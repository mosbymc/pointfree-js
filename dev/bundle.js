(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zip = exports.union = exports.join = exports.intersect = exports.groupJoin = exports.except = exports.concat = undefined;

var _concat = require('./concat');

var _except = require('./except');

var _groupJoin = require('./groupJoin');

var _intersect = require('./intersect');

var _join = require('./join');

var _union = require('./union');

var _zip = require('./zip');

exports.concat = _concat.concat;
exports.except = _except.except;
exports.groupJoin = _groupJoin.groupJoin;
exports.intersect = _intersect.intersect;
exports.join = _join.join;
exports.union = _union.union;
exports.zip = _zip.zip;

},{"./concat":2,"./except":3,"./groupJoin":4,"./intersect":5,"./join":6,"./union":7,"./zip":8}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function concat(source, collection) {
    return function* concatIterator() {
        for (let item of source) yield item;

        for (let item of collection) yield item;
    };
}

exports.concat = concat;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.except = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function except(source, collection, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;

    return function* exceptIterator() {
        var res;
        for (let item of source) {
            collection = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, collection);
            res = !collection.some(function _comparer(it) {
                return comparer(item, it);
            });
            if (res) yield item;
        }
    };
}

exports.except = except;

},{"../functionalHelpers":14,"../helpers":15}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupJoin = undefined;

var _helpers = require('../helpers');

function groupJoin(outer, inner, outerSelector, innerSelector, projector, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;

    return function* groupJoinIterator() {
        var innerGroups = [];
        for (let innerItem of inner) {
            let innerRes = innerSelector(innerItem);
            var matchingGroup = innerGroups.find(function _findInnerGroup(grp) {
                return comparer(grp.key, innerRes);
            });

            if (!matchingGroup) matchingGroup = { key: innerRes, items: [innerItem] };
            innerGroups[innerGroups.length] = matchingGroup;
        }

        for (let outerItem of outer) {
            var innerMatch = innerGroups.find(function _compareByKeys(innerItem) {
                return comparer(outerSelector(outerItem), innerItem.key);
            });
            yield projector(outerItem, undefined === innerMatch ? [] : innerMatch.items);
        }
    };
}

exports.groupJoin = groupJoin;

},{"../helpers":15}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.intersect = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function intersect(source, collection, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;

    return function* intersectIterator() {
        /*var res;
        for (let item of source) {
            res = havePreviouslyViewed(item);
            //TODO: I need to figure out a way to handle generator iterables here in order to ensure that the 'collection' includes
            //TODO: the item being examined. I also need to make sure I am executing generators consistently across the iterators.
              //TODO: The logic here needs adjusting.
            //if (!res && collection.includes(item)) yield item;
            collection = when(not(isArray), Array.from, collection);
            if (!res && ~collection.findIndex(function findMatchingItem(it) { return comparer(item, it); })) yield item;
        }*/
        collection = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, collection);
        for (let item of source) {
            if (collection.some(function _checkEquivalency(it) {
                return comparer(item, it);
            })) {
                yield item;
            }
        }
    };
}

exports.intersect = intersect;

},{"../functionalHelpers":14,"../helpers":15}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.join = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function join(outer, inner, outerSelector, innerSelector, projector, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;
    inner = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, inner);
    return function* joinIterator() {
        for (let outerItem of outer) {
            for (let innerItem of inner) {
                if (comparer(outerSelector(outerItem), innerSelector(innerItem))) yield projector(outerItem, innerItem);
            }
        }
    };
}

exports.join = join;

},{"../functionalHelpers":14,"../helpers":15}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.union = undefined;

var _helpers = require('../helpers');

/*
function union(previousFunc, collection, comparer) {
    comparer = comparer || defaultEqualityComparer;
    var havePreviouslyViewed = memoizer2(comparer),
        atEndOfList = false,
        atEndOfCollection = false;

    function unionFunc(item) {
        return havePreviouslyViewed(item);
    }

    return Object.defineProperty(
        //TODO: I don't know how realistic it would be to implement an ES6 generator for the .next function properties,
        //TODO: but it would allow me to throw the whole function into a while-loop with a .next() as the predicate.
        //TODO: The problem is that it takes so darn much to transpile/polyfill ES6 generators for a pre-ES6 environment
        //TODO: that it probably isn't realistic to use them. However, I may be able to simulate a generator with closures
        //TODO: that would allow a similar while-loop execution.
        unionFunc,
        'next', {
            writable: false,
            configurable: false,
            value: function _next() {
                var next,
                    res;
                while (!atEndOfList && undefined === res) {
                    next = previousFunc.next();
                    if (emptyObj.isPrototypeOf(next)) {
                        atEndOfList = true;
                        break;
                    }

                    res = unionFunc(next);
                    if (!res) return res;
                }

                while (!atEndOfCollection && undefined === res) {
                    next = collection.shift();
                    if (!collection.count) atEndOfCollection = true;
                    res = unionFunc(next);
                    if (!res) return res;
                }
                return Object.create(emptyObj);
            }
        }
    )
}
*/

