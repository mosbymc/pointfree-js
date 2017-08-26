import { identity } from '../combinators';
import { map } from '../pointless_data_structures';

/** @module dataStructures/data_structure_util */

/**
 * @signature
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
function monadTransformer(type) {
    return function toType(fn = identity) {
        return type.of(fn(this.value));
    };
}

/**
 * @signature
 * @description Applies mapping transformers from each monad to each monad
 * @param {Array} types - An array containing each monad type factory function and associated delegate object
 * @return {*} Returns the array of monad 'types' that it received as an argument.
 */
function applyTransforms(types) {
    var fns = types
        .map(type => [
            { name: `mapTo${type.factory.name}`, fn: monadTransformer(type.factory) },
            { name: `to${type.factory.name}`, fn: function _toType() { return type.factory(this.value); } }
        ]);

    types.forEach(function _applyTransforms(type) {
        if (type.delegate) {
            let regex = new RegExp(type.factory.name, 'i');

            fns.forEach(function _addTransformFunctionality(transforms) {
                transforms.forEach(transform => type.delegate[transform.name] = regex.test(transform.name) ? map(type.delegate) : transform.fn);
            });
        }
    });

    return types;
}

/**
 * @signature
 * @description Accepts a list of monad delegates and applies the associated fantasy-land
 * synonyms where applicable.
 * @param {Array} monads - An array containing each monad type factory function and associated delegate object
 * @return {*} Returns the array of monad 'types' that it received as an argument.
 */
function applyFantasyLandSynonyms(monads) {
    monads.forEach(function _applyFantasyLandSynonyms(monad) {
        if (monad.delegate) {
            Object.keys(monad.delegate).forEach(function _forEachKey(key) {
                if (key in fl) monad.delegate[fl[key]] = monad.delegate[key];
            });
        }
    });
    return monads;
}

/**
 * @signature
 * @description d
 * @return {Object} - a
 */
function monadIterator() {
    let first = true,
        val = this.value;
    return {
        next: function _next() {
            if (first) {
                first = false;
                return { done: false, value: val };
            }
            return { done: true };
        }
    };
}

/**
 * @signature
 * @description d
 * @return {*} - a
 */
function get() {
    return this.value;
}

/**
 * @signature
 * @description d
 * @return {string} - b
 */
function emptyGet() {
    throw new Error('Cannot extract a null value.');
}

/**
 * @signature
 * @description d
 * @param {function} f - a
 * @return {*} - b
 */
function orElse(f) {
    return this.value;
}

/**
 * @signature
 * @description d
 * @param {function} f - a
 * @return {*} - b
 */
function emptyOrElse(f) {
    return f();
}

/**
 * @signature
 * @description d
 * @param {*} x - a
 * @return {*} - b
 */
function getOrElse(x) {
    return this.value;
}

/**
 * @signature
 * @description d
 * @param {*} x - a
 * @return {*} - b
 */
