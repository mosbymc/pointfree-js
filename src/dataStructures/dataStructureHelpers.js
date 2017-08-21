import { identity } from '../combinators';

/** @module dataStructures/dataStructureHelpers */

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
function toContainerType(type) {
    return function toType(fn = identity) {
        return type.of(fn(this.value));
    };
}

function selfMapper(fn = identity) {
    return this.map(fn);
}

function applyTransforms(types) {
    var fns = types
        .map(type => [
            { name: `mapTo${type.factory.name}`, fn: toContainerType(type.factory) },
            { name: `to${type.factory.name}`, fn: function _toType() { return type.factory(this.value); } }
        ]);

    types.forEach(function _applyTransforms(type) {
        if (type.delegate) {
            let regex = new RegExp(type.factory.name, 'i');

            fns.forEach(function _addTransformFunctionality(transforms) {
                transforms.forEach(transform => type.delegate[transform.name] = regex.test(transform.name) ? selfMapper : transform.fn);
            });
        }
    });

    return types;
}

/**
 * @sig
 * @description d
 * @return {Object} - a
 */
function containerIterator() {
    let first = true,
        val = this.value;
    return {
        next: function _next() {
            if (first) {
                first = false;
                return {
                    done: false,
                    value: val
                };
            }
            return {
                done: true
            };
        }
    };
}

/**
 * @sig
 * @description d
 * @return {*} - a
 */
function get() {
    return this.value;
}

/**
 * @sig
 * @description d
 * @return {string} - b
 */
function emptyGet() {
    throw new Error('Cannot extract a null value.');
}

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @return {*} - b
 */
function orElse(f) {
    return this.value;
}

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @return {*} - b
 */
function emptyOrElse(f) {
    return f();
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {*} - b
 */
function getOrElse(x) {
    return this.value;
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {*} - b
 */
function emptyGetOrElse(x) {
    return x;
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {*} - b
 */
function apply(ma) {
    return ma.map(this.value);
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function chain(fn) {
    var val = fn(this.value);
    return Object.getPrototypeOf(this).isPrototypeOf(val) ? val : this.of(val);
}

/**
 * @sig
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
 * @sig
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
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var lifter = (type) => (fn) => (...args) => type.of(fn(...args));

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var maybeFactoryHelper = type => val => type(val);

/**
 * @sig
 * @description d
 * @return {*} - a
 */
function mjoin() {
    return Object.getPrototypeOf(this).isPrototypeOf(this.value) ? this.value : this;
}

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var pointMaker = type => val => type.of(val);

/**
 * @sig
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
 * @sig
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
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function rightMap(fn) {
    return this.of(fn(this.value));
}

/**
 * @sig
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
 * @sig
 * @description d
 * @param {function} f - a
 * @param {function} g - b
 * @return {*} - c
 */
function rightBiMap(f, g) {
    return this.of(f(this.value));
}

/**
 * @sig
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

export { apply, applyTransforms, chain, containerIterator, disjunctionEqualMaker, equalMaker, lifter, maybeFactoryHelper,
        mjoin, pointMaker, stringMaker, valueOf, get, emptyGet, orElse, emptyOrElse, getOrElse, emptyGetOrElse, sharedMaybeFns,
        sharedEitherFns };