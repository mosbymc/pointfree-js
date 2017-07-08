import { arraySet, objectSet, isArray } from './functionalHelpers';
import { curry, compose, kestrel, when } from './combinators';
import { Maybe } from './containers/monads/maybe_monad';
import { Identity } from './containers/monads/identity_monad';
import { Constant } from './containers/monads/constant_monad';
import { mapWith } from './pointlessContainers';

/**
 * @description:
 * @type: {function}
 * @param: {number} idx
 * @param: {function} f
 * @param: {Array} xs
 * @return: {Array}
 */
var arrayLens = curry(function _arrayLens(idx, f, xs) {
    return mapWith(function (val) {
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
    return mapWith(function _map(rep) {
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
    return lens(Constant)(target).value;
});

/**
 * @description:
 * @type: {function}
 * @param: {function} lens
 * @param: {function} mapFn
 * @param: {Object} target
 * @return: {*}
 */
var over = curry(function _over(lens, mapFn, target) {
    return lens(function _lens(y) {
        return Identity(mapFn(y));
    })(target).value;
});

/**
 * @description:
 * @type: {function}
 * @param: {function} lens
 * @param: {*} val
 * @param: {*} target
 * @return: {*}
 */
var put = curry(function _put(lens, val, target) {
    return over(lens, kestrel(val), target);
});

/**
 * @type: {*}
 * @description:
 * @param: {function} lens
 * @param: {*} val
 * @param: {Object} targetData
 * @return: {*}
 */
var set = curry((lens, val, targetData) => over(lens, kestrel(val), targetData));

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

/**
 * @type: {*}
 * @description:
 * @param: {function} getter
 * @param: {function} setter
 * @param: {String} key
 * @param: {function} f
 * @param: {Array} xs
 * @return: {*}
 */
var lens = curry(function _lens(getter, setter, key, f, xs) {
    return mapWith(replace => setter(key, replace, xs), f(getter(key, xs)));
});

/**
 * @type" {*}
 * @description:
 * @param: {Array|String} path
 * @param: {Object} obj
 * @return: {*}
 */
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

/**
 * @type {*}
 * @description:
 * @param: {String} delimiter
 * @param: {String} string
 * @return: {Array}
 */
var split = curry(function _split(delimiter, string) {
    return string.split(delimiter);
});

export { arrayLens, objectLens, view, over, put, set, lens, maybePath, makeLenses, lensPath };