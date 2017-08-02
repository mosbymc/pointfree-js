import { compose, curry } from './combinators'

/**
 * @type:
 * @description:
 * @param: {function} f
 * @return: {*}
 */
var mapping = curry(function _mapping(mapFn, reduceFn, result, input) {
    return reduceFn(result, mapFn(input));
});

/**
 * @type:
 * @description:
 * @param: {function} predicate
 * @param: {function} reduceFn
 * @param: {*} result
 * @param: {Array} input
 * @return: {*}
 */
var filtering = curry(function _filtering2(predicate, reduceFn, result, input) {
    return predicate(input) ? reduceFn(result, input) : result;
});

/**
 * @type:
 * @description:
 * @param: {function} mapFn
 * @return: {function}
 */
function mapReducer (mapFn) {
    return function _mapReducer(result, input) {
        return result.concat(mapFn(input));
    };
}

/**
 * @type:
 * @description:
 * @param: {function} predicate
 * @return: {function}
 */
function filterReducer(predicate) {
    return function _filterReducer(result, input) {
        return predicate(input) ? result.concat(input) : result;
    };
}

/**
 * @type:
 * @description:
 * @param: {} f
 * @param: {} x
 * @return: *
 */
var mapped = curry(function _mapped(f, x) {
    return identity(map(compose(function _mCompose(x) {
        return x.value;
    }, f), x));
});

/**
 * @type:
 * @description:
 * @param: {function} xform
 * @param: {function} reducing
 * @param: {*} initial
 * @param: {*} input
 * @return: {*}
 */
var transduce = (xform, reducing, initial, input) => input.reduce(xform(reducing), initial);

/**
 * @type:
 * @description:
 * @param: txf
 * @param: acc
 * @param: xs
 * @return: {*}
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

var taking = allows => reducerFn => {
    let _allows = allows;
    return (acc, item) => {
        return 0 < --_allows ? reducerFn(acc, item) : { [reduce.stopper]: reducerFn(acc, item) };
    }
};

//var map = curry((mapFn, redFn) => (xs, x) => redFn(xs, mapFn(x)));
//var inc = reduce(map(add(1), concat), []);

//var filter = curry((predFn, redFn) => (xs, x) => predFn(x) ? redFn(xs, x) : xs);
//var greaterThanOne = reduce(filter(x => 1 < x, concat), []);

//var transduce2 = curry((xForm, f, init, coll) => reduce(xForm(f), init, coll));
//console.log(transduce2(map(add(1)), concat, [], [1, 2, 3, 4]));

export { mapping, filtering, mapReducer, filterReducer, mapped, transduce, reduce, dropping, taking };