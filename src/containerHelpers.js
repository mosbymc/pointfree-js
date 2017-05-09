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

//TODO: seems like mjoin may require that both outer and inner containers be of same type
function mjoin(m) {
    return m.join();
}

function toList(ma) {
    return List(mjoin(ma));
}

function toMaybe(ma) {
    return Maybe(mjoin(ma));
}

function toFuture(ma) {
    return Future(majoin(ma));
}

function toIdentity(ma) {
    return Identity(mjoin(ma));
}

function toJust(ma) {
    return Just(mjoin(ma));
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