import { all, any, except, intersect, union, map, groupBy, sortBy, prepend, concat, groupJoin, join, zip, filter, intersperse,
    contains, first, last, count, foldLeft, reduceRight, distinct, ofType, binarySearch, equals, takeWhile, skipWhile, reverse,
    copyWithin, fill, findIndex, findLastIndex, repeat, foldRight, unfold } from '../list_iterators';
import { sortDirection, generatorProto } from '../../helpers';
import { wrap, defaultPredicate, delegatesTo, delegatesFrom, isArray, noop, invoke } from '../../functionalHelpers';
import { when, ifElse, identity } from '../../combinators';
import { not } from '../../decorators';
import { createListCreator, taker_skipper } from '../list_helpers';

/**
 * @description: Object that contains the core functionality of a List; both the m_list and ordered_m_list
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @typedef {Object}
 * @property {function} value
 * @property {function} append
 * @property {function} copyWithin
 * @property {function} concat
 * @property {function} distinct
 * @property {function} except
 * @property {function} fill
 * @property {function} filter
 * @property {function} groupBy
 * @property {function} groupByDescending
 * @property {function} groupJoin
 * @property {function} intersect
 * @property {function} intersperse
 * @property {function} join
 * @property {function} map
 * @property {function} ofType
 * @property {function} prepend
 * @property {function} reverse
 * @property {function} skip
 * @property {function} skipWhile
 * @property {function} take
 * @property {function} takeWhile
 * @property {function} union
 * @property {function} zip
 * @property {function} all
 * @property {function} any
 * @property {function} contains
 * @property {function} count
 * @property {function} equals
 * @property {function} findIndex
 * @property {function} findLastIndex
 * @property {function} first
 * @property {function} foldLeft
 * @property {function} foldr
 * @property {function} isEmpty
 * @property {function} last
 * @property {function} reduceRight
 * @property {function} toArray
 * @property {function} toEvaluatedList
 * @property {function} toMap
 * @property {function} toSet
 * @property {function} toString
 * @property {function} valueOf
 * @property {function} factory
 * @property {function} of
 * @property {Symbol.iterator}
 */