//TODO: Here's what I'm thinking now.
//TODO: 1) I am going to stick with using ES2015 generators for queryable object evaluation. Even though that means transpiling them and including
//TODO:    the 'regeneratorRuntime' if someone wants to use this library in a pre-ES2015 environment, it allows for a much cleaner and clearer
//TODO:    code path/syntax, a much simpler logic for iterating each item through each pipeline function, and ostensible allows for easier extensions
//TODO:    to be written for the queryable logic by consumers of the library.
//TODO:
//TODO: 2) Given #1, at some point I may try to make a more pre-ES2015-compliant version of this library that doesn't need to rely on the 'regeneratorRuntime'
//TODO:    to properly function in a pre-ES2015 environment.
//TODO:
//TODO: 3) Using generators, it seems like all I need to do is define each queryable function (similar to what I have in the js-data-manager library),
//TODO:    and the generator/iterator for each function. The initial/base queryable object's iterator would always be the same: a for-of loop that yields
//TODO:    each item in the source collection. Every time a queryable method is chained off a queryable object, it will return a new queryable object
//TODO:    whose source is not the base collection, but rather the previous queryable object itself.
//TODO:
//TODO:    Each 'method' that can be called on the queryable object and which results in deferred execution, should have its own iterator defined,
//TODO:    so that, in effect, each 'method' knows how to iterate and evaluate itself. When creating the new queryable object to return from a 'method'
//TODO:    call, that 'method' should return its iterator to be set as the new queryable object's iterator; thus, every time a deferred execution 'method'
//TODO:    is chained off a queryable, it results in a new queryable object that has a different iterator than the one that proceeded it and is unique
//TODO:    to the 'method' that was called.
//TODO:
//TODO:    Since a queryable object will always have a [Symbol.iterator] property, they can be iterated in a for-of loop. And since the queryable's
//TODO:    iterator is a generator, they can gather as few or as many of the items from the 'source' as needed before 'evaluating themselves'. The one
//TODO:    potential problem I see is that, once a queryable pipeline has been built up by chaining 'methods', the evaluation of the final queryable
//TODO:    will cause all prior queryables to also be evaluated. To an extent this isn't an issue, since, even if it didn't cause the evaluation of the
//TODO:    previous queryable objects themselves, but instead it just sorta reduced each queryable's function over the source collection, the evaluation
//TODO:    would have to occur anyway... in other words, it wouldn't be performing any additional work by evaluating prior queryables. However, there are
//TODO:    a few things I need to be careful of and watch out for:
//TODO:         - If the evaluation of a queryable causes all prior queryable's to also be evaluated, then it would make sense to 'save' the evaluation
//TODO:           of each queryable along the pipeline. If I evaluate a prior queryable during the evaluation of the 'final' queryable, but fail to 'save'
//TODO:           that evaluation in the prior queryable object, then, if that prior queryable is ever iterated again, I'll have to perform the work all
//TODO:           over again. So, I probably need to pass some context into each of the queryable's function iterators so they can 'save' the evaluated
//TODO:           data in that queryable object should it be iterated again at some future point (this assumes a non-streaming context). This would also
//TODO:           mean that I'd need to check to see if the current queryable has been evaluated within the iterator before performing the evaluation.
//TODO:
//TODO:         - Again, if the evaluation of a queryable causes all prior queryable's in the pipeline to also be evaluated, how do I handle a split
//TODO:           queryable pipeline? Example:
//TODO:                 var a = new[] {1, 2, 3, 4, 5};
//TODO:                 var b = a.Select(it => it * 2);
//TODO:                 var c = b.Where(it => it % 2 == 0);
//TODO:                 var d = c.Join(new [] {2, 4, 6, 8, 10},
//TODO:                             it => it,
//TODO:                             item  => item
//TODO:                             (it, item) => it * item);
//TODO:                 var e = c.Join(new[] {1, 2, 3, 4, 5},
//TODO:                             it => it,
//TODO:                             item => item
//TODO:                             (it, item) => it * item);
//TODO:
//TODO:           Here, if the 'd' queryable is evaluated, then the 'c' and 'b' queryables will also be evaluated. So, if the 'e' queryable is later
//TODO:           evaluated, it needs to be able to grab the pre-evaluated data from 'b' and 'c' rather than re-evaluating them again. Given my proposed
//TODO:           method of dealing with prior queryable evaluation above, the 'e' queryable object would probably benefit from that 'saved' evaluation
//TODO:           state as well. But this is something to be aware of as I don't want to re-perform work that has already been done.
//TODO:
//TODO:         - While there won't be any concept of 'tasks' in this library any time soon (or possible never), introducing tasks adds a whole new
//TODO:           dimension to queryable evaluation and the saving of that evaluation. Besides which, even if I don't use web workers or some other
//TODO:           JavaScript threading technology, if I am using generators in this library, it is only fair to assume that consumers of this library
//TODO:           are also using generators. While generators do not provide true synchronous execution, they can mimic it at the program level. This
//TODO:           means, again, using the example code above, that both 'd' and 'e' could be evaluated at the 'same' time. Because a queryable object's
//TODO:           iterator is a generator, both 'd' and 'e' would have their own 'instance' of the 'b' and 'c' iterators; so there should be no issue
//TODO:           with race conditions per se. But, if each iterator is checking its queryable's state to see if it has already been evaluated before
//TODO:           performing the evaluation, this could lead to some interesting effects. It could also happen that the 'c' and 'd' queryable objects
//TODO:           are being evaluated at the 'same' time. Which I think would be even more likely to cause issue since 'c' is 100% within the 'd'
//TODO:           queryable's pipeline.
//TODO:
//TODO:         - In the interest of allow for easy extensibility, I should probably wrap each deferred execution 'method's' returned iterator
//TODO:           in a generator function before setting it as the new queryable object's iterator. The wrapper would be where it would check the queryable
//TODO:           object's state to see if it has already been evaluated before actually performing the evaluation. This would allow users of the library
//TODO:           to focus more on the evaluation logic of their function via the iterator without having to worry about checking if the queryable has
//TODO:           already been evaluated, while at the same time, providing a clean and consistent 'interface' for a queryable's [Symbol.iterator] property.
//TODO:           In addition, the iterator wrapper could always set the queryable's evaluated state after the function iterator has completed execution as
//TODO:           well. This way, not only does a function's iterator not need to check if the queryable object it is iterating has already been evaluated,
//TODO:           but it also won't need to bother setting that state once it completes the evaluation as it will be performed in the iterator wrapper. Now,
//TODO:           each function's iterator is free to concern itself solely with its own evaluation and doesn't need to bother with the checking or setting
//TODO:           of a queryable's evaluated state, nor what to do when the queryable it is evaluating has already been evaluated.
//TODO:
//TODO:         - Finally, as mentioned above, 'saving' the evaluated data of a queryable object kinda assumes a non-streaming version/usage of this library.
//TODO:           While I don't want to extend my focus on more than is necessary to implement the core functionality, I think this library would be
//TODO:           significantly more useful if it could handle both finite and potentially infinite (i.e. streaming) sets. The problem is that the concept
//TODO:           of a 'pre-evaluated' queryable is ridiculous in a streaming context. Obviously, I could take the hacky way out and just create two
//TODO:           separate queryable object types; one for finite sets, and one for potentially infinite sets. But, not only is that hacky, ugly, and just
//TODO:           plain lazy, but I also feel it reduces the usability practicality of this library if a user must learn not one, but two APIs for the
//TODO:           two queryable objects, and when to use each one. In general, it is sacrificing consumer convenience for developer convenience, and I
//TODO:           just won't stand for it!
//TODO:
//TODO: 4) Every queryable collation 'method' should be capable of taking any enumerable object as an argument for the 'collection' parameter, including
//TODO:    another queryable object. Utilizing generators and for-of loops should make this very possible. Only objects that have an iterator, built-in or
//TODO:    otherwise, should be accepted. An object without an iterator, although enumerable, should not be accepted as a valid parameter. In light of this,
//TODO:    I should probably change the 'collection' parameter in all collation 'methods' to 'enumerable' or something similar.


function union(source, collection, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;
    var havePreviouslyViewed = (0, _helpers.memoizer2)(comparer);

    return function* unionIterator() {
        var res;
        for (let item of source) {
            res = havePreviouslyViewed(item);
            if (!res) yield item;
        }

        for (let item of collection) {
            res = havePreviouslyViewed(item);
            if (!res) yield item;
        }
    };
}

exports.union = union;

},{"../helpers":15}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.zip = undefined;

var _functionalHelpers = require('../functionalHelpers');

function zip(source, collection, selector) {
    return function* zipIterator() {
        var res,
            idx = 0;
        collection = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, collection);

        if (collection.length < 1) return [];

        for (let item of source) {
            if (idx > collection.length) return;
            res = selector(item, collection[idx]);
            if (undefined !== res) yield res;
            ++idx;
        }
    };
}

exports.zip = zip;

},{"../functionalHelpers":14}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.all = undefined;

var _helpers = require('../helpers');

function all(source, predicate) {
    if (_helpers.javaScriptTypes.function !== typeof predicate) return false;
    return Array.from(source).every(predicate);
}

exports.all = all;

},{"../helpers":15}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.any = undefined;

var _helpers = require('../helpers');

function any(source, predicate) {
    if (_helpers.javaScriptTypes.function !== typeof predicate) return Array.from(source).length > 0;
    return Array.from(source).some(predicate);
}

exports.any = any;

},{"../helpers":15}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.last = exports.first = exports.any = exports.all = undefined;

var _all = require('./all');

var _any = require('./any');

var _first = require('./first');

var _last = require('./last');

exports.all = _all.all;
exports.any = _any.any;
exports.first = _first.first;
exports.last = _last.last;

},{"./all":9,"./any":10,"./first":12,"./last":13}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.first = undefined;

var _helpers = require('../helpers');

function first(source, predicate) {
    if (_helpers.javaScriptTypes.function === typeof predicate) return Array.from(source).find(predicate);
    return Array.from(source)[0];
}

exports.first = first;

},{"../helpers":15}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.last = undefined;

var _helpers = require('../helpers');

function last(source, predicate) {
    var data = Array.from(source);
    if (_helpers.javaScriptTypes.function === typeof predicate) data = data.filter(predicate);
    return data[data.length - 1];
}

