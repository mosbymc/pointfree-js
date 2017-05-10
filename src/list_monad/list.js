import { addFront, concat, except, groupJoin, intersect, join, union, zip } from '../collation/collationFunctions';
import { all, any, binary, contains, first, fold, last, count } from '../evaluation/evaluationFunctions';
import { distinct, ofType, where } from '../limitation/limitationFunctions';
import { deepFlatten, deepMap, flatMap, flatten, groupBy, orderBy, map } from '../projection/projectionFunctions';
import { generatorProto, sortDirection } from '../helpers';
import { set, when, isSomething, apply, ifElse, wrap, delegatesFrom, defaultPredicate } from '../functionalHelpers';

//import { Maybe } from '../maybe_monad/maybe';
//import { Just } from '../just_monad/just';
//import { Identity } from '../identity_monad/identity';

/**
 * @description: Object that contains the core functionality of a List; both the m_list and ordered_m_list
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @type {{
 * value,
 * value,
 * map: list_core._map,
 * groupBy: list_core._groupBy,
 * groupByDescending: list_core._groupByDescending,
 * flatten: list_core._flatten,
 * deepFlatten: list_core._deepFlatten,
 * deepMap: list_core._deepMap,
 * addFront: list_core._addFront,
 * concat: list_core._concat,
 * except: list_core._except,
 * groupJoin: list_core._groupJoin,
 * intersect: list_core._intersect,
 * join: list_core._join,
 * union: list_core._union,
 * zip: list_core._zip,
 * where: list_core._where,
 * ofType: list_core._ofType,
 * distinct: list_core._distinct,
 * take: list_core._take,
 * takeWhile: list_core._takeWhile,
 * skip: list_core._skip,
 * skipWhile: list_core._skipWhile,
 * any: list_core._any,
 * all: list_core._all,
 * contains: list_core._contains,
 * first: list_core._first,
 * fold: list_core._fold,
 * last: list_core._last,
 * count: list_core._count,
 * toArray: list_core._toArray,
 * toSet: list_core._toSet,
 * reverse: list_core._reverse,
 * [Symbol.iterator]: list_core._iterator
 * }}
 */