var list_core = {
    //Using getters for these properties because there's a chance the setting and/or getting
    //functionality could change; this will allow for a consistent interface while the
    //logic beneath changes
    /**
     * @sig
     * @description Getter for the underlying source object of the List
     * @return {*} - a
     */
    get value() {
        return this._value;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {number} index - a
     * @param {number} start - b
     * @param {number} end - c
     * @return {list_functor} - d
     */
    copyWithin: function _copyWithin(index, start, end) {
        return this.of(this, copyWithin(index, start, end, this));
    },

    /**
     * @sig
     * @description Concatenates two or more lists by appending the "method's" List argument(s) to the
     * List's value. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @protected
     * @param {Array | *} ys - a
     * @return {list_functor} - b
     */
    concat: function _concat(...ys) {
        return this.of(this, concat(this, ys, ys.length));
    },

    /**
     * @sig (a -> boolean) -> List<b>
     * @description d
     * @protected
     * @param {function} comparer - a
     * @return {list_functor} - b
     */
    distinct: function _distinct(comparer) {
        return this.of(this, distinct(this, comparer));
    },

    /**
     * @sig
     * @description Produces a List that contains the objectSet difference between the queryable object
     * and the List that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * equality comparer.
     * @protected
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    except: function _except(xs, comparer) {
        return this.of(this, except(this, xs, comparer));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {number} value - a
     * @param {number} start - b
     * @param {number} end - c
     * @return {list_functor} - d
     */
    fill: function _fill(value, start, end) {
        return this.of(this, fill(value, start, end, this));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {list_functor} - b
     */
    filter: function _filter(predicate) {
        return this.of(this, filter(this, predicate));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
        return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
        return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @sig
     * @description Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @protected
     * @param {list_core | Array} ys - a
     * @param {function} xSelector - b
     * @param {function} ySelector - c
     * @param {function} projector - d
     * @param {function} comparer - e
     * @return {list_functor} - f
     */
    groupJoin: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
        return this.of(this, groupJoin(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
    },

    /**
     * @sig
     * @description Produces the objectSet intersection of the List object's value and the List
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @protected
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    intersect: function _intersect(xs, comparer) {
        return this.of(this, intersect(this, xs, comparer));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {*} val - a
     * @return {list_functor} - b
     */
    intersperse: function _intersperse(val) {
        return this.of(this, intersperse(this, val));
    },

    /**
     * @sig
     * @description Correlates the items in two lists based on the equality of items in each
     * List. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @protected
     * @param {Array|List} ys - a
     * @param {function} xSelector - b
     * @param {function} ySelector - c
     * @param {function} projector - d
     * @param {function} comparer - e
     * @return {list_functor} - f
     */
    join: function _join(ys, xSelector, ySelector, projector, comparer) {
        return this.of(this, join(this, ys, xSelector, ySelector, projector, comparer));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} mapFunc - a
     * @return {list_functor} - b
     */
    map: function _map(mapFunc) {
        return this.of(this, map(this, mapFunc));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {string|Object} type - a
     * @returns {list_functor} - b
     */
    ofType: function _ofType(type) {
        return this.of(this, ofType(this, type));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {Array|generator} xs - a
     * @return {list_functor} - b
     */
    prepend: function _prepend(xs) {
        return this.of(this, prepend(this, xs));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {list_functor} - a
     */
    reverse: function _reverse() {
        return this.of(this, reverse(this));
    },

    /**
     * @sig
     * @description Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty list_functor is returned;
     * Otherwise, a list_functor containing the items collected from the source is
     * returned.
     * @protected
     * @param {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @return {list_functor} - a
     */
    skip: function _skip(amt) {
        return this.skipWhile(taker_skipper(amt));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {list_functor} - b
     */
    skipWhile: function _skipWhile(predicate = defaultPredicate) {
        return this.of(this, skipWhile(this, predicate));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {number} amt - a
     * @return {list_functor} - b
     */
    take: function _take(amt) {
        return this.takeWhile(taker_skipper(amt));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {list_functor} - b
     */
    takeWhile: function _takeWhile(predicate = defaultPredicate) {
        return this.of(this, takeWhile(this, predicate));
    },

    /**
     * @sig
     * @description Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @protected
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    union: function _union(xs, comparer) {
        return this.of(this, union(this, xs, comparer));
    },

    /**
     * @sig
     * @description Produces a List of the items in the queryable object and the List passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @protected
     * @param {function} selector - a
     * @param {Array|generator} xs - b
     * @return {list_functor} - c
     */
    zip: function _zip(selector, xs) {
        return this.of(this, zip(this, xs, selector));
    },

    /**
     * @sig (a -> Boolean) -> [a] -> Boolean
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {boolean} - b
     */
    all: function _all(predicate = defaultPredicate) {
        return all(this, predicate);
    },

    /**
     * @sig: (a -> Boolean) -> [a] -> Boolean
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {boolean} - b
     */
    any: function _any(predicate = defaultPredicate) {
        return any(this, predicate);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {Number} - a
     */
    count: function _count() {
        return count(this);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {list_core} f - a
     * @param {function} comparer - b
     * @return {boolean} - c
     */
    equals: function _equals(f, comparer) {
        return Object.getPrototypeOf(this).isPrototypeOf(f) && equals(this, f, comparer);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} comparer - a
     * @return {Number} - b
     */
    findIndex: function _findIndex(comparer) {
        return findIndex(this, comparer);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} comparer - a
     * @return {Number} - b
     */
    findLastIndex: function _findLastIndex(comparer) {
        return findLastIndex(this, comparer);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {*} - b
     */
    first: function _first(predicate = defaultPredicate) {
        return first(this, predicate);
    },

    /**
     * @sig (a -> b -> c) -> a -> [b] -> a
     * @description d
     * @protected
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    foldl: function _foldl(fn, acc) {
        return foldLeft(this, fn, acc);
    },

    /**
     * @sig (a -> a -> a) -> [a] -> a
     * @description d
     * @protected
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    foldr: function _foldr(fn, acc) {
        return foldRight(this, fn, acc);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {boolean} - a
     */
    isEmpty: function _isEmpty() {
        return 0 === this.data.length;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {*} - b
     */
    last: function _last(predicate = defaultPredicate) {
        return last(this, predicate);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    reduceRight: function _reduceRight(fn, acc) {
        return reduceRight(this, fn, acc);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {Array} - a
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     * @sig
     * @description Evaluates the current List instance and returns a new List
     * instance with the evaluated data as its source. This is used when the
     * initial List's data must be iterated more than once as it will cause
     * the evaluation to happen each item it is iterated. Rather the pulling the
     * initial data through the List's 'pipeline' every time, this property will
     * allow you to evaluate the List's data and store it in a new List that can
     * be iterated many times without needing to re-evaluate. It is effectively
     * a syntactical shortcut for: List.from(listInstance.data)
     * @protected
     * @return {list_functor} - a
     */
    toEvaluatedList: function _toEvaluatedList() {
        return List.from(this.data /* the .data property is a getter function that forces evaluation */);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {Map} - a
     */
    toMap: function _toMap() {
        return new Map(this.data.map(function _map(val, idx) {
            return [idx, val];
        }));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {Set} - a
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     * @sig
     * @description Returns a string representation of an instance of a List
     * delegator object. This function does not cause evaluation of the source,
     * but this also means the returned value only reflects the underlying
     * data, not the evaluated data.
     * @protected
     * @return {string} - a
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
     * @sig
     * @description d
     * @protected
     * @return {*} - a
     */
    valueOf: function _valueOf() {
        return this.value;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {list_functor} - a
     */
    factory: List,

    /**
     * @sig
     * @description d
     * @protected
     * @param {*} xs - a
     * @param {generator} iterator - b
     * @param {Array} sortObj - c
     * @param {string} key - d
     * @return {list_functor} - e
     */
    of: function _of(xs, iterator, sortObj, key) {
        return createListDelegateInstance(xs, iterator, sortObj, key);
    },

    /**
     * @sig
     * @description Base iterator to which all queryable_core delegator objects
     * delegate to for iteration if for some reason an iterator wasn't
     * objectSet on the delegator at the time of creation.
     * @protected
     * @return {Array} - a
     */
    [Symbol.iterator]: function *_iterator() {
        var data = Array.from(this.value);
        for (let item of data) {
            yield item;
        }
    }
};

list_core.append = list_core.concat;

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the list_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a List's data by
 * a given key.
 * @typedef {Object}
 * @property {function} sortBy
 * @property {function} sortByDescending
 * @property {function} contains
 */
var list_functor = Object.create(list_core, {
    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    sortBy: {
        value: function _orderBy(keySelector, comparer = defaultPredicate) {
            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
            return this.of(this, sortBy(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    sortByDescending: {
        value: function _orderByDescending(keySelector, comparer = defaultPredicate) {
            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
            return this.of(this, sortBy(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description d
     * @protected
     * @param {*} val - a
     * @param {function} comparer - b
     * @return {boolean} - c
     */
    contains: {
        value: function _contains(val, comparer) {
            return contains(this, val, comparer);
        }
    }
});

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .thenBy and .thenByDescending
 * functions. These functions allow a consumer to sort more on than a single column.
 * @typedef {Object}
 * @property {function} sortBy
 * @property {function} sortByDescending
 * @property {function} contains
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
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    thenBy: {
        value: function _thenBy(keySelector, comparer = defaultPredicate) {
            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending });
            return this.of(this.value, sortBy(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    thenByDescending: {
        value: function thenByDescending(keySelector, comparer = defaultPredicate) {
            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending });
            return this.of(this.value, sortBy(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description Performs the same functionality as list_core#contains, but utilizes
     * a binary searching algorithm rather than a sequential search. If this function is called
     * an a non-ordered List, it will internally delegate to list_core#contains instead. This
     * function should not be called on a sorted List for look for a value that is not the
     * primary field on which the List's data is sorted on as an incorrect result will likely
     * be returned.
     * @protected
     * @param {*} val - The value that should be searched for
     * @param {function} comparer - The function used to compare values in the List to
     * the 'val' parameter
     * @return {boolean} - Returns true if the List contains the searched for value, false
     * otherwise.
     */
    contains: {
        value: function _contains(val, comparer) {
            return binarySearch(when(not(isArray), Array.from, this.value), val, comparer);
        }
    }
});

//TODO: monad
//TODO: functor
//TODO: monoid
//TODO: semigroup
//TODO: decorator
//TODO: combinator
//TODO: transducer
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

//TODO: JavaScript
//TODO: JS
//TODO: EcmaScript
//TODO: es-20FP
//TODO: functional
//TODO: functional programming
//TODO: FP
//TODO: Lambda
//TODO: Lambda calculus
//TODO: category theory
//TODO: higher order (functions)
//TODO: first class functions
//TODO: lazy (evaluation)
//TODO: deferred execution
//TODO: pure
//TODO: composable
//TODO: referential transparency
//TODO: pointfree/pointless

//TODO: Pointfree Functional programming - PF-FP
//TODO: pointfree-js pfjs

//TODO: Algebraic JavaScript - AJS
//TODO: Functional JavaScript - FJS
//TODO: Deferred Laziness
//TODO: First-class Laziness
//TODO: Algebraic Laziness

/**
 * @sig
 * @description Creates a new list_functor object delegate instance; list_functor type is determined by
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
 * @param {*} source - The value to be used as the underlying source of the list_functor functor; may be
 * anything javascript object that has an iterator.
 * @param {generator} iterator - A generator function that is to be used on the new list_functor delegate
 * object instance's iterator.
 * @param {Array} sortObj - An array of the sort(s) (field and direction} to be used when the
 * instance is evaluated.
 * @param {string} key - A string that denotes what value the new list_functor delegate object instance
 * was grouped on.
 * @return {list_core}
 */
var createListDelegateInstance = createListCreator(list_functor, ordered_list_functor, list_functor);

/**
 * @sig
 * @description d
 * @param {*} source - a
 * @return {list_functor} - b
 */
var listFromNonGen = source => createListDelegateInstance(source && source[Symbol.iterator] ? source : wrap(source));

/**
 * @sig
 * @description d
 * @param {generator} source - a
 * @return {list_functor} - b
 */
var listFromGen = source => createListDelegateInstance(invoke(source));

/**
 * @sig
 * @description Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_functor} - A new List instance with the value provided as the underlying source.
 */
//TODO: should I exclude strings from being used as a source directly, or allow it because
//TODO: they have an iterator?
function List(source) {
    return ifElse(delegatesFrom(generatorProto), listFromGen, listFromNonGen, source);
}

/**
 * @sig
 * @description Convenience function for listCreate a new List instance; internally calls List.
 * @static
 * @see List
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_functor} - A new List instance with the value provided as the underlying source.
 */
List.from = source => List(source);

/**
 * @sig
 * @description Alias for List.from
 * @static
 * @see List.from
 * @param {*}
 * @return {list_functor} - a
 */
List.of = List.from;

//TODO: implement this so that a consumer can initiate a List as ordered
List.ordered = (source, selector, comparer = defaultPredicate) => createListDelegateInstance(source, null,
    [{ keySelector: selector, comparer: comparer, direction: sortDirection.ascending }]);

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @return {list_functor} - a
 */
List.empty = () => createListDelegateInstance([], null,
    [{ keySelector: identity, comparer: defaultPredicate, direction: sortDirection.ascending }]);

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @param {*} val - a
 * @return {list_functor} - b
 */
List.just = val => createListDelegateInstance([val], null,
    [{ keySelector: identity, comparer: defaultPredicate, direction: sortDirection.ascending }]);

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @param {function|generator} fn - a
 * @param {*} seed - b
 * @return {list_functor} - c
 */
List.unfold = (fn, seed) => createListDelegateInstance(unfold(fn)(seed));

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @param {*} f - a
 * @return {boolean} - b
 */
List.is = f => list_core.isPrototypeOf(f);

/**
 * @sig
 * @description Generates a new list with the specified item repeated the specified number of times. Because
 * this generates a list with the same item repeated n times, the resulting List is trivially
 * sorted. Thus, a sorted List is returned rather than an unsorted list.
 * @static
 * @see List
 * @param {*} item - a
 * @param {number} count - b
 * @return {ordered_list_functor} - c
 */
List.repeat = function _repeat(item, count) {
    return createListDelegateInstance([], repeat(item, count), [{ keySelector: noop, comparer: noop, direction: sortDirection.descending }]);
};

/**
 * @sig
 * @summary Extension function that allows new functionality to be applied to
 * the queryable object
 * @static
 * @see List
 * @param {string} prop - The name of the new property that should exist on the List; must be unique
 * @param {function} fn - A function that defines the new List functionality and
 * will be called when this new List property is invoked.
 * @return {List} - a
 *
 * @description The fn parameter must be a non-generator function that takes one or more
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
List.extend = function _extend(prop, fn) {
    if (!(prop in list_functor) && !(prop in ordered_list_functor)) {
        list_core[prop] = function _extension(...args) {
            return createListDelegateInstance(this, fn(this, ...args));
        };
    }
    return List;
};

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
 * @sig
 * @description Since the constant functor does not represent a disjunction, the List's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @protected
 * @param {function} f - a
 * @param {function} g - b
 * @return {list_core} - c
 */
list_core.bimap = list_core.map;


export { List, list_core, list_functor, ordered_list_functor };