import { addFront, concat, except, groupJoin, intersect, join, union, zip } from '../collation/collationFunctions';
import { all, any, contains, first, fold, last, count } from '../evaluation/evaluationFunctions';
import { distinct, ofType, where } from '../limitation/limitationFunctions';
import { deepFlatten, deepMap, flatten, groupBy, orderBy, map } from '../projection/projectionFunctions';
import { createNewQueryableDelegator, createNewOrderedQueryableDelegator } from './queryDelegatorCreators';
import { generatorProto, defaultPredicate } from '../helpers';
import { isArray, wrap } from '../functionalHelpers';

/**
 * Object that contains the core functionality; both the queryable and orderedQueryable
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @type {{
 * source,
 * source,
 * evaluatedData: *,
 * evaluatedData: *,
 * dataComputed: *,
 * dataComputed: *,
 * map: queryable_core._map,
 * groupBy: queryable_core._groupBy,
 * groupByDescending: queryable_core._groupByDescending,
 * flatten: queryable_core._flatten,
 * deepFlatten: queryable_core._deepFlatten,
 * deepMap: queryable_core._deepMap,
 * addFront: queryable_core._addFront,
 * concat: queryable_core._concat,
 * except: queryable_core._except,
 * groupJoin: queryable_core._groupJoin,
 * intersect: queryable_core._intersect,
 * join: queryable_core._join,
 * union: queryable_core._union,
 * zip: queryable_core._zip,
 * where: queryable_core._where,
 * ofType: queryable_core._ofType,
 * distinct: queryable_core._distinct,
 * take: queryable_core._take,
 * takeWhile: queryable_core._takeWhile,
 * skip: queryable_core._skip,
 * skipWhile: queryable_core._skipWhile,
 * any: queryable_core._any,
 * all: queryable_core._all,
 * contains: queryable_core._contains,
 * first: queryable_core._first,
 * fold: queryable_core._fold,
 * last: queryable_core._last,
 * count: queryable_core._count,
 * toArray: queryable_core._toArray,
 * toSet: queryable_core._toSet,
 * reverse: queryable_core._reverse,
 * [Symbol.iterator]: queryable_core._iterator
 * }}
 */