exports.last = last;

},{"../helpers":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function identity(item) {
    return item;
}

var ifElse = curry(function ifElse(predicate, ifFunc, elseFunc, data) {
    if (predicate(data)) return ifFunc(data);
    return elseFunc(data);
});

var when = curry(function _when(predicate, transform, data) {
    return ifElse(predicate, transform, identity, data);
});

function wrap(data) {
    return [data];
}

function isArray(data) {
    return Array.isArray(data);
}

function isObject(item) {
    return typeof item === 'object' && null !== item;
}

function isFunction(fn) {
    return typeof fn === 'function';
}

function not(fn) {
    return function _not(...rest) {
        return !fn(...rest);
    };
}

function or(a, b, item) {
    return a(item) || b(item);
}

function and(a, b, item) {
    return a(item) && b(item);
}

function curry(fn) {
    if (!fn.length) return fn;
    return curryN(fn.length, [], fn);
}

function curryN(length, received, fn) {
    return function _c(...rest) {
        var combined = received.concat(rest);
        if (length > combined.length) return curryN(length, combined, fn);
        return fn.call(this, ...combined);
    };
}

exports.identity = identity;
exports.ifElse = ifElse;
exports.when = when;
exports.wrap = wrap;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.not = not;
exports.or = or;
exports.and = and;
exports.curry = curry;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var functionTypes = {
    atomic: 'atomic',
    collective: 'collective',
    initiatory: 'initiatory',
    collation: 'collation',
    evaluation: 'evaluation',
    limitation: 'limitation',
    projection: 'projection'
};

var operationTypes = {
    atomic: 'atomic',
    collective: 'collective',
    initiatory: 'initiatory'
};

var javaScriptTypes = {
    'function': 'function',
    'object': 'object',
    'boolean': 'boolean',
    'number': 'number',
    'symbol': 'symbol',
    'string': 'string',
    'undefined': 'undefined'
};

var comparisons = {
    strictEquality: 'eq',
    looseEquality: '==',
    strictInequality: 'neq',
    looseInequality: '!=',
    greaterThanOrEqual: 'gte',
    greaterThan: 'gt',
    lessThanOrEqual: 'lte',
    lessThan: 'lt',
    falsey: 'falsey',
    truthy: 'truthy',
    contains: 'ct',
    doesNotContain: 'nct',
    startsWith: 'startsWith',
    endsWith: 'endsWith'
};

var dataTypes = {
    number: '^-?(?:[1-9]{1}[0-9]{0,2}(?:,[0-9]{3})*(?:\\.[0-9]+)?|[1-9]{1}[0-9]{0,}(?:\\.[0-9]+)?|0(?:\\.[0-9]+)?|(?:\\.[0-9]+)?)$',
    numberChar: '[\\d,\\.-]',
    integer: '^\\-?\\d+$',
    time: '^(0?[1-9]|1[012])(?:(?:(:|\\.)([0-5]\\d))(?:\\2([0-5]\\d))?)?(?:(\\ [AP]M))$|^([01]?\\d|2[0-3])(?:(?:(:|\\.)([0-5]\\d))(?:\\7([0-5]\\d))?)$',
    timeChar: '[\\d\\.:\\ AMP]',
    date: '^(?:(?:(?:(?:(?:(?:(?:(0?[13578]|1[02])(\\/|-|\\.)(31))\\2|(?:(0?[1,3-9]|1[0-2])(\\/|-|\\.)(29|30)\\5))|(?:(?:(?:(?:(31)(\\/|-|\\.)(0?[13578]|1[02])\\8)|(?:(29|30)(\\/|-|\\.)' + '(0?[1,3-9]|1[0-2])\\11)))))((?:1[6-9]|[2-9]\\d)?\\d{2})|(?:(?:(?:(0?2)(\\/|-|\\.)(29)\\15)|(?:(29)(\\/|-|\\.)(0?2))\\18)((?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])' + '|(?:(?:16|[2468][048]|[3579][26])00))))|(?:(?:((?:0?[1-9])|(?:1[0-2]))(\\/|-|\\.)(0?[1-9]|1\\d|2[0-8]))\\22|(0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)((?:0?[1-9])|(?:1[0-2]))\\25)((?:1[6-9]|[2-9]\\d)?\\d{2}))))' + '|(?:(?:((?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\\/|-|\\.)(?:(?:(?:(0?2)(?:\\29)(29))))|((?:1[6-9]|[2-9]\\d)?\\d{2})(\\/|-|\\.)' + '(?:(?:(?:(0?[13578]|1[02])\\33(31))|(?:(0?[1,3-9]|1[0-2])\\33(29|30)))|((?:0?[1-9])|(?:1[0-2]))\\33(0?[1-9]|1\\d|2[0-8]))))$',
    datetime: '^(((?:(?:(?:(?:(?:(?:(?:(0?[13578]|1[02])(\\/|-|\\.)(31))\\4|(?:(0?[1,3-9]|1[0-2])(\\/|-|\\.)(29|30)\\7))|(?:(?:(?:(?:(31)(\\/|-|\\.)(0?[13578]|1[02])\\10)|(?:(29|30)(\\/|-|\\.)' + '(0?[1,3-9]|1[0-2])\\13)))))((?:1[6-9]|[2-9]\\d)?\\d{2})|(?:(?:(?:(0?2)(\\/|-|\\.)(29)\\17)|(?:(29)(\\/|-|\\.)(0?2))\\20)((?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])' + '|(?:(?:16|[2468][048]|[3579][26])00))))|(?:(?:((?:0?[1-9])|(?:1[0-2]))(\\/|-|\\.)(0?[1-9]|1\\d|2[0-8]))\\24|(0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)((?:0?[1-9])|(?:1[0-2]))\\27)' + '((?:1[6-9]|[2-9]\\d)?\\d{2}))))|(?:(?:((?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\\/|-|\\.)(?:(?:(?:(0?2)(?:\\31)(29))))' + '|((?:1[6-9]|[2-9]\\d)?\\d{2})(\\/|-|\\.)(?:(?:(?:(0?[13578]|1[02])\\35(31))|(?:(0?[1,3-9]|1[0-2])\\35(29|30)))|((?:0?[1-9])|(?:1[0-2]))\\35(0?[1-9]|1\\d|2[0-8])))))' + '(?: |T)((0?[1-9]|1[012])(?:(?:(:|\\.)([0-5]\\d))(?:\\44([0-5]\\d))?)?(?:(\\ [AP]M))$|([01]?\\d|2[0-3])(?:(?:(:|\\.)([0-5]\\d))(?:\\49([0-5]\\d))?)$))',
    dateChar: '\\d|\\-|\\/|\\.',
    dateTimeChar: '[\\d\\.:\\sAMP\\-\\/]'
};

var emptyObj = Object.create(null);

function defaultEqualityComparer(a, b) {
    return a === b;
}

function defaultGreaterThanComparer(a, b) {
    return a > b;
}

function defaultPredicate() {
    return true;
}

var generatorProto = Object.getPrototypeOf(function* _generator() {});

function memoizer() {
    var cache = new Set();
    return function memoizeForMeWillYa(item) {
        if (!cache.has(item)) {
            cache.add(item);
            return false;
        }
        return true;
    };
}

//TODO: this will have to be changed as the false value could be a legit value for a collection...
//TODO:... I'm thinking reusing the 'flag' object to indicate the end of the list for the .next functions
//TODO: should be reusable here to indicate a 'false' value
function memoizer2(comparer) {
    comparer = comparer || defaultEqualityComparer;
    //TODO: need to make another change here... ideally, no queryable function should ever pass an undefined value to
    //TODO: the memoizer, but I don't want to depend on that. The problem here is that, if the defaultEqualityComparer is
    //TODO: not used, then an exception could well be thrown if the comparer tries to access a property on or invoke the
    //TODO: undefined value that the memoizer's array is initialized with. Likely the best approach is to examine the item
    //TODO to be memoized, and if it is undefined, then just return true
    var items = []; //initialize the array with an undefined value as we don't accept that as a legit value for the comparator
    return function _memoizeThis(item) {
        if (undefined === item || items.some(function _checkEquality(it) {
            return comparer(it, item);
        })) {
            return true;
        }
        items[items.length] = item;
        return false;
    };
}

function comparator(type, val, base) {
    switch (type) {
        case 'eq':
        case '===':
            return val === base;
        case '==':
            return val == base;
        case 'neq':
        case '!==':
            return val !== base;
        case '!=':
            return val != base;
        case 'gte':
        case '>=':
            return val >= base;
        case 'gt':
        case '>':
            return val > base;
        case 'lte':
        case '<=':
            return val <= base;
        case 'lt':
        case '<':
            return val < base;
        case 'not':
        case '!':
        case 'falsey':
            return !val;
        case 'truthy':
            return !!val;
        case 'ct':
            return !!~val.toString().toLowerCase().indexOf(base.toString().toLowerCase());
        case 'nct':
            return !~val.toString().toLowerCase().indexOf(base.toString().toLowerCase());
        case 'startsWith':
            return val.toString().substring(0, base.toString().length) === base.toString();
        case 'endsWith':
            return val.toString().substring(val.length - base.toString().length, val.length) === base.toString();
    }
}

function dataTypeValueNormalizer(dataType, val) {
    if (val == null) return val;
    switch (dataType) {
        case 'time':
            var value = getNumbersFromTime(val);
            if (val.indexOf('PM') > -1) value[0] += 12;
            return convertTimeArrayToSeconds(value);
        case 'datetime':
            let dateTimeRegex = new RegExp(dataTypes.datetime),
                execVal1;
            if (dateTimeRegex.test(val)) {
                execVal1 = dateTimeRegex.exec(val);

                var dateComp1 = execVal1[2],
                    timeComp1 = execVal1[42];
                timeComp1 = getNumbersFromTime(timeComp1);
                if (timeComp1[3] && timeComp1[3] === 'PM') timeComp1[0] += 12;
                let month = execVal1[23] || execVal1[28],
                    day = execVal1[25] || execVal1[26],
                    year = execVal1[29];
                dateComp1 = new Date(year, month, day);
                return dateComp1.getTime() + convertTimeArrayToSeconds(timeComp1);
            } else return 0;
        case 'number':
            return parseFloat(val);
        case 'date':
            let dateRegex = new RegExp(dataTypes.date),
                execVal;
            if (dateRegex.test(val)) {
                execVal = dateRegex.exec(val);
                let day = execVal[23] || execVal[24],
                    month = execVal[21] || execVal[26],
                    year = execVal[27];
                return new Date(year, month, day);
            }
            return new Date();
        case 'boolean':
        default:
            return val.toString();
    }
}

function getNumbersFromTime(val) {
    var re = new RegExp("^(0?[1-9]|1[012])(?:(?:(:|\\.)([0-5]\\d))(?:\\2([0-5]\\d))?)?(?:(\\ [AP]M))$|^([01]?\\d|2[0-3])(?:(?:(:|\\.)([0-5]\\d))(?:\\7([0-5]\\d))?)$");
    if (!re.test(val)) return [12, '00', '00', 'AM'];
    var timeGroups = re.exec(val),
        hours = timeGroups[1] ? +timeGroups[1] : +timeGroups[6],
        minutes,
        seconds,
        meridiem,
        retVal = [];
    if (timeGroups[2]) {
        minutes = timeGroups[3] || '00';
        seconds = timeGroups[4] || '00';
        meridiem = timeGroups[5].replace(' ', '') || null;
    } else if (timeGroups[6]) {
        minutes = timeGroups[8] || '00';
        seconds = timeGroups[9] || '00';
    } else {
        minutes = '00';
        seconds = '00';
    }
    retVal.push(hours);
    retVal.push(minutes);
    retVal.push(seconds);
    if (meridiem) retVal.push(meridiem);
    return retVal;
}

function convertTimeArrayToSeconds(timeArray) {
    var hourVal = parseInt(timeArray[0].toString()) === 12 || parseInt(timeArray[0].toString()) === 24 ? parseInt(timeArray[0].toString()) - 12 : parseInt(timeArray[0]);
    return 3660 * hourVal + 60 * parseInt(timeArray[1]) + parseInt(timeArray[2]);
}

function cloneData(data) {
    //Clones data so pass-by-reference doesn't mess up the values in other grids.
    if (data == null || typeof data !== 'object') return data;

    if (Object.prototype.toString.call(data) === '[object Array]') return cloneArray(data);

    var temp = {};
    Object.keys(data).forEach(function _cloneGridData(field) {
        temp[field] = cloneData(data[field]);
    });
    return temp;
}

function cloneArray(arr) {
    var length = arr.length,
        newArr = new arr.constructor(length),
        index = -1;
    while (++index < length) {
        newArr[index] = cloneData(arr[index]);
    }
    return newArr;
}

exports.functionTypes = functionTypes;
exports.javaScriptTypes = javaScriptTypes;
exports.comparisons = comparisons;
exports.dataTypes = dataTypes;
exports.defaultEqualityComparer = defaultEqualityComparer;
exports.defaultGreaterThanComparer = defaultGreaterThanComparer;
exports.defaultPredicate = defaultPredicate;
exports.memoizer = memoizer;
exports.memoizer2 = memoizer2;
exports.getNumbersFromTime = getNumbersFromTime;
exports.comparator = comparator;
exports.dataTypeValueNormalizer = dataTypeValueNormalizer;
exports.cloneData = cloneData;
exports.cloneArray = cloneArray;
exports.operationTypes = operationTypes;
exports.emptyObj = emptyObj;
exports.generatorProto = generatorProto;

},{}],16:[function(require,module,exports){
'use strict';

var _queryObjectCreators = require('./queryObjects/queryObjectCreators');

var _queryable = require('./queryObjects/queryable');

window.queryable = _queryable.queryable || {};

},{"./queryObjects/queryObjectCreators":28,"./queryObjects/queryable":29}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.distinct = undefined;

var _helpers = require('../helpers');

function distinct(source, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;
    var havePreviouslyViewed = (0, _helpers.memoizer2)(comparer);

    return function* distinctIterator() {
        for (let item of source) {
            if (!havePreviouslyViewed(item)) yield item;
        }
    };
}

exports.distinct = distinct;

},{"../helpers":15}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.where = exports.distinct = undefined;

