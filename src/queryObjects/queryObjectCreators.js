import { queryable } from './queryable';
import { orderedQueryable } from './orderedQueryable';
import { orderBy } from '../projection/projectionFunctions';
import { defaultEqualityComparer, generatorProto } from '../helpers';

function createNewQueryableDelegator(source, iterator) {
    var obj = Object.create(queryable);
    obj.dataComputed = false;
    obj.source = source;
    if (iterator && generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;

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
    obj.take = function _take(amt = 1) {
        return this.queryableTake(amt);
    };
    obj.takeWhile = function _takeWhile(predicate) {
        return this.queryableTakeWhile(predicate);
    };
    obj.skip = function _skip(amt = 1) {
        return this.queryableSkip(amt);
    };
    obj.skipWhile = function _skipWhile(predicate) {
        return this.queryableSkipWhile(predicate);
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
    obj.toArray = function _toArray() {
        return this.queryableToArray();
    };
    obj.toSet = function _toSet() {
        return this.queryableToSet();
    };
    obj.reverse = function _reverse() {
        return this.queryableReverse();
    };
    return addGetter(obj);
}

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
    obj.groupBy = function _groupBy(keySelector, comparer) {
        return this.orderedGroupBy(keySelector, comparer);
    };
    obj.groupByDescending = function _groupByDescending(keySelector, comparer) {
        return this.orderedGroupByDescending(keySelector, comparer);
    };
    obj.except = function _except(collection, comparer = defaultEqualityComparer) {
        return this.orderedExcept(collection, comparer);
    };
    obj.groupJoin = function _groupJoin(inner, outerSelector, innerSelector, projector, comparer = defaultEqualityComparer) {
        return this.orderedGroupJoin(inner, outerSelector, innerSelector, projector, comparer);
    };
    obj.intersect = function _intersect(collection, comparer = defaultEqualityComparer) {
        return this.orderedIntersect(collection, comparer);
    };
    obj.distinct = function _distinct(comparer = defaultEqualityComparer) {
        return this.orderedDistinct(comparer);
    };
    obj.flatten = function _flatten() {
        return this.orderedFlatten();
    };
    obj.flattenDeep = function _flattenDeep() {
        return this.orderedFlattenDeep();
    };
    obj.take = function _take(amt = 1) {
        return this.orderedTake(amt);
    };
    obj.takeWhile = function _takeWhile(predicate) {
        return this.orderedTakeWhile(predicate);
    };
    obj.skip = function _skip(amt = 1) {
        return this.orderedSkip(amt);
    };
    obj.skipWhile = function _skipWhile(predicate) {
        return this.orderedSkipWhile(predicate);
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
    obj.toArray = function _toArray() {
        return this.orderedQueryableToArray();
    };
    obj.toSet = function _toSet() {
        return this.orderedQueryableToSet();
    };
    obj.reverse = function _reverse() {
        return this.orderedQueryableReverse();
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