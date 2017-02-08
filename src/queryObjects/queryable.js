import { concat, except, groupJoin, intersect, join, union, zip } from '../collation/collationFunctions';
import { all, any, first, last } from '../evaluation/evaluationFunctions';
import { distinct, where } from '../limitation/limitationFunctions';
import { identity } from '../functionalHelpers';
import { javaScriptTypes } from '../helpers';
import { createNewQueryableDelegator/*, createNewFilteredQueryableDelegator, createNewOrderedQueryableDelegator*/ } from './queryObjectCreators';
//import { selectThunk, selectManyThunk, orderByThunk, orderByDescendingThunk, groupByThunk, groupByDescendingThunk, flattenData, deepFlattenData } from '../projection/projectionFunctions';
//import { _takeGenerator, _takeWhileGenerator, _pipelineGenerator, any, all, last } from '../evaluation/evaluationFunctions';
//import { expressionManager } from '../expressionManager';


//TODO: Not sure if this has been done yet or not, but need a way to create new query/query-type object without
//TODO: needing to first evaluate the data by pumping it through the pipeline first; rather creating a new
//TODO: query/query-type object would be better served by passing all the unprocessed data;

/**
 * Primary object to which filteredQueryables and orderedQueryables, as well as the objects passed to consumers, all delegate.
 * @type {{
 * queryableSelect: queryable._select,
 * queryableSelectMany: queryable._selectMany,
 * queryableGroupBy: queryable._groupBy,
 * queryableGroupByDescending: queryable._groupByDescending,
 * queryableOrderBy: queryable._orderBy,
 * queryableOrderByDescending: queryable._orderByDescending,
 * queryableFlatten: queryable._flatten,
 * queryableFlattenDeep: queryable._flattenDeep,
 * queryableJoin: queryable._join,
 * queryableGroupJoin: queryable._groupJoin,
 * queryableExcept: queryable._except,
 * queryableIntersect: queryable._intersect,
 * queryableUnion: queryable._union,
 * queryableZip: queryable._zip,
 * queryableWhere: queryable._where,
 * queryableDistinct: queryable._distinct,
 * queryableTake: queryable._take,
 * queryableTakeWhile: queryable.takeWhile,
 * queryableAny: queryable._any,
 * queryableAll: queryable._all,
 * queryableFirst: queryable.first,
 * queryableLast: queryable.last,
 * queryableToArray: queryable._toArray,
 * queryableToSet: queryable._toSet,
 * queryableReverse: queryable._reverse,
 * [Symbol.iterator]: queryable._iterator
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

    /**
     *@type {function}
     */
    /*queryableGroupBy: function _groupBy(field) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: groupByThunk(field), functionType: functionTypes.collective }]));
    },*/

    /**
     *@type {function}
     */
    /*queryableGroupByDescending: function _groupByDescending(field) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: groupByDescendingThunk(field), functionType: functionTypes.collective }]));
    },*/

    /**
     *@type {function}
     */
    /*queryableOrderBy: function _orderBy(field) {
        field.dir = 'asc';
        return createNewOrderedQueryableDelegator(this.source, this._pipeline.concat([{ fn: orderByThunk([field]), functionType: functionTypes.collective }]), [field]);
    },*/

    /**
     *@type {function}
     */
    /*queryableOrderByDescending: function _orderByDescending(field) {
        field.dir = 'desc';
        return createNewOrderedQueryableDelegator(this.source, this._pipeline.concat([{ fn: orderByDescendingThunk([field]), functionType: functionTypes.collective }]), [field]);
    },*/

    /**
     *@type {function}
     */
    /*queryableFlatten: function _flatten() {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: flattenData(), functionType: functionTypes.atomic }]));
    },*/

    /**
     *@type {function}
     */
    /*queryableFlattenDeep: function _flattenDeep() {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: deepFlattenData(), functionType: functionTypes.atomic }]));
    },*/

    /**
     *
     * @param collection
     * @returns {*}
     */
    queryableConcat: function _concat(collection) {
        return createNewQueryableDelegator(this, concat(this, collection));
    },

    /**
     *
     * @param collection
     * @param comparer
     * @returns {*}
     */
    queryableExcept: function _except(collection, comparer) {
        return createNewQueryableDelegator(this, except(this, collection, comparer));
    },

    /**
     *@type {function}
     */
    queryableGroupJoin: function _groupJoin(inner, outerSelector, innerSelector, projector, comparer) {
        return createNewQueryableDelegator(this, groupJoin(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     *@type {function}
     */
    queryableIntersect: function _intersect(collection, comparer) {
        return createNewQueryableDelegator(this, intersect(this, collection, comparer));
    },

    /**
     *@type {function}
     */
    queryableJoin: function _join(inner, outerSelector, innerSelector, projector, comparer) {
        return createNewQueryableDelegator(this, join(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     *@type {function}
     */
    queryableUnion: function _union(collection, comparer) {
        return createNewQueryableDelegator(this, union(this, collection, comparer));
    },

    /**
     *@type {function}
     */
    queryableZip: function _zip(selector, collection) {
        return createNewQueryableDelegator(this, zip(this, selector, collection));
        //return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: zip(selector, collection), functionType: functionTypes.atomic }]));
    },

    /**
     *@type {function}
     */
    queryableWhere: function _where(predicate) {
        return createNewQueryableDelegator(this, where(this, predicate));
        /*var filterExpression = expressionManager.isPrototypeOf(field) ? field : Object.create(expressionManager).createExpression(field, operator, value);
        return createNewFilteredQueryableDelegator(this.source, this._pipeline.concat([{ fn: filterDataWrapper(filterExpression),
            functionType: functionTypes.atomic, functionWrapper: basicAtomicFunctionWrapper }]), filterExpression);*/
    },

    /**
     *@type {function}
     */
    queryableDistinct: function _distinct(comparer) {
        return createNewQueryableDelegator(this, distinct(this, comparer));
        //return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: distinctThunk(fields), functionType: functionTypes.atomic }]));
    },

    /**
     *@type {function}
     */
    queryableTake: function _take(amt = 1) {
        //TODO: If I decide to 'save' not just a fully evaluated 'source', but also any data from a partially evaluated
        //TODO: 'source', then I'll probably have to re-think my strategy of wrapping each 'method's' iterator with
        //TODO: the standard queryable iterator as it may not work as needed.
        //TODO:
        //TODO: I'll also have to change this 'method' as it should take as much of the pre-evaluated date as possible
        //TODO: before evaluating any remaining data the it needs from the source.
        if (!amt) return;
        if (!this._dataComputed) {
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
        return this._evaluatedData.slice(0, amt);
    },

    /**
     *@type {function}
     */
    queryableTakeWhile: function takeWhile(predicate) {
        var res = [];

        if (!this._dataComputed) {
            for (let item of this) {
                if (predicate(item))
                    res = res.concat(item);
                else  {
                    return res;
                }
            }
        }

        /*for (let item of this._evaluatedData) {
            if (predicate(item)) res = res.concat([item]);
            else return res;
        }*/
    },

    /**
     *@type {function}
     */
    queryableAny: function _any(predicate) {
        return any(this, predicate);
    },

    /**
     *@type {function}
     */
    queryableAll: function _all(predicate) {
        return all(this, predicate);
    },

    /**
     *@type {function}
     */
    queryableFirst: function _first(predicate) {
        return first(this, predicate);
    },

    /**
     *@type {function}
     */
    queryableLast: function _last(predicate) {
        return last(this, predicate);
    },

    /**
     * @type {function}
     */
    queryableToArray: function _toArray() {
        return Array.from(this);
    },

    /**
     * @type {function}
     */
    queryableToSet: function _toSet() {
        return new Set(this);
    },

    /**
     * @type {function}
     */
    queryableReverse: function _reverse() {
        return Array.from(this).reverse();
    },

    [Symbol.iterator]: function *_iterator() {
        for (let item of this.source)
            yield item;
    }
};

export { queryable };