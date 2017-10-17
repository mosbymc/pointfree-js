import { compose, curry, identity } from './combinators';

/** @module transducers */

/**
 * @signature
 * @description d
 * @kind function
 * @function mapping
 * @param {function} f - a
 * @return {*} - b
 */
var mapping = curry(function _mapping(mapFn, reduceFn, result, input) {
    return reduceFn(result, mapFn(input));
});

/**
 * @signature
 * @description d
 * @kind function
 * @function filtering
 * @param {function} predicate - a
 * @param {function} reduceFn - b
 * @param {*} result - c
 * @param {Array} input - d
 * @return {*} - d
 */
var filtering = curry(function _filtering2(predicate, reduceFn, result, input) {
    return predicate(input) ? reduceFn(result, input) : result;
});

/**
 * @signature
 * @description d
 * @param {function} mapFn - a
 * @return {function} - b
 */
function mapReducer (mapFn) {
    return function _mapReducer(result, input) {
        return result.concat(mapFn(input));
    };
}

/**
 * @signature
 * @description d
 * @param {function} predicate - a
 * @return {function} - b
 */
function filterReducer(predicate) {
    return function _filterReducer(result, input) {
        return predicate(input) ? result.concat(input) : result;
    };
}

/**
 * @signature
 * @description d
 * @kind function
 * @function mapped
 * @param {function} f - a
 * @param {*} x - b
 * @return {*} - c
 */
var mapped = curry(function _mapped(f, x) {
    return identity(map(compose(function _mCompose(x) {
        return x.value;
    }, f), x));
});

/**
 * @signature
 * @description d
 * @param {function} xform - a
 * @param {function} reducing - b
 * @param {*} initial - c
 * @param {*} input - d
 * @return {*} - e
 */
var transduce = (xform, reducing, initial, input) => input.reduce(xform(reducing), initial);

/**
 * @signature
 * @description d
 * @param {*} txf - a
 * @param {*} acc - b
 * @param {*} xs - c
 * @return {*} - d
 */
var reduce = (txf, acc, xs) => {
    for (let item of xs){
        let next = txf(acc, item);//we could also pass an index or xs, but K.I.S.S.
        acc = next && next[reduce.stopper] || next;// {[reduce.stopper]:value} or just a value
        if (next[reduce.stopper]){
            break;
        }
    }
    return acc;
};

Object.defineProperty(reduce, 'stopper', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Symbol('stop reducing')//no possible computation could come up with this by accident
});

/**
 * @signature
 * @description d
 * @param {number} skips - a
 * @return {function} - b
 */
function dropping(skips) {
    return function _dropping2(reducingFunc) {
        return function _dropping2_(acc, item) {
            return 0 <= --skips ? acc : reducingFunc(acc, item);
        };
    };
}

/*
var taking = allows => reducerFn => (acc, item) => {
    let result = reducerFn(acc, item);
    return 0 < --allows ? result : { [reduce.stopper]: result };
};
*/

/**
 * @signature
 * @description d
 * @param {*} allows - a
 * @return {function} - b
 */
var taking = allows => reducerFn => {
    let _allows = allows;
    return (acc, item) => {
        return 0 < --_allows ? reducerFn(acc, item) : { [reduce.stopper]: reducerFn(acc, item) };
    };
};

//var map = curry((mapFn, redFn) => (xs, x) => redFn(xs, mapFn(x)));
//var inc = reduce(map(add(1), concat), []);

//var filter = curry((predFn, redFn) => (xs, x) => predFn(x) ? redFn(xs, x) : xs);
//var greaterThanOne = reduce(filter(x => 1 < x, concat), []);

//var transduce2 = curry((xForm, f, init, coll) => reduce(xForm(f), init, coll));
//console.log(transduce2(map(add(1)), concat, [], [1, 2, 3, 4]));

export { mapping, filtering, mapReducer, filterReducer, mapped, transduce, reduce, dropping, taking };