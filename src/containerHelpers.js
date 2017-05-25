import { curry, compose, identity } from './functionalHelpers';
import { Just, _just } from './just_monad/just';
import { Identity, _identity } from './identity_monad/identity';
import { Maybe, _maybe } from './maybe_monad/maybe';
import { List, list_core } from './list_monad/list';

//TODO: I need to figure out how to structure this lib. I'd like to have several different types of containers...
//TODO: ...specifically, functors (pointed), monads, and maybe one other type. In addition, each container type
//TODO: would have several implementations: maybe, option, constant, identity, future, io, etc. It would make sense
//TODO: to let the "higher" level containers delegate to the "lower" level implementations since they share all the
//TODO: functionality of the "lower" containers and add to them. In addition, a lot of the containers will have the
//TODO: same map, flatMap, chain, apply, etc functionality; it would be nice to share this functionality as well.
//TODO: Finally, I'd like to have each container in a category be capable of converting their underlying value to
//TODO: another container of the same category without the use of 'apply', more in the manner of 'toContainerX'.
//TODO: However, this means that each container in a given category has a dependency on all the other containers in
//TODO: the same category. This, more than the rest, makes structuring this lib difficult. I'd like to, at the very
//TODO: least, split each container category up so that they can be imported (and preferably downloaded) individually.
//TODO: But the more separation between containers, the more they have to 'import' each other.

/**
 * @description:
 * @type: {function}
 * @param: {functor} ma
 * @param: {functor} mb
 * @return: {functor}
 */
var apply = curry(function _apply(ma, mb) {
    return mb.apply(ma);
});

var ap = apply;

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @param: {functor} m
 * @return: {functor}
 */
var flatMap = curry(function _flatMap(fn, m) {
    return m.flatMap(fn);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @param: {functor} m
 * @return:
 */
var map = curry(function _map(fn, m) {
    return m.map(fn);
});

/**
 * @description:
 * @type {function} @see map
 * @param: {function} fn
 * @param: {functor} m
 * @return:
 */
var fmap = map;

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {functor} m
 * @return:
 */
var chain = curry(function _chain(f, m){
    return m.map(f).join(); // or compose(join, map(f))(m)
});

var bind = chain;

/**
 * @description:
 * @param: {function} f
 * @param: g
 * @return {*}
 */
var mcompose = function _mcompose(f, g) {
    return compose(chain(f), g);
};

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {functor} m1
 * @param: {functor} m2
 * @return: {Mb}
 */
var lift2 = curry(function _lift2(f, m1, m2) {
    return m1.map(f).apply(m2);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {functor} m1
 * @param: {functor} m2
 * @param: {functor} m3
 * @return: {Mb}
 */
var lift3 = curry(function _lift3(f, m1, m2, m3) {
    return lift2(f, m1, m2).apply(m3);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {functor} m1
 * @param: {functor} m2
 * @param: {functor} m3
 * @param: {functor} m4
 * @return: {Mb}
 */
var lift4 = curry(function _lift4(f, m1, m2, m3, m4) {
    return lift3(f, m1, m2, m3).apply(m4);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {Ma} ...ms
 * @return: {Mb}
 */
var liftN = curry(function _liftN(f, ...ms) {
    return ms.slice(1).reduce(function _apply(curM, nextM) {
        return curM.apply(nextM);
    }, ms.shift().map(f));
});

/**
 * @description:
 * @param: {functor} ma
 * @return: {functor}
 */
function mjoin(ma) {
    return ma.join();
}

/**
 * @description:
 * @param: type
 * @return: {function}
 */
function toFunctorType(type) {
    return function toType(fn = identity) {
        return type.of(fn(this.value));
    };
}

/**
 * @description:
 * @return: {{next: _next}}
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
 * @description:
 * @param: {functor} ma
 * @return: {@see m_list}
 */
function toList(ma) {
    return List(mjoin(ma));
}

/**
 * @description:
 * @param: {functor} ma
 * @return: {@see _maybe}
 */
function toMaybe(ma) {
    return Maybe(mjoin(ma));
}

/**
 * @description:
 * @param: {functor} ma
 * @return: {@see _future}
 */
function toFuture(ma) {
    return Future(mjoin(ma));
}

/**
 * @description:
 * @param: {functor} ma
 * @return: {@see _identity}
 */
function toIdentity(ma) {
    return Identity(mjoin(ma));
}

/**
 * @description:
 * @param: {functor} ma
 * @return: {@see _just}
 */
function toJust(ma) {
    return Just(mjoin(ma));
}

//===========================================================================================//
//===========================================================================================//
//=======================           CONTAINER TRANSFORMERS            =======================//
//===========================================================================================//
//===========================================================================================//

function _toIdentity() {
    return Identity.from(this.value);
}

function _toJust() {
    return Just.from(this.value);
}

function _toList() {
    return List.from(this.value);
}

function _toMaybe() {
    return Maybe.from(this.value);
}



//===========================================================================================//
//===========================================================================================//
//============================           LIST HELPERS            ============================//
//===========================================================================================//
//===========================================================================================//

/**
 * @description:
 * @type: {function}
 * @param: {function} predicate
 * @param: {Array} list
 * @return: {Array}
 */
var filter = curry(function _filter(predicate, list) {
    list.filter(predicate);
});

/**
 * @description:
 * @type: {function}
 * @param: {Array} enumerable
 * @param: {function} comparer
 * @param: {Array} list
 * @return: {Array}
 */
var intersect = curry(function _intersect(enumerable, comparer, list) {
    return list.intersect(enumerable, comparer);
});

export { apply, fmap, map, lift2, lift3, lift4, liftN, mjoin, toFunctorType, containerIterator };