/**
 * @type:
 * @description:
 * @return: {*}
 */
function get() {
    return this.value;
}

/**
 * @type:
 * @description:
 * @param: {function} f
 * @return: {*}
 */
function orElse(f) {
    return this.value;
}

/**
 * @type:
 * @description:
 * @param: {*} x
 * @return: {*}
 */
function getOrElse(x) {
    return this.value;
}

/**
 * @type:
 * @description:
 * @param: {functor|monad} ma
 * @return: {*}
 */
function apply(ma) {
    return ma.map(this.value);
}

/**
 * @type:
 * @description:
 * @param: {function} fn
 * @return: {*}
 */
function chain(fn) {
    var val = fn(this.value);
    return Object.getPrototypeOf(this).isPrototypeOf(val) ? val : this.of(val);
}

/**
 * @type:
 * @description:
 * @param: {functor|monad} type
 * @param: {string} prop
 * @return: {function}
 */
function disjunctionEqualMaker(type, prop) {
    return function _disjunctionEquals(a) {
        return Object.getPrototypeOf(type).isPrototypeOf(a) && a[prop] && this.value === a.value;
    }
}

/**
 * @type:
 * @description:
 * @param: {functor|monad} type
 * @return: {function}
 */
function equalMaker(type) {
    return function _equal(a) {
        return Object.getPrototypeOf(type).isPrototypeOf(a) && this.value === a.value;
    };
}

/**
 * @type:
 * @description:
 * @param: {functor|monad} type
 * @return: {function}
 */
var lifter = (type) => (fn) => (...args) => type.of(fn(...args));

/**
 * @type:
 * @description:
 * @param: {functor|monad} type
 * @return: {function}
 */
var maybeFactoryHelper = type => val => type(val);

/**
 * @type:
 * @description:
 * @return: {*}
 */
function mjoin() {
    return this.value;
}

/**
 * @type:
 * @description:
 * @param: {functor|monad} type
 * @return: {function}
 */
var pointMaker = type => val => type.of(val);

/**
 * @type:
 * @description:
 * @param: {string} typeString
 * @return: {function}
 */
function stringMaker(typeString) {
    return function _toString() {
        return `${typeString}(${this.value})`;
    }
}

/**
 * @type:
 * @description:
 * @return: {*}
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
    }
}

function justBimap(f, g) {
    return this.of(f(this.value));
}

function nothingBimapMaker(factory) {
    return function nothingBimap(f, g) {
        return factory(g(this.value));
    }
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
 * @type:
 * @description:
 * @param: {function} fn
 * @return: {*}
 */
function rightMap(fn) {
    return this.of(fn(this.value));
}

/**
 * @type:
 * @description:
 * @param: {functor|monad factory function} factory
 * @return: {function}
 */
function leftMapMaker(factory) {
    return function leftMap(fn) {
        return factory(this.value);
    }
}

/**
 * @type:
 * @description:
 * @param: {function} f
 * @param: {function} g
 * @return: {*}
 */
function rightBiMap(f, g) {
    return this.of(f(this.value));
}

/**
 * @type:
 * @description:
 * @param: {functor|monad factor function} factory
 * @return: {function}
 */
function leftBimapMaker(factory) {
    return function leftBimap(f, g) {
        return factory(g(this.value));
    }
}

var sharedEitherFns = {
    rightMap,
    leftMapMaker,
    rightBiMap,
    leftBimapMaker
};

export { apply, chain, disjunctionEqualMaker, equalMaker, lifter, maybeFactoryHelper, mjoin, pointMaker, stringMaker, valueOf, get, orElse, getOrElse,
        sharedMaybeFns, sharedEitherFns };