var _distinct = require('./distinct');

var _where = require('./where');

exports.distinct = _distinct.distinct;
exports.where = _where.where;

},{"./distinct":17,"./where":19}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function where(source, predicate) {
    return function* whereIterator() {
        for (let item of source) {
            if (predicate(item)) yield item;
        }
    };
}

exports.where = where;

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deepFlatten = undefined;

var _functionalHelpers = require('../functionalHelpers');

function deepFlatten(source) {
    return function* iterator() {
        var unyieldedData = [],
            res;

        for (let item of source) {
            res = flatteningFunc(item);

            if ((0, _functionalHelpers.isArray)(res)) unyieldedData = unyieldedData.concat(Array.prototype.concat.apply([], res));
            if (unyieldedData.length) yield unyieldedData.shift();else yield res;
        }
        while (unyieldedData.length) yield unyieldedData.shift();
    };
}

function flatteningFunc(data) {
    return (0, _functionalHelpers.ifElse)(_functionalHelpers.isArray, mapData, (0, _functionalHelpers.when)(_functionalHelpers.isObject, (0, _functionalHelpers.when)(objectContainsOnlyArrays, getObjectKeysAsArray)), data);
}

function mapData(data) {
    return Array.prototype.concat.apply([], data.map(function flattenArray(item) {
        return flatteningFunc(item);
    }));
}

function getObjectKeysAsArray(data) {
    return Object.keys(data).map(function _flattenKeys(key) {
        return flatteningFunc(data[key]);
    });
}

function objectContainsOnlyArrays(data) {
    return Object.keys(data).every(function _isMadeOfArrays(key) {
        return (0, _functionalHelpers.isArray)(data[key]);
    });
}

exports.deepFlatten = deepFlatten;

},{"../functionalHelpers":14}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.flatten = undefined;

var _functionalHelpers = require('../functionalHelpers');

function flatten(source) {
    return function* flattenIterator() {
        var unyieldedData = [];

        for (let item of source) {
            if ((0, _functionalHelpers.isArray)(item)) unyieldedData = unyieldedData.concat(item);
            if (unyieldedData.length) yield unyieldedData.shift();else yield item;
        }

        while (unyieldedData.length) yield unyieldedData.shift();
    };
}

exports.flatten = flatten;

},{"../functionalHelpers":14}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupBy = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _sortHelpers = require('./sortHelpers');

function groupBy(source, groupObject) {
    return function* groupByIterator() {
        //gather all data from the source before grouping
        var groupedData = groupData((0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, source), groupObject);
        for (let item of groupedData) yield item;
    };
}

function groupData(data, groupObject) {
    var sortedData = (0, _sortHelpers.sortData2)(data, groupObject),
        retData = [];

    sortedData.forEach(function _groupSortedData(item) {
        let grp = retData;
        groupObject.forEach(function _createGroupsByFields(group) {
            grp = findGroup(grp, group.keySelector(item));
        });
        grp[grp.length] = item;
    });

    return retData;
}

