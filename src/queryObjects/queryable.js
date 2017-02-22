import { addFront, concat, except, groupJoin, intersect, join, union, zip } from '../collation/collationFunctions';
import { all, any, contains, first, fold, last, count } from '../evaluation/evaluationFunctions';
import { distinct, ofType, where } from '../limitation/limitationFunctions';
import { deepFlatten, deepMap, flatten, groupBy, map, orderBy } from '../projection/projectionFunctions';
import { createNewQueryableDelegator, createNewOrderedQueryableDelegator } from './queryObjectCreators';
import { generatorProto, defaultPredicate } from '../helpers';
import { isArray, wrap } from '../functionalHelpers';

//TODO: need to determine a better way to "hide" queryable delegate prototype functionality. Browser's
//TODO: are wanting to display both functions on the delegate and on the prototype(s).

/**
 * Primary object to which orderedQueryables, as well as the objects passed to consumers, all delegate.
 * @type {{
 * queryableFrom: * queryable._queryableFrom,
 * queryableMap: * queryable._queryableMap,
 * queryableGroupBy: * queryable._groupBy,
 * queryableGroupByDescending: * queryable._groupByDescending,
 * queryableOrderBy: * queryable._orderBy,
 * queryableOrderByDescending: * queryable._orderByDescending,
 * queryableFlatten: * queryable._flatten,
 * queryableFlattenDeep: * queryable._flattenDeep,
 * queryableConcat: * queryable._concat,
 * queryableExcept: * queryable._except,
 * queryableGroupJoin: * queryable._groupJoin,
 * queryableIntersect: * queryable._intersect,
 * queryableJoin: * queryable._join,
 * queryableUnion: * queryable._union,
 * queryableZip: * queryable._zip,
 * queryableWhere: * queryable._where,
 * queryableDistinct: * queryable._distinct,
 * queryableTake: * queryable._take,
 * queryableTakeWhile: * queryable.takeWhile,
 * queryableAny: queryable._any,
 * queryableAll: queryable._all,
 * queryableFirst: * queryable._first,
 * queryableLast: * queryable._last,
 * queryableToArray: * queryable._toArray,
 * queryableToSet: * queryable._toSet,
  *queryableReverse: * queryable._reverse,
  * [Symbol.iterator]: * queryable._iterator
  * }}
 */
