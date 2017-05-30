import { when, not, isArray, strictEqual, delegatesTo, isObject, ifElse } from '../functionalHelpers';
import { javaScriptTypes, cacher } from '../helpers';
import { sortData } from  '../projection/sortHelpers';

/**
 * @description:
 * @param: {iterable} source
 * @param: {iterable} enumerable
 * @return: {generator}
 */
function addFront(source, enumerable) {
    return function *addFront() {
        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of enumerable) {
            if (javaScriptTypes.undefined !== item) yield item;
        }

        for (let item of source) {
            if (javaScriptTypes.undefined !== item) yield item;
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {Array} enumerables
 * @param: {number} argsCount
 * @return: {generator}
 */
function concat(source, enumerables, argsCount) {
    return function *concatIterator() {
        for (let item of source) {
            if (javaScriptTypes.undefined !== item) yield item;
        }

        var enumerable;
        if (1 === argsCount) {
            enumerable = enumerables[0];
            for (let item of enumerable) {
                if (javaScriptTypes.undefined !== item) yield item;
            }
        }
        else {
            for (let list of enumerables) {
                enumerable = when(not(isArray), Array.from, list);
                for (let item of enumerable) {
                    if (javaScriptTypes.undefined !== item) yield item;
                }
            }
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {iterable} enumerable
 * @param: {function} comparer
 * @return {generator}
 */
function except(source, enumerable, comparer = strictEqual) {
    return function *exceptIterator() {
        var res;
        for (let item of source) {
            enumerable = when(not(isArray), Array.from, enumerable);
            res = !(enumerable.some(function _comparer(it) {
                return comparer(item, it);
            }));
            if (res) yield item;
        }
    };
}

/**
 * @description:
 * @param: {iterable} outer
 * @param: {iterable} inner
 * @param: {function} outerSelector
 * @param: {function} innerSelector
 * @param: {function} projector
 * @param: {function} comparer
 * @return {generator}
 */
function groupJoin(outer, inner, outerSelector, innerSelector, projector, comparer = strictEqual) {
    return function *groupJoinIterator() {
        var innerGroups = [];
        inner = when(not(isArray), Array.from, inner);
        for (let innerItem of inner) {
            var innerRes = innerSelector(innerItem);
            var matchingGroup = innerGroups.find(_findInnerGroup);

            if (!matchingGroup) matchingGroup = { key: innerRes, items: [innerItem] };
            innerGroups[innerGroups.length] = matchingGroup;
        }

        for (var outerItem of outer) {
            var innerMatch =  innerGroups.find(_compareByKeys);
            let res = projector(outerItem, undefined === innerMatch ? [] : innerMatch.items );
            if (javaScriptTypes.undefined !== res) yield res;
        }

        function _findInnerGroup(grp) {
            return comparer(grp.key, innerRes);
        }

        function _compareByKeys(innerItem) {
            return comparer(outerSelector(outerItem), innerItem.key);
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {iterable} enumerable
 * @param: {function} comparer
 * @return {generator}
 */
function intersect(source, enumerable, comparer = strictEqual) {
    return function *intersectIterator() {
        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of source) {
            if (javaScriptTypes.undefined !== item && enumerable.some(function _checkEquivalency(it) {
                    return comparer(item, it);
                }))
            {
                yield item;
            }
        }
    };
}

/**
 * @description:
 * @param: {iterable} outer
 * @param: {iterable} inner
 * @param: {function} outerSelector
 * @param: {function} innerSelector
 * @param: {function} projector
 * @param: {function} comparer
 * @return {generator}
 */
function join(outer, inner, outerSelector, innerSelector, projector, comparer = strictEqual) {
    return function *joinIterator() {
        inner = when(not(isArray), Array.from, inner);
        for (let outerItem of outer) {
            for (let innerItem of inner) {
                if (comparer(outerSelector(outerItem), innerSelector(innerItem))) {
                    let res = projector(outerItem, innerItem);
                    if (javaScriptTypes.undefined !== res) yield res;
                }

            }
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {iterable} enumerable
 * @param: {function} comparer
 * @return {generator}
 */
function union(source, enumerable, comparer = strictEqual) {
    var isInCache = cacher(comparer);

    return function *unionIterator() {
        for (let item of source) {
            if (!isInCache(item)) yield item;
        }

        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of enumerable) {
            if (!isInCache(item)) yield item;
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {iterable} enumerable
 * @param: {function} selector
 * @return {generator}
 */
function zip(source, enumerable, selector) {
    return function *zipIterator() {
        var res,
            idx = 0;
        enumerable = when(not(isArray), Array.from, enumerable);

        if (!enumerable.length < 1) {
            for (let item of source) {
                if (idx > enumerable.length) return;
                res = selector(item, enumerable[idx]);
                if (javaScriptTypes.undefined !== res) yield res;
                ++idx;
            }
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {function} predicate
 * @return: {boolean}
 */
function all(source, predicate) {
    if (javaScriptTypes.function !== typeof predicate)
        return false;
    return Array.from(source).every(predicate);
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {function} predicate
 * @return: {boolean}
 */
function any(source, predicate) {
    if (javaScriptTypes.function !== typeof predicate)
        return Array.from(source).length > 0;
    return Array.from(source).some(predicate);
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {*} val
 * @param: {function} comparer
 * @return: {*}
 */
function contains(source, val, comparer) {
    source = when(not(isArray), Array.from, source);
    if (javaScriptTypes.undefined === typeof comparer)
        return source.includes(val);
    return source.some(function _checkEquality(item) {
        return comparer(item, val);
    });
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {number} left
 * @param: {number} right
 * @param: {*} val
 * @param: {function} comparer
 * @return {boolean}
 */
function binarySearch(source, left, right, val, comparer) {
    if (left > right) return false;
    var mid = (left + (right - left)) / 2,
        res = comparer(val, source[mid]);
    if (0 === res) return true;
    else if (0 < res) return binarySearch(source, left, mid - 1, val, comparer);
    else return binarySearch(source, mid + 1, right, val, comparer);
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {function} predicate
 * @return {Number}
 */
function count(source, predicate) {
    if (javaScriptTypes.undefined === typeof predicate)
        return Array.from(source).length;
    return Array.from(source).filter(function filterItems(item) {
        return predicate(item);
    }).length;
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {function} predicate
 * @return {*}
 */
function first(source, predicate) {
    if (javaScriptTypes.function === typeof predicate)
        return Array.from(source).find(predicate);
    return Array.from(source)[0];
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {function} fn
 * @param: {*} initial
 * @return: {*}
 */
function fold(source, fn, initial = 0) {
    return when(not(isArray), Array.from, source).reduce(fn, initial);
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {function} fn
 * @param: {*} initial
 * @return: {*}
 */
function foldRight(source, fn, initial = 0) {
    return when(not(isArray), Array.from, source).reduceRight(fn, initial);
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {function} predicate
 * @return: {*}
 */
function last(source, predicate) {
    var data = Array.from(source);
    if (javaScriptTypes.function === typeof predicate)
        data = data.filter(predicate);
    return data[data.length - 1];
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {function} comparer
 * @return: {generator}
 */
function distinct(source, comparer = strictEqual) {
    var isInCache = cacher(comparer);

    return function *distinctIterator() {
        for (let item of source) {
            if (!isInCache(item)) yield item;
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {string} dataType
 * @return: {generator}
 */
function ofType(source, dataType) {
    return function *ofTypeIterator() {
        function _checkTypeKeys(key) {
            return key in objItem;
        }
        function _checkItemKeys(key) {
            return key in dataType;
        }

        if (dataType in javaScriptTypes) {
            for (let item of source) {
                if (javaScriptTypes[dataType] === typeof item) yield item;
            }
        }
        else {
            if (typeof dataType === javaScriptTypes.function) {
                for (let item of source) {
                    if (item === dataType) yield item;
                }
            }
            else if (null === dataType) {
                for (let item of source) {
                    if (dataType === item) yield item;
                }
            }
            else {
                for (var objItem of source) {
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
 * @param: {iterable} source
 * @param: {function} predicate
 * @return: {generator}
 */
function filter(source, predicate) {
    return function *filterIterator() {
        for (let item of source) {
            if (false !== predicate(item)) yield item;
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @return: {generator}
 */
function deepFlatten(source) {
    return function *iterator() {
        var unyieldedData = [],
            res;

        for (let item of source) {
            res = flatteningFunc(item);

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
 * @param: {*} source
 * @param: {function} fn
 * @return: {flatMapIterator}
 */
function flatMap(source, fn) {
    return function *flatMapIterator() {
        for (let item of source) {
            if (null != item && item.map && 'function' === typeof item.map) {
                var res;
                if (item.value && item.value.value) res = item.map(fn).data;
                //if (list_core.isPrototypeOf(item)) res = item.map(fn).data;
                else res = item.map(fn);

                yield res;
            }
            else yield fn(item);
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @return: {generator}
 */
function flatten(source) {
    return function *flattenIterator() {
        var unyieldedData = [];

        for (let item of source) {
            if (isArray(item)) unyieldedData = unyieldedData.concat(item);
            if (unyieldedData.length) yield unyieldedData.shift();
            else yield item;
        }

        while (unyieldedData.length) yield unyieldedData.shift();
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {object} groupObject
 * @param: {function} queryableConstructor
 * @return: {generator}
 */
function groupBy(source, groupObject, queryableConstructor) {
    return function *groupByIterator() {
        //gather all data from the source before grouping
        var groupedData = nestLists(groupData(when(not(isArray), Array.from, source), groupObject), 0, null, queryableConstructor);
        for (let item of groupedData) yield item;
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
        data = queryableConstructor(data, key);
    }
    return data;
}

/**
 * @description:
 * @param: {*} data
 * @param: {object} groupObject
 * @return: {Array}
 */
function groupData(data, groupObject) {
    var sortedData = sortData(data, groupObject),
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
 * @param: {iterable} source
 * @param: {function} fn
 * @return: {generator}
 */
function map(source, fn) {
    return function *mapIterator() {
        if (Array.isArray(source.value) && source.value.length === 5) {
            console.log(source.value);
            console.log(Object.getPrototypeOf(source));
        }
        for (let item of source) {
            let res = fn(item);
            if (~[1, 2, 3, 4, 5].indexOf(item)) {
                console.log(res);
            }
            else console.log(item, source);
            if (javaScriptTypes.undefined !== res) yield res;
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {Array} orderObject
 * @param: {function} comparer
 * @return: {generator}
 */
function sortBy(source, orderObject) {
    return function *orderByIterator() {
        //gather all data from the source before sorting
        var orderedData = sortData(when(not(isArray), Array.from, source), orderObject);
        for (let item of orderedData) {
            if (javaScriptTypes.undefined !== typeof item) yield item;
        }
    };
}

/**
 * @description:
 * @param: {@see m_list} l1
 * @param: {@see m_list} l2
 * @param: {function} comparer
 * @return: {boolean}
 */
function equals(l1, l2, comparer = strictEqual) {
    var l1Data = l1.data,
        l2Data = l2.data;

    return l1Data.length === l2Data.length &&
            l1Data.every(function _checkEquality(item, idx) {
                return comparer(item, l2Data[idx]);
            });
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {number} amt
 * @return {generator}
 */
function take(source, amt) {
    return function *takeIterator() {
        if (!amt) return [];
        var idx = 0;

        for (let item of source) {
            if (idx < amt) yield item;
            else break;
            ++idx;
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {function} predicate
 * @return {generator}
 */
function takeWhile(source, predicate) {
    return function *takeWhileIterator() {
        for (let item of source) {
            if (predicate(item)) yield item;
            else break;
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {number} amt
 * @return {generator}
 */
function skip(source, amt) {
    return function *skipIterator() {
        var count = 0;

        for (let item of source) {
            if (count > amt) {
                ++count;
                yield item;
            }
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @param: {function} predicate
 * @return: {generator}
 */
function skipWhile(source, predicate) {
    return function *skipWhileIterator() {
        var hasFailed = false;
        for (let item of source) {
            if (!hasFailed) {
                if (!predicate(item)) {
                    hasFailed = true;
                    yield item;
                }
            }
            else yield item;
        }
    };
}

/**
 * @description:
 * @param: {iterable} source
 * @return: {generator}
 */
function reverse(source) {
    return function *reverseIterator() {
        source = Array.from(source).reverse();
        for (let item of source) yield item;
    };
}

/**
 * @description:
 * @param: {number} idx
 * @param: {number} start
 * @param: {number} end
 * @returns {generator}
 */
function copyWithin(idx, start, end, source) {
    return function *copyWithinIterator() {
        for (let item of when(not(isArray), toArray, source).copyWithin(idx, start, end)) yield item;
    };
}

function fill(val, start, end, source) {
    return function *fillIterator() {
        for (let item of when(not(isArray), toArray, source).fill(val, start, end)) yield item;
    };
}

function indexOf(callback, context, source) {
    return function *indexOfIterator() {
        for (let item of when(not(isArray), toArray, source).findIndex(callback, context)) yield item;
    };
}

function lastIndexOf(val, idx, source) {
    return function *lastIndexOfIterator() {
        for (let item of when(not(isArray), toArray, source).lastIndexOf(val, idx)) yield item;
    };
}

export { all, any, except, intersect, union, map, flatMap, groupBy, sortBy, addFront, concat, groupJoin, join, zip, filter,
    contains, first, last, count, fold, foldRight, distinct, ofType, binarySearch, equals, take, takeWhile, skip, skipWhile, reverse,
    copyWithin, fill, indexOf, lastIndexOf };