function findGroup(arr, field) {
    var grp;
    if (arr.some(function _findGroup(group) {
        if (group.key === field) {
            grp = group;
            return true;
        }
    })) return grp;else {
        grp = [];
        grp.key = field;
        arr.push(grp);
        return grp;
    }
}

exports.groupBy = groupBy;

},{"../functionalHelpers":14,"./sortHelpers":26}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function map(source, fn) {
    return function* mapIterator() {
        for (let item of source) {
            yield fn(item);
        }
    };
}

exports.map = map;

},{}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.orderBy = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _sortHelpers = require('./sortHelpers');

//TODO: I should probably make this take either a "fields" object, or a selector function
//TODO: It also seems an insertion sort would work better in terms of lazy evaluation... of course, if
//TODO: I can chain multiple calls to "orderBy/orderByDescending/thenBy/thenByDescending" together
//TODO: beneath the covers, then I'd need all the data up front.

//TODO: Since group by functionality will work the same way, it's probably best to think this through
//TODO: first before committing to a mode of functionality  now.
function orderBy(source, orderObject) {
    return function* orderByIterator() {
        //gather all data from the source before sorting
        var orderedData = (0, _sortHelpers.sortData2)((0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, source), orderObject);
        for (let item of orderedData) yield item;
    };
}

exports.orderBy = orderBy;

},{"../functionalHelpers":14,"./sortHelpers":26}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orderBy = exports.map = exports.groupBy = exports.flatten = exports.deepFlatten = undefined;

var _deepFlatten = require('./deepFlatten');

var _flatten = require('./flatten');

var _groupBy = require('./groupBy');

var _map = require('./map');

var _orderBy = require('./orderBy');

exports.deepFlatten = _deepFlatten.deepFlatten;
exports.flatten = _flatten.flatten;
exports.groupBy = _groupBy.groupBy;
exports.map = _map.map;
exports.orderBy = _orderBy.orderBy;

},{"./deepFlatten":20,"./flatten":21,"./groupBy":22,"./map":23,"./orderBy":24}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sortData2 = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

/*
function sortData(data, fields) {
    var sortedData = data;
    fields.forEach(function _sortItems(field, index) {
        if (index === 0) sortedData = mergeSort(data, field.key, field.dir, field.dataType);
        else {
            let sortedSubData = [],
                itemsToSort = [],
                prevField = fields[index - 1].key,
                prevType = fields[index - 1].dataType || 'string';
            sortedData.forEach(function _sortData(item, idx) {
                if (!itemsToSort.count || comparator('eq', dataTypeValueNormalizer(prevType, itemsToSort[0][prevField]), dataTypeValueNormalizer(prevType, item[prevField])))
                    itemsToSort.push(item);
                else {
                    if (itemsToSort.count === 1) sortedSubData = sortedSubData.concat(itemsToSort);
                    else sortedSubData = sortedSubData.concat(mergeSort(itemsToSort, field.key, field.dir, field.dataType || 'string'));
                    itemsToSort.count = 0;
                    itemsToSort.push(item);
                }
                if (idx === sortedData.count - 1)
                    sortedSubData = sortedSubData.concat(mergeSort(itemsToSort, field.key, field.dir, field.dataType || 'string'));
            });
            sortedData = sortedSubData;
        }
    });
    return sortedData;
}
*/

function sortData2(data, sortObject) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
        let comparer = sort.direction === 'asc' ? sort.comparer : (0, _functionalHelpers.not)(sort.comparer);
        if (index === 0) sortedData = mergeSort2(data, sort.keySelector, comparer);else {
            let sortedSubData = [],
                itemsToSort = [],
                prevKeySelector = sortObject[index - 1].keySelector;
            sortedData.forEach(function _sortData(item, idx) {
                if (!itemsToSort.length || (0, _helpers.defaultEqualityComparer)(prevKeySelector(itemsToSort[0]), prevKeySelector(item))) itemsToSort.push(item);else {
                    if (itemsToSort.length === 1) sortedSubData = sortedSubData.concat(itemsToSort);else {
                        sortedSubData = sortedSubData.concat(mergeSort2(itemsToSort, sort.keySelector, comparer));
                    }
                    itemsToSort.length = 0;
                    itemsToSort.push(item);
                }
                if (idx === sortedData.length - 1) {
                    sortedSubData = sortedSubData.concat(mergeSort2(itemsToSort, sort.keySelector, comparer));
                }
            });
            sortedData = sortedSubData;
        }
    });
    return sortedData;
}

function mergeSort2(data, keySelector, comparer) {
    if (data.length < 2) return data;
    var middle = parseInt(data.length / 2);
    return merge2(mergeSort2(data.slice(0, middle), keySelector, comparer), mergeSort2(data.slice(middle), keySelector, comparer), keySelector, comparer);
}

function merge2(left, right, keySelector, comparer) {
    if (!left.length) return right;
    if (!right.length) return left;

    if (comparer(keySelector(left[0]), keySelector(right[0]))) return [(0, _helpers.cloneData)(left[0])].concat(merge2(left.slice(1, left.length), right, keySelector, comparer));
    return [(0, _helpers.cloneData)(right[0])].concat(merge2(left, right.slice(1, right.length), keySelector, comparer));
}

/*
function mergeSort(data, field, direction, dataType) {
    if (data.count < 2) return data;
    var middle = parseInt(data.count / 2);
    return merge(mergeSort(data.slice(0, middle), field, direction, dataType), mergeSort(data.slice(middle, data.count), field, direction, dataType), field, direction, dataType);
}

function merge(left, right, field, direction, dataType) {
    if (!left.count) return right;
    if (!right.count) return left;

    var operator = direction === 'asc' ? comparisons.lessThanOrEqual : comparisons.greaterThanOrEqual;
    if (comparator(operator, dataTypeValueNormalizer(dataType || typeof left[0][field], left[0][field]), dataTypeValueNormalizer(dataType || typeof right[0][field], right[0][field])))
        return [cloneData(left[0])].concat(merge(left.slice(1, left.count), right, field, direction, dataType));
    else  return [cloneData(right[0])].concat(merge(left, right.slice(1, right.count), field, direction, dataType));
}
*/

/*
function sortAlgorithm(source, keySelector) {
    return function *sortAlgorithmIterator() {
        var res = [];
        for (let item of source) {
            if (!res.count) res[0] = item;
            else if (res.count === 1) {
                if (keySelector(res[0]) < keySelector(item))
                    res = res.concat(item);
                else
                    res = [item, res[0]];
            }
            else {
                let prev = res.count > 2,
                    middle = res.slice(0, res.count / 2),
                    found = false;
                while (!found) {
                    if (keySelector(middle) > keySelector(item)) {
                        if (prev) middle = middle.slice(0, middle.count / 2);
                        else {
                            res = [item].concat(res);
                            found = true;
                        }
                    }
                    else {
                        if (prev) middle = res.slice(res.count / 2);
                        else {
                            res = [item].concat(res);
                            found = true;
                        }
                    }
                }
            }
        }
    }
}*/

exports.sortData2 = sortData2;

},{"../functionalHelpers":14,"../helpers":15}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.orderedQueryable = undefined;

var _queryable = require('./queryable');

var orderedQueryable = Object.create(_queryable.queryable);

orderedQueryable.from = function _orderedFrom(source) {
    return this.queryableFrom(source);
};

orderedQueryable.orderedMap = function _orderedMap(mapFunc) {
    return this.queryableMap(mapFunc);
};

orderedQueryable.orderedGroupBy = function _orderedGroupBy(keySelector, comparer) {
    return this.queryableGroupBy(keySelector, comparer);
};

orderedQueryable.orderedGroupBy = function _orderedGroupBy(keySelector, comparer) {
    return this.queryableGroupBy(keySelector, comparer);
};

orderedQueryable.orderedGroupByDescending = function _orderedGroupByDescending(keySelector, comparer) {
    return this.queryableGroupByDescending(keySelector, comparer);
};

orderedQueryable.orderedFlatten = function _orderedFlatten() {
    return this.queryableFlatten();
};

orderedQueryable.orderedFlattenDeep = function _orderedFlattenDeep() {
    return this.queryableFlattenDeep();
};

