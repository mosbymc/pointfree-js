function get() {
    return this.value;
}

function orElse(f) {
    return this.value;
}

function getOrElse(x) {
    return this.value;
}

function apply(ma) {
    return ma.map(this.value);
}

function chain(fn) {
    var val = fn(this.value);
    return Object.getPrototypeOf(this).isPrototypeOf(val) ? val : this.of(val);
}

function disjunctionEqualMaker(type, prop) {
    return function _disjunctionEquals(a) {
        return Object.getPrototypeOf(type).isPrototypeOf(a) && a[prop] && this.value === a.value;
    }
}

function equalMaker(type) {
    return function _equal(a) {
        return Object.getPrototypeOf(type).isPrototypeOf(a) && this.value === a.value;
    };
}

function maybeFactoryHelper(type) {
    return function _maybe(val) {
        return type(val);
    };
}

function mjoin() {
    return this.value;
}

function pointMaker(type) {
    return function typeOf(val) {
        return type.of(val);
    };
}

function stringMaker(typeString) {
    return function _toString() {
        return `${typeString}(${this.value})`;
    }
}

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
function rightMap(fn) {
    return this.of(fn(this.value));
}

function leftMapMaker(factory) {
    return function leftMap(fn) {
        return factory(this.value);
    }
}

function rightBiMap(f, g) {
    return this.of(f(this.value));
}

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

export { apply, chain, disjunctionEqualMaker, equalMaker, maybeFactoryHelper, mjoin, pointMaker, stringMaker, valueOf, get, orElse, getOrElse,
        sharedMaybeFns, sharedEitherFns };