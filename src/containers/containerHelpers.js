function apply(ma) {
    return ma.map(this.value);
}

function chainMaker(type) {
    return function _chain(fn) {
        var val = fn(this.value);
        return Object.getPrototypeOf(this).isPrototypeOf(val) ? val : this.of(val);
    }
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

export { apply, chainMaker, disjunctionEqualMaker, equalMaker, mjoin, pointMaker, stringMaker, valueOf };