var list_core = {
    //Using getters for these properties because there's a chance the setting and/or getting
    //functionality could change; this will allow for a consistent interface while the
    //logic beneath changes

    /**
     * @description: Getter for the underlying source object of the List
     * @returns: {*}
     */
    get value() {
        return this._value;
    },

    /**
     * @description: Setter for the underlying source object of the List
     * @param: val
     */
    set value(val) {
        this._value = val;
    },

    /**
     * @description: Applies a function contained in another functor to the source
     * of this List object instance's underlying source. A new List object instance
     * is returned.
     * @param: ma
     * @return: {*}
     */
    apply: function _apply(ma) {
        return this.map(ma.value);
    },

    /**
     * @description:
     * @return: {@see list_core}
     */
    mjoin: function _mjoin() {

    },

    /**
     * @description:
     * @param: {function} mapFunc
     * @returns: {*}
     */
    map: function _map(mapFunc) {
        return createListDelegator(this, map(this, mapFunc));
    },

    /**
     * @description:
     * @param: {function} fn
     * @return: {*}
     */
    flatMap: function _flatMap(fn) {
        return createListDelegator(this, flatMap(this, fn));
    },

    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @returns: {m_list}
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
        return createListDelegator(this, groupBy(this, groupObj, createGroupedListDelegator));
    },

    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @returns: {*}
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
        return createListDelegator(this, groupBy(this, groupObj, createGroupedListDelegator));
    },

    /**
     * @description:
     * @returns:
     */
    flatten: function _flatten() {
        return createListDelegator(this, flatten(this));
    },

    /**
     * @description:
     * @returns:
     */
    deepFlatten: function _deepFlatten() {
        return createListDelegator(this, deepFlatten(this));
    },

    /**
     * @description:
     * @param: {function} fn
     * @returns: {*}
     */
    deepMap: function _deepMap(fn) {
        return createListDelegator(this, deepMap(this, fn));
    },

    /**
     * @description:
     * @param: enumerable
     * @returns: {*}
     */
    addFront: function _addFront(enumerable) {
        return createListDelegator(this, addFront(this, enumerable));
    },

    /**
     * @description: Concatenates two or more lists by appending the "method's" List argument(s) to the
     * List's value. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @param: {Array | *} enumerables
     * @returns: {*}
     */
    concat: function _concat(...enumerables) {
        return createListDelegator(this, concat(this, enumerables, enumerables.length));
    },

    /**
     * @description: Produces a List that contains the objectSet difference between the queryable object
     * and the List that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * equality comparer.
     * @param: enumerable
     * @param: {function} comparer
     * @returns: {*}
     */
    except: function _except(enumerable, comparer) {
        return createListDelegator(this, except(this, enumerable, comparer));
    },

    /**
     * @description: Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param: {Array|List} inner
     * @param: {function} outerSelector
     * @param: {function} innerSelector
     * @param: {function} projector
     * @param: {function} comparer
     * @returns: {*}
     */
    groupJoin: function _groupJoin(inner, outerSelector, innerSelector, projector, comparer) {
        return createListDelegator(this, groupJoin(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     * @description: Produces the objectSet intersection of the List object's value and the List
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param: enumerable
     * @param: {function} comparer
     * @returns: {*}
     */
    intersect: function _intersect(enumerable, comparer) {
        return createListDelegator(this, intersect(this, enumerable, comparer));
    },

    /**
     * @description: Correlates the items in two lists based on the equality of items in each
     * List. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: {Array|List} inner
     * @param: {function} outerSelector
     * @param: {function} innerSelector
     * @param: {function} projector
     * @param: {function} comparer
     * @returns: {*}
     */
    join: function _join(inner, outerSelector, innerSelector, projector, comparer) {
        return createListDelegator(this, join(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     * @description: Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: enumerable
     * @param: {function} comparer
     * @returns: {*}
     */
    union: function _union(enumerable, comparer) {
        return createListDelegator(this, union(this, enumerable, comparer));
    },

    /**
     * @description: Produces a List of the items in the queryable object and the List passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: {function} selector
     * @param: enumerable
     * @returns {*}
     */
    zip: function _zip(selector, enumerable) {
        return createListDelegator(this, zip(this, selector, enumerable));
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {*}
     */
    where: function _where(predicate) {
        return createListDelegator(this, where(this, predicate));
    },

    /**
     * @description:
     * @param: type
     * @returns: {*}
     */
    ofType: function _ofType(type) {
        return createListDelegator(this, ofType(this, type));
    },

    /**
     * @description:
     * @param: {function} comparer
     * @returns: {*}
     */
    distinct: function _distinct(comparer) {
        return createListDelegator(this, distinct(this, comparer));
    },

    /**
     * @description:
     * @param: {number} amt
     * @returns: {Array}
     */
    take: function _take(amt) {
        if (!amt) return [];
        var res = [],
            idx = 0;

        for (let item of this) {
            if (idx < amt) res[res.length] = item;
            else break;
            ++idx;
        }
        return res;
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {Array}
     */
    takeWhile: function _takeWhile(predicate = defaultPredicate) {
        var res = [];

        for (let item of this.value) {
            if (predicate(item))
                res[res.length] = item;
            else  {
                return res;
            }
        }
    },

    /**
     * @description: Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty array is returned;
     * Otherwise, an array containing the items collected from the source is
     * returned.
     * @param: {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @returns: {*}
     */
    skip: function _skip(amt) {
        var idx = 0,
            res = [];

        for (let item of this.value) {
            if (idx >= amt)
                res[res.length] = item;
            ++idx;
        }
        return res;
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {Array}
     */
    skipWhile: function _skipWhile(predicate = defaultPredicate) {
        var hasFailed = false,
            res = [];

        for (let item of this.value) {
            if (!hasFailed) {
                if (!predicate(item)) {
                    hasFailed = true;
                    res[res.length] = item;
                }
            }
            else res[res.length] = item;
        }
        return res;
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {*}
     */
    any: function _any(predicate = defaultPredicate) {
        return any(this, predicate);
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {*}
     */
    all: function _all(predicate = defaultPredicate) {
        return all(this, predicate);
    },

    /**
     * @description:
     * @param: val
     * @param: {function} comparer
     * @returns: {*}
     */
    contains: function _contains(val, comparer) {
        return contains(this, val, comparer);
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {*}
     */
    first: function _first(predicate = defaultPredicate) {
        return first(this, predicate);
    },

    /**
     * @description:
     * @param: {function} fn
     * @param: initial
     * @returns: {*}
     */
    fold: function _fold(fn, initial) {
        return fold(this, fn, initial);
    },

    /**
     * @description:
     * @see: list_core.fold
     * @param: fn
     * @param: initial
     * @returns:
     */
    reduce: function _reduce(fn, initial) {
        return fold(this, fn, initial);
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {*}
     */
    last: function _last(predicate = defaultPredicate) {
        return last(this, predicate);
    },

    /**
     * @description:
     * @returns: {*}
     */
    count: function _count() {
        return count(this);
    },

    /**
     * @description:
     * @returns: {Array}
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     * @description:
     * @returns: {Set}
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     * @description:
     * @return: {@see _maybe}
     */
    /*toMaybe: function _toMaybe() {
        return Maybe(this.data);
    },*/

    /**
     * @description:
     * @return: {@see _maybe}
     */
    /*asMaybe: function _asMaybe() {
        return Maybe(this);
    },*/

    /**
     * @description:
     * @return: {@see _identity}
     */
    /*toIdentity: function _toIdentity() {
        return Identity(this.data);
    },*/

    /**
     * @description:
     * @return: {@see _identity}
     */
    /*asIdentity: function _asIdentity() {
        return Identity(this);
    },*/

    /**
     * @description:
     * @return: {@see _just}
     */
    /*toJust: function _toJust() {
        return Just(this.data);
    },*/

    /**
     * @description:
     * @return: {@see _just}
     */
    /*asJust: function _asJust() {
        return Just(this);
    },*/

    /**
     * @description:
     * @param: {*} item
     * @returns: {m_list}
     */
    of: function _of(item) {
        return List(item);
    },

    /**
     * @description: Evaluates the current List instance and returns a new List
     * instance with the evaluated data as its source. This is used when the
     * initial List's data must be iterated more than once as it will cause
     * the evaluation to happen each item it is iterated. Rather the pulling the
     * initial data through the List's 'pipeline' every time, this property will
     * allow you to evaluate the List's data and store it in a new List that can
     * be iterated many times without needing to re-evaluate. It is effectively
     * a syntactical shortcut for: List.from(listInstance.data);
     * @returns: {m_list}
     */
    toEvaluatedList: function _toEvaluatedList() {
        return List.from(this.data /* the .data property is a getter function that forces evaluation */);
    },

    /**
     * @description:
     * @returns: {Array<*>}
     */
    reverse: function _reverse() {
        return Array.from(this).reverse();
    },

    /**
     * @description: Base iterator to which all queryable_core delegator objects
     * delegate to for iteration if for some reason an iterator wasn't
     * objectSet on the delegator at the time of creation.
     */
    [Symbol.iterator]: function *_iterator() {
        for (let item of this.value)
            yield item;
    },

    /**
     * @description: Returns a string representation of an instance of a List
     * delegator object. This function does not cause evaluation of the source,
     * but this also means the returned value only reflects the underlying
     * data, not the evaluated data.
     * @return: {string}
     */
    toString: function _toString() {
        return `List(${this.value})`;
    }
};

/**
 * @description: Performs the same functionality as list_core#contains, but utilizes
 * a binary searching algorithm rather than a sequential search. If this function is called
 * an a non-ordered List, it will internally delegate to list_core#contains instead. This
 * function should not be called on a sorted List for look for a value that is not the
 * primary field on which the List's data is sorted on as an incorrect result will likely
 * be returned.
 * @param: {*} val - The value that should be searched for
 * @param: {function} comparer - The function used to compare values in the List to
 * the 'val' parameter
 * @return {boolean} - Returns true if the List contains the searched for value, false
 * otherwise.
 */
list_core.contains.binary = function _binary(val, comparer) {
    return binary(this, val, comparer);
};

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the list_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a List's data by
 * a given key.
 * @type: {list_core}
 */
var m_list = Object.create(list_core, {
    /**
     * @description:
     * @param: keySelector
     * @param: comparer
     * @returns: {*}
     */
    orderBy: {
        value: function _orderBy(keySelector, comparer) {
            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
            return createListDelegator(this, orderBy(this, sortObj), sortObj);
        }
    },
    /**
     * @description:
     * @param: keySelector
     * @param: comparer
     * @returns: {*}
     */
    orderByDescending: {
        value: function _orderByDescending(keySelector, comparer) {
            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
            return createListDelegator(this, orderBy(this, sortObj), sortObj);
        }
    }
});

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .thenBy and .thenByDescending
 * functions. These functions allow a consumer to sort more on than a single column.
 * @type: {list_core}
 */
var ordered_m_list = Object.create(list_core, {
    _appliedSorts: {
        value: []
    },
    //In these two functions, feeding the call to "orderBy" with the .value property of the List delegate
    //rather than the delegate itself, effectively excludes the previous call to the orderBy/orderByDescending
    //since the iterator exists on the delegate, not on its value. Each subsequent call to thenBy/thenByDescending
    //will continue to exclude the previous call's iterator... effectively what we're doing is ignoring all the
    //prior calls made to orderBy/orderByDescending/thenBy/thenByDescending and calling it once but with an array
    //of the the requested sorts.
    /**
     * @description:
     * @param: keySelector
     * @param: comparer
     * @returns: {*}
     */
    thenBy: {
        value: function _thenBy(keySelector, comparer) {
            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending });
            return createListDelegator(this.value, orderBy(this, sortObj), sortObj);
        }
    },
    /**
     * @description:
     * @param: keySelector
     * @param: comparer
     * @returns: {*}
     */
    thenByDescending: {
        value: function thenByDescending(keySelector, comparer) {
            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending });
            return createListDelegator(this.value, orderBy(this, sortObj), sortObj);
        }
    }
});

//TODO: functional
//TODO: functional programming
//TODO: FP
//TODO: monad
//TODO: functor
//TODO: container
//TODO: JavaScript
//TODO: JS
//TODO: JunctionalS
//TODO: JunctorS
//TODO: lanoitcunf
//TODO: rotcnuf
//TODO: danom
//TODO: tpircSavaJ
//TODO: Junctional FavaScript

var setValue = set('value'),
    setIterator = set(Symbol.iterator),
    isIterator = apply(delegatesFrom(generatorProto)),
    create = ifElse(isSomething, createOrderedList, createList);

/**
 * @description:
 * @return: {@see m_list}
 */
function createList() {
    return Object.create(m_list, {
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
 * @return: {@see ordered_m_list}
 */
function createOrderedList(sorts) {
    return set('_appliedSorts', sorts, Object.create(ordered_m_list, {
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
 * @return: {m_list}
 */
function createGroupedList(val) {
    return Object.create(m_list, {
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
 */
function createListDelegator(value, iterator, sortObj) {
    return when(isIterator(iterator), setIterator(iterator), setValue(value, create(sortObj)));
}

/**
 * @description:
 * @param: {*} value
 * @param: {function} iterator
 * @param: {string} key
 * @return: {@see m_list}
 */
function createGroupedListDelegator(value, iterator, key) {
    return when(isIterator(iterator), setIterator(iterator), setValue(value, createGroupedList(key)));
}

/**
 * @description: Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param: {*} source - Any type, any value; used as the underlying source of the List
 * @returns: {m_list} - A new List instance with the value provided as the underlying source.
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
 * @returns: {m_list} - A new List instance with the value provided as the underlying source.
 */
List.from = function _from(source) {
    return List(source);
};

/**
 * @description: Alias for List.from
 * @see: List.from
 * @type: {function}
 * @param: {*}
 * @returns: {m_list}
 */
List.of = List.from;

/**
 * @description: Extension function that allows new functionality to be applied to
 * the queryable object
 * @param: {string} propName - The name of the new property that should exist on the List; must be unique
 * @param: {function} fn - A function that defines the new List functionality and
 * will be called when this new List property is invoked.
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
    if (!(propName in m_list) && !(propName in ordered_m_list)) {
        list_core[propName] = function(...args) {
            return createListDelegator(this, fn(this, ...args));
        };
    }
};

export { List, list_core, m_list, ordered_m_list };