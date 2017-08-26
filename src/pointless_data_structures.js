import { curry, compose, identity } from './combinators';
import { getWith } from './functionalHelpers';
import * as monads from './dataStructures/monads/monads';

/** @module pointless_data_structures */

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isConstant(fa) {
    return fa.factory === monads.Constant;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isEither(fa) {
    return fa.factory === monads.Either;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isFuture(fa) {
    return fa.factory === monads.Future;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIdentity(fa) {
    return fa.factory === monads.Identity;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIo(fa) {
    return fa.factory === monads.Io;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isJust(fa) {
    return !!(fa.isJust && fa.factory === monads.Maybe);
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isLeft(fa) {
    return !!(fa.isLeft && fa.factory === monads.Either);
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isList(fa) {
    return fa.factory === monads.List;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isMaybe(fa) {
    return !!((fa.isNothing && (fa.factory === monads.Maybe)) ||
        (fa.isJust && (fa.factory === monads.Maybe)));
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
function isMonad(ma) {
    return !!(ma && ma.factory && ma.factory === monads[ma.factory.name]);
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isNothing(fa) {
    return !!fa.isNothing;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isRight(fa) {
    return !!fa.isRight;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isValidation(fa) {
    return fa.factory === monads.Validation;
}

/**
 * @signature
 * @description d
 * @kind function
 * @function apply
 * @param {Object} ma - a
 * @param {Object} mb - b
 * @return {Object} - c
 */
var apply = curry(function _apply(ma, mb) {
    return mb.apply(ma);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function ap
 * @see apply
 * @param {Object} ma - a
 * @param {Object} mb - b
 * @return {Object} - c
 */
var ap = apply;

/**
 * @signature
 * @description d
 * @kind function
 * @function flatMap
 * @param {Object} m - a
 * @param {function} fn :: (a) -> Monad b - b
 * @return {Object} - c
 */
var flatMap = curry(function _flatMap(m, fn) {
    return m.flatMap(fn);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function flatMapWith
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {Object} - c
 */
var flatMapWith = curry(function _flatMapWith(fn, m) {
    return m.flatMap(fn);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function map
 * @param {Object} m - a
 * @param {function} fn :: (a) -> b
 * @return {Object} - b
 */
var map = curry(function _map(m, fn) {
    return m.map(fn);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function mapWith
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {Object} - c
 */
var mapWith = curry(function _map(fn, m) {
    return m.map(fn);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function pluckWith
 */
var pluckWith = compose(mapWith, getWith);

/**
 * @signature
 * @description d
 * @kind function
 * @function fmap
 * @see mapWith
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {*} c
 */
var fmap = mapWith;

/**
 * @signature
 * @description d
 * @kind function
 * @function chain
 * @param {function} f - a
 * @param {Object} m - b
 * @return {*} - c
 */
var chain = curry(function _chain(f, m){
    return m.map(f).join(); // or compose(join, mapWith(f))(m)
});

/**
 * @signature
 * @description d
 * @kind function
 * @function bind
 */
var bind = chain;

/**
 * @signature
 * @description d
 * @param {function} f - a
 * @param {function} g - b
 * @return {function} - c
 */
var mcompose = function _mcompose(f, g) {
    return compose(chain(f), g);
};

/**
 * @signature
 * @description d
 * @kind function
 * @function put
 * @param {*} val - a
 * @param {Object} fa - b
 * @return {Object} - c
 */
var put = curry(function _put(val, fa) {
    return fa.put(val);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function lift2
 * @param {function} f - a
 * @param {Object} m1 - b
 * @param {Object} m2 - c
 * @return {Object} - c
 */
var lift2 = curry(function _lift2(f, m1, m2) {
    return m1.map(f).apply(m2);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function lift3
 * @param {function} f - a
 * @param {Object} m1 - b
 * @param {Object} m2 - c
 * @param {Object} m3 - d
 * @return {Object} - e
 */
var lift3 = curry(function _lift3(f, m1, m2, m3) {
    return lift2(f, m1, m2).apply(m3);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function lift4
 * @param {function} f - a
 * @param {Object} m1 - b
 * @param {Object} m2 - c
 * @param {Object} m3 - d
 * @param {Object} m4 - e
 * @return {Object} - f
 */
var lift4 = curry(function _lift4(f, m1, m2, m3, m4) {
    return lift3(f, m1, m2, m3).apply(m4);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function liftN
 * @param {function} f - a
 * @param {Object} ...ms - b
 * @return {Object} - c
 */
var liftN = curry(function _liftN(f, ...ms) {
    return ms.slice(1).reduce(function _apply(curM, nextM) {
        return curM.apply(nextM);
    }, ms.shift().map(f));
});

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function mjoin(ma) {
    return ma.join();
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toList(ma) {
    return List(mjoin(ma));
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toMaybe(ma) {
    //return Maybe(mjoin(ma));
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toFuture(ma) {
    //return Future(mjoin(ma));
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toIdentity(ma) {
    //return Identity(mjoin(ma));
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toJust(ma) {
    //return Just(mjoin(ma));
}

//===========================================================================================//
//===========================================================================================//
//=======================           CONTAINER TRANSFORMERS            =======================//
//===========================================================================================//
//===========================================================================================//

function _toIdentity() {
    //return Identity.from(this.value);
}

function _toJust() {
    //return Just.from(this.value);
}

function _toList() {
    //return List.from(this.value);
}

function _toMaybe() {
    //return Maybe.from(this.value);
}

//===========================================================================================//
//===========================================================================================//
//============================           LIST HELPERS            ============================//
//===========================================================================================//
//===========================================================================================//

/**
 * @signature
 * @description d
 * @kind function
 * @function filter
 * @param {function} predicate - a
 * @param {Array} xs - b
 * @return {Array} - c
 */
var filter = curry(function _filter(predicate, xs) {
    xs.filter(predicate);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function intersect
 * @param {Array} xs - a
 * @param {function} comparer - b
 * @param {Array} ys - c
 * @return {Array} - d
 */
var intersect = curry(function _intersect(xs, comparer, ys) {
    return ys.intersect(xs, comparer);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function except
 * @param {Array} xs - a
 * @param {function} comparer - b
 * @param {Array} - c
 * @return {*} - d
 */
var except = curry(function _except(xs, comparer, ys) {
    return ys.except(xs, comparer);
});

export { ap, apply, fmap, map, mapWith, flatMap, flatMapWith, lift2, lift3, lift4, liftN, mjoin, pluckWith,
        chain, bind, mcompose, filter, intersect, except, isConstant, isEither, isFuture, isIdentity, isIo,
        isJust, isLeft, isList, isMaybe, isMonad, isNothing, isRight, isValidation };