import { all, any, except, intersect, union, map, flatMap, groupBy, sortBy, addFront, concat, groupJoin, join, zip, filter,
    contains, first, last, count, fold, foldRight, distinct, ofType, binarySearch, equals, take, takeWhile, skip, skipWhile, reverse,
    copyWithin, fill, indexOf, lastIndexOf } from '../../list_monad/list_iterators';
import { sortDirection } from '../../helpers';
import { when, wrap, defaultPredicate, delegatesTo, not, isArray } from '../../functionalHelpers';
import { createListCreator } from '../list_helpers';

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
 * flatMap: list_core._flatMap,
 * addFront: list_core._addFront,
 * concat: list_core._concat,
 * except: list_core._except,
 * groupJoin: list_core._groupJoin,
 * intersect: list_core._intersect,
 * join: list_core._join,
 * union: list_core._union,
 * zip: list_core._zip,
 * filter: list_core.filter,
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
     * @return: {*}
     */
    get value() {
        return this._value;
    },

    /**
     * @description:
     * @param: {@see list_core} ma
     * @param: {function} comparer
     * @return: {boolean}
     */
    equals: function _equals(ma, comparer) {
        return list_core.isPrototypeOf(ma) && equals(this, ma, comparer);
    },

    /**
     * @description:
     * @param: {function} mapFunc
     * @return: {@see m_list}
     */
    map: function _map(mapFunc) {
        return this.of(this, map(this, mapFunc));
    },

    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @return: {@see m_list}
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
        return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @return: {@see m_list}
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
        return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @description:
     * @param: {function} fn
     * @return: {@see m_list}
     */
    flatMap: function _flatMap(fn) {
        return this.of(flatMap(this, fn));
    },

    /**
     * @description:
     * @param: {iterable} enumerable
     * @return: {@see m_list}
     */
    addFront: function _addFront(enumerable) {
        return this.of(this, addFront(this, enumerable));
    },

    /**
     * @description: Concatenates two or more lists by appending the "method's" List argument(s) to the
     * List's value. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @param: {Array | *} enumerables
     * @return: {@see m_list}
     */
    concat: function _concat(...enumerables) {
        return this.of(this, concat(this, enumerables, enumerables.length));
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
     * @param: {iterable} enumerable
     * @param: {function} comparer
     * @return: {@see m_list}
     */
    except: function _except(enumerable, comparer) {
        return this.of(this, except(this, enumerable, comparer));
    },

    /**
     * @description: Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param: {@see list_core | Array} inner
     * @param: {function} outerSelector
     * @param: {function} innerSelector
     * @param: {function} projector
     * @param: {function} comparer
     * @return: {@see m_list}
     */
    groupJoin: function _groupJoin(inner, outerSelector, innerSelector, projector, comparer) {
        return this.of(this, groupJoin(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     * @description: Produces the objectSet intersection of the List object's value and the List
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param: {iterable} enumerable
     * @param: {function} comparer
     * @return: {@see m_list}
     */
    intersect: function _intersect(enumerable, comparer) {
        return this.of(this, intersect(this, enumerable, comparer));
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
     * @return: {@see m_list}
     */
    join: function _join(inner, outerSelector, innerSelector, projector, comparer) {
        return this.of(this, join(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     * @description: Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: {iterable} enumerable
     * @param: {function} comparer
     * @return: {@see m_list}
     */
    union: function _union(enumerable, comparer) {
        return this.of(this, union(this, enumerable, comparer));
    },

    /**
     * @description: Produces a List of the items in the queryable object and the List passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: {function} selector
     * @param: {iterable} enumerable
     * @return: {@see m_list}
     */
    zip: function _zip(selector, enumerable) {
        return this.of(this, zip(this, selector, enumerable));
    },

    /**
     * @description:
     * @param: {function} predicate
     * @return: {@see m_list}
     */
    filter: function _filter(predicate) {
        return this.of(this, filter(this, predicate));
    },

    /**
     * @description:
     * @param: type
     * @returns: {@see m_list}
     */
    ofType: function _ofType(type) {
        return this.of(this, ofType(this, type));
    },

    /**
     * @description:
     * @param: {function} comparer
     * @return: {@see m_list}
     */
    distinct: function _distinct(comparer) {
        return this.of(this, distinct(this, comparer));
    },

    /**
     * @description:
     * @param: {number} amt
     * @return: {@see m_list}
     */
    take: function _take(amt) {
        return this.of(this, take(this, amt));
    },

    /**
     * @description:
     * @param: {function} predicate
     * @return: {@see m_list}
     */
    takeWhile: function _takeWhile(predicate = defaultPredicate) {
        return this.of(this, takeWhile(this, predicate));
    },

    /**
     * @description: Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty list is returned;
     * Otherwise, a list containing the items collected from the source is
     * returned.
     * @param: {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @return: {@see m_list}
     */
    skip: function _skip(amt) {
        return this.of(this, skip(this, amt));
    },

    /**
     * @description:
     * @param: {function} predicate
     * @return: {@see m_list}
     */
    skipWhile: function _skipWhile(predicate = defaultPredicate) {
        return this.of(this, skipWhile(this, predicate));
    },

    /**
     * @description:
     * @return: {@see m_list}
     */
    reverse: function _reverse() {
        return this.of(this, reverse(this));
    },

    /**
     * @description:
     * @param: {function} predicate
     * @return: {boolean}
     */
    any: function _any(predicate = defaultPredicate) {
        return any(this, predicate);
    },

    /**
     * @description:
     * @param: {function} predicate
     * @return: {boolean}
     */
    all: function _all(predicate = defaultPredicate) {
        return all(this, predicate);
    },

    /**
     * @description:
     * @param: {*} val
     * @param: {function} comparer
     * @return: {boolean}
     */
    contains: function _contains(val, comparer) {
        return contains(this, val, comparer);
    },

    /**
     * @description:
     * @param: {function} predicate
     * @return: {*}
     */
    first: function _first(predicate = defaultPredicate) {
        return first(this, predicate);
    },

    /**
     * @description:
     * @param: {function} fn
     * @param: {*} initial
     * @return: {*}
     */
    fold: function _fold(fn, initial) {
        return fold(this, fn, initial);
    },

    /**
     * @description:
     * @see: list_core.fold
     * @param: {function} fn
     * @param: {*} initial
     * @return: {*}
     */
    reduce: function _reduce(fn, initial) {
        return fold(this, fn, initial);
    },

    /**
     * @description:
     * @param: {function} fn
     * @param: {*} initial
     * @return: {*}
     */
    reduceRight: function _reduceRight(fn, initial) {
        return foldRight(this, fn, initial);
    },

    /**
     * @description:
     * @param: {number} index
     * @param: {number} start
     * @param: {number} end
     * @return: {@see list}
     */
    copyWithin: function _copyWithin(index, start, end) {
        return this.of(this, copyWithin(index, start, end, this));
    },

    /**
     * @description:
     * @param: {number} value
     * @param: {number} start
     * @param: {number} end
     * @return: {@see list}
     */
    fill: function _fill(value, start, end) {
        return this.of(this, fill(value, start, end, this));
    },

    /**
     * @description:
     * @param: {function} callback
     * @param: {*} context
     * @return: {@see list}
     */
    indexOf: function _indexOf(callback, context) {
        return this.of(this, indexOf(callback, context, this));
    },

    /**
     * @description:
     * @param: {*} value
     * @param: {number} index
     * @return: {@see list}
     */
    lastIndexOf: function _lastIndexOf(value, index) {
        return this.of(this, lastIndexOf(value, index, this));
    },

    /**
     * @description:
     * @param: {function} predicate
     * @return: {*}
     */
    last: function _last(predicate = defaultPredicate) {
        return last(this, predicate);
    },

    /**
     * @description:
     * @return: {*}
     */
    count: function _count() {
        return count(this);
    },

    /**
     * @description:
     * @return: {Array}
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     * @description:
     * @return: {Set}
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     * @description:
     * @param: {*} source
     * @param: {generator} iterator
     * @param: {Array} sortObj
     * @param: {string} key
     * @return: {@see m_list}
     */
    of: function _of(source, iterator, sortObj, key) {
        return createListDelegateInstance(source, iterator, sortObj, key);
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
     * @return: {@see m_list}
     */
    toEvaluatedList: function _toEvaluatedList() {
        return List.from(this.data /* the .data property is a getter function that forces evaluation */);
    },

    /**
     * @description: Base iterator to which all queryable_core delegator objects
     * delegate to for iteration if for some reason an iterator wasn't
     * objectSet on the delegator at the time of creation.
     */
    [Symbol.iterator]: function *_iterator() {
        var data = Array.from(this.value);
        for (let item of data) {
            yield item;
        }
    },

    /**
     * @description:
     * @return: {*}
     */
    valueOf: function _valueOf() {
        return this.value;
    },

    /**
     * @description: Returns a string representation of an instance of a List
     * delegator object. This function does not cause evaluation of the source,
     * but this also means the returned value only reflects the underlying
     * data, not the evaluated data.
     * @return: {string}
     */
    toString: function _toString() {
        //console.log(this.value);
        //console.log(list_core.isPrototypeOf(this.value), this.value.toString(), this.value);

        /*if (list_core.isPrototypeOf(this.value) || (Array.isArray(this.value) && this.value.length === 5)) {
            console.log(list_core.isPrototypeOf(this.value));
            console.log(this);
            console.log(this.value);

            if (list_core.isPrototypeOf(this.value)) {
                console.log(this.value.toString());
            }
        }*/
        var val = list_core.isPrototypeOf(this.value) ? this.value.toString() : this.value;
        return `List(${val})`;
        //return list_core.isPrototypeOf(this.value) ? this.value.toString() : `List(${this.value})`;
    },

    /**
     * @description:
     */
    constructor: List
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
    if (delegatesTo(source, ordered_list) && 'undefined' === typeof comparer)
        return binarySearch(when(not(isArray), Array.from, source), val, comparer);
    return list_core.contains(val, comparer);
};

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the list_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a List's data by
 * a given key.
 * @type: {list_core}
 */
var list = Object.create(list_core, {
    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @return: {@see m_list}
     */
    sortBy: {
        value: function _orderBy(keySelector, comparer) {
            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
            return this.of(this, sortBy(this, sortObj), sortObj);
        }
    },
    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @return: {@see m_list}
     */
    sortByDescending: {
        value: function _orderByDescending(keySelector, comparer) {
            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
            return this.of(this, sortBy(this, sortObj), sortObj);
        }
    }
});

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .thenBy and .thenByDescending
 * functions. These functions allow a consumer to sort more on than a single column.
 * @type: {list_core}
 */
var ordered_list = Object.create(list_core, {
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
     * @param: {function} keySelector
     * @param: {function} comparer
     * @return: {@see ordered_list_a}
     */
    thenBy: {
        value: function _thenBy(keySelector, comparer) {
            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending });
            return this.of(this.value, sortBy(this, sortObj), sortObj);
        }
    },
    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @return: {@see ordered_list_a}
     */
    thenByDescending: {
        value: function thenByDescending(keySelector, comparer) {
            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending });
            return this.of(this.value, sortBy(this, sortObj), sortObj);
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

/**
 * @description: Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param: {*} source - Any type, any value; used as the underlying source of the List
 * @return: {@see _list_a} - A new List instance with the value provided as the underlying source.
 */
function List(source) {
    //TODO: should I exclude strings from being used as a source directly, or allow it because
    //TODO: they have an iterator?
    return createListDelegateInstance(source && source[Symbol.iterator] ? source : wrap(source));
}

/**
 * @description: Convenience function for listCreate a new List instance; internally calls List.
 * @see: List
 * @param: {*} source - Any type, any value; used as the underlying source of the List
 * @return: {@see list} - A new List instance with the value provided as the underlying source.
 */
List.from = function _from(source) {
    return List(source);
};

/**
 * @description: Alias for List.from
 * @see: List.from
 * @type: {function}
 * @param: {*}
 * @return: {@see _list_a}
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
    if (!(propName in list) && !(propName in ordered_list)) {
        list_core[propName] = function(...args) {
            return createListDelegateInstance(this, fn(this, ...args));
        };
    }
    return List;
};

function createGroupedListDelegate(source, key) {
    return createListDelegateInstance(source, undefined, undefined, key);
}

/**
 * @description: Creates a new list object delegate instance; list type is determined by
 * the parameters passed to the function. If only the 'source' parameter is provided, a
 * 'basic' list delegate object instance is created. If the source and iterator parameters
 * are passed as arguments, a 'basic' list delegate object instance is created and the
 * iterator provided is used as the new instance object's iterator rather than the default
 * list iterator. If the source, iterator, and sortObj parameters are passed as arguments,
 * an ordered_list delegate object instance is created. The provided iterator is set on
 * the instance object to be used in lieu of the default iterator and the ._appliedSorts
 * field is set as the 'sortObj' parameter. If all four of the function's arguments are
 * provided (source, iterator, sortObj, and key), then a list delegate object instance
 * is created, setting the iterator for the object instance as the provided iterator, the
 * ._appliedSorts field as the sortObj argument, and the ._key field as the 'key' parameter's
 * value.
 *
 * The switch case inside the function only handles a subset of the possible bit flag values.
 * Technically there could be as many as eight different scenarios to check, not including the
 * default case. However, in practice, the only values received from the 'createBitMask' function
 * will be odd. Thus, only odd values (plus the default case which covers a value of zero) need
 * to be handled. A case of zero arises when only the 'source' argument is provided.
 *
 * @param: {*} source - The value to be used as the underlying source of the list functor; may be
 * anything javascript object that has an iterator.
 * @param: {generator} iterator - A generator function that is to be used on the new list delegate
 * object instance's iterator.
 * @param: {Array} sortObj - An array of the sort(s) (field and direction} to be used when the
 * instance is evaluated.
 * @param: {string} key - A string that denotes what value the new list delegate object instance
 * was grouped on.
 * @return: {@see list_core}
 */
var createListDelegateInstance = createListCreator(list, ordered_list, list);

export { List, list_core, list, ordered_list };