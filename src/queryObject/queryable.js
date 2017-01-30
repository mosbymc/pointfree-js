import { union } from '../collation/collationFunctions';
import { selectThunk, selectManyThunk, orderByThunk, orderByDescendingThunk, groupByThunk, groupByDescendingThunk, flattenData, deepFlattenData } from '../projection/projectionFunctions';
import { _takeGenerator, _takeWhileGenerator, _pipelineGenerator, any, all, last } from '../evaluation/evaluationFunctions';
import { filterDataWrapper, distinctThunk } from '../limitation/limitationFunctions';
import { defaultEqualityComparer, memoizer, functionTypes, javaScriptTypes } from '../helpers';
import { identity } from '../functionalHelpers';
import { createNewQueryableDelegator, createNewFilteredQueryableDelegator, createNewOrderedQueryableDelegator } from './queryObjectCreators';
import { expressionManager } from '../expressionManager';
import { basicAtomicFunctionWrapper, listCollationAtomicFunctionWrapper, selectManyFunctionWrapper } from '../functionWrappers';


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
    queryableSelect: function _select(selector, context) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: selectThunk(selector, context), functionType: functionTypes.atomic }]));
    },

    /**
     * Projects each element of a sequence to an array and flattens the resulting sequences into one sequence.
     * @method selectMany
     * @type {function}
     * @param {function} selector - (Required) A transform function to apply to each element.
     * @param resSelector
     * @returns {Array} - The array of type of the elements of the sequence returned by selector.
     */
    queryableSelectMany: function _selectMany(selector, resSelector) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: selectManyThunk(selector, resSelector), functionType: functionTypes.atomic }]));
    },

    /**
     *@type {function}
     */
    queryableGroupBy: function _groupBy(field) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: groupByThunk(field), functionType: functionTypes.collective }]));
    },

    /**
     *@type {function}
     */
    queryableGroupByDescending: function _groupByDescending(field) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: groupByDescendingThunk(field), functionType: functionTypes.collective }]));
    },

    /**
     *@type {function}
     */
    queryableOrderBy: function _orderBy(field) {
        field.dir = 'asc';
        return createNewOrderedQueryableDelegator(this.source, this._pipeline.concat([{ fn: orderByThunk([field]), functionType: functionTypes.collective }]), [field]);
    },

    /**
     *@type {function}
     */
    queryableOrderByDescending: function _orderByDescending(field) {
        field.dir = 'desc';
        return createNewOrderedQueryableDelegator(this.source, this._pipeline.concat([{ fn: orderByDescendingThunk([field]), functionType: functionTypes.collective }]), [field]);
    },

    /**
     *@type {function}
     */
    queryableFlatten: function _flatten() {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: flattenData(), functionType: functionTypes.atomic }]));
    },

    /**
     *@type {function}
     */
    queryableFlattenDeep: function _flattenDeep() {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: deepFlattenData(), functionType: functionTypes.atomic }]));
    },

    /**
     *@type {function}
     */
    queryableJoin: function _join(outer, inner, projector, comparer, collection) {
        comparer = comparer || defaultEqualityComparer;
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: joinWrapper(outer, inner, projector, comparer, collection),
            functionType: functionTypes.atomic, functionWrapper: selectManyFunctionWrapper }]));
    },

    /**
     *@type {function}
     */
    queryableGroupJoin: function _groupJoin(outer, inner, projector, comparer, collection) {
        comparer = comparer || defaultEqualityComparer;
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: groupJoinWrapper(outer, inner, projector, comparer, collection),
            functionType: functionTypes.atomic, functionWrapper: basicAtomicFunctionWrapper }]));
    },

    /**
     *
     * @param collection
     * @param comparer
     * @returns {*}
     */
    queryableExcept: function _except(collection, comparer) {
        comparer = comparer || defaultEqualityComparer;
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: except(collection, comparer), functionType: functionTypes.atomic }]));
    },

    /**
     *@type {function}
     */
    queryableIntersect: function _intersect(comparer, collection) {
        if (typeof comparer !== 'function' && (typeof comparer !== 'object' && Array.isArray(comparer))) return this;
        if (typeof comparer !== 'function') {
            collection = comparer;
            comparer = undefined;
        }
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: intersectThunk(comparer, collection), functionType: functionTypes.atomic }]));
    },

    /**
     *@type {function}
     */
    queryableUnion: function _union(collection, comparer) {
        var previouslyViewed = memoizer();
        comparer = comparer ||
            function _findUniques(item) {
                if (!previouslyViewed(item)) return item;
            };
        return createNewQueryableDelegator(this.source, union(this._pipeline[this._pipeline.length - 1], collection, comparer));
    },

    /**
     *@type {function}
     */
    queryableZip: function _zip(selector, collection) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: zipThunk(selector, collection), functionType: functionTypes.atomic }]));
    },

    /**
     *@type {function}
     */
    queryableWhere: function _where(field, operator, value) {
        var filterExpression = expressionManager.isPrototypeOf(field) ? field : Object.create(expressionManager).createExpression(field, operator, value);
        return createNewFilteredQueryableDelegator(this.source, this._pipeline.concat([{ fn: filterDataWrapper(filterExpression),
            functionType: functionTypes.atomic, functionWrapper: basicAtomicFunctionWrapper }]), filterExpression);
    },

    /**
     *@type {function}
     */
    queryableDistinct: function _distinct(fields) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: distinctThunk(fields), functionType: functionTypes.atomic }]));
    },

    /**
     *@type {function}
     */
    queryableTake: function _take(amt = 1) {
        if (!amt) return;
        if (!this._dataComputed) {
            var takeResult = Array.from(_takeGenerator(_pipelineGenerator(this.source, this._pipeline), amt));
            return takeResult && takeResult.length ? Array.prototype.concat.apply([], takeResult) : [];
            //return takeResult[0];
        }
        return this.data.slice(0, amt);
    },

    /**
     *@type {function}
     */
    queryableTakeWhile: function takeWhile(predicate) {
        if (!this._dataComputed) {
            var takeWhileResult = Array.from(_takeWhileGenerator(predicate, _pipelineGenerator(this.source, this._pipeline)));
            return takeWhileResult && takeWhileResult.length ? Array.prototype.concat.apply([], takeWhileResult) : [];
        }

        var ret = [];
        for (var item of this.data) {
            if (predicate(item)) ret = ret.concat([item]);
            else return ret;
        }
    },

    /**
     *@type {function}
     */
    queryableAny: function _any(predicate) {
        return any(predicate, this.data);
    },

    /**
     *@type {function}
     */
    queryableAll: function _all(predicate) {
        return all(predicate, this.data);
    },

    /**
     *@type {function}
     */
    queryableFirst: function first(predicate) {
        if (!predicate || typeof predicate !== javaScriptTypes.function) {
            return this.queryableTake(1)[0];
        }
        return this.data.find(predicate);
    },

    /**
     *@type {function}
     */
    queryableLast: function last(predicate) {
        return last(predicate, this.data);
    },

    /**
     * @type {function}
     */
    queryableToArray: function _toArray() {
        return this.data.map(identity);
    },

    /**
     * @type {function}
     */
    queryableToSet: function _toSet() {
        return new Set(this.data);
    },

    /**
     * @type {function}
     */
    queryableReverse: function _reverse() {
        return this.data.reverse();
    },

    [Symbol.iterator]: function *_iterator(items) {
        if (this._dataComputed) {
            for (var item of items)
                yield item;
        }
        else {
            yield _pipelineGenerator(this.source, this._pipeline);
        }
    }
};

export { queryable };