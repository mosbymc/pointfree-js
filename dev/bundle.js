(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function addFront(source, enumerable) {
    return function* addFront() {
        for (let item of enumerable) {
            if (undefined !== item) yield item;
        }

        for (let item of source) {
            if (undefined !== item) yield item;
        }
    };
}

exports.addFront = addFront;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zip = exports.union = exports.join = exports.intersect = exports.groupJoin = exports.except = exports.concat = exports.addFront = undefined;

var _addFront = require('./addFront');

var _concat = require('./concat');

var _except = require('./except');

var _groupJoin = require('./groupJoin');

var _intersect = require('./intersect');

var _join = require('./join');

var _union = require('./union');

var _zip = require('./zip');

exports.addFront = _addFront.addFront;
exports.concat = _concat.concat;
exports.except = _except.except;
exports.groupJoin = _groupJoin.groupJoin;
exports.intersect = _intersect.intersect;
exports.join = _join.join;
exports.union = _union.union;
exports.zip = _zip.zip;

},{"./addFront":1,"./concat":3,"./except":4,"./groupJoin":5,"./intersect":6,"./join":7,"./union":8,"./zip":9}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function concat(source, enumerable) {
    return function* concatIterator() {
        for (let item of source) {
            if (undefined !== item) yield item;
        }

        for (let item of enumerable) {
            if (undefined !== item) yield item;
        }
    };
}

exports.concat = concat;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.except = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function except(source, enumerable, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;

    return function* exceptIterator() {
        var res;
        for (let item of source) {
            enumerable = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, enumerable);
            res = !enumerable.some(function _comparer(it) {
                return comparer(item, it);
            });
            if (res) yield item;
        }
    };
}

exports.except = except;

},{"../functionalHelpers":18,"../helpers":19}],5:[function(require,module,exports){
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
            var innerRes = innerSelector(innerItem);
            var matchingGroup = innerGroups.find(_findInnerGroup);

            if (!matchingGroup) matchingGroup = { key: innerRes, items: [innerItem] };
            innerGroups[innerGroups.length] = matchingGroup;
        }

        for (var outerItem of outer) {
            var innerMatch = innerGroups.find(_compareByKeys);
            let res = projector(outerItem, undefined === innerMatch ? [] : innerMatch.items);
            if (undefined !== res) yield res;
        }

        function _findInnerGroup(grp) {
            return comparer(grp.key, innerRes);
        }

        function _compareByKeys(innerItem) {
            return comparer(outerSelector(outerItem), innerItem.key);
        }
    };
}

exports.groupJoin = groupJoin;

},{"../helpers":19}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.intersect = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function intersect(source, enumerable, comparer) {
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
        enumerable = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, enumerable);
        for (let item of source) {
            if (undefined !== item && enumerable.some(function _checkEquivalency(it) {
                return comparer(item, it);
            })) {
                yield item;
            }
        }
    };
}

exports.intersect = intersect;

},{"../functionalHelpers":18,"../helpers":19}],7:[function(require,module,exports){
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
                if (comparer(outerSelector(outerItem), innerSelector(innerItem))) {
                    let res = projector(outerItem, innerItem);
                    if (undefined !== res) yield res;
                }
            }
        }
    };
}

exports.join = join;

},{"../functionalHelpers":18,"../helpers":19}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.union = undefined;

var _helpers = require('../helpers');

function union(source, enumerable, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;
    var havePreviouslyViewed = (0, _helpers.memoizer)(comparer);

    return function* unionIterator() {
        var res;
        for (let item of source) {
            res = havePreviouslyViewed(item);
            if (!res) yield item;
        }

        for (let item of enumerable) {
            res = havePreviouslyViewed(item);
            if (!res) yield item;
        }
    };
}

exports.union = union;

},{"../helpers":19}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.zip = undefined;

var _functionalHelpers = require('../functionalHelpers');