orderedQueryable.orderedJoin = function _orderedJoin(inner, outerSelector, innerSelector, projector, comparer) {
    return this.queryableJoin(inner, outerSelector, innerSelector, projector, comparer);
};

orderedQueryable.orderedGroupJoin = function _orderedGroupJoin(outer, inner, projector, comparer, collection) {
    return this.queryableGroupJoin(outer, inner, projector, comparer, collection);
};

orderedQueryable.orderedExcept = function _orderedExcept(comparer, collection) {
    return this.queryableExcept(comparer, collection);
};

orderedQueryable.orderedIntersect = function _orderedIntersect(comparer, collection) {
    return this.queryableIntersect(comparer, collection);
};

orderedQueryable.orderedUnion = function _orderedUnion(comparer, collection) {
    return this.queryableUnion(comparer, collection);
};

orderedQueryable.orderedZip = function _orderedZip(selector, collection) {
    return this.queryableZip(selector, collection);
};

orderedQueryable.orderedConcat = function _orderedConcat(collection) {
    return this.queryableConcat(collection);
};

orderedQueryable.orderedWhere = function _orderedWhere(predicate) {
    return this.queryableWhere(predicate);
};

orderedQueryable.orderedDistinct = function _orderedDistinct(comparer) {
    return this.queryableDistinct(comparer);
};

orderedQueryable.orderedTake = function _orderedTake(amt = 1) {
    return this.queryableTake(amt);
};

orderedQueryable.orderedTakeWhile = function _orderedTakeWhile(predicate) {
    return this.queryableTakeWhile(predicate);
};

orderedQueryable.orderedAny = function _orderedAny(predicate) {
    return this.queryableAny(predicate);
};

orderedQueryable.orderedAll = function _orderedAll(predicate) {
    return this.queryableAll(predicate);
};

orderedQueryable.orderedFirst = function _orderedFirst(predicate) {
    return this.queryableFirst(predicate);
};

orderedQueryable.orderedLast = function _orderedLast(predicate) {
    return this.queryableLast(predicate);
};

orderedQueryable.orderedToArray = function _orderedToArray() {
    return this.queryableToArray();
};

orderedQueryable.orderedToSet = function _orderedToSet() {
    return this.queryableToSet();
};

orderedQueryable.orderedReverse = function _orderedReverse() {
    return this.queryableReverse();
};

exports.orderedQueryable = orderedQueryable;

},{"./queryable":29}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNewOrderedQueryableDelegator = exports.createNewQueryableDelegator = undefined;

var _queryable = require('./queryable');

var _orderedQueryable = require('./orderedQueryable');

var _projectionFunctions = require('../projection/projectionFunctions');

var _helpers = require('../helpers');

//import { filteredQueryable } from './filteredQueryable';
//import { filterAppend } from '../limitation/limitationFunctions';

function createNewQueryableDelegator(source, iterator) {
    var obj = Object.create(_queryable.queryable);
    obj.dataComputed = false;
    obj.source = source;
    if (iterator && _helpers.generatorProto.isPrototypeOf(iterator)) obj[Symbol.iterator] = iterator;
    //TODO: may not need to set a default iterator here... if the iterator value is passed in, then
    //TODO: set it, otherwise, don't shadow the queryable's iterator and just let it yield each item
    //TODO: of the source
    //obj[Symbol.iterator] = iterator ? iterator : queryableIterator(source);

    /*obj.select = function _select(fields) {
        return this.queryableSelect(fields);
    };*/
    /*obj.selectMany = function _selectMany(selector, resSelector) {
        return this.queryableSelectMany(selector, resSelector);
    };*/
    obj.from = function _from(source) {
        return this.queryableFrom(source);
    };
    obj.map = function _map(mapFunc) {
        return this.queryableMap(mapFunc);
    };
    obj.where = function _where(predicate) {
        return this.queryableWhere(predicate);
    };
    obj.concat = function _concat(collection) {
        return this.queryableConcat(collection);
    };
    obj.except = function _except(collection, comparer = _helpers.defaultEqualityComparer) {
        return this.queryableExcept(collection, comparer);
    };
    obj.groupJoin = function _groupJoin(inner, outerSelector, innerSelector, projector, comparer = _helpers.defaultEqualityComparer) {
        return this.queryableGroupJoin(inner, outerSelector, innerSelector, projector, comparer);
    };
    obj.intersect = function _intersect(collection, comparer = _helpers.defaultEqualityComparer) {
        return this.queryableIntersect(collection, comparer);
    };
    obj.join = function _join(inner, outerSelector, innerSelector, projector, comparer = _helpers.defaultEqualityComparer) {
        return this.queryableJoin(inner, outerSelector, innerSelector, projector, comparer);
    };
    obj.union = function _union(collection, comparer = _helpers.defaultEqualityComparer) {
        return this.queryableUnion(collection, comparer);
    };
    obj.zip = function _zip(selector, collection) {
        return this.queryableZip(selector, collection);
    };
    //TODO: see if setting up a default value for the group/order comparer is a necessary thing
    obj.groupBy = function _groupBy(keySelector, comparer) {
        return this.queryableGroupBy(keySelector, comparer);
    };
    obj.groupByDescending = function _groupByDescending(keySelector, comparer) {
        return this.queryableGroupByDescending(keySelector, comparer);
    };
    obj.orderBy = function _orderBy(keySelector, comparer) {
        return this.queryableOrderBy(keySelector, comparer);
    };
    obj.orderByDescending = function _orderByDescending(keySelector, comparer) {
        return this.queryableOrderByDescending(keySelector, comparer);
    };
    obj.distinct = function _distinct(comparer = _helpers.defaultEqualityComparer) {
        return this.queryableDistinct(comparer);
    };
    obj.flatten = function _flatten() {
        return this.queryableFlatten();
    };
    obj.flattenDeep = function _flattenDeep() {
        return this.queryableFlattenDeep();
    };
    obj._getData = function _getData() {
        return this._getData();
    };
    obj.take = function _take(amt = 1) {
        return this.queryableTake(amt);
    };
    obj.takeWhile = function _takeWhile(predicate) {
        return this.queryableTakeWhile(predicate);
    };
    obj.any = function _any(predicate = _helpers.defaultPredicate) {
        return this.queryableAny(predicate);
    };
    obj.all = function _all(predicate = _helpers.defaultPredicate) {
        return this.queryableAll(predicate);
    };
    obj.first = function _first(predicate) {
        return this.queryableFirst(predicate);
    };
    obj.last = function _last(predicate) {
        return this.queryableLast(predicate);
    };
    return addGetter(obj);
}

/*
function createNewFilteredQueryableDelegator(data, funcs, filterExpression) {
    if (!expressionManager.isPrototypeOf(filterExpression)) return;

    var obj = Object.create(filteredQueryable);
    obj.source = data;
    obj._evaluatedData = null;
    obj._dataComputed = false;
    obj._pipeline = funcs ? ifElse(not(isArray), wrap, identity, funcs) : [];
    obj._currentPipelineIndex = 0;
    obj._currentDataIndex = 0;

    obj.select = function _select(fields) {
        return this.filteredSelect(fields);
    };
    obj.where = function _where(field, operator, value) {
        return this.filteredWhere(field, operator, value);
    };
    obj.join = function _join(outer, inner, projector, comparer, collection) {
        return this.filteredJoin(outer, inner, projector, comparer, collection);
    };
    obj.union = function _union(comparer, collection) {
        return this.filteredUnion(comparer, collection);
    };
    obj.zip = function _zip() {
        return this.filteredZip();
    };
    obj.except = function _except(collection, comparer) {
        return this.filteredExcept(collection, comparer);
    };
    obj.intersect = function _intersect(comparer, collection) {
        return this.filteredIntersect(comparer, collection);
    };
    obj.groupBy = function _groupBy(fields, sl) {
        return this.filteredGroupBy(fields, sl);
    };
    obj.distinct = function _distinct(fields) {
        return this.filteredDistinct(fields);
    };
    obj.flatten = function _flatten() {
        return this.filteredFlatten();
    };
    obj.flattenDeep = function _flattenDeep() {
        return this.filteredFlattenDeep();
    };
    obj._getData = function _getData() {
        return this._getData();
    };
    obj.take = function _take(amt = 1) {
        return this.filteredTake(amt);
    };
    obj.takeWhile = function _takeWhile(predicate) {
        return this.filteredTakeWhile(predicate);
    };
    obj.any = function _any(predicate) {
        return this.filteredAny(predicate);
    };
    obj.all = function _all(predicate) {
        return this.filteredAll(predicate);
    };
    obj.first = function _first(predicate) {
        return this.filteredFirst(predicate);
    };
    obj.last = function _last(predicate) {
        return this.filteredLast(predicate);
    };

    obj.and = filterAppend(filterExpression, 'and');
    obj.or = filterAppend(filterExpression, 'or');
    obj.nand = filterAppend(filterExpression, 'nand');
    obj.nor = filterAppend(filterExpression, 'nor');
    obj.xand = filterAppend(filterExpression, 'xand');
    obj.xor = filterAppend(filterExpression, 'xor');

    return addGetter(obj);
}
*/

