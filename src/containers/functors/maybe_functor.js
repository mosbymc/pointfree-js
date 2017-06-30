/**
 * @description:
 * @param: {*} val
 * @return: {@see maybe_functor}
 */
function Maybe(val) {
    /*return Object.create(maybe_functor, {
        _value: {
            value: null == val ? null : val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: null != val
        },
        isNothing: {
            value: null == val
        }
    });*/
    return null == val ?
        Object.create(nothing_functor, {
            _value: {
                value: null
            },
            isJust: {
                value: false
            },
            isNothing: {
                value: true
            }
        }) :
        Object.create(just_functor, {
            _value: {
                value: val
            },
            isJust: {
                value: true
            },
            isNothing: {
                value: false
            }
        });
}

/**
 * @description:
 * @param: {*} val
 * @return: {@see maybe_functor}
 */
Maybe.of = function _of(val) {
    return Object.create(just_functor, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Maybe.is = f => just_functor.isPrototypeOf(f) || nothing_functor.isPrototypeOf(f);

/**
 * @description:
 * @param {*} val
 * @return: {@see maybe_functor}
 * @type {function}
 */
Maybe.Just = Maybe.of;

/**
 * @description:
 * @return: {@see maybe_functor}
 */
Maybe.Nothing =  function _nothing() {
    return Maybe();
};
//Maybe.Just = Just;
//Maybe.Nothing = Nothing;
Maybe.isJust = function _isJust(m) {
    return m.isJust;
};
Maybe.isNothing = function _isNothing(m) {
    return m.isNothing;
};

//TODO: determine if there is any purpose in splitting a maybe into two types... if those sub-types
//TODO: are not exposed, what benefit is derived from them? And if they are exposed (Just being Identity,
//TODO: and Nothing being Constant(null)), then the maybe container has a direct dependency on the Identity
//TODO: and Constant containers. This becomes an issue due to circular dependencies.
function Just(val) {
    return Object.create(just_functor, {
            _value: {
                value: val,
                writable: false,
                configurable: false
            },
            isJust: {
                value: true
            },
            isNothing: {
                value: false
            }
        });
}

Just.of = function _of(val) {
    return Object.create(just_functor, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Just.is = f => just_functor.isPrototypeOf(f);

function Nothing() {
    return Object.create(nothing_functor, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    });
}

Nothing.of = Nothing;

/**
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Nothing.is = f => nothing_functor.isPrototypeOf(f);

//TODO: Using this.of in order to create a new instance of a Maybe container (functor/monad) will
//TODO: not work as it is implemented here in terms of creating a new maybe container with the
//TODO: proper values for the '.isJust' and '.isNothing' fields. The problem is that the '.of'
//TODO: function property will create a new maybe instance with whatever value it receives as
//TODO: as argument and treat the new maybe container instance as a 'Just', regardless of the
//TODO: actual underlying value. As 'null' and 'undefined' underlying values are traditionally
//TODO: treated as 'Nothing' maybe values, this will cause a problem during mapping/flat-mapping/etc.
var maybe_functor = {
    get value() {
        return this._value;
    },
    map: _map,
    equals: _equals,
    of: _of,
    nothing: _nothing,
    /**
     * @description:
     * @return: {*}
     */
    valueOf: _valueOf,
    toString: _toString,
    factory: Maybe
};

function _map(fn) {
    //return this.of(fn(this.value));
    return this.isNothing ? this.nothing() : this.of(fn(this.value));
}

function _equals(ma) {
    return Object.getPrototypeOf(this).isPrototypeOf(ma) && this.value === ma.value;
}

function _of(val) {
    return Maybe.of(val);
}

function _nothing() {
    return Maybe();
}

function _valueOf() {
    return this.value;
}

function _toString() {
    //return `Maybe(${this.value})`;
    return null == this.value ? `Nothing()` : `Just(${this.value})`;
}

var just_functor = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    bimap: function _bimap(f, g) {
        return this.of(f(this.value));
    },
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && ma.isJust && this.value === ma.value;
    },
    of: function _of(val) {
        return Just.of(val);
    },
    valueOf: function _valueOf() {
        return this.value;
    },
    toString: function _toString() {
        return `Just(${this.value})`;
    },
    factory: Just
};

var nothing_functor = {
    get value() {
        return this._value;
    },
    map: function _map() {
        return this.of();
    },
    bimap: function _bimap(f, g) {
        return this.of(g(this.value));
    },
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && ma.isNothing;
    },
    of: function _of() {
        return Nothing.of();
    },
    valueOf: function _valueOf() {
        return this.value;
    },
    toString: function _toString() {
        return `Nothing()`;
    },
    factory: Nothing
};


//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
//maybe_functor.constructor = maybe_functor.factory;
just_functor.constructor = just_functor.factory;
nothing_functor.constructor = nothing_functor.factory;

export { Maybe, Just, Nothing, just_functor, nothing_functor };