import { queryable } from './queryable';
import { orderedQueryable } from './orderedQueryable';
import { orderBy } from '../projection/projectionFunctions';
import { defaultEqualityComparer, defaultPredicate, generatorProto } from '../helpers';
//import { filteredQueryable } from './filteredQueryable';
//import { filterAppend } from '../limitation/limitationFunctions';

function createNewQueryableDelegator(source, iterator) {
    var obj = Object.create(queryable);
    obj.dataComputed = false;
    obj.source = source;
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
    obj.map = function _map(mapFunc) {
        return this.queryableMap(mapFunc);
    };
    obj.where = function _where(predicate) {
        return this.queryableWhere(predicate);
    };
    obj.concat = function _concat(collection) {
        return this.queryableConcat(collection);
    };
    obj.except = function _except(collection, comparer = defaultEqualityComparer) {
        return this.queryableExcept(collection, comparer);
    };
    obj.groupJoin = function _groupJoin(inner, outerSelector, innerSelector, projector, comparer = defaultEqualityComparer) {
        return this.queryableGroupJoin(inner, outerSelector, innerSelector, projector, comparer);
    };
    obj.intersect = function _intersect(collection, comparer = defaultEqualityComparer) {
        return this.queryableIntersect(collection, comparer);
    };
    obj.join = function _join(inner, outerSelector, innerSelector, projector, comparer = defaultEqualityComparer) {
        return this.queryableJoin(inner, outerSelector, innerSelector, projector, comparer);
    };
    obj.union = function _union(collection, comparer = defaultEqualityComparer) {
        return this.queryableUnion(collection, comparer);
    };
    obj.zip = function _zip(selector, collection) {
        return this.queryableZip(selector, collection);
    };
    //TODO: see if setting up a default value for the group/order comparer is a necessary thing
    obj.groupBy = function _groupBy(keySelector, comparer) {
        return this.queryableGroupBy(keySelector, comparer);
    };
    obj.groupByDescending = function _groupByDescending(keySelector, comparer) {
        return this.queryableGroupByDescending(keySelector, comparer);
    };
    obj.orderBy = function _orderBy(keySelector, comparer) {
        return this.queryableOrderBy(keySelector, comparer);
    };
    obj.orderByDescending = function _orderByDescending(keySelector, comparer) {
        return this.queryableOrderByDescending(keySelector, comparer);
    };
    obj.distinct = function _distinct(comparer = defaultEqualityComparer) {
        return this.queryableDistinct(comparer);
    };
    obj.flatten = function _flatten() {
        return this.queryableFlatten();
    };
    obj.flattenDeep = function _flattenDeep() {
        return this.queryableFlattenDeep();
    };
    obj._getData = function _getData() {
        return this._getData();
    };
    obj.take = function _take(amt = 1) {
        return this.queryableTake(amt);
    };
    obj.takeWhile = function _takeWhile(predicate) {
        return this.queryableTakeWhile(predicate);
    };
    obj.any = function _any(predicate = defaultPredicate) {
        return this.queryableAny(predicate);
    };
    obj.all = function _all(predicate = defaultPredicate) {
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
*/

function createNewOrderedQueryableDelegator(source, iterator, sortObj) {
    var obj = Object.create(orderedQueryable);
    obj.source = source;
    obj.dataComputed = false;
    obj._appliedSorts = sortObj;
    if (iterator && generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;

    obj.map = function _map(mapFunc) {
        return this.orderedMap(mapFunc);
    };
    obj.where = function _where(predicate) {
        return this.orderedWhere(predicate);
    };
    obj.concat = function _concat(collection) {
        return this.orderedConcat(collection);
    };
    obj.join = function _join(inner, outerSelector, innerSelector, projector, comparer = defaultEqualityComparer) {
        return this.orderedJoin(inner, outerSelector, innerSelector, projector, comparer);
    };
    obj.union = function _union(collection, comparer = defaultEqualityComparer) {
        return this.orderedUnion(collection, comparer);
    };
    obj.zip = function _zip(selector, collection) {
        return this.orderedZip(selector, collection);
    };
    obj.except = function _except(collection, comparer = defaultEqualityComparer) {
        return this.orderedExcept(collection, comparer);
    };
    obj.intersect = function _intersect(collection, comparer = defaultEqualityComparer) {
        return this.orderedIntersect(collection, comparer);
    };
    obj.distinct = function _distinct(comparer = defaultEqualityComparer) {
        return this.orderedDistinct(comparer);
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
    obj.any = function _any(predicate = defaultPredicate) {
        return this.orderedAny(predicate);
    };
    obj.all = function _all(predicate = defaultPredicate) {
        return this.orderedAll(predicate);
    };
    obj.first = function _first(predicate) {
        return this.orderedFirst(predicate);
    };
    obj.last = function _last(predicate) {
        return this.orderedLast(predicate);
    };

    //Shadow the orderBy/orderByDescending function of the delegate so that if another
    //orderBy/orderByDescending function is immediately chained to an orderedQueryable
    //delegator object, it will treat it as a thenBy/thenByDescending call respectively.
    //TODO: These could also be treated as no-ops, or a deliberate re-ordering of the
    //TODO: source; I feel the latter would be an odd thing do to, so it might not
    //TODO: make sense to treat it that way.

    //TODO: Rather than shadowing, I could make the queryable's orderBy/orderByDescending
    //TODO: functions check the context object's prototype; if it finds that the
    //TODO: orderedQueryable is in the context's prototype chain, then it could treat
    //TODO: the function call differently
    obj.orderBy = function _orderBy(keySelector, comparer) {
        return this.thenBy(keySelector, comparer);
    };

    obj.orderByDescending = function _orderByDescending(keySelector, comparer) {
        return this.thenByDescending(keySelector, comparer);
    };

    obj.thenBy = function _thenBy(keySelector, comparer) {
        var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'asc' });
        return createNewOrderedQueryableDelegator(this.source, orderBy(this, sortObj), sortObj);
    };

    obj.thenByDescending = function thenByDescending(keySelector, comparer) {
        var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'desc' });
        return createNewOrderedQueryableDelegator(this.source, orderBy(this, sortObj), sortObj);
    };

    return addGetter(obj);
}


function addGetter(obj) {
    return Object.defineProperty(
        obj,
        'data', {
            get: function _data() {
                //TODO: not sure if I plan on 'saving' the eval-ed data of a queryable object, and if I do, it'll take a different
                //TODO: form that what is currently here; for now I am going to leave the check for pre-eval-ed data in place
                if (!this.dataComputed) {
                    //TODO: is this valid for an object that has an iterator? Seems like it should work...
                    var res = Array.from(this);
                    this.dataComputed = true;
                    this.evaluatedData = res;
                    return res;
                }
                return this.evaluatedData;
            }
        }
    );
}

export { createNewQueryableDelegator, createNewOrderedQueryableDelegator };