function zip(source, enumerable, selector) {
    return function* zipIterator() {
        var res,
            idx = 0;
        enumerable = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, enumerable);

        if (enumerable.length < 1) return [];

        for (let item of source) {
            if (idx > enumerable.length) return;
            res = selector(item, enumerable[idx]);
            if (undefined !== res) yield res;
            ++idx;
        }
    };
}

exports.zip = zip;

},{"../functionalHelpers":18}],10:[function(require,module,exports){
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

},{"../helpers":19}],11:[function(require,module,exports){
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

},{"../helpers":19}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.contains = undefined;

var _functionalHelpers = require('../functionalHelpers');

function contains(source, val, comparer) {
    source = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, source);
    if (undefined === comparer) return source.includes(val);
    return source.some(function _checkEquality(item) {
        return comparer(item, val);
    });
} //TODO: see if there is any real performance increase by just using .includes when a comparer hasn't been passed
//import { defaultEqualityComparer } from '../helpers';
exports.contains = contains;

},{"../functionalHelpers":18}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function count(source, predicate) {
    if (undefined === predicate) return Array.from(source).length;
    return Array.from(source).filter(function filterItems(item) {
        return predicate(item);
    }).length;
}

exports.count = count;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.count = exports.last = exports.fold = exports.first = exports.contains = exports.any = exports.all = undefined;

var _all = require('./all');

var _any = require('./any');

var _contains = require('./contains');

var _first = require('./first');

var _fold = require('./fold');

var _last = require('./last');

var _count = require('./count');

exports.all = _all.all;
exports.any = _any.any;
exports.contains = _contains.contains;
exports.first = _first.first;
exports.fold = _fold.fold;
exports.last = _last.last;
exports.count = _count.count;

},{"./all":10,"./any":11,"./contains":12,"./count":13,"./first":15,"./fold":16,"./last":17}],15:[function(require,module,exports){
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

},{"../helpers":19}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function fold(source, fn, initial = 0) {
    var data = Array.from(source);
    return data.reduce(fn, initial);
}

exports.fold = fold;

},{}],17:[function(require,module,exports){
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

},{"../helpers":19}],18:[function(require,module,exports){
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
    if (!fn.length || 1 === fn.length) return fn;
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

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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

//TODO: this will have to be changed as the false value could be a legit value for a collection...
//TODO:... I'm thinking reusing the 'flag' object to indicate the end of the list for the .next functions
//TODO: should be reusable here to indicate a 'false' value
function memoizer(comparer) {
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

exports.javaScriptTypes = javaScriptTypes;
exports.comparisons = comparisons;
exports.dataTypes = dataTypes;
exports.defaultEqualityComparer = defaultEqualityComparer;
exports.defaultGreaterThanComparer = defaultGreaterThanComparer;
exports.defaultPredicate = defaultPredicate;
exports.memoizer = memoizer;
exports.cloneData = cloneData;
exports.cloneArray = cloneArray;
exports.generatorProto = generatorProto;

},{}],20:[function(require,module,exports){
'use strict';

var _queryObjectCreators = require('./queryObjects/queryObjectCreators');

var _queryable = require('./queryObjects/queryable');

window.queryable = _queryable.queryable || {};

},{"./queryObjects/queryObjectCreators":33,"./queryObjects/queryable":34}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.distinct = undefined;

var _helpers = require('../helpers');

function distinct(source, comparer = _helpers.defaultEqualityComparer) {
    var havePreviouslyViewed = (0, _helpers.memoizer)(comparer);

    return function* distinctIterator() {
        for (let item of source) {
            if (!havePreviouslyViewed(item)) yield item;
        }
    };
}

exports.distinct = distinct;

},{"../helpers":19}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.where = exports.ofType = exports.distinct = undefined;

var _distinct = require('./distinct');

var _ofType = require('./ofType');

var _where = require('./where');

exports.distinct = _distinct.distinct;
exports.ofType = _ofType.ofType;
exports.where = _where.where;

},{"./distinct":21,"./ofType":23,"./where":24}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ofType = undefined;

var _helpers = require('../helpers');

