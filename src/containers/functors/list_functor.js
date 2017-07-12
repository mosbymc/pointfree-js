import { all, any, except, intersect, union, map, groupBy, sortBy, prepend, concat, groupJoin, join, zip, filter, intersperse,
    contains, first, last, count, foldLeft, reduceRight, distinct, ofType, binarySearch, equals, take, takeWhile, skip, skipWhile, reverse,
    copyWithin, fill, findIndex, findLastIndex, repeat, foldRight, unfold } from '../list_iterators';
import { sortDirection, generatorProto } from '../../helpers';
import { wrap, defaultPredicate, delegatesTo, delegatesFrom, isArray, noop, invoke } from '../../functionalHelpers';
import { when, ifElse } from '../../combinators';
import { not } from '../../decorators';
import { createListCreator } from '../list_helpers';

/**
 * @description: Object that contains the core functionality of a List; both the m_list and ordered_m_list
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @type {{
 * value: *,
 * append: {function} _concat,
 * copyWithin: {function} _copyWithin,
 * concat: {function} _concat,
 * distinct: {function} _distinct,
 * except: {function} _except,
 * fill: {function} _fill,
 * filter: {function} _filter,
 * groupBy: {function} _groupBy,
 * groupByDescending: {function} _groupByDescending,
 * groupJoin: {function} _groupJoin,
 * intersect: {function} _intersect,
 * intersperse: {function} _intersperse,
 * join: {function} _join,
 * map: {function} _map,
 * ofType: {function} _ofType,
 * prepend: {function} _prepend,
 * reverse: {function} _reverse,
 * skip: {function} _skip,
 * skipWhile: {function} _skipWhile,
 * take: {function} _take,
 * takeWhile: {function} _takeWhile,
 * union: {function} _union,
 * zip: {function} _zip,
 * all: {function} _all,
 * any: {function} _any,
 * contains: {function} _contains,
 * count: {function} _count,
 * equals: {function} _equals,
 * findIndex: {function} _findIndex,
 * findLastIndex: {function} _findLastIndex,
 * first: {function} _first,
 * foldLeft: {function} _foldl,
 * foldr: {function} _foldr,
 * isEmpty: {function} _isEmpty,
 * last: {function} _last,
 * reduceRight: {function} _reduceRight,
 * toArray: {function} _toArray,
 * toEvaluatedList: {function} _toEvaluatedList,
 * toMap: {function} _toMap,
 * toSet: {function} _toSet,
 * toString: {function} _toString,
 * valueOf: {function} _valueOf,
 * factory: {function} List,
 * of: {function} _of,
 * [Symbol.iterator]:  {generator} _iterator
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
     * @param: {number} index
     * @param: {number} start
     * @param: {number} end
     * @return: {@see list_functor}
     */
    copyWithin: function _copyWithin(index, start, end) {
        return this.of(this, copyWithin(index, start, end, this));
    },

    /**
     * @description: Concatenates two or more lists by appending the "method's" List argument(s) to the
     * List's value. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @param: {Array | *} ys
     * @return: {@see list_functor}
     */
    concat: function _concat(...ys) {
        return this.of(this, concat(this, ys, ys.length));
    },

    /**
     * @type: (a -> boolean) -> List<b>
     * @description:
     * @param: {function} comparer
     * @return: {@see list_functor}
     */
    distinct: function _distinct(comparer) {
        return this.of(this, distinct(this, comparer));
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
     * @param: {iterable} xs
     * @param: {function} comparer
     * @return: {@see list_functor}
     */
    except: function _except(xs, comparer) {
        return this.of(this, except(this, xs, comparer));
    },

    /**
     * @description:
     * @param: {number} value
     * @param: {number} start
     * @param: {number} end
     * @return: {@see list_functor}
     */
    fill: function _fill(value, start, end) {
        return this.of(this, fill(value, start, end, this));
    },

    /**
     * @description:
     * @param: {function} predicate
     * @return: {@see list_functor}
     */
    filter: function _filter(predicate) {
        return this.of(this, filter(this, predicate));
    },

    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @return: {@see list_functor}
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
        return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @return: {@see list_functor}
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
        return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @description: Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param: {@see list_core | Array} ys
     * @param: {function} xSelector
     * @param: {function} ySelector
     * @param: {function} projector
     * @param: {function} comparer
     * @return: {@see list_functor}
     */
    groupJoin: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
        return this.of(this, groupJoin(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
    },

    /**
     * @description: Produces the objectSet intersection of the List object's value and the List
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param: {iterable} xs
     * @param: {function} comparer
     * @return: {@see list_functor}
     */
    intersect: function _intersect(xs, comparer) {
        return this.of(this, intersect(this, xs, comparer));
    },

    /**
     * @type:
     * @description:
     * @param: {*{ val
     * @return: {@see list_functor}
     */
    intersperse: function _intersperse(val) {
        return this.of(this, intersperse(this, val));
    },

    /**
     * @description: Correlates the items in two lists based on the equality of items in each
     * List. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: {Array|List} ys
     * @param: {function} xSelector
     * @param: {function} ySelector
     * @param: {function} projector
     * @param: {function} comparer
     * @return: {@see list_functor}
     */
    join: function _join(ys, xSelector, ySelector, projector, comparer) {
        return this.of(this, join(this, ys, xSelector, ySelector, projector, comparer));
    },

    /**
     * @description:
     * @param: {function} mapFunc
     * @return: {@see list_functor}
     */
    map: function _map(mapFunc) {
        return this.of(this, map(this, mapFunc));
    },

    /**
     * @description:
     * @param: type
     * @returns: {@see list_functor}
     */
    ofType: function _ofType(type) {
        return this.of(this, ofType(this, type));
    },

    /**
     * @description:
     * @param: {iterable} xs
     * @return: {@see list_functor}
     */
    prepend: function _prepend(xs) {
        return this.of(this, prepend(this, xs));
    },

    /**
     * @description:
     * @return: {@see list_functor}
     */
    reverse: function _reverse() {
        return this.of(this, reverse(this));
    },

    /**
     * @description: Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty list_functor is returned;
     * Otherwise, a list_functor containing the items collected from the source is
     * returned.
     * @param: {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @return: {@see list_functor}
     */
    skip: function _skip(amt) {
        return this.of(this, skip(this, amt));
    },

    /**
     * @description:
     * @param: {function} predicate
     * @return: {@see list_functor}
     */
    skipWhile: function _skipWhile(predicate = defaultPredicate) {
        return this.of(this, skipWhile(this, predicate));
    },

    /**
     * @description:
     * @param: {number} amt
     * @return: {@see list_functor}
     */
    take: function _take(amt) {
        return this.of(this, take(this, amt));
    },

    /**
     * @description:
     * @param: {function} predicate
     * @return: {@see list_functor}
     */
    takeWhile: function _takeWhile(predicate = defaultPredicate) {
        return this.of(this, takeWhile(this, predicate));
    },

    /**
     * @description: Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: {iterable} xs
     * @param: {function} comparer
     * @return: {@see list_functor}
     */
    union: function _union(xs, comparer) {
        return this.of(this, union(this, xs, comparer));
    },

    /**
     * @description: Produces a List of the items in the queryable object and the List passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: {function} selector
     * @param: {iterable} xs
     * @return: {@see list_functor}
     */
    zip: function _zip(selector, xs) {
        return this.of(this, zip(this, selector, xs));
    },

    /**
     * @type: (a -> Boolean) -> [a] -> Boolean
     * @description:
     * @param: {function} predicate
     * @return: {boolean}
     */
    all: function _all(predicate = defaultPredicate) {
        return all(this, predicate);
    },

    /**
     * @type: (a -> Boolean) -> [a] -> Boolean
     * @description:
     * @param: {function} predicate
     * @return: {boolean}
     */
    any: function _any(predicate = defaultPredicate) {
        return any(this, predicate);
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
     * @return: {Number}
     */
    count: function _count() {
        return count(this);
    },

    /**
     * @description:
     * @param: {@see list_core} f
     * @param: {function} comparer
     * @return: {boolean}
     */
    equals: function _equals(f, comparer) {
        return Object.getPrototypeOf(this).isPrototypeOf(f) && equals(this, f, comparer);
    },

    /**
     * @type:
     * @description:
     * @param: {function} comparer
     * @param: {*} context
     * @return: {@see Number}
     */
    findIndex: function _findIndex(comparer, context) {
        return this.of(this, findIndex(this, comparer, context));
    },

    /**
     * @type:
     * @description:
     * @param: {function} comparer
     * @param: {*} context
     * @return: {Number}
     */
    findLastIndex: function _findLastIndex(comparer, context) {
        return this.of(this, findLastIndex(this, comparer, context));
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
     * @type: (a -> b -> c) -> a -> [b] -> a
     * @description:
     * @param: {function} fn
     * @param: {*} acc
     * @return: {*}
     */
    foldl: function _foldl(fn, acc) {
        return foldLeft(this, fn, acc);
    },

    /**
     * @type: (a -> a -> a) -> [a] -> a
     * @description:
     * @param: {function} fn
     * @param: {*} acc
     * @return: {*}
     */
    foldr: function _foldr(fn, acc) {
        return foldRight(this, fn, acc);
    },

    /**
     * @type:
     * @description:
     * @return: {boolean}
     */
    isEmpty: function _isEmpty() {
        return 0 === this.data.length;
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
     * @type:
     * @description:
     * @param: {function} fn
     * @param: {*} acc
     * @return: {*}
     */
    reduceRight: function _reduceRight(fn, acc) {
        return reduceRight(this, fn, acc);
    },

    /**
     * @description:
     * @return: {Array}
     */
    toArray: function _toArray() {
        return Array.from(this);
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
     * @return: {@see list_functor}
     */
    toEvaluatedList: function _toEvaluatedList() {
        return List.from(this.data /* the .data property is a getter function that forces evaluation */);
    },

    /**
     * @type:
     * @description:
     * @return: {Map}
     */
    toMap: function _toMap() {
        return new Map(this.data.map(function _map(val, idx) {
            return [idx, val];
        }));
    },

    /**
     * @description:
     * @return: {Set}
     */
    toSet: function _toSet() {
        return new Set(this);
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
     * @return: {*}
     */
    valueOf: function _valueOf() {
        return this.value;
    },

    /**
     * @description:
     */
    factory: List,

    /**
     * @description:
     * @param: {*} xs
     * @param: {generator} iterator
     * @param: {Array} sortObj
     * @param: {string} key
     * @return: {@see list_functor}
     */
    of: function _of(xs, iterator, sortObj, key) {
        return createListDelegateInstance(xs, iterator, sortObj, key);
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
};

list_core.append = list_core.concat;

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
    if (delegatesTo(source, ordered_list_functor) && 'undefined' === typeof comparer)
        return binarySearch(when(not(isArray), Array.from, source), val, comparer);
    return list_core.contains(val, comparer);
};

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the list_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a List's data by
 * a given key.
 * @type: {@see list_core}
 */
var list_functor = Object.create(list_core, {
    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @return: {@see ordered_list_functor}
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
     * @return: {@see ordered_list_functor}
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
 * @type: {@see list_core}
 */
var ordered_list_functor = Object.create(list_core, {
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
     * @return: {@see ordered_list_functor}
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
     * @return: {@see ordered_list_functor}
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
//TODO: monoid
//TODO: semigroup
//TODO: decorator
//TODO: combinator
//TODO: transducer
//TODO: JavaScript
//TODO: JS
//TODO: JunctionalS
//TODO: JunctorS
//TODO: lanoitcunf
//TODO: rotcnuf
//TODO: danom
//TODO: dionom
//TODO: puorgimes
//TODO: rotaroced
//TODO: rotanibmoc
//TODO: recudsnart
//TODO: tpircSavaJ
//TODO: Junctional FavaScript
//TODO: Algebraic Data Structures
//TODO: ADS
//TODO: Algebraic JavaScript - AJS
//TODO: Lambda

/**
 * @description: Creates a new list_functor object delegate instance; list_functor type is determined by
 * the parameters passed to the function. If only the 'source' parameter is provided, a
 * 'basic' list_functor delegate object instance is created. If the source and iterator parameters
 * are passed as arguments, a 'basic' list_functor delegate object instance is created and the
 * iterator provided is used as the new instance object's iterator rather than the default
 * list_functor iterator. If the source, iterator, and sortObj parameters are passed as arguments,
 * an ordered_list_functor delegate object instance is created. The provided iterator is set on
 * the instance object to be used in lieu of the default iterator and the ._appliedSorts
 * field is set as the 'sortObj' parameter. If all four of the function's arguments are
 * provided (source, iterator, sortObj, and key), then a list_functor delegate object instance
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
 * @param: {*} source - The value to be used as the underlying source of the list_functor functor; may be
 * anything javascript object that has an iterator.
 * @param: {generator} iterator - A generator function that is to be used on the new list_functor delegate
 * object instance's iterator.
 * @param: {Array} sortObj - An array of the sort(s) (field and direction} to be used when the
 * instance is evaluated.
 * @param: {string} key - A string that denotes what value the new list_functor delegate object instance
 * was grouped on.
 * @return: {@see list_core}
 */
var createListDelegateInstance = createListCreator(list_functor, ordered_list_functor, list_functor);

/**
 * @type:
 * @description:
 * @param: {*} source
 * @return: {@see list_functor}
 */
var listFromNonGen = source => createListDelegateInstance(source && source[Symbol.iterator] ? source : wrap(source));

/**
 * @type:
 * @description:
 * @param: {generator} source
 * @return: {@see list_functor}
 */
var listFromGen = source => createListDelegateInstance(invoke(source));

/**
 * @description: Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param: {*} source - Any type, any value; used as the underlying source of the List
 * @return: {@see list_functor} - A new List instance with the value provided as the underlying source.
 */
//TODO: should I exclude strings from being used as a source directly, or allow it because
//TODO: they have an iterator?
function List(source) {
    return ifElse(delegatesFrom(generatorProto), listFromGen, listFromNonGen, source);
}

/**
 * @description: Convenience function for listCreate a new List instance; internally calls List.
 * @see: List
 * @param: {*} source - Any type, any value; used as the underlying source of the List
 * @return: {@see list_functor} - A new List instance with the value provided as the underlying source.
 */
List.from = source => List(source);

/**
 * @description: Alias for List.from
 * @see: List.from
 * @type: {function}
 * @param: {*}
 * @return: {@see list_functor}
 */
List.of = List.from;

//TODO: implement this so that a consumer can initiate a List as ordered
List.ordered = source => source;

/**
 * @type:
 * @description:
 * @return: {@see list_functor}
 */
List.empty = () => List([]);

/**
 * @type:
 * @description:
 * @param: {*} val
 * @return: {@see list_functor}
 */
List.just = val => List([val]);

/**
 * @type:
 * @description:
 * @param: {function|generator} fn
 * @param: {*} seed
 * @return: {@see list_functor}
 */
List.unfold = (fn, seed) => createListDelegateInstance(unfold(fn)(seed));

/**
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
List.is = f => list_core.isPrototypeOf(f);

/**
 * Generates a new list with the specified item repeated the specified number of times. Because
 * this generates a list with the same item repeated n times, the resulting List is trivially
 * sorted. Thus, a sorted List is returned rather than an unsorted list.
 * @param: {*} item
 * @param: {number} count
 * @return: {@see ordered_list_functor}
 */
List.repeat = function _repeat(item, count) {
    return createListDelegateInstance([], repeat(item, count), [{ keySelector: noop, comparer: noop, direction: sortDirection.descending }]);
};

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
 * function (like: foldl, any, reverse, etc.), it merely needs the accept one or more
 * arguments and know how to iterate the source. In the case of an immediately evaluated
 * function, the return type can be any javascript type. The first argument is always the
 * previous List instance that must be iterated. Additional arguments may be specified
 * if desired.
 *
 * If the function's evaluation should be deferred it needs to work a bit differently.
 * In this case, the function should accept one or more arguments, the first and only
 * required argument being the underlying source of the List object. This underlying
 * source can be anything with an iterator (generator, array, map, set, another list, etc.).
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
    if (!(propName in list_functor) && !(propName in ordered_list_functor)) {
        list_core[propName] = function(...args) {
            return createListDelegateInstance(this, fn(this, ...args));
        };
    }
    return List;
};

/*
List.extend = (propName, fn) => when(both(second(inObject(list_functor)), second(inObject(ordered_list_functor)), noop, propName);
 */

function createGroupedListDelegate(source, key) {
    return createListDelegateInstance(source, undefined, undefined, key);
}




//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
list_core.constructor = list_core.factory;
list_core.fold = list_core.foldl;
list_core.reduce = list_core.foldl;

/**
 * @description: Since the constant functor does not represent a disjunction, the List's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type: {{function}}
 * @param: {function} f
 * @param: {function} g
 * @return: {@see list_core}
 */
list_core.bimap = list_core.map;


export { List, list_core, list_functor, ordered_list_functor };