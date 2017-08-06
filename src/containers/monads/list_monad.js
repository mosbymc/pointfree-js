import { list_functor, ordered_list_functor, list_core } from '../functors/list_functor';
import { sortDirection, generatorProto } from '../../helpers';
import { groupBy, groupJoin, chain, unfold, repeat } from '../list_iterators';
import { wrap, noop, invoke,delegatesFrom } from '../../functionalHelpers';
import { identity, ifElse } from '../../combinators';
import { createListCreator } from '../list_helpers';

/**
 * @sig
 * @description d
 * @param {*} source - a
 * @return {list_monad} - b
 */
var listFromNonGen = source => createListDelegateInstance(source && source[Symbol.iterator] ? source : wrap(source));

/**
 * @sig
 * @description d
 * @param {generator} source - a
 * @return {list_monad} - b
 */
var listFromGen = source => createListDelegateInstance(invoke(source));

/**
 * @sig
 * @description Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_monad} - A new List instance with the value provided as the underlying source.
 */
//TODO: should I exclude strings from being used as a source directly, or allow it because
//TODO: they have an iterator?
function List(source) {
    return ifElse(delegatesFrom(generatorProto), listFromGen, listFromNonGen, source);
}

/**
 * @sig
 * @description Convenience function for create a new List instance; internally calls List.
 * @see List
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_monad} - A new List instance with the value provided as the underlying source.
 */
List.from = source => List(source);

/**
 * @sig
 * @description Alias for List.from
 * @see List.from
 * @type {function}
 * @param {*} - a
 * @return {list_monad} - b
 */
List.of = List.from;

//TODO: implement this so that a consumer can initiate a List as ordered
List.ordered = source => source;

/**
 * @sig
 * @description d
 * @return {list_monad} - a
 */
List.empty = () => List([]);

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {list_monad} - b
 */
List.just = val => List([val]);

/**
 * @sig
 * @description d
 * @param {function|generator} fn - a
 * @param {*} seed - b
 * @return {list_monad} - c
 */
List.unfold = (fn, seed) => createListDelegateInstance(unfold(fn)(seed));

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
List.is = m => list_monad.isPrototypeOf(m) || ordered_list_monad.isPrototypeOf(m);

/**
 * @sig
 * @description Generates a new list with the specified item repeated the specified number of times. Because
 * this generates a list with the same item repeated n times, the resulting List is trivially
 * sorted. Thus, a sorted List is returned rather than an unsorted list.
 * @param {*} item - a
 * @param {number} count - b
 * @return {ordered_list_monad} - c
 */
List.repeat = function _repeat(item, count) {
    return createListDelegateInstance([], repeat(item, count), [{ keySelector: noop, comparer: noop, direction: sortDirection.descending }]);
};

/**
 * @sig
 * @summary Extension function that allows new functionality to be applied to
 * the queryable object
 * @param {string} propName - The name of the new property that should exist on the List; must be unique
 * @param {function} fn - A function that defines the new List functionality and
 * will be called when this new List property is invoked.
 * @return {List} - a
 *
 * @description The fn parameter must be a non-generator function that takes one or more
 * arguments. If this new List function should be an immediately evaluated
 * function (like: take, any, reverse, etc.), it merely needs the accept one or more
 * arguments and know how to iterate the source. In the case of an immediately evaluated
 * function, the return type can be any javascript type. The first argument is always the
 * previous List instance that must be iterated. Additional arguments may be specified
 * if desired.
 *
 * If the function's evaluation should be deferred it needs to work a bit differently.
 * In this case, the function should accept one or more arguments, the first and only
 * required argument being the underlying source of the List object. This underlying
 * source can be anything with an iterator (generator, array, map, set, another queryable).
 * Any additional arguments that the function needs should be specified in the signature.
 * The return value of the function should be a generator that knows how to iterate the
 * underlying source. If the generator should operate like most List functions, i.e.
 * take a single item, process it, and then yield it out before asking for the next, a
 * for-of loop is the preferred method for employment. However, if the generator needs
 * all of the underlying data upfront (like orderBy and groupBy), Array.from is the
 * preferred method. Array.from will 'force' all the underlying List instances
 * to evaluate their data before it is handed over in full to the generator. The generator
 * can then act with full knowledge of the data and perform whatever operation is needed
 * before ultimately yielding out a single item at a time. If your extension function
 * needs to yield out all items at once, then that function is not a lazy evaluation
 * function and should be constructed like the immediately evaluated functions described
 * above.
 */
