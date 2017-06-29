import { isArray, strictEquals, isObject, type } from '../functionalHelpers';
import { apply, not } from '../decorators';
import { when, ifElse, ifThisThenThat } from '../combinators';
import { javaScriptTypes, cacher } from '../helpers';
import { sortData } from  './sortHelpers';

var toArray = when(not(isArray), Array.from);

/**
 * @description:
 * @param: {iterable} xs
 * @param: {iterable} ys
 * @return: {generator}
 */
function addFront(xs, ys) {
    return function *addFront() {
        ys = toArray(ys);
        for (let y of ys) {
            if (javaScriptTypes.undefined !== y) yield y;
        }

        for (let x of xs) {
            if (javaScriptTypes.undefined !== x) yield x;
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {Array} yss
 * @param: {number} argsCount
 * @return: {generator}
 */
function concat(xs, yss, argsCount) {
    return function *concatIterator() {
        for (let x of xs) {
            if (javaScriptTypes.undefined !== x) yield x;
        }

        if (1 === argsCount) {
            let ys = yss[0];
            for (let y of ys) {
                if (javaScriptTypes.undefined !== y) yield y;
            }
        }
        else {
            for (let ys of yss) {
                console.log(ys);
                for (let y of toArray(ys)) {
                    if (javaScriptTypes.undefined !== y) yield y;
                }
            }
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {iterable} ys
 * @param: {function} comparer
 * @return {generator}
 */
function except(xs, ys, comparer = strictEquals) {
    return function *exceptIterator() {
        for (let x of xs) {
            ys = toArray(ys);
            if (!(ys.some(function _comparer(y) {
                    return comparer(x, y);
                }))) yield x;
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {iterable} ys
 * @param: {function} xSelector
 * @param: {function} ySelector
 * @param: {function} projector
 * @param: {function} comparer
 * @return {generator}
 */
function groupJoin(xs, ys, xSelector, ySelector, projector, comparer = strictEquals) {
    return function *groupJoinIterator() {
        var innerGroups = [];
        ys = toArray(ys);
        for (let y of ys) {
            var innerRes = ySelector(y);
            var matchingGroup = innerGroups.find(_findInnerGroup);

            if (!matchingGroup) matchingGroup = { key: innerRes, items: [y] };
            innerGroups[innerGroups.length] = matchingGroup;
        }

        for (var x of xs) {
            var innerMatch =  innerGroups.find(_compareByKeys);
            let res = projector(x, undefined === innerMatch ? [] : innerMatch.items );
            if (javaScriptTypes.undefined !== res) yield res;
        }

        function _findInnerGroup(grp) {
            return comparer(grp.key, innerRes);
        }

        function _compareByKeys(innerItem) {
            return comparer(xSelector(x), innerItem.key);
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {iterable} ys
 * @param: {function} comparer
 * @return {generator}
 */
function intersect(xs, ys, comparer = strictEquals) {
    return function *intersectIterator() {
        ys = toArray(ys);
        for (let x of xs) {
            if (javaScriptTypes.undefined !== x && ys.some(function _checkEquivalency(it) {
                    return comparer(x, it);
                })) yield x;
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {iterable} ys
 * @param: {function} xSelector
 * @param: {function} ySelector
 * @param: {function} projector
 * @param: {function} comparer
 * @return {generator}
 */
function join(xs, ys, xSelector, ySelector, projector, comparer = strictEquals) {
    return function *joinIterator() {
        ys = toArray(ys);
        for (let x of xs) {
            for (let y of ys) {
                if (comparer(xSelector(x), ySelector(y))) {
                    let res = projector(x, y);
                    if (javaScriptTypes.undefined !== res) yield res;
                }

            }
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {iterable} ys
 * @param: {function} comparer
 * @return {generator}
 */
function union(xs, ys, comparer = strictEquals) {
    var isInCache = cacher(comparer);

    return function *unionIterator() {
        for (let x of xs) {
            if (!isInCache(x)) yield x;
        }

        for (let y of toArray(ys)) {
            if (!isInCache(y)) yield y;
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {iterable} ys
 * @param: {function} selector
 * @return {generator}
 */
function zip(xs, ys, selector) {
    return function *zipIterator() {
        var res,
            idx = 0;
        var yArr = toArray(ys);

        for (let x of xs) {
            if (idx > yArr.length || !yArr.length) return;
            res = selector(x, yArr[idx]);
            if (not(strictEquals)(javaScriptTypes.undefined, res)) yield res;
            ++idx;
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} predicate
 * @return: {boolean}
 */
function all(xs, predicate) {
    return strictEquals(javaScriptTypes.function, type(predicate)) && toArray(xs).every(predicate);
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} predicate
 * @return: {boolean}
 */
function any(xs, predicate) {
    return strictEquals(javaScriptTypes.function, type(predicate)) ? toArray(xs).some(predicate) : 0 < toArray(xs).length;
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {*} val
 * @param: {function} comparer
 * @return: {*}
 */
function contains(xs, val, comparer) {
    //TODO: see if there is any real performance increase by just using .includes when a comparer hasn't been passed
    return strictEquals(javaScriptTypes.undefined, type(comparer)) ? toArray(xs).includes(val) : toArray(xs).some(x => comparer(x, val));
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {number} left
 * @param: {number} right
 * @param: {*} val
 * @param: {function} comparer
 * @return {boolean}
 */
function binarySearch(xs, left, right, val, comparer) {
    if (left > right) return false;
    var mid = (left + (right - left)) / 2,
        res = comparer(val, xs[mid]);
    if (0 === res) return true;
    else if (0 < res) return binarySearch(xs, left, mid - 1, val, comparer);
    else return binarySearch(xs, mid + 1, right, val, comparer);
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} predicate
 * @return {Number}
 */
function count(xs, predicate) {
    return strictEquals(javaScriptTypes.undefined, type(predicate)) ?
        toArray(xs).length : toArray(xs).filter(predicate).length;
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} predicate
 * @return {*}
 */
function first(xs, predicate) {
    return strictEquals(javaScriptTypes.function, type(predicate)) ? toArray(xs).find(predicate) : toArray(xs)[0];
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} fn
 * @param: {*} initial
 * @return: {*}
 */
function fold(xs, fn, initial = 0) {
    return toArray(xs).reduce(fn, initial);
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} fn
 * @param: {*} initial
 * @return: {*}
 */
function foldRight(xs, fn, initial = 0) {
    return toArray(xs).reduceRight(fn, initial);
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} predicate
 * @return: {*}
 */
function last(xs, predicate) {
    if (strictEquals(javaScriptTypes.function, type(predicate)))
        return toArray(xs).filter(predicate).slice(-1)[0];
    return toArray(xs).slice(-1)[0];
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} comparer
 * @return: {generator}
 */
function distinct(xs, comparer = strictEquals) {
    var isInCache = cacher(comparer);

    return function *distinctIterator() {
        for (let x of xs) {
            if (!isInCache(x)) yield x;
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {string} dataType
 * @return: {generator}
 */
function ofType(xs, dataType) {
    return function *ofTypeIterator() {
        function _checkTypeKeys(key) {
            return key in objItem;
        }
        function _checkItemKeys(key) {
            return key in dataType;
        }

        if (dataType in javaScriptTypes) {
            for (let x of xs) {
                if (javaScriptTypes[dataType] === typeof x) yield x;
            }
        }
        else {
            if (typeof dataType === javaScriptTypes.function) {
                for (let x of xs) {
                    if (x === dataType) yield x;
                }
            }
            else if (null === dataType) {
                for (let x of xs) {
                    if (dataType === x) yield x;
                }
            }
            else {
                for (var objItem of xs) {
                    if (dataType.isPrototypeOf(objItem))
                        yield objItem;
                    else if (javaScriptTypes.object === typeof objItem && null !== objItem &&
                        Object.keys(dataType).every(_checkTypeKeys) && Object.keys(objItem).every(_checkItemKeys)) {
                        yield objItem;
                    }
                }
            }
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} predicate
 * @return: {generator}
 */
function filter(xs, predicate) {
    return function *filterIterator() {
        for (let x of xs) {
            if (false !== predicate(x)) yield x;
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @return: {generator}
 */
function deepFlatten(xs) {
    return function *iterator() {
        var unyieldedData = [],
            res;

        for (let x of xs) {
            res = flatteningFunc(x);

            if (isArray(res)) unyieldedData = unyieldedData.concat(Array.prototype.concat.apply([], res));
            if (unyieldedData.length) yield unyieldedData.shift();
            else yield res;
        }
        while (unyieldedData.length) yield unyieldedData.shift();
    };
}

/**
 * @description:
 * @param: {*} data
 * @return:
 */
function flatteningFunc(data) {
    return ifElse(isArray, mapData, when(isObject, when(objectContainsOnlyArrays, getObjectKeysAsArray)), data);
}

/**
 * @description:
 * @param: {*} data
 * @return: {*}
 */
function mapData(data) {
    return Array.prototype.concat.apply([], data.map(function flattenArray(item) {
        return flatteningFunc(item);
    }));
}

/**
 * @description:
 * @param: {*} data
 * @return: {Array}
 */
function getObjectKeysAsArray(data) {
    return Object.keys(data).map(function _flattenKeys(key) {
        return flatteningFunc(data[key]);
    });
}

/**
 * @description:
 * @param: {*} data
 * @return: {boolean}
 */
function objectContainsOnlyArrays(data) {
    return Object.keys(data).every(function _isMadeOfArrays(key) {
        return isArray(data[key]);
    });
}

/**
 * @description:
 * @param: {*} xs
 * @param: {function} fn
 * @return: {flatMapIterator}
 */
function flatMap(xs, fn) {
    return function *flatMapIterator() {
        for (let x of xs) {
            if (null != x && x.map && 'function' === typeof x.map) {
                var res;
                if (x.value && x.value.value) res = x.map(fn).data;
                //if (list_core.isPrototypeOf(x)) res = x.mapWith(fn).data;
                else res = x.map(fn);

                yield res;
            }
            else yield fn(x);
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
 * @description:
 * @param: {iterable} xs
 * @return: {generator}
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
 * @description:
 * @param: {iterable} xs
 * @param: {object} groupObject
 * @param: {function} queryableConstructor
 * @return: {generator}
 */
function groupBy(xs, groupObject, queryableConstructor) {
    return function *groupByIterator() {
        //gather all data from the iterable before grouping
        var groupedData = nestLists(groupData(toArray(xs), groupObject), 0, null, queryableConstructor);
        for (let x of groupedData) yield x;
    };
}

/**
 * @description:
 * @param: {*} data
 * @param: {number} depth
 * @param: {string} key
 * @param: {function} queryableConstructor
 * @return: {Array}
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
 * @description:
 * @param: {*} xs
 * @param: {object} groupObject
 * @return: {Array}
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
 * @description:
 * @param: {Array} arr
 * @param: {string} field
 * @return: {Array}
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
 * @description:
 * @param: {iterable} xs
 * @param: {function} fn
 * @return: {generator}
 */
function map(xs, fn) {
    return function *mapIterator() {
        for (let x of xs) {
            let res = fn(x);
            if (!strictEquals(javaScriptTypes.undefined, type(res))) yield res;
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {Array} orderObject
 * @param: {function} comparer
 * @return: {generator}
 */
function sortBy(xs, orderObject) {
    return function *orderByIterator() {
        //gather all data from the xs before sorting
        var x_s = sortData(toArray(xs), orderObject);
        for (let x of x_s) {
            if (javaScriptTypes.undefined !== typeof x) yield x;
        }
    };
}

/**
 * @description:
 * @param: {@see m_list} xs
 * @param: {@see m_list} ys
 * @param: {function} comparer
 * @return: {boolean}
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
 * @description:
 * @param: {iterable} xs
 * @param: {number} amt
 * @return {generator}
 */
function take(xs, amt) {
    return function *takeIterator() {
        if (!amt) return [];
        var idx = 0;

        for (let x of xs) {
            if (idx < amt) yield x;
            else break;
            ++idx;
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} predicate
 * @return {generator}
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
 * @description:
 * @param: {iterable} xs
 * @param: {number} amt
 * @return {generator}
 */
function skip(xs, amt) {
    return function *skipIterator() {
        var count = 0;

        for (let x of xs) {
            if (count > amt) {
                ++count;
                yield x;
            }
        }
    };
}

/**
 * @description:
 * @param: {iterable} xs
 * @param: {function} predicate
 * @return: {generator}
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
 * @description:
 * @param: {iterable} xs
 * @return: {generator}
 */
function reverse(xs) {
    return function *reverseIterator() {
        for (let x of toArray(xs).reverse()) yield x;
    };
}

/**
 * @description:
 * @param: {*} item
 * @param: {number} count
 * @return: {generator}
 */
function repeat(item, count) {
    return function *repeatIterator() {
        for (let i = 0; i < count; ++i) {
            yield item;
        }
    };
}

/**
 * @description:
 * @param: {number} idx
 * @param: {number} start
 * @param: {number} end
 * @returns {generator}
 */
function copyWithin(idx, start, end, xs) {
    return function *copyWithinIterator() {
        for (let x of toArray(xs).copyWithin(idx, start, end)) yield x;
    };
}

/**
 * @description:
 * @param: {*} val
 * @param: {number} start
 * @param: {number} end
 * @param: {Array} xs
 * @return: {generator}
 */
function fill(val, start, end, xs) {
    return function *fillIterator() {
        for (let x of toArray(xs).fill(val, start, end)) yield x;
    };
}

/**
 * @description:
 * @param: {function} callback
 * @param: {object} context
 * @param: {Array} xs
 * @return: {generator}
 */
function indexOf(callback, context, xs) {
    return function *indexOfIterator() {
        for (let x of toArray(xs).findIndex(callback, context)) yield x;
    };
}

/**
 * @description:
 * @param: {*} val
 * @param: {number} idx
 * @param: {Array} xs
 * @return: {generator}
 */
function lastIndexOf(val, idx, xs) {
    return function *lastIndexOfIterator() {
        for (let x of toArray(xs).lastIndexOf(val, idx)) yield x;
    };
}

export { all, any, except, intersect, union, map, flatMap, groupBy, sortBy, addFront, concat, groupJoin, join, zip, filter,
    contains, first, last, count, fold, foldRight, distinct, ofType, binarySearch, equals, take, takeWhile, skip, skipWhile, reverse,
    copyWithin, fill, indexOf, lastIndexOf, repeat };