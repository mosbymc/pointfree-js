import { curry } from './functionalHelpers';

var apply = curry(function _apply(ma, mb) {
    return mb.apply(ma);
});

var fmap = curry(function _fmap(fn, m) {
    return m.flatMap(fn);
});

var flatMap = fmap;

var map = curry(function _map(fn, m) {
    return m.map(fn);
});

function mjoin(m) {
    return m.join();
}




//===========================================================================================//
//===========================================================================================//
//============================           LIST HELPERS            ============================//
//===========================================================================================//
//===========================================================================================//

var filter = curry(function _filter(predicate, list) {
    list.filter(predicate);
});

var intersect = curry(function _intersect(enumerable, comparer, list) {
    return list.intersect(enumerable, comparer);
});

export { apply, fmap, map, mjoin };