import { curry, compose } from './functionalHelpers';

/**
 * @description:
 * @type: {function}
 * @param: {functor} ma
 * @param: {functor} mb
 * @return: {functor}
 */
var apply = curry(function _apply(ma, mb) {
    return mb.apply(ma);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @param: {functor} m
 * @return: {functor}
 */
var flatMap = curry(function _flatMap(fn, m) {
    return m.flatMap(fn);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @param: {functor} m
 * @return:
 */
var map = curry(function _map(fn, m) {
    return m.map(fn);
});

/**
 * @description:
 * @type {function} @see map
 * @param: {function} fn
 * @param: {functor} m
 * @return:
 */
var fmap = map;

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {functor} m
 * @return:
 */
var chain = curry(function _chain(f, m){
    return m.map(f).join(); // or compose(join, map(f))(m)
});

/**
 * @description:
 * @param: {function} f
 * @param: g
 * @return {*}
 */
var mcompose = function _mcompose(f, g) {
    return compose(chain(f), g);
};

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {functor} m1
 * @param: {functor} m2
 * @return:
 */
var lift2 = curry(function _lift2(f, m1, m2) {
    return m1.map(f).apply(m2);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {functor} m1
 * @param: {functor} m2
 * @param: {functor} m3
 * @return:
 */
var lift3 = curry(function _lift3(f, m1, m2, m3) {
    return lift2(f, m1, m2).apply(m3);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {functor} m1
 * @param: {functor} m2
 * @param: {functor} m3
 * @param: {functor} m4
 * @return:
 */
var lift4 = curry(function _lift4(f, m1, m2, m3, m4) {
    return lift3(f, m1, m2, m3).apply(m4);
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
/**
 * @description:
 * @param: {functor} m
 * @return: {functor}
 */
function mjoin(m) {
    return m.join();
}

/**
 * @description:
 * @param: {functor} ma
 * @return {@see m_list}
 */
function toList(ma) {
    return List(mjoin(ma));
}

/**
 * @description:
 * @param: {functor} ma
 * @return {@see _maybe}
 */
function toMaybe(ma) {
    return Maybe(mjoin(ma));
}

/**
 * @description:
 * @param: {functor} ma
 * @return {@see _future}
 */
function toFuture(ma) {
    return Future(mjoin(ma));
}

/**
 * @description:
 * @param: {functor} ma
 * @return {@see _identity}
 */
function toIdentity(ma) {
    return Identity(mjoin(ma));
}

/**
 * @description:
 * @param: {functor} ma
 * @return {@see _just}
 */
function toJust(ma) {
    return Just(mjoin(ma));
}




//===========================================================================================//
//===========================================================================================//
//============================           LIST HELPERS            ============================//
//===========================================================================================//
//===========================================================================================//

/**
 * @description:
 * @type: {function}
 * @param: {function} predicate
 * @param: {Array} list
 * @return: {Array}
 */
var filter = curry(function _filter(predicate, list) {
    list.filter(predicate);
});

/**
 * @description:
 * @type: {function}
 * @param: {Array} enumerable
 * @param: {function} comparer
 * @param: {Array} list
 * @return: {Array}
 */
var intersect = curry(function _intersect(enumerable, comparer, list) {
    return list.intersect(enumerable, comparer);
});

export { apply, fmap, map, mjoin };