import { queryable } from './queryable';

var orderedQueryable = Object.create(queryable);

orderedQueryable.orderedDeepMap = function _orderedDeepMap(fn) {
    return this.queryableDeepMap(fn);
};

orderedQueryable.orderedMap = function _orderedMap(mapFunc) {
    return this.queryableMap(mapFunc);
};

orderedQueryable.orderedGroupBy = function _orderedGroupBy(keySelector, comparer) {
    return this.queryableGroupBy(keySelector, comparer);
};

orderedQueryable.orderedGroupByDescending = function _orderedGroupByDescending(keySelector, comparer) {
    return this.queryableGroupByDescending(keySelector, comparer);
};

orderedQueryable.orderedFlatten = function _orderedFlatten() {
    return this.queryableFlatten();
};

orderedQueryable.orderedFlattenDeep = function _orderedFlattenDeep() {
    return this.queryableFlattenDeep();
};

orderedQueryable.orderedJoin = function _orderedJoin(inner, outerSelector, innerSelector, projector, comparer) {
    return this.queryableJoin(inner, outerSelector, innerSelector, projector, comparer);
};

orderedQueryable.orderedGroupJoin = function _orderedGroupJoin(outer, inner, projector, comparer, collection) {
    return this.queryableGroupJoin(outer, inner, projector, comparer, collection);
};

orderedQueryable.orderedExcept = function _orderedExcept(comparer, collection) {
    return this.queryableExcept(comparer, collection);
};

orderedQueryable.orderedIntersect = function _orderedIntersect(comparer, collection) {
    return this.queryableIntersect(comparer, collection);
};

orderedQueryable.orderedUnion = function _orderedUnion(comparer, collection) {
    return this.queryableUnion(comparer, collection);
};

orderedQueryable.orderedZip = function _orderedZip(selector, collection) {
    return this.queryableZip(selector, collection);
};

orderedQueryable.orderedAddFront = function _orderedAddFront(enumerable) {
    return this.queryableAddFront(enumerable);
};

orderedQueryable.orderedConcat = function _orderedConcat(collection) {
    return this.queryableConcat(collection);
};

orderedQueryable.orderedWhere = function _orderedWhere(predicate) {
    return this.queryableWhere(predicate);
};

orderedQueryable.orderedOfType = function _orderedOfType(type) {
    return this.queryableOfType(type);
};

orderedQueryable.orderedDistinct = function _orderedDistinct(comparer) {
    return this.queryableDistinct(comparer);
};

orderedQueryable.orderedTake = function _orderedTake(amt) {
    return this.queryableTake(amt);
};

orderedQueryable.orderedTakeWhile = function _orderedTakeWhile(predicate) {
    return this.queryableTakeWhile(predicate);
};

orderedQueryable.orderedSkip = function _orderedSkip(amt) {
    return this.queryableSkip(amt);
};

orderedQueryable.orderedSkipWhile = function _orderedSkipWhile(predicate) {
    return this.queryableSkipWhile(predicate);
};

orderedQueryable.orderedAny = function _orderedAny(predicate) {
    return this.queryableAny(predicate);
};

orderedQueryable.orderedAll = function _orderedAll(predicate) {
    return this.queryableAll(predicate);
};

orderedQueryable.orderedFirst = function _orderedFirst(predicate) {
    return this.queryableFirst(predicate);
};

orderedQueryable.orderedFold = function _orderedFold(fn, initial) {
    return this.queryableFold(fn, initial);
};

orderedQueryable.orderedLast = function _orderedLast(predicate) {
    return this.queryableLast(predicate);
};

orderedQueryable.orderedLength = function _orderedLength() {
    return this.queryableLength();
};

orderedQueryable.orderedQueryableToArray = function _orderedQueryableToArray() {
    return this.queryableToArray();
};

orderedQueryable.orderedQueryableToSet = function _orderedQueryableToSet() {
    return this.queryableToSet();
};

orderedQueryable.orderedQueryableReverse = function _orderedQueryableReverse() {
    return this.queryableReverse();
};

export { orderedQueryable };