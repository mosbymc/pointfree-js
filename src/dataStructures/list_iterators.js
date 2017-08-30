import { isArray, strictEquals, isObject, type } from '../functionalHelpers';
import { not, unfoldWith } from '../decorators';
import { when, ifElse } from '../combinators';
import { javaScriptTypes, sortDirection, cacher, typeNames } from '../helpers';
import { sortData } from './sort_util';

/** @module dataStructures/list_iterators */

var toArray = when(not(isArray), Array.from);

/**
 * @sig 
 * @description -
 * @param {Array|generator|monads.list_core} xs - some stuff
 * @param {Array|generator|monads.list_core} ys - some other stuff
 * @return {generator} - some other other stuff
 */
function prepend(xs, ys) {
    return function *addFront() {
        for (let y of ys) yield y;

        for (let x of xs) yield x;
    };
}

/**
 * @sig:
 * @description description
 * @param {Array|generator|monads.list_core} xs - x
 * @param {Array|generator|monads.list_core} yss - y
 * @param {number} argsCount - z
 * @return {generator} - a
 */
function concat(xs, yss, argsCount) {
    return function *concatIterator() {
        for (let x of xs) yield x;

        if (1 === argsCount) {
            let ys = yss[0];
            for (let y of ys) yield y;
        }
        else {
            for (let ys of yss) {
                for (let y of ys) yield y;
            }
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - x
 * @param {Array|generator|monads.list_core} ys - y
 * @param {function} comparer - z
 * @return {generator} - a
 */
function except(xs, ys, comparer = strictEquals) {
    ys = toArray(ys);
    return function *exceptIterator() {
        for (let x of xs) {
            if (!(ys.some(function _comparer(y) {
                    return comparer(x, y);
                }))) yield x;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {Array|generator|monads.list_core} ys - b
 * @param {function} xSelector - c
 * @param {function} ySelector - d
 * @param {function} projector - e
 * @param {function} listFactory - f
 * @param {function} comparer - g
 * @return {generator} - h
 */
function groupJoin(xs, ys, xSelector, ySelector, projector, listFactory, comparer = strictEquals) {
    return function *groupJoinIterator() {
        var groupObj = [{ keySelector: ySelector, comparer: comparer, direction: sortDirection.ascending }];
        var groupedY = nestLists(groupData(toArray(ys), groupObj), 0, null, listFactory);

        for (let x of xs) {
            let grp;
            for (let yGroup of groupedY) {
                if (comparer(xSelector(x), yGroup.key)) {
                    grp = yGroup;
                    break;
                }
            }

            yield projector(x, grp || listFactory([]));
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {Array|generator|monads.list_core} ys - b
 * @param {function} comparer - c
 * @return {generator} - d
 */
function intersect(xs, ys, comparer = strictEquals) {
    return function *intersectIterator() {
        ys = toArray(ys);
        for (let x of xs) {
            if (!strictEquals(javaScriptTypes.Undefined, x) && ys.some(function _checkEquivalency(it) {
                    return comparer(x, it);
                })) yield x;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {*} val - b
 * @return {generator} - c
 */
function intersperse(xs, val) {
    return function *intersperseIterator() {
        var it = xs[Symbol.iterator](),
            next = it.next();

        while (!next.done) {
            yield next.value;
            next = it.next();
            if (!next.done) yield val;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {Array|generator|monads.list_core} ys - b
 * @param {function} xSelector - c
 * @param {function} ySelector - d
 * @param {function} projector - e
 * @param {function} comparer - f
 * @return {generator} - g
 */
function join(xs, ys, xSelector, ySelector, projector, comparer = strictEquals) {
    return function *joinIterator() {
        ys = toArray(ys);
        for (let x of xs) {
            for (let y of ys) {
                if (comparer(xSelector(x), ySelector(y))) {
                    yield projector(x, y);
                }
            }
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {Array|generator|monads.list_core} ys - b
 * @param {function} comparer - c
 * @return {generator} - d
 */
function union(xs, ys, comparer = strictEquals) {
    return function *unionIterator() {
        var isInCache = cacher(comparer);
        for (let x of xs) {
            if (!isInCache(x)) yield x;
        }

        for (let y of toArray(ys)) {
            if (!isInCache(y)) yield y;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {Array|generator|monads.list_core} ys - b
 * @param {function} selector - c
 * @return {generator} - d
 */
function zip(xs, ys, selector) {
    return function *zipIterator() {
        var idx = 0;
        var yArr = toArray(ys);

        for (let x of xs) {
            if (idx >= yArr.length || !yArr.length) return;
            yield selector(x, yArr[idx]);
            ++idx;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} predicate - b
 * @return {boolean} - c
 */
function all(xs, predicate) {
    return strictEquals(javaScriptTypes.Function, type(predicate)) && toArray(xs).every(predicate);
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} predicate - b
 * @return {boolean} - c
 */
function any(xs, predicate) {
    return strictEquals(javaScriptTypes.Function, type(predicate)) ? toArray(xs).some(predicate) : 0 < toArray(xs).length;
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {*} val - b
 * @param {function} comparer - c
 * @return {*} - d
 */
function contains(xs, val, comparer) {
    //TODO: see if there is any real performance increase by just using .includes when a comparer hasn't been passed
    return strictEquals(javaScriptTypes.Undefined, type(comparer)) ? toArray(xs).includes(val) : toArray(xs).some((x) => comparer(x, val));
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {*} val - b
 * @param {function} comparer - c
 * @return {boolean} - d
 */
function binarySearch(xs, val, comparer) {
    return binarySearchRec(xs, 0, xs.length - 1, val, comparer);
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {number} left - b
 * @param {number} right - c
 * @param {*} val - d
 * @param {function} comparer - e
 * @return {boolean} - f
 */
function binarySearchRec(xs, left, right, val, comparer) {
    if (left > right) return false;
    var mid = Math.floor((left + right) / 2),
        res = comparer(val, xs[mid]);
    if (0 === res) return true;
    if (0 < res) return binarySearchRec(xs, mid + 1, right, val, comparer);
    return binarySearchRec(xs, left, mid - 1, val, comparer);
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} predicate - b
 * @return {Number} - c
 */
function count(xs, predicate) {
    return strictEquals(javaScriptTypes.Undefined, type(predicate)) ?
        toArray(xs).length : toArray(xs).filter(predicate).length;
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} predicate - b
 * @return {*} - c
 */
function first(xs, predicate) {
    return strictEquals(javaScriptTypes.Function, type(predicate)) ? toArray(xs).find(predicate) : toArray(xs)[0];
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} fn - b
 * @param {*} initial - c
 * @return {*} - d
 */
function foldLeft(xs, fn, initial = 0) {
    return toArray(xs).reduce(fn, initial);
}

/**
 * @sig
 * @description d
 * @param {Array|monads.list_core} arr - a
 * @param {function} op - b
 * @param {*} acc - c
 * @return {*} - d
 */
function foldRight(arr, op, acc) {
    var list = toArray(arr),
        len = list.length,
        res = acc || list[--len];
    while (0 < len) {
        res = op(list[--len], res, len, list);
    }
    return res;
}

/**
 * @sig
 * @description s
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} fn - b
 * @param {*} initial - c
 * @return {*} - d
 */
function reduceRight(xs, fn, initial) {
    return null == initial ? toArray(xs).reduceRight(fn) : toArray(xs).reduceRight(fn, initial);
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} predicate - b
 * @return {*} - c
 */
function last(xs, predicate) {
    if (strictEquals(javaScriptTypes.Function, type(predicate)))
        return toArray(xs).filter(predicate).slice(-1)[0];
    return toArray(xs).slice(-1)[0];
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} comparer - b
 * @return {generator} - c
 */
function distinct(xs, comparer = strictEquals) {
    var cached = cacher(comparer);

    return function *distinctIterator() {
        for (let x of xs) {
            if (!cached(x)) yield x;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {string} dataType - b
 * @return {generator} - c
 */
function ofType(xs, dataType) {
    return function *ofTypeIterator() {
        function _checkTypeKeys(key) {
            return key in objItem;
        }
        function _checkItemKeys(key) {
            return key in dataType;
        }

        if (dataType in typeNames) {
            for (let x of xs) {
                if (typeNames[dataType] === typeof x) yield x;
            }
        }
        else {
            if (strictEquals(javaScriptTypes.Function, type(dataType))) {
                for (let x of xs) {
                    if (x === dataType) yield x;
                }
            }
            else if (null === dataType) {
                for (let x of xs) {
                    if (dataType === x) yield x;
                }
            }
            else if (strictEquals(javaScriptTypes.Object, type(dataType)) && !isArray(dataType)) {
                for (var objItem of xs) {
                    if (dataType.isPrototypeOf(objItem))
                        yield objItem;
                    else if (strictEquals(javaScriptTypes.Object, type(objItem)) && null !== objItem &&
                        Object.keys(dataType).every(_checkTypeKeys) && Object.keys(objItem).every(_checkItemKeys)) {
                        yield objItem;
                    }
                }
            }
            else {
                for (let x of xs) {
                    yield x;
                }
            }
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function filter(xs, predicate) {
    return function *filterIterator() {
        for (let x of xs) {
            if (false !== predicate(x)) yield x;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {*} xs - a
 * @param {function} fn - b
 * @return {generator} - c
 */
function chain(xs, fn) {
    return function *flatMapIterator() {
        var res;
        for (let x of xs) {
            res = fn(x);
            yield Object.getPrototypeOf(xs).isPrototypeOf(res) ? res.value : res;
        }
    };
}

/*
 function flatMap1(source, fn) {
    return function *flatMap1Iterator() {
        var results = [];
        for (let item of source) {
            var res = fn(item);
            if (res.length) {
                results = results.concat(res);
                yield results.shift();
            }
            else if (undefined !== res) {
                if (isArray(res)) {
                    yield res.shift();
                    results = results.concat(res);
                }
            }
            else yield res;
        }

        while (results.length) yield results.shift();
    };
 }
 */

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @return {generator} - b
 */
function flatten(xs) {
    return function *flattenIterator() {
        var unyieldedData = [];

        for (let x of xs) {
            if (isArray(x)) unyieldedData = unyieldedData.concat(x);
            if (unyieldedData.length) yield unyieldedData.shift();
            else yield x;
        }

        while (unyieldedData.length) yield unyieldedData.shift();
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {object} groupObject - b
 * @param {function} queryableConstructor - c
 * @return {generator} - d
 */
function groupBy(xs, groupObject, queryableConstructor) {
    return function *groupByIterator() {
        //gather all data from the iterable before grouping
        var groupedData = nestLists(groupData(toArray(xs), groupObject), 0, null, queryableConstructor);
        for (let x of groupedData) yield x;
    };
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @param {number} depth - b
 * @param {string} key - c
 * @param {function} queryableConstructor - d
 * @return {Array} - e
 */
function nestLists(data, depth, key, queryableConstructor) {
    if (isArray(data)) {
        data = data.map(function _createLists(item) {
            if (null != item.key) return nestLists(item, depth + 1, item.key, queryableConstructor);
            return item;
        });
    }
    if (0 !== depth) {
        data = queryableConstructor(data, null, null, key);
    }
    return data;
}

/**
 * @sig
 * @description d
 * @param {*} xs - a
 * @param {object} groupObject - b
 * @return {Array} - c
 */
function groupData(xs, groupObject) {
    var sortedData = sortData(xs, groupObject),
        retData = [];
    sortedData.forEach(function _groupSortedData(item) {
        let grp = retData;
        groupObject.forEach(function _createGroupsByFields(group) {
            grp = findGroup(grp, group.keySelector(item));
        });
        grp.push(item);
    });

    return retData;
}

/**
 * @sig
 * @description d
 * @param {Array} arr - a
 * @param {string} field - b
 * @return {Array} - c
 */
function findGroup(arr, field) {
    var grp;
    if (arr.some(function _findGroup(group) {
            if (group.key === field) {
                grp = group;
                return true;
            }
        }))
        return grp;
    else {
        grp = [];
        grp.key = field;
        //objectSet(field, 'key', grp);
        arr.push(grp);
        return grp;
    }
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} fn - b
 * @return {generator} - c
 */
function map(xs, fn) {
    return function *mapIterator() {
        for (let x of xs) {
            let res = fn(x);
            if (!strictEquals(javaScriptTypes.Undefined, type(res))) yield res;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {Array} orderObject - b
 * @return {generator} - d
 */
function sortBy(xs, orderObject) {
    return function *orderByIterator() {
        //gather all data from the xs before sorting
        var x_s = sortData(toArray(xs), orderObject);
        for (let x of x_s) yield x;
    };
}

/**
 * @sig
 * @description d
 * @param {monads.list_core} xs - a
 * @param {monads.list_core} ys - b
 * @param {function} comparer - c
 * @return {boolean} - d
 */
function equals(xs, ys, comparer = strictEquals) {
    var x_s = xs.data,
        y_s = ys.data;

    return x_s.length === y_s.length &&
            x_s.every(function _checkEquality(x, idx) {
                return comparer(x, y_s[idx]);
            });
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function takeWhile(xs, predicate) {
    return function *takeWhileIterator() {
        for (let x of xs) {
            if (predicate(x)) yield x;
            else break;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function skipWhile(xs, predicate) {
    return function *skipWhileIterator() {
        var hasFailed = false;
        for (let x of xs) {
            if (!hasFailed) {
                if (!predicate(x)) {
                    hasFailed = true;
                    yield x;
                }
            }
            else yield x;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @return {generator} - b
 */
function reverse(xs) {
    return function *reverseIterator() {
        for (let x of toArray(xs).reverse()) yield x;
    };
}

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @param {number} count - b
 * @return {generator} - c
 */
function repeat(item, count) {
    return function *repeatIterator() {
        for (let i = 0; i < count; ++i) {
            yield item;
        }
    };
}

/**
 * @sig
 * @description d
 * @param {number} idx - a
 * @param {number} start - b
 * @param {number} end - c
 * @param {monads.list_core} xs - d
 * @returns {generator} - e
 */
function copyWithin(idx, start, end, xs) {
    return function *copyWithinIterator() {
        for (let x of toArray(xs).copyWithin(idx, start, end)) yield x;
    };
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @param {number} start - b
 * @param {number} end - c
 * @param {Array|monads.list_core} xs - d
 * @return {generator} - e
 */
function fill(val, start, end, xs) {
    return function *fillIterator() {
        for (let x of toArray(xs).fill(val, start, end)) yield x;
    };
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} comparer - b
 * @return {Number} - c
 */
function findIndex(xs, comparer = strictEquals) {
    return toArray(xs).findIndex(comparer);
}

/**
 * @sig
 * @description d
 * @param {Array|generator|monads.list_core} xs - a
 * @param {function} comparer - b
 * @return {Number} - c
 */
function findLastIndex(xs, comparer = strictEquals) {
    return toArray(xs).length - toArray(xs).reverse().findIndex(comparer);
}

var unfold = unfoldWith;

export { all, any, except, intersect, union, map, chain, groupBy, sortBy, prepend, concat, groupJoin, join, zip, filter, intersperse,
    contains, first, last, count, foldLeft, reduceRight, distinct, ofType, binarySearch, equals, takeWhile, skipWhile, reverse,
    copyWithin, fill, findIndex, findLastIndex, repeat, foldRight, unfold };