function ofType(source, type) {
    return function* ofTypeIterator() {
        function _checkTypeKeys(key) {
            return key in objItem;
        }
        function _checkItemKeys(key) {
            return key in type;
        }

        if (type in _helpers.javaScriptTypes) {
            for (let item of source) {
                if (_helpers.javaScriptTypes[type] === typeof item) yield item;
            }
        } else {
            if (typeof type === _helpers.javaScriptTypes.function) {
                for (let item of source) {
                    if (item === type) yield item;
                }
            } else if (null === type) {
                for (let item of source) {
                    if (type === item) yield item;
                }
            } else {
                for (var objItem of source) {
                    if (type.isPrototypeOf(objItem)) yield objItem;else if (_helpers.javaScriptTypes.object === typeof objItem && null !== objItem && Object.keys(type).every(_checkTypeKeys) && Object.keys(objItem).every(_checkItemKeys)) {
                        yield objItem;
                    }
                }
            }
        }
    };
}

exports.ofType = ofType;

},{"../helpers":19}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"../functionalHelpers":18}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deepMap = undefined;

var _functionalHelpers = require('../functionalHelpers');

function deepMap(source, fn) {
    return function* deepMapIterator() {
        var results = [];
        for (let item of source) {
            let res = recursiveMap(item);
            if (results.length) {
                results = results.concat(res);
                yield results.shift();
            } else if (undefined !== res) {
                if ((0, _functionalHelpers.isArray)(res)) {
                    yield res.shift();
                    results = results.concat(res);
                } else yield res;
            }
        }

        while (results.length) yield results.shift();

        function recursiveMap(item) {
            if ((0, _functionalHelpers.isArray)(item)) {
                var res = [];
                for (let it of item) {
                    res = res.concat(recursiveMap(it));
                }
                return res;
            }
            return fn(item);
        }
    };
}

exports.deepMap = deepMap;

},{"../functionalHelpers":18}],27:[function(require,module,exports){
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

},{"../functionalHelpers":18}],28:[function(require,module,exports){
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
    var sortedData = (0, _sortHelpers.sortData)(data, groupObject),
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

},{"../functionalHelpers":18,"./sortHelpers":32}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function map(source, fn) {
    return function* mapIterator() {
        for (let item of source) {
            let res = fn(item);
            if (undefined !== res) yield res;
        }
    };
}

exports.map = map;

},{}],30:[function(require,module,exports){
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
        var orderedData = (0, _sortHelpers.sortData)((0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, source), orderObject);
        for (let item of orderedData) {
            if (undefined !== item) yield item;
        }
    };
}

exports.orderBy = orderBy;

},{"../functionalHelpers":18,"./sortHelpers":32}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orderBy = exports.map = exports.groupBy = exports.flatten = exports.deepMap = exports.deepFlatten = undefined;

var _deepFlatten = require('./deepFlatten');

var _deepMap = require('./deepMap');

var _flatten = require('./flatten');

var _groupBy = require('./groupBy');

var _map = require('./map');

var _orderBy = require('./orderBy');

exports.deepFlatten = _deepFlatten.deepFlatten;
exports.deepMap = _deepMap.deepMap;
exports.flatten = _flatten.flatten;
exports.groupBy = _groupBy.groupBy;
exports.map = _map.map;
exports.orderBy = _orderBy.orderBy;

},{"./deepFlatten":25,"./deepMap":26,"./flatten":27,"./groupBy":28,"./map":29,"./orderBy":30}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sortData = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function sortData(data, sortObject) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
        let comparer = sort.direction === 'asc' ? sort.comparer : (0, _functionalHelpers.not)(sort.comparer);
        if (index === 0) sortedData = mergeSort(data, sort.keySelector, comparer);else {
            let sortedSubData = [],
                itemsToSort = [],
                prevKeySelector = sortObject[index - 1].keySelector;
            sortedData.forEach(function _sortData(item, idx) {
                //TODO: re-examine this logic; I think it is in reverse order
                if (!itemsToSort.length || (0, _helpers.defaultEqualityComparer)(prevKeySelector(itemsToSort[0]), prevKeySelector(item))) itemsToSort.push(item);else {
                    //TODO: see if there's a realistic way that length === 1 || 2 could be combined into one statement
                    if (itemsToSort.length === 1) sortedSubData = sortedSubData.concat(itemsToSort);else if (itemsToSort.length === 2) {
                        sortedSubData = comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1])) ? sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                    } else {
                        sortedSubData = sortedSubData.concat(mergeSort(itemsToSort, sort.keySelector, comparer));
                    }
                    itemsToSort.length = 0;
                    itemsToSort.push(item);
                }
                if (idx === sortedData.length - 1) {
                    sortedSubData = sortedSubData.concat(mergeSort(itemsToSort, sort.keySelector, comparer));
                }
            });
            sortedData = sortedSubData;
        }
    });
    return sortedData;
}