function emptyGetOrElse(x) {
    return x;
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {*} - b
 */
function apply(ma) {
    return ma.map(this.value);
}

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function chain(fn) {
    var val = fn(this.value);
    return Object.getPrototypeOf(this).isPrototypeOf(val) ? val : this.of(val);
}

/**
 * @signature
 * @description Chain recursive
 * @param {function} fn - A function that should be called recursively
 * @param {*} val - Any JavaScript value that should be used as the initial
 * value for the recursive function.
 * @return {Object} Returns a monad that wraps the final value 'yielded' out
 * of the recursive function.
 */
function chainRec(fn, val) {
    var next = x => ({ done: false, value: x }),
        done = x => ({ done: true, value: x }),
        state = { done: false, value: val };

    while (!state.done) {
        state = fn(next, done, state.value).value;
    }
    return this.of(state.value);
}

/**
 * @signature
 * @description d
 * @param {Object} type - a
 * @param {string} prop - b
 * @return {function} - c
 */
function disjunctionEqualMaker(type, prop) {
    return function _disjunctionEquals(a) {
        return Object.getPrototypeOf(type).isPrototypeOf(a) && a[prop] && this.value === a.value;
    };
}

/**
 * @signature
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
function equalMaker(type) {
    return function _equal(a) {
        return Object.getPrototypeOf(type).isPrototypeOf(a) && this.value === a.value;
    };
}

/**
 * @signature
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var lifter = (type) => (fn) => (...args) => type.of(fn(...args));

/**
 * @signature
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var maybeFactoryHelper = type => val => type(val);

/**
 * @signature
 * @description d
 * @return {*} - a
 */
function mjoin() {
    return Object.getPrototypeOf(this).isPrototypeOf(this.value) ? this.value : this;
}

/**
 * @signature
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var pointMaker = type => val => type.of(val);

/**
 * @signature
 * @description d
 * @param {string} typeString - a
 * @return {function} - b
 */
function stringMaker(typeString) {
    return function _toString() {
        return `${typeString}(${this.value})`;
    };
}

/**
 * @signature
 * @description d
 * @return {*} - a
 */
function valueOf() {
    return this.value;
}


//==========================================================================================================//
//==========================================================================================================//
//================================        Shared Maybe Functionality        ================================//
//==========================================================================================================//
//==========================================================================================================//
function justMap(fn) {
    return this.of(fn(this.value));
}

function nothingMapMaker(factory) {
    return function nothingMap(fn) {
        return factory(this.value);
    };
}

function justBimap(f, g) {
    return this.of(f(this.value));
}

function nothingBimapMaker(factory) {
    return function nothingBimap(f, g) {
        return factory(g(this.value));
    };
}

var sharedMaybeFns = {
    justMap,
    nothingMapMaker,
    justBimap,
    nothingBimapMaker
};

//==========================================================================================================//
//==========================================================================================================//
//================================        Shared Either Functionality        ===============================//
//==========================================================================================================//
//==========================================================================================================//
/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function rightMap(fn) {
    return this.of(fn(this.value));
}

/**
 * @signature
 * @description d
 * @param {function} factory - a
 * @return {function} - b
 */
function leftMapMaker(factory) {
    return function leftMap(fn) {
        return factory(this.value);
    };
}

/**
 * @signature
 * @description d
 * @param {function} f - a
 * @param {function} g - b
 * @return {*} - c
 */
function rightBiMap(f, g) {
    return this.of(f(this.value));
}

/**
 * @signature
 * @description d
 * @param {function} factory - a
 * @return {function} - b
 */
function leftBimapMaker(factory) {
    return function leftBimap(f, g) {
        return factory(g(this.value));
    };
}

var sharedEitherFns = {
    rightMap,
    leftMapMaker,
    rightBiMap,
    leftBimapMaker
};

var fl = {
    equals: 'fantasy-land/equals',
    lte: 'fantasy-land/lte',
    compose: 'fantasy-land/compose',
    id: 'fantasy-land/id',
    concat: 'fantasy-land/concat',
    empty: 'fantasy-land/empty',
    map: 'fantasy-land/map',
    contramap: 'fantasy-land/contramap',
    ap: 'fantasy-land/ap',
    of: 'fantasy-land/of',
    alt: 'fantasy-land/alt',
    zero: 'fantasy-land/zero',
    reduce: 'fantasy-land/reduce',
    traverse: 'fantasy-land/traverse',
    chain: 'fantasy-land/chain',
    chainRec: 'fantasy-land/chainRec',
    extend: 'fantasy-land/extend',
    extract: 'fantasy-land/extract',
    bimap: 'fantasy-land/bimap',
    promap: 'fantasy-land/promap'
};

export { apply, applyTransforms, chain, monadIterator, disjunctionEqualMaker, equalMaker, lifter, maybeFactoryHelper,
        mjoin, pointMaker, stringMaker, valueOf, get, emptyGet, orElse, emptyOrElse, getOrElse, emptyGetOrElse, sharedMaybeFns,
        sharedEitherFns, applyFantasyLandSynonyms, chainRec };