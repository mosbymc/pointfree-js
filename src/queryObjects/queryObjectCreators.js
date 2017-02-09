import { queryable } from './queryable';
//import { orderedQueryable } from './orderedQueryable';
//import { filteredQueryable } from './filteredQueryable';
//import { filterAppend } from '../limitation/limitationFunctions';
//import { orderByThunk, orderByDescendingThunk } from '../projection/projectionFunctions';
//import { _pipelineGenerator } from '../evaluation/pipelineGenerator';
//import { functionTypes } from '../helpers';
import { ifElse, not, isArray, wrap, identity } from '../functionalHelpers';
//import { expressionManager } from '../expressionManager';

var generatorProto = Object.getPrototypeOf(function *_generator(){});

function createNewQueryableDelegator(source, iterator) {
    var obj = Object.create(queryable);
    obj.source = source;
    obj._evaluatedData = null;
    obj._dataComputed = false;
    obj._currentDataIndex = 0;
    if (iterator && generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;
    //TODO: may not need to set a default iterator here... if the iterator value is passed in, then
    //TODO: set it, otherwise, don't shadow the queryable's iterator and just let it yield each item
    //TODO: of the source
    //obj[Symbol.iterator] = iterator ? iterator : queryableIterator(source);

    /*obj.select = function _select(fields) {
        return this.queryableSelect(fields);
    };*/
    /*obj.selectMany = function _selectMany(selector, resSelector) {
        return this.queryableSelectMany(selector, resSelector);
    };*/
    obj.where = function _where(field, operator, value) {
        return this.queryableWhere(field, operator, value);
    };
    obj.concat = function _concat(collection) {
        return this.queryableConcat(collection);
    };
    obj.except = function _except(collection, comparer) {
        return this.queryableExcept(collection, comparer);
    };
    obj.groupJoin = function _groupJoin(inner, outerSelector, innerSelector, projector, comparer) {
        return this.queryableGroupJoin(inner, outerSelector, innerSelector, projector, comparer);
    };
    obj.intersect = function _intersect(collection, comparer) {
        return this.queryableIntersect(collection, comparer);
    };
    obj.join = function _join(inner, outerSelector, innerSelector, projector, comparer) {
        return this.queryableJoin(inner, outerSelector, innerSelector, projector, comparer);
    };
    obj.union = function _union(collection, comparer) {
        return this.queryableUnion(collection, comparer);
    };
    obj.zip = function _zip(selector, collection) {
        return this.queryableZip(selector, collection);
    };
    /*obj.groupBy = function _groupBy(fields, sl) {
        return this.queryableGroupBy(fields, sl);
    };*/
    /*obj.groupByDescending = function _groupByDescending(fields) {
        return this.queryableGroupByDescending(fields);
    };*/
    /*obj.orderBy = function _orderBy(field) {
        return this.queryableOrderBy(field);
    };*/
    /*obj.orderByDescending = function _orderByDescending(field) {
        return this.queryableOrderByDescending(field);
    };*/
    obj.distinct = function _distinct(fields) {
        return this.queryableDistinct(fields);
    };
    /*obj.flatten = function _flatten() {
        return this.queryableFlatten();
    };*/
    /*obj.flattenDeep = function _flattenDeep() {
        return this.queryableFlattenDeep();
    };*/
    obj._getData = function _getData() {
        return this._getData();
    };
    obj.take = function _take(amt = 1) {
        return this.queryableTake(amt);
    };
    obj.takeWhile = function _takeWhile(predicate) {
        return this.queryableTakeWhile(predicate);
    };
    obj.any = function _any(predicate) {
        return this.queryableAny(predicate);
    };
    obj.all = function _all(predicate) {
        return this.queryableAll(predicate);
    };
    obj.first = function _first(predicate) {
        return this.queryableFirst(predicate);
    };
    obj.last = function _last(predicate) {
        return this.queryableLast(predicate);
    };
    return addGetter(obj);
}

/*
function createNewFilteredQueryableDelegator(data, funcs, filterExpression) {
    if (!expressionManager.isPrototypeOf(filterExpression)) return;

    var obj = Object.create(filteredQueryable);
    obj.source = data;
    obj._evaluatedData = null;
    obj._dataComputed = false;
    obj._pipeline = funcs ? ifElse(not(isArray), wrap, identity, funcs) : [];
    obj._currentPipelineIndex = 0;
    obj._currentDataIndex = 0;

    obj.select = function _select(fields) {
        return this.filteredSelect(fields);
    };
    obj.where = function _where(field, operator, value) {
        return this.filteredWhere(field, operator, value);
    };
    obj.join = function _join(outer, inner, projector, comparer, collection) {
        return this.filteredJoin(outer, inner, projector, comparer, collection);
    };
    obj.union = function _union(comparer, collection) {
        return this.filteredUnion(comparer, collection);
    };
    obj.zip = function _zip() {
        return this.filteredZip();
    };
    obj.except = function _except(collection, comparer) {
        return this.filteredExcept(collection, comparer);
    };
    obj.intersect = function _intersect(comparer, collection) {
        return this.filteredIntersect(comparer, collection);
    };
    obj.groupBy = function _groupBy(fields, sl) {
        return this.filteredGroupBy(fields, sl);
    };
    obj.distinct = function _distinct(fields) {
        return this.filteredDistinct(fields);
    };
    obj.flatten = function _flatten() {
        return this.filteredFlatten();
    };
    obj.flattenDeep = function _flattenDeep() {
        return this.filteredFlattenDeep();
    };
    obj._getData = function _getData() {
        return this._getData();
    };
    obj.take = function _take(amt = 1) {
        return this.filteredTake(amt);
    };
    obj.takeWhile = function _takeWhile(predicate) {
        return this.filteredTakeWhile(predicate);
    };
    obj.any = function _any(predicate) {
        return this.filteredAny(predicate);
    };
    obj.all = function _all(predicate) {
        return this.filteredAll(predicate);
    };
    obj.first = function _first(predicate) {
        return this.filteredFirst(predicate);
    };
    obj.last = function _last(predicate) {
        return this.filteredLast(predicate);
    };

    obj.and = filterAppend(filterExpression, 'and');
    obj.or = filterAppend(filterExpression, 'or');
    obj.nand = filterAppend(filterExpression, 'nand');
    obj.nor = filterAppend(filterExpression, 'nor');
    obj.xand = filterAppend(filterExpression, 'xand');
    obj.xor = filterAppend(filterExpression, 'xor');

    return addGetter(obj);
}

function createNewOrderedQueryableDelegator(data, funcs, fields) {

    var obj = Object.create(orderedQueryable);
    obj.source = data;
    obj._evaluatedData = null;
    obj._dataComputed = false;
    obj._pipeline = funcs ? ifElse(not(isArray), wrap, identity, funcs) : [];
    obj._currentPipelineIndex = 0;
    obj._currentDataIndex = 0;

    obj.select = function _select(fields) {
        return this.orderedSelect(fields);
    };
    obj.where = function _where(field, operator, value) {
        return this.orderedWhere(field, operator, value);
    };
    obj.join = function _join(outer, inner, projector, comparer, collection) {
        return this.orderedJoin(outer, inner, projector, comparer, collection);
    };
    obj.union = function _union(comparer, collection) {
        return this.orderedUnion(comparer, collection);
    };
    obj.zip = function _zip() {
        return this.orderedZip();
    };
    obj.except = function _except(collection, comparer) {
        return this.orderedExcept(collection, comparer);
    };
    obj.intersect = function _intersect(comparer, collection) {
        return this.orderedIntersect(comparer, collection);
    };
    obj.groupBy = function _groupBy(fields) {
        return this.orderedGroupBy(fields);
    };
    obj.distinct = function _distinct(fields) {
        return this.orderedDistinct(fields);
    };
    obj.flatten = function _flatten() {
        return this.orderedFlatten();
    };
    obj.flattenDeep = function _flattenDeep() {
        return this.orderedFlattenDeep();
    };
    obj._getData = function _getData() {
        return this._getData();
    };
    obj.take = function _take(amt = 1) {
        return this.orderedTake(amt);
    };
    obj.takeWhile = function _takeWhile(predicate) {
        return this.orderedTakeWhile(predicate);
    };
    obj.any = function _any(predicate) {
        return this.orderedAny(predicate);
    };
    obj.all = function _all(predicate) {
        return this.orderedAll(predicate);
    };
    obj.first = function _first(predicate) {
        return this.orderedFirst(predicate);
    };
    obj.last = function _last(predicate) {
        return this.orderedLast(predicate);
    };

    obj.orderBy = function _orderBy(field) {
        return this.thenBy(field);
    };

    obj.orderByDescending = function _orderByDescending(field) {
        return this.orderByDescending(field);
    };

    obj.thenBy = function _thenBy(field) {
        field.dir = 'asc';
        var allFields = fields.concat(field);
        return createNewOrderedQueryableDelegator(this.source, this._pipeline.slice(0, this._pipeline.length - 1)
            .concat([{ fn: orderByThunk(allFields), functionType: functionTypes.collective }]), allFields);
    };

    obj.thenByDescending = function thenByDescending(field) {
        field.dir = 'desc';
        var allFields = fields.concat(field);
        return createNewOrderedQueryableDelegator(this.source, this._pipeline.slice(0, this._pipeline.length - 1)
            .concat([{ fn: orderByDescendingThunk(allFields), functionType: functionTypes.collective }]), allFields)
    };

    return addGetter(obj);
}
*/

function addGetter(obj) {
    return Object.defineProperty(
        obj,
        'data', {
            get: function _data() {
                //TODO: not sure if I plan on 'saving' the eval-ed data of a queryable object, and if I do, it'll take a different
                //TODO: form that what is currently here; for now I am going to leave the check for pre-eval-ed data in place
                if (!this._dataComputed) {
                    //TODO: is this valid for an object that has an iterator? Seems like it should work...
                    return Array.from(this);
                }
                return this._evaluatedData;
            }
        }
    );
}

export { createNewQueryableDelegator/*, createNewFilteredQueryableDelegator, createNewOrderedQueryableDelegator*/ };