var queryable = {
    /**
     * Projects each element of a sequence into a new form.
     * @param selector
     * @param context
     * @returns {Object}
     */
    /*queryableSelect: function _select(selector, context) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: selectThunk(selector, context), functionType: functionTypes.atomic }]));
    },*/

    /**
     * Projects each element of a sequence to an array and flattens the resulting sequences into one sequence.
     * @method selectMany
     * @type {function}
     * @param {function} selector - (Required) A transform function to apply to each element.
     * @param resSelector
     * @returns {Array} - The array of type of the elements of the sequence returned by selector.
     */
    /*queryableSelectMany: function _selectMany(selector, resSelector) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: selectManyThunk(selector, resSelector), functionType: functionTypes.atomic }]));
    },*/
    get source() {
        return this._source;
    },

    set source(val) {
        this._source = val;
    },

    //TODO: 1) See about initializing the queryable object with the _evaluatedData and _dataComputed
    //TODO:    properties upfront and making then non-enumerable.
    //TODO: 2) See if, via closure, I can bypass the need for getters/setters for properties that can
    //TODO:    ultimately be read and written to directly with a getter/setter property that maintains
    //TODO:    its own internal state - this would probably need to be done via Object.defineProperty
    //TODO:    as the closure would have to be shared amongst both the getter and setter
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
     * Extension function that allows new functionality to be applied to
     * the queryable object
     * @param {string} propName - The name of the new queryable property; must be unique
     * @param {function} fn - A function that defines the new queryable functionality and
     * will be called when this new queryable property is invoked.
     *
     * NOTE: The fn parameter must be a non-generator function that take one or more
     * arguments and returns a generator function that knows how to iterate the data
     * and yield out each item one at a time. The first argument must be the 'source'
     * argument of the function which will be what the returned generator must iterate
     * in order to retrieve the items it work work on. The function may work on all
     * the data as a single set, or it can iterate it's queryable source and apply the
     * functionality to a single item before yielding that item and calling for the next.
     */
    extend: function _extend(propName, fn) {
        if (!queryable[propName]) {
            queryable[propName] = function(...args) {
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
     * @returns { Object } Returns a new queryable delegator object with its source set
     * to the value of the provided source argument
     */
    from: function _from(source = []) {
        //... if the source is a generator, an array, or another queryable, accept it as is...
        if (generatorProto.isPrototypeOf(source) || isArray(source) || queryable.isPrototypeOf(source))
            return createNewQueryableDelegator(source);
        //... otherwise, turn the source into an array before creating a new queryable delegator object;
        //if it has an iterator, use Array.from, else wrap the source arg in an array...
        return createNewQueryableDelegator(null !== source && source[Symbol.iterator] ? Array.from(source) : wrap(source));
    },

    /**
     *
     * @param mapFunc
     * @returns {*}
     */
    queryableMap: function _queryableMap(mapFunc) {
        return createNewQueryableDelegator(this, map(this, mapFunc));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    queryableGroupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
        return createNewQueryableDelegator(this, groupBy(this, groupObj));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    queryableGroupByDescending: function _groupByDescending(keySelector, comparer) {
         var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
         return createNewQueryableDelegator(this, groupBy(this, groupObj));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    queryableOrderBy: function _orderBy(keySelector, comparer) {
        var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
        return createNewOrderedQueryableDelegator(this, orderBy(this, sortObj), sortObj);
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    queryableOrderByDescending: function _orderByDescending(keySelector, comparer) {
        var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
        return createNewOrderedQueryableDelegator(this, orderBy(this, sortObj), sortObj);
    },

    /**
     *@type {function}
     */
    queryableFlatten: function _flatten() {
        return createNewQueryableDelegator(this, flatten(this));
    },

    /**
     *@type {function}
     */
    queryableFlattenDeep: function _flattenDeep() {
        return createNewQueryableDelegator(this, deepFlatten(this));
    },

    /**
     *
     * @param fn
     * @returns {*}
     */
    queryableDeepMap: function _queryableDeepMap(fn) {
        return createNewQueryableDelegator(this, deepMap(this, fn));
    },

    /**
     *
     * @param enumerable
     * @returns {*}
     */
    queryableAddFront: function _queryableAddFront(enumerable) {
        return createNewQueryableDelegator(this, addFront(this, enumerable));
    },

    /**
     *
     * @param enumerable
     * @returns {*}
     */
    queryableConcat: function _concat(enumerable) {
        return createNewQueryableDelegator(this, concat(this, enumerable));
    },

    /**
     *
     * @param collection
     * @param enumerable
     * @returns {*}
     */
    queryableExcept: function _except(collection, enumerable) {
        return createNewQueryableDelegator(this, except(this, collection, enumerable));
    },

    /**
     *
     * @param inner
     * @param outerSelector
     * @param innerSelector
     * @param projector
     * @param comparer
     * @returns {*}
     */
    queryableGroupJoin: function _groupJoin(inner, outerSelector, innerSelector, projector, comparer) {
        return createNewQueryableDelegator(this, groupJoin(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     *
     * @param collection
     * @param enumerable
     * @returns {*}
     */
    queryableIntersect: function _intersect(collection, enumerable) {
        return createNewQueryableDelegator(this, intersect(this, collection, enumerable));
    },

    /**
     *
     * @param inner
     * @param outerSelector
     * @param innerSelector
     * @param projector
     * @param comparer
     * @returns {*}
     */
    queryableJoin: function _join(inner, outerSelector, innerSelector, projector, comparer) {
        return createNewQueryableDelegator(this, join(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     *
     * @param collection
     * @param enumerable
     * @returns {*}
     */
    queryableUnion: function _union(collection, enumerable) {
        return createNewQueryableDelegator(this, union(this, collection, enumerable));
    },

    /**
     *
     * @param selector
     * @param enumerable
     * @returns {*}
     */
    queryableZip: function _zip(selector, enumerable) {
        return createNewQueryableDelegator(this, zip(this, selector, enumerable));
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    queryableWhere: function _where(predicate) {
        return createNewQueryableDelegator(this, where(this, predicate));
        /*var filterExpression = expressionManager.isPrototypeOf(field) ? field : Object.create(expressionManager).createExpression(field, operator, value);
        return createNewFilteredQueryableDelegator(this.source, this._pipeline.concat([{ fn: filterDataWrapper(filterExpression),
            functionType: functionTypes.atomic, functionWrapper: basicAtomicFunctionWrapper }]), filterExpression);*/
    },

    /**
     *
     * @param type
     * @returns {*}
     */
    queryableOfType: function _queryableOfType(type) {
        return createNewQueryableDelegator(this, ofType(this, type));
    },

    /**
     *
     * @param comparer
     * @returns {*}
     */
    queryableDistinct: function _distinct(comparer) {
        return createNewQueryableDelegator(this, distinct(this, comparer));
    },

    /**
     *
     * @param amt
     * @returns {Array}
     */
    queryableTake: function _take(amt) {
        //TODO: If I decide to 'save' not just a fully evaluated 'source', but also any data from a partially evaluated
        //TODO: 'source', then I'll probably have to re-think my strategy of wrapping each 'method's' iterator with
        //TODO: the standard queryable iterator as it may not work as needed.
        //TODO:
        //TODO: I'll also have to change this 'method' as it should take as much of the pre-evaluated data as possible
        //TODO: before evaluating any remaining data the it needs from the source.
        if (!amt) return [];
        if (!this.dataComputed) {
            var res = [],
                idx = 0;

            for (let item of this) {
                if (idx < amt)
                    res = res.concat(item);
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
    queryableTakeWhile: function takeWhile(predicate = defaultPredicate) {
        var res = [],
            source = this.dataComputed ? this.evaluatedData : this;

        for (let item of source) {
            if (predicate(item))
                res = res.concat(item);
            else  {
                return res;
            }
        }
    },

    /**
     *
     * @param amt
     * @returns {*}
     */
    queryableSkip: function skip(amt) {
        var source = this.dataComputed ? this.evaluatedData : this.source,
            idx = 0,
            res = [];

        for (let item of source) {
            if (idx >= amt)
                res = res.concat(item);
            ++idx;
        }
        return res;
    },

    /**
     *
     * @param predicate
     * @returns {Array}
     */
    queryableSkipWhile: function skipWhile(predicate = defaultPredicate) {
        var source = this.dataComputed ? this.evaluatedData : this.source,
            hasFailed = false,
            res = [];

        for (let item of source) {
            if (!hasFailed && !predicate(item))
                hasFailed = true;
            if (hasFailed)
                res = res.concat(item);
        }
        return res;
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    queryableAny: function _any(predicate = defaultPredicate) {
        return any(this, predicate);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    queryableAll: function _all(predicate = defaultPredicate) {
        return all(this, predicate);
    },

    /**
     *
     * @param val
     * @param comparer
     * @returns {*}
     */
    queryableContains: function _queryableContains(val, comparer) {
        return contains(this, val, comparer);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    queryableFirst: function _first(predicate = defaultPredicate) {
        return first(this, predicate);
    },

    /**
     *
     * @param fn
     * @param initial
     * @returns {*}
     */
    queryableFold: function _queryableFold(fn, initial) {
        return fold(this, fn, initial);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    queryableLast: function _last(predicate = defaultPredicate) {
        return last(this, predicate);
    },

    /**
     *
     * @returns {*}
     */
    queryableLength: function _queryableLength() {
        return count(this);
    },

    /**
     *
     * @returns {Array}
     */
    queryableToArray: function _toArray() {
        return Array.from(this);
    },

    /**
     *
     * @returns {Set}
     */
    queryableToSet: function _toSet() {
        return new Set(this);
    },

    /**
     *
     * @returns {Array.<*>}
     */
    queryableReverse: function _reverse() {
        return Array.from(this).reverse();
    },

    /**
     *
     */
    [Symbol.iterator]: function *_iterator() {
        for (let item of this.source)
            yield item;
    }
};

/*
function createEvaledDateProperty(obj) {
    var data = null;
    Object.defineProperty(
        obj,
        'evaledData', {
            get: function _getEvaledData() {
                return data;
            },
            set: function _setEvaledData(val) {
                data = val;
            }
        }
    );
}
*/

export { queryable };