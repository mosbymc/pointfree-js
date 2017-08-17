import { curry, compose, identity } from './combinators';
import { getWith } from './functionalHelpers';

//TODO: I need to figure out how to structure this lib. I'd like to have several different types of containers...
//TODO: ...specifically, functors (pointed), monads, and maybe one other type. In addition, each container type
//TODO: would have several implementations: maybe, option, constant, identity, future_functor, io, etc. It would make sense
//TODO: to let the "higher" level containers delegate to the "lower" level implementations since they share all the
//TODO: functionality of the "lower" containers and add to them. In addition, a lot of the containers will have the
//TODO: same mapWith, flatMapWith, chain, apply, etc functionality; it would be nice to share this functionality as well.
//TODO: Finally, I'd like to have each container in a category be capable of converting their underlying value to
//TODO: another container of the same category without the use of 'apply', more in the manner of 'toContainerX'.
//TODO: However, this means that each container in a given category has a dependency on all the other containers in
//TODO: the same category. This, more than the rest, makes structuring this lib difficult. I'd like to, at the very
//TODO: least, split each container category up so that they can be imported (and preferably downloaded) individually.
//TODO: But the more separation between containers, the more they have to 'import' each other.

/**
 * @sig
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
 * @sig
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
 * @sig
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
 * @sig
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
 * @sig
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
 * @sig
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
 * @sig
 * @description d
 * @kind function
 * @function pluckWith
 */
var pluckWith = compose(mapWith, getWith);

/**
 * @sig
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
 * @sig
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
 * @sig
 * @description d
 * @kind function
 * @function bind
 */
var bind = chain;

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @param {function} g - b
 * @return {function} - c
 */
var mcompose = function _mcompose(f, g) {
    return compose(chain(f), g);
};

/**
 * @sig
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
 * @sig
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
 * @sig
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
 * @sig
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
 * @sig
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
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function mjoin(ma) {
    return ma.join();
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toList(ma) {
    return List(mjoin(ma));
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toMaybe(ma) {
    //return Maybe(mjoin(ma));
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toFuture(ma) {
    //return Future(mjoin(ma));
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toIdentity(ma) {
    //return Identity(mjoin(ma));
}

/**
 * @sig
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
 * @sig
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
 * @sig
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
 * @sig
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
        chain, bind, mcompose, filter, intersect, except };