import { queryable } from './queryable';

var orderedQueryable = Object.create(queryable);

orderedQueryable.orderedJoin = function _orderedJoin(outer, inner, projector, comparer, collection) {
    return this.queryableJoin(outer, inner, projector, comparer, collection);
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

orderedQueryable.orderedWhere = function _orderedWhere(field, operator, value) {
    return this.queryableWhere(field, operator, value);
};

orderedQueryable.orderedDistinct = function _orderedDistinct(fields) {
    return this.queryableDistinct(fields);
};

orderedQueryable.orderedTake = function _orderedTake(amt = 1) {
    return this.queryableTake(amt);
};

orderedQueryable.orderedTakeWhile = function _orderedTakeWhile(predicate) {
    return this.queryableTakeWhile(predicate);
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

orderedQueryable.orderedLast = function _orderedLast(predicate) {
    return this.queryableLast(predicate);
};

export { orderedQueryable };