function mergeSort(data, keySelector, comparer) {
    if (data.length < 2) return data;
    var middle = parseInt(data.length / 2);
    return merge(mergeSort(data.slice(0, middle), keySelector, comparer), mergeSort(data.slice(middle), keySelector, comparer), keySelector, comparer);
}

function merge(left, right, keySelector, comparer) {
    if (!left.length) return right;
    if (!right.length) return left;

    if (comparer(keySelector(left[0]), keySelector(right[0]))) return [(0, _helpers.cloneData)(left[0])].concat(merge(left.slice(1, left.length), right, keySelector, comparer));
    return [(0, _helpers.cloneData)(right[0])].concat(merge(left, right.slice(1, right.length), keySelector, comparer));
}

exports.sortData = sortData;

},{"../functionalHelpers":18,"../helpers":19}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNewOrderedQueryableDelegator = exports.createNewQueryableDelegator = undefined;

var _queryable = require('./queryable');

var _helpers = require('../helpers');

//TODO: Consider making some sort of abstract object or something that has
//TODO: the .extend and .from functionality, but the queryable objects do
//TODO: not delegate to it. The problem here is that consumer-level objects
//TODO: are "seeing" .from and .extend, and can use them to create/extend
//TODO: queryables respectively. Those two properties can be set to "undefined"
//TODO: on the consumer-level objects, but the property names still show,
//TODO: and it doesn't stop them from using the delegated function as
//TODO: long as they reference the delegate.

//TODO: It seems like I should probably publicly expose a "queryable" object
//TODO: that only has .extend and .from functionality. The consumer-level
//TODO: objects don't delegate to the "queryable" object, but rather to
//TODO: hidden objects that are not publicly available. The .extend
//TODO: function would extend the "hidden" objects, not itself, and
//TODO: .from would return a new consumer-level object that delegates
//TODO: to one of the "hidden" objects.

function createNewQueryableDelegator(source, iterator) {
    var obj = Object.create(_queryable.internal_queryable);
    obj.dataComputed = false;
    obj.source = source;
    //if the iterator param has been passed and is a generator, set it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (iterator && _helpers.generatorProto.isPrototypeOf(iterator)) obj[Symbol.iterator] = iterator;

    return addGetter(obj);
}

function createNewOrderedQueryableDelegator(source, iterator, sortObj) {
    var obj = Object.create(_queryable.internal_orderedQueryable);
    obj.source = source;
    obj.dataComputed = false;
    //Need to maintain a list of all the sorts that have been applied; effectively,
    //the underlying sorting function will only be called a single time for
    //all sorts.
    obj._appliedSorts = sortObj;
    //if the iterator param has been passed and is a generator, set it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (iterator && _helpers.generatorProto.isPrototypeOf(iterator)) obj[Symbol.iterator] = iterator;

    return addGetter(obj);
}