function createNewOrderedQueryableDelegator(source, iterator, sortObj) {
    var obj = Object.create(_orderedQueryable.orderedQueryable);
    obj.source = source;
    obj.dataComputed = false;
    obj._appliedSorts = sortObj;
    if (iterator && _helpers.generatorProto.isPrototypeOf(iterator)) obj[Symbol.iterator] = iterator;

    obj.from = function _from(source) {
        return this.from(source);
    };
    obj.map = function _map(mapFunc) {
        return this.orderedMap(mapFunc);
    };
    obj.where = function _where(predicate) {
        return this.orderedWhere(predicate);
    };
    obj.concat = function _concat(collection) {
        return this.orderedConcat(collection);
    };
    obj.join = function _join(inner, outerSelector, innerSelector, projector, comparer = _helpers.defaultEqualityComparer) {
        return this.orderedJoin(inner, outerSelector, innerSelector, projector, comparer);
    };
    obj.union = function _union(collection, comparer = _helpers.defaultEqualityComparer) {
        return this.orderedUnion(collection, comparer);
    };
    obj.zip = function _zip(selector, collection) {
        return this.orderedZip(selector, collection);
    };
    obj.except = function _except(collection, comparer = _helpers.defaultEqualityComparer) {
        return this.orderedExcept(collection, comparer);
    };
    obj.intersect = function _intersect(collection, comparer = _helpers.defaultEqualityComparer) {
        return this.orderedIntersect(collection, comparer);
    };
    obj.distinct = function _distinct(comparer = _helpers.defaultEqualityComparer) {
        return this.orderedDistinct(comparer);
    };
    obj._getData = function _getData() {
        return this._getData();
    };
    obj.take = function _take(amt = 1) {
        return this.orderedTake(amt);
    };
    obj.takeWhile = function _takeWhile(predicate) {
        return this.orderedTakeWhile(predicate);
    };
    obj.any = function _any(predicate = _helpers.defaultPredicate) {
        return this.orderedAny(predicate);
    };
    obj.all = function _all(predicate = _helpers.defaultPredicate) {
        return this.orderedAll(predicate);
    };
    obj.first = function _first(predicate) {
        return this.orderedFirst(predicate);
    };
    obj.last = function _last(predicate) {
        return this.orderedLast(predicate);
    };

    //Shadow the orderBy/orderByDescending function of the delegate so that if another
    //orderBy/orderByDescending function is immediately chained to an orderedQueryable
    //delegator object, it will treat it as a thenBy/thenByDescending call respectively.
    //TODO: These could also be treated as no-ops, or a deliberate re-ordering of the
    //TODO: source; I feel the latter would be an odd thing do to, so it might not
    //TODO: make sense to treat it that way.

    //TODO: Rather than shadowing, I could make the queryable's orderBy/orderByDescending
    //TODO: functions check the context object's prototype; if it finds that the
    //TODO: orderedQueryable is in the context's prototype chain, then it could treat
    //TODO: the function call differently
    obj.orderBy = function _orderBy(keySelector, comparer) {
        return this.thenBy(keySelector, comparer);
    };

    obj.orderByDescending = function _orderByDescending(keySelector, comparer) {
        return this.thenByDescending(keySelector, comparer);
    };

    obj.thenBy = function _thenBy(keySelector, comparer) {
        var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'asc' });
        return createNewOrderedQueryableDelegator(this.source, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
    };

    obj.thenByDescending = function thenByDescending(keySelector, comparer) {
        var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'desc' });
        return createNewOrderedQueryableDelegator(this.source, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
    };

    return addGetter(obj);
}

function addGetter(obj) {
    return Object.defineProperty(obj, 'data', {
        get: function _data() {
            //TODO: not sure if I plan on 'saving' the eval-ed data of a queryable object, and if I do, it'll take a different
            //TODO: form that what is currently here; for now I am going to leave the check for pre-eval-ed data in place
            if (!this.dataComputed) {
                //TODO: is this valid for an object that has an iterator? Seems like it should work...
                var res = Array.from(this);
                this.dataComputed = true;
                this.evaluatedData = res;
                return res;
            }
            return this.evaluatedData;
        }
    });
}

exports.createNewQueryableDelegator = createNewQueryableDelegator;
exports.createNewOrderedQueryableDelegator = createNewOrderedQueryableDelegator;

},{"../helpers":15,"../projection/projectionFunctions":25,"./orderedQueryable":27,"./queryable":29}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.queryable = undefined;

var _collationFunctions = require('../collation/collationFunctions');

var _evaluationFunctions = require('../evaluation/evaluationFunctions');

var _limitationFunctions = require('../limitation/limitationFunctions');

var _projectionFunctions = require('../projection/projectionFunctions');

var _queryObjectCreators = require('./queryObjectCreators');

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

//TODO: Not sure if this has been done yet or not, but need a way to create new query/query-type object without
//TODO: needing to first evaluate the data by pumping it through the pipeline first; rather creating a new
//TODO: query/query-type object would be better served by passing all the unprocessed data;

/**
 * Primary object to which filteredQueryables and orderedQueryables, as well as the objects passed to consumers, all delegate.
 * @type {{
 * queryableFrom: queryable._queryableFrom,
 * queryableMap: * queryable._queryableMap,
 * queryableGroupBy: * queryable._groupBy,
 * queryableGroupByDescending: * queryable._groupByDescending,
 * queryableOrderBy: * queryable._orderBy,
 * queryableOrderByDescending: * queryable._orderByDescending,
 * queryableFlatten: * queryable._flatten,
 * queryableFlattenDeep: * queryable._flattenDeep,
 * queryableConcat: * queryable._concat,
 * queryableExcept: * queryable._except,
 * queryableGroupJoin: * queryable._groupJoin,
 * queryableIntersect: * queryable._intersect,
 * queryableJoin: * queryable._join,
 * queryableUnion: * queryable._union,
 * queryableZip: * queryable._zip,
 * queryableWhere: * queryable._where,
 * queryableDistinct: * queryable._distinct,
 * queryableTake: * queryable._take,
 * queryableTakeWhile: * queryable.takeWhile,
 * queryableAny: queryable._any,
 * queryableAll: queryable._all,
 * queryableFirst: * queryable._first,
 * queryableLast: * queryable._last,
 * queryableToArray: * queryable._toArray,
 * queryableToSet: * queryable._toSet,
  *queryableReverse: * queryable._reverse,
  * [Symbol.iterator]: * queryable._iterator
  * }}
 */
