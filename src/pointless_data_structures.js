import { curry, compose, identity } from './combinators';
import { getWith } from './functionalHelpers';
import { Constant, Either, Future, Identity, Io, Just, Left, List, Maybe, Nothing, Right, Validation } from './dataStructures/dataStructures';

/** @module pointless_data_structures */

var factoryList = [Constant, Either, Future, Identity, Io, Just, Left, List, Maybe, Nothing, Right, Validation];

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isConstant = Constant.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isEither = Either.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isFuture = Future.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isIdentity = Identity.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIo(fa) {
    return fa.factory === Io;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isJust = Just.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isLeft = Left.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isList = List.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isMaybe = Maybe.is;

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
function isImmutableDataStructure(ma) {
    return !!(ma && ma.factory && factoryList.some(factory => ma.factory === factory));
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isNothing = Nothing.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isRight = Right.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isValidation = Validation.is;

/**
 * @signature
 * @description d
 * @kind function
 * @function monad_apply
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
 * @function fold
 * @param {function} fn - a
 * @param {*} acc - b
 * @param {Object} ma - c
 * @return {*} - d
 */
var fold = curry(function _fold(fn, acc, ma) {
    return ma.fold(fn, acc);
});

/**
 * @signature
 * @description d
 * @param {Object} p - a
 * @param {Object} m - b
 * @return {*|monads.list|Object} - c
 */
var sequence = curry(function _sequence(p, m) {
    return m.sequence(p);
});

/**
 * @signature
 * @description d
 * @param {Object} a - a
 * @param {function} f - b
 * @param {Object} ma - c
 * @return {Object} - d
 */
var traverse = curry(function _traverse(a, f, ma) {
    return ma.traverse(a, f);
});

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @type {Function|*}
 */
var contramap = curry(function _contramap(fn, ma) {
    return ma.contramap(fn);
});

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
function isEmpty(ma) {
    return ma.isEmpty();
}

/**
 * @signature
 * @description d
 * @kind function
 * @function equals
 * @param {Object} a - a
 * @param {Object} b - b
 * @return {boolean} - c
 */
var equals = curry(function _equals(a, b) {
    return a.equals(b);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function bimap
 * @param {function} f - a
 * @param {function} g = b
 * @param {Object} ma - c
 * @return {Object} d
 */
var bimap = curry(function _bimap(f, g, ma) {
    return ma.bimap(f, g);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function dimap
 * @param {function} f - a
 * @param {function} g - b
 * @param {Object} m - c
 * @return {Object} - d
 */
var dimap = curry(function _dimap(f, g, m) {
    return m.dimap(f, g);
});

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
    return m.chain(f); // or compose(join, mapWith(f))(m)
});

/**
 * @signature
 * @description d
 * @kind function
 * @function chainRec
 * @param {function} fn - a
 * @param {Object} ma - b
 * @return {Object} b
 */
var chainRec = curry(function _chainRec(fn, ma) {
    return ma.chainRec(fn);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function bind
 */
var bind = chain,
    flatMap = chain;

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
function join(ma) {
    return ma.join();
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toList(ma) {
    return List.of(ma.extract);
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toMaybe(ma) {
    return Maybe(ma.extract);
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toFuture(ma) {
    return Future.of(ma.extract);
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toIdentity(ma) {
    return Identity(ma.extract);
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toJust(ma) {
    return Just(ma.extract);
}

function toConstant(ma) {
    return Constant(ma.extract);
}

function toNothing(ma) {
    return Nothing();
}

function toEither(ma, fork) {
    return Either(ma.extract, 'right' === fork || null != ma.extract ? 'right' : 'left');
}

function toRight(ma) {
    return Right(ma.extract);
}

function toLeft(ma) {
    return Left(ma.extract);
}

//===========================================================================================//
//===========================================================================================//
//============================           LIST HELPERS            ============================//
//===========================================================================================//
//===========================================================================================//

function count(predicate, xs) {
    return xs.count(predicate);
}

/**
 * @signature
 * @description d
 * @kind function
 * @function filter
 * @param {function} predicate - a
 * @param {Array} xs - b
 * @return {Array} - c
 */
var filter = curry((predicate, xs) => xs.filter(predicate));

var first = curry((predicate, xs) => xs.first(predicate));

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
var intersect = curry((xs, comparer, ys) => ys.intersect(xs, comparer));

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
var except = curry((xs, comparer, ys) => ys.except(xs, comparer));

var last = curry((predicate, xs) => xs.last(predicate));

var skip = curry((amt, xs) => xs.skip(amt));

var skipWhile = curry((predicate, xs) => xs.skipWhile(predicate));

var take = curry((amt, xs) => xs.take(amt));

var takeWhile = curry((predicate, xs) => xs.takeWhile(predicate));

export { ap, apply, count, chainRec, fmap, map, mapWith, flatMap, lift2, lift3, lift4, liftN, join, pluckWith,
        chain, bind, mcompose, filter, intersect, except, isConstant, isEither, isFuture, isIdentity, isIo,
        isJust, isLeft, isList, isMaybe, isImmutableDataStructure, isNothing, isRight, isValidation, fold, sequence, traverse,
        contramap, isEmpty, equals, bimap, dimap, toList, toLeft, toRight, toEither, toIdentity, toMaybe, toNothing,
        toJust, toFuture, toConstant, first, last, skip, skipWhile, take, takeWhile };