function addGetter(obj) {
    return Object.defineProperty(obj, 'data', {
        get: function _data() {
            //TODO: not sure if I plan on 'saving' the eval-ed data of a queryable object, and if I do, it'll take a different
            //TODO: form that what is currently here; for now I am going to leave the check for pre-eval-ed data in place
            if (!this.dataComputed) {
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

},{"../helpers":19,"./queryable":34}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.queryable = exports.internal_orderedQueryable = exports.internal_queryable = exports.queryable_core = undefined;

var _collationFunctions = require('../collation/collationFunctions');

var _evaluationFunctions = require('../evaluation/evaluationFunctions');

var _limitationFunctions = require('../limitation/limitationFunctions');

var _projectionFunctions = require('../projection/projectionFunctions');

var _queryObjectCreators = require('./queryObjectCreators');

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

//TODO: need to determine a better way to "hide" queryable delegate prototype functionality. Browser's
//TODO: are wanting to display both functions on the delegate and on the prototype(s).

/**
 * Object that contains the core functionality; both the queryable and orderedQueryable
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @type {{
 * source,
 * source,
 * evaluatedData: *,
 * evaluatedData: *,
 * dataComputed: *,
 * dataComputed: *,
 * map: queryable_core._map,
 * groupBy: queryable_core._groupBy,
 * groupByDescending: queryable_core._groupByDescending,
 * flatten: queryable_core._flatten,
 * deepFlatten: queryable_core._deepFlatten,
 * deepMap: queryable_core._deepMap,
 * addFront: queryable_core._addFront,
 * concat: queryable_core._concat,
 * except: queryable_core._except,
 * groupJoin: queryable_core._groupJoin,
 * intersect: queryable_core._intersect,
 * join: queryable_core._join,
 * union: queryable_core._union,
 * zip: queryable_core._zip,
 * where: queryable_core._where,
 * ofType: queryable_core._ofType,
 * distinct: queryable_core._distinct,
 * take: queryable_core._take,
 * takeWhile: queryable_core._takeWhile,
 * skip: queryable_core._skip,
 * skipWhile: queryable_core._skipWhile,
 * any: queryable_core._any,
 * all: queryable_core._all,
 * contains: queryable_core._contains,
 * first: queryable_core._first,
 * fold: queryable_core._fold,
 * last: queryable_core._last,
 * count: queryable_core._count,
 * toArray: queryable_core._toArray,
 * toSet: queryable_core._toSet,
 * reverse: queryable_core._reverse,
 * [Symbol.iterator]: queryable_core._iterator
 * }}
 */
var queryable_core = {
    //Using getters for these properties because there's a chance the setting and/or getting
    //functionality could change; this will allow for a consistent interface while the
    //logic beneath changes

    /**
     * Getter for the underlying source object of the queryable
     * @returns {*}
     */
    get source() {
        return this._source;
    },

    /**
     * Setter for the underlying source object of the queryable
     * @param val
     */
    set source(val) {
        this._source = val;
    },

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
        this._dataComputed = true;
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
     *
     * @param mapFunc
     * @returns {*}
     */
    map: function _map(mapFunc) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.map)(this, mapFunc));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.groupBy)(this, groupObj));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.groupBy)(this, groupObj));
    },

    /**
     *@type {function}
     */
    flatten: function _flatten() {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.flatten)(this));
    },

    /**
     *@type {function}
     */
    deepFlatten: function _deepFlatten() {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.deepFlatten)(this));
    },

    /**
     *
     * @param fn
     * @returns {*}
     */
    deepMap: function _deepMap(fn) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.deepMap)(this, fn));
    },

    /**
     *
     * @param enumerable
     * @returns {*}
     */
    addFront: function _addFront(enumerable) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.addFront)(this, enumerable));
    },

    /**
     *
     * @param enumerable
     * @returns {*}
     */
    concat: function _concat(enumerable) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.concat)(this, enumerable));
    },

    /**
     *
     * @param collection
     * @param enumerable
     * @returns {*}
     */
    except: function _except(collection, enumerable) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.except)(this, collection, enumerable));
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
    groupJoin: function _groupJoin(inner, outerSelector, innerSelector, projector, comparer) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.groupJoin)(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     *
     * @param collection
     * @param enumerable
     * @returns {*}
     */
    intersect: function _intersect(collection, enumerable) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.intersect)(this, collection, enumerable));
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
    join: function _join(inner, outerSelector, innerSelector, projector, comparer) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.join)(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     *
     * @param collection
     * @param enumerable
     * @returns {*}
     */
    union: function _union(collection, enumerable) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.union)(this, collection, enumerable));
    },

    /**
     *
     * @param selector
     * @param enumerable
     * @returns {*}
     */
    zip: function _zip(selector, enumerable) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.zip)(this, selector, enumerable));
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    where: function _where(predicate) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _limitationFunctions.where)(this, predicate));
    },

    /**
     *
     * @param type
     * @returns {*}
     */
    ofType: function _ofType(type) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _limitationFunctions.ofType)(this, type));
    },

    /**
     *
     * @param comparer
     * @returns {*}
     */
    distinct: function _distinct(comparer) {
        return (0, _queryObjectCreators.createNewQueryableDelegator)(this, (0, _limitationFunctions.distinct)(this, comparer));
    },

    /**
     *
     * @param amt
     * @returns {Array}
     */
    take: function _take(amt) {
        //TODO: If I decide to 'save' not just a fully evaluated 'source', but also any data from a partially evaluated
        //TODO: 'source', then I'll probably have to re-think my strategy of wrapping each 'method's' iterator with
        //TODO: the standard queryable iterator as it may not work as needed.
        //TODO:
        //TODO: I'll also have to change this 'method' as it should take as much of the pre-evaluated data as possible
        //TODO: before evaluating any remaining data that it needs from the source.
        if (!amt) return [];
        if (!this.dataComputed) {
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
    takeWhile: function _takeWhile(predicate = _helpers.defaultPredicate) {
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
     * @param amt
     * @returns {*}
     */
    skip: function _skip(amt) {
        var source = this.dataComputed ? this.evaluatedData : this.source,
            idx = 0,
            res = [];

        for (let item of source) {
            if (idx >= amt) res = res.concat(item);
            ++idx;
        }
        return res;
    },

    /**
     *
     * @param predicate
     * @returns {Array}
     */
    skipWhile: function _skipWhile(predicate = _helpers.defaultPredicate) {
        var source = this.dataComputed ? this.evaluatedData : this.source,
            hasFailed = false,
            res = [];

        for (let item of source) {
            if (!hasFailed && !predicate(item)) hasFailed = true;
            if (hasFailed) res = res.concat(item);
        }
        return res;
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    any: function _any(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.any)(this, predicate);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    all: function _all(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.all)(this, predicate);
    },

    /**
     *
     * @param val
     * @param comparer
     * @returns {*}
     */
    contains: function _contains(val, comparer) {
        return (0, _evaluationFunctions.contains)(this, val, comparer);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    first: function _first(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.first)(this, predicate);
    },

    /**
     *
     * @param fn
     * @param initial
     * @returns {*}
     */
    fold: function _fold(fn, initial) {
        return (0, _evaluationFunctions.fold)(this, fn, initial);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    last: function _last(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.last)(this, predicate);
    },

    /**
     *
     * @returns {*}
     */
    count: function _count() {
        return (0, _evaluationFunctions.count)(this);
    },

    /**
     *
     * @returns {Array}
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     *
     * @returns {Set}
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     *
     * @returns {Array.<*>}
     */
    reverse: function _reverse() {
        return Array.from(this).reverse();
    },

    /**
     * Base iterator to which all queryable_core delegator objects
     * delegate to for iteration if for some reason an iterator wasn't
     * set on the delegator at the time of creation.
     */
    [Symbol.iterator]: function* _iterator() {
        var data = Array.from(this.source);
        for (let item of data) yield item;
    }
};

var internal_queryable = Object.create(queryable_core);

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_queryable.orderBy = function _orderBy(keySelector, comparer) {
    var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
    return (0, _queryObjectCreators.createNewOrderedQueryableDelegator)(this, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
};

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_queryable.orderByDescending = function _orderByDescending(keySelector, comparer) {
    var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
    return (0, _queryObjectCreators.createNewOrderedQueryableDelegator)(this, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
};

var internal_orderedQueryable = Object.create(queryable_core);

internal_orderedQueryable._appliedSort = [];

//In these two functions, feeding the call to "orderBy" with the .source property of the queryable delegate
//rather than the delegate itself, effectively excludes the previous call to the orderBy/orderByDescending
//since the iterator exists on the delegate, not on its source. Each subsequent call to thenBy/thenByDescending
//will continue to exclude the previous call's iterator... effectively what we're doing is ignoring all the
//prior calls made to orderBy/orderByDescending/thenBy/thenByDescending and calling it once but with an array
//of the the requested sorts.

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_orderedQueryable.thenBy = function _thenBy(keySelector, comparer) {
    var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'asc' });
    return (0, _queryObjectCreators.createNewOrderedQueryableDelegator)(this.source, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
};

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_orderedQueryable.thenByDescending = function thenByDescending(keySelector, comparer) {
    var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'desc' });
    return (0, _queryObjectCreators.createNewOrderedQueryableDelegator)(this.source, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
};

//TODO: consider added a function property to this object that can create a new consumer-level
//TODO: so that the queryable_core object can call that function for each deferred execution
//TODO: function rather than creating the consumer-level objects itself. This may to resolve
//TODO: the circular dependency that I am dealing with between queryable_core, queryObjectCreators
//TODO: function, and the internal_queryable/internal_orderedQueryable objects.
/**
 *
 * @type {{
 *      extend: queryable._extend,
 *      from: queryable._from
 * }}
 */
var queryable = {
    /**
     * Extension function that allows new functionality to be applied to
     * the queryable object
     * @param {string} propName - The name of the new queryable property; must be unique
     * @param {function} fn - A function that defines the new queryable functionality and
     * will be called when this new queryable property is invoked.
     *
     * NOTE: The fn parameter must be a non-generator function that takes one or more
     * arguments and returns a generator function that knows how to iterate the data
     * and yield out each item one at a time. The first argument must be the 'source'
     * argument of the function which will be what the returned generator must iterate
     * in order to retrieve the items it work work on. The function may work on all
     * the data as a single set, or it can iterate it's queryable source and apply the
     * functionality to a single item before yielding that item and calling for the next.
     * The source argument may be any iterable object, generally an array or another
     * queryable; the returned generator needs either turn the iterable into an array
     * using Array#from if all the data is needed up front, or iterate the source in
     * a for-of loop if each item is only needed one-at-a-time.
     */
    extend: function _extend(propName, fn) {
        if (!queryable_core[propName]) {
            queryable_core[propName] = function (...args) {
                return (0, _queryObjectCreators.createNewQueryableDelegator)(this, fn(this, ...args));
            };
        }
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
    from: function _from(source = []) {
        //... if the source is a generator, an array, or another queryable, accept it as is...
        if (_helpers.generatorProto.isPrototypeOf(source) || (0, _functionalHelpers.isArray)(source) || queryable_core.isPrototypeOf(source)) return (0, _queryObjectCreators.createNewQueryableDelegator)(source);
        //... otherwise, turn the source into an array before creating a new queryable delegator object;
        //if it has an iterator, use Array.from, else wrap the source arg in an array...
        return (0, _queryObjectCreators.createNewQueryableDelegator)(null !== source && source[Symbol.iterator] ? Array.from(source) : (0, _functionalHelpers.wrap)(source));
    }
};

exports.queryable_core = queryable_core;
exports.internal_queryable = internal_queryable;
exports.internal_orderedQueryable = internal_orderedQueryable;
exports.queryable = queryable;

},{"../collation/collationFunctions":2,"../evaluation/evaluationFunctions":14,"../functionalHelpers":18,"../helpers":19,"../limitation/limitationFunctions":22,"../projection/projectionFunctions":31,"./queryObjectCreators":33}]},{},[20])

//# sourceMappingURL=index.js.map
