import { curry } from '../../functionalHelpers';

var queryableMap = curry(function _queryableMap(func, queryable) {
    return queryable.map(func);
});

var queryableFilter = curry(function _queryableFilter(predicate, queryable) {
    return queryable.filter(predicate);
});

var queryableZip = curry(function _queryableZip(selector, enumerable, queryable) {
    return queryable.zip(enumerable, selector);
});

export { queryableMap, queryableFilter };