List.extend = function _extend(propName, fn) {
    if (!(propName in list_functor) && !(propName in ordered_list_functor)) {
        //TODO: this should probably be changed, other wise I am altering the applicative list_functor in
        //TODO: addition to the monadic list_functor. I'll also need to recreate the 'toEvaluatedList' function
        //TODO: since using it on a monadic list_functor would result in a list_a, not a list_m.
        list_core[propName] = function _extension(...args) {
            return createListDelegateInstance(this, fn(this, ...args));
        };
    }
    return List;
};

var list_monad = Object.create(list_functor, {
    chain: {
        /**
         * @sig
         * @description d
         * @param {function} fn - a
         * @return {list_monad} - b
         */
        value: function _chain(fn) {
            return this.of(chain(this, fn));
        }
    },
    groupBy: {
        value: function _groupBy(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
            return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
        }
    },
    groupByDescending: {
        value: function _groupByDescending(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
            return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
        }
    },
    groupJoin: {
        value: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
            return this.of(this, groupJoin(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    fold: {
        value: function _fold(fn, x) {
            return fn(this.value, x);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(p, identity);
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.value.reduce(function _reduce(xs, x) {
                fn(x).map(x => y => y.concat([x])).apply(xs);
            }, fa.of(List.of()));

            /*
            return this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            });*/

            //TODO: this exists inside the traverse function. Function should take a typeRep + fn
            /*
             var xs = this;
             function go(idx, n) {
                 switch (n) {
                     case 0: return of(typeRep, []);
                     case 2: return lift2(pair, f(xs[idx]), f(xs[idx + 1]));
                     default:
                         var m = Math.floor(n / 4) * 2;
                         return lift2(concat_, go(idx, m), go(idx + m, n - m));
                }
             }
             return this.length % 2 === 1 ?
                 lift2(concat_, map(Array$of, f(this[0])), go(1, this.length - 1)) :
                 go(0, this.length);
             */
        }
    },
    /**
     * @sig
     * @description Applies a function contained in another functor to the source
     * of this List object instance's underlying source. A new List object instance
     * is returned.
     * @param {Object} ma - a
     * @return {list_monad} - b
     */
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val, iterator, sortObj) {
            return createListDelegateInstance(val, iterator, sortObj);
        }
    },
    factory: {
        value: List
    }
});

list_monad.ap =list_monad.apply;
list_monad.fmap = list_monad.chain;
list_monad.flapMap = list_monad.chain;
list_monad.bind = list_monad.chain;

var ordered_list_monad = Object.create(ordered_list_functor, {
    /**
     * @description:
     * @param: {function} fn
     * @return: {@see m_list}
     */
    chain: {
        value: function _chain(fn) {
            return this.of(chain(this, fn));
        }
    },
    groupBy: {
        value: function _groupBy(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
            return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
        }
    },
    groupByDescending: {
        value: function _groupByDescending(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
            return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
        }
    },
    groupJoin: {
        value: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
            return this.of(this, groupJoin(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    fold: {
        value: function _fold(fn, x) {
            return fn(this.value, x);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(p, identity);
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.reduce((ys, x) =>
                fn(x).map(x => y => y.concat([x])).apply(ys), fa.of(this.empty));
        }
    },
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val, iterator, sortObj) {
            return createListDelegateInstance(val, iterator, sortObj);
        }
    },
    factory: {
        value: List
    }
});

ordered_list_monad.ap = ordered_list_monad.apply;
ordered_list_monad.fmap = ordered_list_monad.chain;
ordered_list_monad.flapMap = ordered_list_monad.chain;
ordered_list_monad.bind = ordered_list_monad.chain;
//ordered_list_monad.reduce = ordered_list_monad.fold;

function createGroupedListDelegate(source, key) {
    return createListDelegateInstance(source, undefined, undefined, key);
}
var createListDelegateInstance = createListCreator(list_monad, ordered_list_monad, list_monad);

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "you're too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
list_monad.constructor = list_monad.factory;
ordered_list_monad.constructor = ordered_list_monad.factory;


export { List, list_monad, ordered_list_monad };