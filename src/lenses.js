import { arraySet, objectSet, isArray } from './functionalHelpers';
import { curry, compose, identity, kestrel, when } from './combinators';
import { Maybe } from './containers/monads/maybe_monad';

/**
 * @description:
 * @type: {function}
 * @param: {number} idx
 * @param: {function} f
 * @param: {Array} xs
 * @return: {Array}
 */
var arrayLens = curry(function _arrayLens(idx, f, xs) {
    return map(function (val) {
        return arraySet(idx, val, xs)
    }, f(xs[idx]));
});

/**
 * @description:
 * @type: {function}
 * @param: {string} prop
 * @param: {function} f
 * @param: {Object} xs
 * @return: {Object}
 */
var objectLens = curry(function _objectLens(prop, f, xs) {
    return map(function _map(rep) {
        return objectSet(prop, rep, xs);
    }, f(xs[prop]));
});

/**
 * @description:
 * @type: {function}
 * @param: {function} lens
 * @param: {Object} target
 * @return:
 */
var view = curry(function _view(lens, target) {
    return lens(kestrel)(target).value;
});

/**
 * @description:
 * @type: {function}
 * @param: {function} lens
 * @param: {function} mapFn
 * @param: {Object} target
 * @return:
 */
var over = curry(function _over(lens, mapFn, target) {
    return lens(function _lens(y) {
        return identity(mapFn(y));
    })(target).value;
});

/**
 * @description:
 * @type: {function}
 * @param: {function} lens
 * @param: {*} val
 * @param: {*} target
 * @return:
 */
var put = curry(function _put(lens, val, target) {
    return over(lens, kestrel(val), target);
});

/**
 * @description:
 * @param: {Array} paths
 * @return: {*}
 */
function makeLenses(...paths) {
    return paths.reduce(function _pathReduce(cur, next) {
        var ol = objectLens(next);
        return put(ol, ol, cur);
    }, { num: arrayLens });
}

/**
 * @description:
 * @param: {Array} path
 * @return: {*}
 */
function lensPath(...path) {
    return compose(...path.map(function _pathMap(p) {
        return 'string' === typeof p ? objectLens(p) : arrayLens(p);
    }));
}

var maybePath = curry(function _maybePath(path, obj) {
    path = when(not(isArray), split('.'), path);
    var val = obj,
        idx = 0;
    while (idx < path.length) {
        if (null == val) return Maybe.Nothing();
        val = val[path[idx]];
        ++idx;
    }
    return Maybe(val);
});

var split = curry(function _split(delimiter, string) {
    return string.split(delimiter);
});

export { arrayLens, objectLens, view, over, put, makeLenses, lensPath };