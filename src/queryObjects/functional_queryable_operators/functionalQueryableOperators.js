import { curry } from '../../functionalHelpers';

var queryableMap = curry(function _queryableMap(queryable, func) {
    return queryable.map(func);
});

var queryableFilter = curry(function _queryableFilter(queryable, predicate) {
    return queryable.filter(predicate);
});

export { queryableMap, queryableFilter };