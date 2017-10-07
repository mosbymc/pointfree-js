import { identity } from '../combinators';

/** @module data_structure_util */

var map = m => fn => m.map(fn);

/**
 * @signature contramap :: (b -> a) -> Ma
 * @description Contramap accepts a single function as an argument and returns a
 * new instance of the same data structure with an underlying function that is
 * the result of the composition of the original underlying function and the
 * function argument.
 * @param {function} fn - A function that should be composed with the data structure's
 * underlying function.
 * @return {*} Returns a data structure of the same type.
 */
function contramap(fn) {
    return this.of(compose(this.value, fn));
}

function compose(f, g) {
    return function _compose(...args) {
        return f(g(...args));
    };
}

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

    return types.map(function _applyTransforms(type) {
        if (type.delegate) {
            let regex = new RegExp(type.factory.name, 'i');

            fns.forEach(function _addTransformFunctionality(transforms) {
                transforms.forEach(transform => type.delegate[transform.name] = regex.test(transform.name) ? map(type.delegate) : transform.fn);
            });
        }
        return type;
    });
}

/**
 * @signature
 * @description Accepts a list of monad delegates and applies the associated fantasy-land
 * synonyms where applicable.
 * @param {Array} monads - An array containing each monad type factory function and associated delegate object
 * @return {*} Returns the array of monad 'types' that it received as an argument.
 */
function applyFantasyLandSynonyms(monads) {
    return monads.map(function _applyFantasyLandSynonyms(monad) {
        if (monad.delegate) {
            Object.keys(monad.delegate).forEach(function _forEachKey(key) {
                if (key in fl) monad.delegate[fl[key]] = monad.delegate[key];
            });
        }
        return monad;
    });
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

function _toPrimitive(hint) {
    console.log(hint);
    console.log(this.value);

    if (Array.isArray(this.value) && 5 === this.value.length) {
        console.log(this.value);
        console.log(hint);
        console.log(+this.value);
    }
    //if the underlying is a function, an object, or we didn't receive a hint, let JS determine how
    //to turn the underlying value into a primitive if it is not already...
    if ('object' !== typeof this.value && 'function' !== typeof this.value && null != hint) {
        //..if the hint is a number or default, coerce the underlying to a number and return...
        if ('number' === hint || 'default' === hint) return +this.value;
        //...else the hint was 'string', so coerce to a string a return
        return '' + this.value;
    }
    return this.value;
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
 * @description A factory function that takes a monad factory of any type
 * and returns a function that acts as an extend for that monad.
 * @param {function} typeFactory - A reference to a specific monad's factory function.
 * @return {_extend} Returns a function that acts as an extend for a monad.
 */
function extendMaker(typeFactory) {
    return function _extend(fn) {
        return typeFactory(fn(this));
    };
}

/**
 * @signature extract :: () -> *
 * @description Returns the underlying value of the data structure
 * @return {*} Returns the underlying value of the data structure
 */
function extract() {
    return this.value;
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
function monad_apply(ma) {
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
 * @return {Object} Returns a monad that wraps the final value 'yielded' out
 * of the recursive function.
 */
function chainRec(fn) {
    var next = x => ({ done: false, value: x }),
        done = x => ({ done: true, value: x }),
        state = { done: false, value: this.value };

    while (!state.done) {
        state = fn(next, done, state.value);
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
        return this.value && this.value.equals === _disjunctionEquals ? this.value.equals(a) :
            a.value && a.value.equals === _disjunctionEquals ? a.value.equals(this) : Object.getPrototypeOf(this).isPrototypeOf(a) && a[prop] && this.value === a.value;
    };
}

/**
 * @signature
 * @description d
 * @param {Object} a - a
 * @return {boolean} - b
 */
function equals(a) {
    return this.value && this.value.equals === equals ? this.value.equals(a) :
        a.value && a.value.equals === equals ? a.value.equals(this) : Object.getPrototypeOf(this).isPrototypeOf(a) && this.value === a.value;
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
 * @param {function} type - a
 * @return {function} val - b
 */
var maybeFactoryHelper = type => val => type(val);

/**
 * @signature
 * @description d
 * @return {Object} Returns a monad flattened by one level if capable.
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
 * @param {string} factory - a
 * @return {function} - b
 */
function stringMaker(factory) {
    return function _toString() {
        //String(this.value)
        //this.value.toString()
        //null == this.value ? this.value : this.value.toString()
        return `${factory}(${null == this.value ? this.value : this.value.toString()})`;
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

var delegate_aliases = {
    chain: [ 'bind', 'fmap', 'flatMap' ],
    apply: [ 'ap' ],
    factory: [ 'constructor' ]
};

var factory_aliases = {
    of: [ 'pure', 'point', 'return' ]
};

function setIteratorAndLift(dataStructures) {
    return dataStructures.map(function _forEachStructure(dataStructure) {
        dataStructure.factory.lift = lifter(dataStructure.factory);
        if (dataStructure.delegate) {
            //TODO: for now, don't apply the toPrimitive symbol function - it's messing with operations I
            //TODO: would not expect it to mess with.
            //dataStructure.delegate[Symbol.toPrimitive] = _toPrimitive;
            if (!dataStructure.delegate[Symbol.iterator]) dataStructure.delegate[Symbol.iterator] = monadIterator;
        }
        return dataStructure;
    });
}

function applyAliases(monads) {
    return monads.map(function _applyAliases(monad) {
        Object.keys(factory_aliases).forEach(function _applyFactoryAliases(fn) {
            factory_aliases[fn].forEach(function _setAliases(alias) {
                monad.factory[alias] = monad.factory[fn];
            });
        });

        if (monad.delegate) {
            Object.keys(delegate_aliases).forEach(function _applyDelegateAliases(fn) {
                delegate_aliases[fn].forEach(function _setAliases(alias) {
                    monad.delegate[alias] = monad.delegate[fn];
                });
            });
        }
        return monad;
    });
}

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

export { monad_apply, applyTransforms, chain, contramap, monadIterator, disjunctionEqualMaker, equals, lifter, maybeFactoryHelper,
        mjoin, pointMaker, stringMaker, valueOf, get, emptyGet, orElse, emptyOrElse, getOrElse, emptyGetOrElse, sharedMaybeFns,
        sharedEitherFns, applyFantasyLandSynonyms, applyAliases, chainRec, extendMaker, extract, setIteratorAndLift };