var queryable = {
    /**
     * Projects each element of a sequence into a new form.
     * @param selector
     * @param context
     * @returns {Object}
     */
    /*queryableSelect: function _select(selector, context) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: selectThunk(selector, context), functionType: functionTypes.atomic }]));
    },*/

    /**
     * Projects each element of a sequence to an array and flattens the resulting sequences into one sequence.
     * @method selectMany
     * @type {function}
     * @param {function} selector - (Required) A transform function to apply to each element.
     * @param resSelector
     * @returns {Array} - The array of type of the elements of the sequence returned by selector.
     */
    /*queryableSelectMany: function _selectMany(selector, resSelector) {
        return createNewQueryableDelegator(this.source, this._pipeline.concat([{ fn: selectManyThunk(selector, resSelector), functionType: functionTypes.atomic }]));
    },*/

    //TODO: 1) See about initializing the queryable object with the _evaluatedData and _dataComputed
    //TODO:    properties upfront and making then non-enumerable.
    //TODO: 2) See if, via closure, I can bypass the need for getters/setters for properties that can
    //TODO:    ultimately be read and written to directly with a getter/setter property that maintains
    //TODO:    its own internal state - this would probably need to be done via Object.defineProperty
    //TODO:    as the closure would have to be shared amongst both the getter and setter
    /**
     * Getter for underlying _evaluatedData field; Holds an array of data
     * after enumerating the queryable delegator instance's source
     * @returns {*}
     */
    get evaluatedData() {
        return this._evaluatedData;
    },

    /**
     * Setter for underlying _evaluatedData field; returns either an
     * array if the queryable delegator instance's source has been
     * enumerated, or undefined
     * @param val
     */
    set evaluatedData(val) {
        this._evaluatedData = val;
    },

    /**
     * Getter for underlying _dataComputed field; returns true if
     * the queryable delegator instance's source has been enumerated
     * and false if not
     * @returns {*}
     */
    get dataComputed() {
        return this._dataComputed;
    },

    /**
     * Setter for underlying _dataComputed field
     * @param val
     */
    set dataComputed(val) {
        this._dataComputed = val;
    },

    /**
     * Creates a new queryable delegator object from whatever source value is provided.
     * @param {*} source - The source argument can be any JavaScript value. It will default
     * to an empty array if 'undefined' is passed. If the source argument is a generator,
     * an array, or another queryable, the function will accept it as is; if the source
     * argument has a [Symbol.iterator] definition, it will call Array.from on the source
     * before creating a new delegator, otherwise it will wrap the source argument in
     * as array.
     * @returns { Object } Returns a new queryable delegator object with its source set
     * to the value of the provided source argument
     */
    queryableFrom: function _queryableFrom(source = []) {
        //... if the source is a generator, an array, or another queryable, accept it as is...
        if (_helpers.generatorProto.isPrototypeOf(source) || (0, _functionalHelpers.isArray)(source) || queryable.isPrototypeOf(source)) return (0, _queryObjectCreators.createNewQueryableDelegator)(source);
        //... otherwise, turn the source into an array before creating a new queryable delegator object;
        //if it has an iterator, use Array.from, else wrap the source arg in an array...
        return (0, _queryObjectCreators.createNewQueryableDelegator)(null !== source && source[Symbol.iterator] ? Array.from(source) : (0, _functionalHelpers.wrap)(source));
    },

    /**
     *
     * @param mapFunc
     * @returns {*}
     */
    queryableMap: function _queryableMap(mapFunc) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.map)(this, mapFunc));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    queryableGroupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.groupBy)(this, groupObj));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    queryableGroupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.groupBy)(this, groupObj));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    queryableOrderBy: function _orderBy(keySelector, comparer) {
        var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
        return (0, _queryObjectCreators.createNewOrderedQueryableDelegator)(this, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    queryableOrderByDescending: function _orderByDescending(keySelector, comparer) {
        var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
        return (0, _queryObjectCreators.createNewOrderedQueryableDelegator)(this, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
    },

    /**
     *@type {function}
     */
    queryableFlatten: function _flatten() {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.flatten)(this));
    },

    /**
     *@type {function}
     */
    queryableFlattenDeep: function _flattenDeep() {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.deepFlatten)(this));
    },

    /**
     *
     * @param collection
     * @returns {*}
     */
    queryableConcat: function _concat(collection) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.concat)(this, collection));
    },

    /**
     *
     * @param collection
     * @param comparer
     * @returns {*}
     */
    queryableExcept: function _except(collection, comparer) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.except)(this, collection, comparer));
    },

    /**
     *
     * @param inner
     * @param outerSelector
     * @param innerSelector
     * @param projector
     * @param comparer
     * @returns {*}
     */
    queryableGroupJoin: function _groupJoin(inner, outerSelector, innerSelector, projector, comparer) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.groupJoin)(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     *
     * @param collection
     * @param comparer
     * @returns {*}
     */
    queryableIntersect: function _intersect(collection, comparer) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.intersect)(this, collection, comparer));
    },

    /**
     *
     * @param inner
     * @param outerSelector
     * @param innerSelector
     * @param projector
     * @param comparer
     * @returns {*}
     */
    queryableJoin: function _join(inner, outerSelector, innerSelector, projector, comparer) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.join)(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     *
     * @param collection
     * @param comparer
     * @returns {*}
     */
    queryableUnion: function _union(collection, comparer) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.union)(this, collection, comparer));
    },

    /**
     *
     * @param selector
     * @param collection
     * @returns {*}
     */
    queryableZip: function _zip(selector, collection) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.zip)(this, selector, collection));
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    queryableWhere: function _where(predicate) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _limitationFunctions.where)(this, predicate));
        /*var filterExpression = expressionManager.isPrototypeOf(field) ? field : Object.create(expressionManager).createExpression(field, operator, value);
        return createNewFilteredQueryableDelegator(this.source, this._pipeline.concat([{ fn: filterDataWrapper(filterExpression),
            functionType: functionTypes.atomic, functionWrapper: basicAtomicFunctionWrapper }]), filterExpression);*/
    },

    /**
     *
     * @param comparer
     * @returns {*}
     */
    queryableDistinct: function _distinct(comparer) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _limitationFunctions.distinct)(this, comparer));
    },

    /**
     *
     * @param amt
     * @returns {Array}
     */
    queryableTake: function _take(amt = 1) {
        //TODO: If I decide to 'save' not just a fully evaluated 'source', but also any data from a partially evaluated
        //TODO: 'source', then I'll probably have to re-think my strategy of wrapping each 'method's' iterator with
        //TODO: the standard queryable iterator as it may not work as needed.
        //TODO:
        //TODO: I'll also have to change this 'method' as it should take as much of the pre-evaluated date as possible
        //TODO: before evaluating any remaining data the it needs from the source.
        if (!amt) return;
        if (!this._dataComputed) {
            var res = [],
                idx = 0;

            for (let item of this) {
                if (idx < amt) res = res.concat(item);else break;
                ++idx;
            }
            return res;
        }
        return this.evaluatedData.slice(0, amt);
    },

    /**
     *
     * @param predicate
     * @returns {Array}
     */
    queryableTakeWhile: function takeWhile(predicate) {
        var res = [],
            source = this.dataComputed ? this.evaluatedData : this;

        for (let item of source) {
            if (predicate(item)) res = res.concat(item);else {
                return res;
            }
        }
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    queryableAny: function _any(predicate) {
        return (0, _evaluationFunctions.any)(this, predicate);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    queryableAll: function _all(predicate) {
        return (0, _evaluationFunctions.all)(this, predicate);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    queryableFirst: function _first(predicate) {
        return (0, _evaluationFunctions.first)(this, predicate);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    queryableLast: function _last(predicate) {
        return (0, _evaluationFunctions.last)(this, predicate);
    },

    /**
     *
     * @returns {Array}
     */
    queryableToArray: function _toArray() {
        return Array.from(this);
    },

    /**
     *
     * @returns {Set}
     */
    queryableToSet: function _toSet() {
        return new Set(this);
    },

    /**
     *
     * @returns {Array.<*>}
     */
    queryableReverse: function _reverse() {
        return Array.from(this).reverse();
    },

    /**
     *
     */
    [Symbol.iterator]: function* _iterator() {
        for (let item of this.source) yield item;
    }
};

/*
function createEvaledDateProperty(obj) {
    var data = null;
    Object.defineProperty(
        obj,
        'evaledData', {
            get: function _getEvaledData() {
                return data;
            },
            set: function _setEvaledData(val) {
                data = val;
            }
        }
    );
}
*/

exports.queryable = queryable;

},{"../collation/collationFunctions":1,"../evaluation/evaluationFunctions":11,"../functionalHelpers":14,"../helpers":15,"../limitation/limitationFunctions":18,"../projection/projectionFunctions":25,"./queryObjectCreators":28}]},{},[16])

//# sourceMappingURL=index.js.map