var queryable_core = {
    //Using getters for these properties because there's a chance the setting and/or getting
    //functionality could change; this will allow for a consistent interface while the
    //logic beneath changes

    /**
     * Getter for the underlying source object of the queryable
     * @returns {*}
     */
    get source() {
        return this._source;
    },

    /**
     * Setter for the underlying source object of the queryable
     * @param val
     */
    set source(val) {
        this._source = val;
    },

    /**
     * Getter for underlying _evaluatedData field; Holds an array of data
     * after enumerating the queryable delegator instance's source
     * @returns {*}
     */
    get evaluatedData() {
        return this._evaluatedData;
    },

    /**
     * Setter for underlying _evaluatedData field; returns either an
     * array if the queryable delegator instance's source has been
     * enumerated, or undefined
     * @param val
     */
    set evaluatedData(val) {
        this._dataComputed = true;
        this._evaluatedData = val;
    },

    /**
     * Getter for underlying _dataComputed field; returns true if
     * the queryable delegator instance's source has been enumerated
     * and false if not
     * @returns {*}
     */
    get dataComputed() {
        return this._dataComputed;
    },

    /**
     * Setter for underlying _dataComputed field
     * @param val
     */
    set dataComputed(val) {
        this._dataComputed = val;
    },

    /**
     *
     * @param mapFunc
     * @returns {*}
     */
    map: function _map(mapFunc) {
        return createNewQueryableDelegator(this, map(this, mapFunc));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
        return createNewQueryableDelegator(this, groupBy(this, groupObj));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
        return createNewQueryableDelegator(this, groupBy(this, groupObj));
    },

    /**
     *@type {function}
     */
    flatten: function _flatten() {
        return createNewQueryableDelegator(this, flatten(this));
    },

    /**
     *@type {function}
     */
    deepFlatten: function _deepFlatten() {
        return createNewQueryableDelegator(this, deepFlatten(this));
    },

    /**
     *
     * @param fn
     * @returns {*}
     */
    deepMap: function _deepMap(fn) {
        return createNewQueryableDelegator(this, deepMap(this, fn));
    },

    /**
     *
     * @param enumerable
     * @returns {*}
     */
    addFront: function _addFront(enumerable) {
        return createNewQueryableDelegator(this, addFront(this, enumerable));
    },

    /**
     * Concatenates two or more lists by appending the "method's" list argument(s) to the
     * queryable's source. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @param {Array | *} enumerables
     * @returns {*}
     */
    concat: function _concat(...enumerables) {
        return createNewQueryableDelegator(this, concat(this, enumerables, arguments.length));
    },

    /**
     * Produces a list that contains the objectSet difference between the queryable object
     * and the list that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each list; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * equality comparer.
     * @param enumerable
     * @param comparer
     * @returns {*}
     */
    except: function _except(enumerable, comparer) {
        return createNewQueryableDelegator(this, except(this, enumerable, comparer));
    },

    /**
     * Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * list; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param inner
     * @param outerSelector
     * @param innerSelector
     * @param projector
     * @param comparer
     * @returns {*}
     */
    groupJoin: function _groupJoin(inner, outerSelector, innerSelector, projector, comparer) {
        return createNewQueryableDelegator(this, groupJoin(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     * Produces the objectSet intersection of the queryable object's source and the list
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each list; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param enumerable
     * @param comparer
     * @returns {*}
     */
    intersect: function _intersect(enumerable, comparer) {
        return createNewQueryableDelegator(this, intersect(this, enumerable, comparer));
    },

    /**
     * Correlates the items in two lists based on the equality of items in each
     * list. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each list; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param inner
     * @param outerSelector
     * @param innerSelector
     * @param projector
     * @param comparer
     * @returns {*}
     */
    join: function _join(inner, outerSelector, innerSelector, projector, comparer) {
        return createNewQueryableDelegator(this, join(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     * Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each list; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param enumerable
     * @param comparer
     * @returns {*}
     */
    union: function _union(enumerable, comparer) {
        return createNewQueryableDelegator(this, union(this, enumerable, comparer));
    },

    /**
     * Produces a list of the items in the queryable object and the list passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each list; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param selector
     * @param enumerable
     * @returns {*}
     */
    zip: function _zip(selector, enumerable) {
        return createNewQueryableDelegator(this, zip(this, selector, enumerable));
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    where: function _where(predicate) {
        return createNewQueryableDelegator(this, where(this, predicate));
    },

    /**
     *
     * @param type
     * @returns {*}
     */
    ofType: function _ofType(type) {
        return createNewQueryableDelegator(this, ofType(this, type));
    },

    /**
     *
     * @param comparer
     * @returns {*}
     */
    distinct: function _distinct(comparer) {
        return createNewQueryableDelegator(this, distinct(this, comparer));
    },

    /**
     *
     * @param amt
     * @returns {Array}
     */
    take: function _take(amt) {
        if (!amt) return [];
        if (!this.dataComputed) {
            var res = [],
                idx = 0;

            for (let item of this) {
                if (idx < amt)
                    res[res.length] = item;
                else
                    break;
                ++idx;
            }
            return res;
        }
        return this.evaluatedData.slice(0, amt);
    },

    /**
     *
     * @param predicate
     * @returns {Array}
     */
    takeWhile: function _takeWhile(predicate = defaultPredicate) {
        var res = [],
            source = this.dataComputed ? this.evaluatedData : this;

        for (let item of source) {
            if (predicate(item))
                res[res.length] = item;
            else  {
                return res;
            }
        }
    },

    /**
     * Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty array is returned;
     * Otherwise, an array containing the items collected from the source is
     * returned.
     * @param {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @returns {*}
     */
    skip: function _skip(amt) {
        var source = this.dataComputed ? this.evaluatedData : this.source,
            idx = 0,
            res = [];

        for (let item of source) {
            if (idx >= amt)
                res[res.length] = item;
            ++idx;
        }
        return res;
    },

    /**
     *
     * @param predicate
     * @returns {Array}
     */
    skipWhile: function _skipWhile(predicate = defaultPredicate) {
        var source = this.dataComputed ? this.evaluatedData : this.source,
            hasFailed = false,
            res = [];

        for (let item of source) {
            if (!hasFailed && !predicate(item))
                hasFailed = true;
            if (hasFailed)
                res[res.length] = item;
        }
        return res;
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    any: function _any(predicate = defaultPredicate) {
        return any(this, predicate);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    all: function _all(predicate = defaultPredicate) {
        return all(this, predicate);
    },

    /**
     *
     * @param val
     * @param comparer
     * @returns {*}
     */
    contains: function _contains(val, comparer) {
        return contains(this, val, comparer);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    first: function _first(predicate = defaultPredicate) {
        return first(this, predicate);
    },

    /**
     *
     * @param fn
     * @param initial
     * @returns {*}
     */
    fold: function _fold(fn, initial) {
        return fold(this, fn, initial);
    },

    /**
     *
     */
    reduce: this.fold,

    /**
     *
     * @param predicate
     * @returns {*}
     */
    last: function _last(predicate = defaultPredicate) {
        return last(this, predicate);
    },

    /**
     *
     * @returns {*}
     */
    count: function _count() {
        return count(this);
    },

    /**
     *
     * @returns {Array}
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     *
     * @returns {Set}
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     *
     * @returns {Array.<*>}
     */
    reverse: function _reverse() {
        return Array.from(this).reverse();
    },

    /**
     * Base iterator to which all queryable_core delegator objects
     * delegate to for iteration if for some reason an iterator wasn't
     * objectSet on the delegator at the time of creation.
     */
    [Symbol.iterator]: function *_iterator() {
        var data = Array.from(this.source);
        for (let item of data)
            yield item;
    }
};

/**
 * A queryable_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a queryable object's data by
 * a given key.
 * @type {queryable_core}
 */
var internal_queryable = Object.create(queryable_core);

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_queryable.orderBy = function _orderBy(keySelector, comparer) {
    var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
    return createNewOrderedQueryableDelegator(this, orderBy(this, sortObj), sortObj);
};

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_queryable.orderByDescending = function _orderByDescending(keySelector, comparer) {
    var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
    return createNewOrderedQueryableDelegator(this, orderBy(this, sortObj), sortObj);
};

/**
 * A queryable_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .thenBy and .thenByDescending
 * functions. These functions allow a consumer to sort more on than a single column.
 * @type {queryable_core}
 */
var internal_orderedQueryable = Object.create(queryable_core);

internal_orderedQueryable._appliedSort = [];

//In these two functions, feeding the call to "orderBy" with the .source property of the queryable delegate
//rather than the delegate itself, effectively excludes the previous call to the orderBy/orderByDescending
//since the iterator exists on the delegate, not on its source. Each subsequent call to thenBy/thenByDescending
//will continue to exclude the previous call's iterator... effectively what we're doing is ignoring all the
//prior calls made to orderBy/orderByDescending/thenBy/thenByDescending and calling it once but with an array
//of the the requested sorts.

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_orderedQueryable.thenBy = function _thenBy(keySelector, comparer) {
    var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'asc' });
    return createNewOrderedQueryableDelegator(this.source, orderBy(this, sortObj), sortObj);
};

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_orderedQueryable.thenByDescending = function thenByDescending(keySelector, comparer) {
    var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'desc' });
    return createNewOrderedQueryableDelegator(this.source, orderBy(this, sortObj), sortObj);
};

//TODO: consider adding a function property to this object that can create a new consumer-level
//TODO: so that the queryable_core object can call that function for each deferred execution
//TODO: function rather than creating the consumer-level objects itself. This may to resolve
//TODO: the circular dependency that I am dealing with between queryable_core, queryObjectCreators
//TODO: function, and the internal_queryable/internal_orderedQueryable objects.
/**
 * Public API for consumers to create new object instance that delegate to a queryable object
 * for functionality. This object also has a ".extend" function property that can extend the
 * functionality of all queryable objects by allowing a consumer to define their own function
 * that will be invokable on all queryable objects.
 * @type {{extend: queryable._extend, from: queryable._from}}
 */
var queryable = {
    /**
     * Extension function that allows new functionality to be applied to
     * the queryable object
     * @param {string} propName - The name of the new queryable property; must be unique
     * @param {function} fn - A function that defines the new queryable functionality and
     * will be called when this new queryable property is invoked.
     *
     * NOTE: The fn parameter must be a non-generator function that takes one or more
     * arguments and returns a generator function that knows how to iterate the data
     * and yield out each item one at a time. The first argument must be the 'source'
     * argument of the function which will be what the returned generator must iterate
     * in order to retrieve the items it work work on. The function may work on all
     * the data as a single objectSet, or it can iterate it's queryable source and apply the
     * functionality to a single item before yielding that item and calling for the next.
     * The source argument may be any iterable object, generally an array or another
     * queryable; the returned generator needs either turn the iterable into an array
     * using Array#from if all the data is needed up front, or iterate the source in
     * a for-of loop if each item is only needed one-at-a-time.
     */
    extend: function _extend(propName, fn) {
        if (!queryable_core[propName]) {
            queryable_core[propName] = function(...args) {
                return createNewQueryableDelegator(this, fn(this, ...args));
            };
        }
    },

    /**
     * Creates a new queryable delegator object from whatever source value is provided.
     * @param {*} source - The source argument can be any JavaScript value. It will default
     * to an empty array if 'undefined' is passed. If the source argument is a generator,
     * an array, or another queryable, the function will accept it as is; if the source
     * argument has a [Symbol.iterator] definition, it will call Array.from on the source
     * before creating a new delegator, otherwise it will wrap the source argument in
     * as array.
     * @returns { Object } Returns a new queryable delegator object with its source objectSet
     * to the value of the provided source argument
     */
    from: function _from(source = []) {
        //... if the source is a generator, an array, or another queryable, accept it as is...
        if (generatorProto.isPrototypeOf(source) || isArray(source) || queryable_core.isPrototypeOf(source))
            return createNewQueryableDelegator(source);
        //... otherwise, turn the source into an array before creating a new queryable delegator object;
        //if it has an iterator, use Array.from, else wrap the source arg in an array...
        return createNewQueryableDelegator(null !== source && source[Symbol.iterator] ? Array.from(source) : wrap(source));
    }
};

export { queryable_core, internal_queryable, internal_orderedQueryable, queryable };