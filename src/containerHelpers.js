import { curry, compose } from './functionalHelpers';

var apply = curry(function _apply(ma, mb) {
    return mb.apply(ma);
});

var flatMap = curry(function _flatMap(fn, m) {
    return m.flatMap(fn);
});

var map = curry(function _map(fn, m) {
    return m.map(fn);
});

var fmap = map;

var chain = curry(function _chain(f, m){
    return m.map(f).join(); // or compose(join, map(f))(m)
});

var mcompose = function _mcompose(f, g) {
    return compose(chain(f), g);
};

var liftA2 = curry(function _liftA2(f, m1, m2) {
    return m1.map(f).apply(m2);
});

var liftA3 = curry(function _liftA3(f, m1, m2, m3) {
    return liftA2(f, m1, m2).apply(m3);
});

var liftA4 = curry(function _liftA4(f, m1, m2, m3, m4) {
    return liftA3(f, m1, m2, m3).apply(m4);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {Ma} ...ms
 * @return:
 */
var liftN = curry(function _liftN(f, ...ms) {
    return ms.slice(1).reduce(function _apply(curM, nextM) {
        return curM.apply(nextM);
    }, ms.shift().map(f));
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
    return Future(mjoin(ma));
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