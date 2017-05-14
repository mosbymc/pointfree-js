import { _list_f, ordered_list_f, list_functor_core } from '../functors/list_functor';
import { ifElse, isSomething, delegatesFrom, set, when, wrap, apply } from '../../functionalHelpers';
import { generatorProto } from '../../helpers';

var setValue = set('value'),
    setIterator = set(Symbol.iterator),
    isIterator = apply(delegatesFrom(generatorProto)),
    create = ifElse(isSomething, createOrderedList, createList);

/**
 * @description:
 * @return: {@see _list_m}
 */
function createList() {
    return Object.create(_list_m, {
        data: {
            get: function _getData() {
                return Array.from(this);
            }
        }
    });
}

/**
 * @description:
 * @param: {Array} sorts
 * @return: {@see ordered_list_m}
 */
function createOrderedList(sorts) {
    return set('_appliedSorts', sorts, Object.create(ordered_list_m, {
        data: {
            get: function _getData() {
                return Array.from(this);
            }
        }
    }));
}

/**
 * @description:
 * @param: {*} val
 * @return: {@see _list_m}
 */
function createGroupedList(val) {
    return Object.create(_list_m, {
        data: {
            get: function _getData() {
                return Array.from(this);
            }
        },
        _key: {
            value: val,
            writable: false,
            configurable: false
        },
        key: {
            get: function _getKey() {
                return this._key;
            }
        }
    })
}

/**
 * @description: Creator function for List delegate object instances. Creates a m_list delegator
 * if no sort object is passed, otherwise, it will create an ordered_m_list delegator. If no
 * iterator is passed, the delegator will fall back on the delegate's iterator.
 * @param: {*} value - Any value that should be used as the underlying source of the List. It the
 * value has an iterator it will be accepted as is, if not, it will be wrapped in an array.
 * @param: {generator} iterator - A generator function that should be used as the iterator for
 * the new List delegator instance.
 * @param: {m_list|ordered_m_list} sortObj - A 'sort object' that the ordered_m_list knows how
 * to utilize when sorting or grouping a List.
 * @return: {@see list_core}
 */
function createListDelegator(value, iterator, sortObj) {
    return when(isIterator(iterator), setIterator(iterator), setValue(value, create(sortObj)));
}

/**
 * @description:
 * @param: {*} value
 * @param: {function} iterator
 * @param: {string} key
 * @return: {@see _list_m}
 */
function createGroupedListDelegator(value, iterator, key) {
    return when(isIterator(iterator), setIterator(iterator), setValue(value, createGroupedList(key)));
}

/**
 * @description: Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param: {*} source - Any type, any value; used as the underlying source of the List
 * @return: {@see _list_m} - A new List instance with the value provided as the underlying source.
 */
function List(source) {
    //TODO: should I exclude strings from being used as a source directly, or allow it because
    //TODO: they have an iterator?
    return createListDelegator(source && source[Symbol.iterator] ? source : wrap(source));
}

/**
 * @description: Convenience function for create a new List instance; internally calls List.
 * @see: List
 * @param: {*} source - Any type, any value; used as the underlying source of the List
 * @return: {@see _list_m} - A new List instance with the value provided as the underlying source.
 */
List.from = function _from(source) {
    return List(source);
};

/**
 * @description: Alias for List.from
 * @see: List.from
 * @type: {function}
 * @param: {*}
 * @return: {@see _list_m}
 */
List.of = List.from;

/**
 * @description: Extension function that allows new functionality to be applied to
 * the queryable object
 * @param: {string} propName - The name of the new property that should exist on the List; must be unique
 * @param: {function} fn - A function that defines the new List functionality and
 * will be called when this new List property is invoked.
 * @return: {@see List}
 *
 * NOTE: The fn parameter must be a non-generator function that takes one or more
 * arguments. If this new List function should be an immediately evaluated
 * function (like: take, any, reverse, etc.), it merely needs the accept one or more
 * arguments and know how to iterate the source. In the case of an immediately evaluated
 * function, the return type can be any javascript type. The first argument is always the
 * previous List instance that must be iterated. Additional arguments may be specified
 * if desired.
 *
 * If the function's evaluation should be deferred it needs to work a bit differently.
 * In this case, the function should accept one or more arguments, the first and only
 * required argument being the underlying source of the List object. This underlying
 * source can be anything with an iterator (generator, array, map, set, another queryable).
 * Any additional arguments that the function needs should be specified in the signature.
 * The return value of the function should be a generator that knows how to iterate the
 * underlying source. If the generator should operate like most List functions, i.e.
 * take a single item, process it, and then yield it out before asking for the next, a
 * for-of loop is the preferred method for employment. However, if the generator needs
 * all of the underlying data upfront (like orderBy and groupBy), Array.from is the
 * preferred method. Array.from will 'force' all the underlying List instances
 * to evaluate their data before it is handed over in full to the generator. The generator
 * can then act with full knowledge of the data and perform whatever operation is needed
 * before ultimately yielding out a single item at a time. If your extension function
 * needs to yield out all items at once, then that function is not a lazy evaluation
 * function and should be constructed like the immediately evaluated functions described
 * above.
 */
List.extend = function _extend(propName, fn) {
    if (!(propName in _list_f) && !(propName in ordered_list_f)) {
        //TODO: this should probably be changed, other wise I am altering the applicative list in
        //TODO: addition to the monadic list. I'll also need to recreate the 'toEvaluatedList' function
        //TODO: since using it on a monadic list would result in a list_a, not a list_m.
        list_functor_core[propName] = function(...args) {
            return createListDelegator(this, fn(this, ...args));
        };
    }
    return List;
};

var _list_m = Object.create(_list_f, {
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    /**
     * @description: Applies a function contained in another functor to the source
     * of this List object instance's underlying source. A new List object instance
     * is returned.
     * @param: {monad} ma
     * @return: {@see _list_m}
     */
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val, iterator, sortObj) {
            return createListDelegator(val, iterator, sortObj);
        }
    }
});

var ordered_list_m = Object.create(ordered_list_f, {
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    of: {
        value: function _of(val, iterator, sortObj) {
            return createListDelegator(val, iterator, sortObj);
        }
    }
});

export { List, _list_m, ordered_list_m };