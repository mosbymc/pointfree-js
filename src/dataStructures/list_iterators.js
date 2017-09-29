import { isArray, strictEquals, isObject, type, delegatesFrom, invoke, defaultPredicate } from '../functionalHelpers';
import { not, unfoldWith } from '../decorators';
import { when, ifElse } from '../combinators';
import { javaScriptTypes, sortDirection, cacher, typeNames, generatorProto } from '../helpers';
import { sortData } from './sort_util';

/** @module dataStructures/list_iterators */

var asArray = when(not(isArray), Array.from);
var arrayFromGenerator = val => Array.from(invoke(val));
var toArray = ifElse(delegatesFrom(generatorProto), arrayFromGenerator, asArray);

/**
 * @description d
 * @param {Array|dataStructures.list|dataStructures.ordered_list|generator} iterable - Any iterable item
 * @return {Array|dataStructures.list|dataStructures.ordered_list|generator} Returns an iterator
 */
var getIterator = iterable => delegatesFrom(generatorProto, iterable) ? invoke(iterable) : iterable;

function *_iterate(iterable, fn) {
    for (let item of getIterator(iterable)) yield fn(item);
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [predicate] - b
 * @return {boolean} - c
 */
function all(xs, predicate) {
    xs = asArray(xs);
    return strictEquals(javaScriptTypes.Function, type(predicate)) && toArray(xs).every(predicate);
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [predicate] - b
 * @return {boolean} - c
 */
function any(xs, predicate) {
    return strictEquals(javaScriptTypes.Function, type(predicate)) ? asArray(xs).some(predicate) : 0 < asArray(xs).length;
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {*} val - b
 * @param {function} comparer - c
 * @return {boolean} - d
 */
function binarySearch(xs, val, comparer) {
    return binarySearchRec(xs, 0, xs.length - 1, val, comparer);
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
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
 * @signature
 * @description Performs the chain operation for the list data structure. Upon invocation,
 * a generator is returned that knows how to iterate a list and return the appropriate value(s).
 * Like the chain operation for the other data structures, this is a 'safe' chain, meaning that
 * if the provided function argument returns a list for an item, then the item is pulled from the
 * list and yielded out. However, if a non-list value is returned, then that value will be yielded
 * out 'as is'. There is no way to perform a chain operation and get back anything other than a list.
 * @param {*} xs - a
 * @param {function} fn - b
 * @return {generator} - c
 */
function chain(xs, fn) {
    return function *_chainIterator() {
        var res;

        for (let x of xs) {
            res = fn(x);
            //If the result is a list, then we need to unwrap the values contained within and yield
            //each one of them individually...
            if (Object.getPrototypeOf(Object.getPrototypeOf(xs)).isPrototypeOf(res)) {
                for (let item of res.value) {
                    yield item;
                }
            }
            //...otherwise the value is not a list and we just yield it as is.
            else yield res;
        }
    };
}

/**
 * @signature:
 * @description description
 * @param {Array|generator|dataStructures.list_core} xs - x
 * @param {Array|generator|dataStructures.list_core} ys - y
 * @return {generator} - a
 */
function concat(xs, ys) {
    return function *concatIterator() {
        for (let x of xs) yield x;
        for (let y of ys) yield y;
    };
}

/**
 * @signature
 * @description d
 * @param {dataStructures.list_core|dataStructures.list|dataStructures.ordered_list|Array} xs - A list
 * @param {Array} yss - An array of one or more lists
 * @return {generator} Returns a generator to be used as an
 * iterator when the list is evaluated.
 */
function concatAll(xs, yss) {
    return function *_concatAllIterator() {
        for (let x of xs) yield x;
        for (let ys of yss)
            for (let y of toArray(ys)) yield y;
    };
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {*} val - b
 * @param {function} comparer - c
 * @return {*} - d
 */
function contains(xs, val, comparer) {
    //TODO: see if there is any real performance increase by just using .includes when a comparer hasn't been passed
    return strictEquals(javaScriptTypes.Undefined, type(comparer)) ? asArray(xs).includes(val) : asArray(xs).some((x) => comparer(x, val));
}

/**
 * @signature
 * @description d
 * @param {number} idx - a
 * @param {number} start - b
 * @param {number} end - c
 * @param {dataStructures.list_core|dataStructures.list|dataStructures.ordered_list} xs - d
 * @returns {generator} - e
 */
function copyWithin(idx, start, end, xs) {
    return function *copyWithinIterator() {
        for (let x of asArray(xs).copyWithin(idx, start, end)) yield x;
    };
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [predicate] - b
 * @return {Number} - c
 */
function count(xs, predicate) {
    return strictEquals(javaScriptTypes.Undefined, type(predicate)) ?
        asArray(xs).length : asArray(xs).filter(predicate).length;
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [comparer] - b
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
 * @signature
 * @description d
 * @param {dataStructures.list_core} xs - a
 * @param {dataStructures.list_core} ys - b
 * @param {function} [comparer] - c
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
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core|dataStructures.list|dataStructures.ordered_list} xs - x
 * @param {Array|generator|dataStructures.list_core|dataStructures.list|dataStructures.ordered_list} ys - y
 * @param {function} [comparer] - z
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
 * @signature
 * @description d
 * @param {*} val - a
 * @param {number} start - b
 * @param {number} end - c
 * @param {Array|dataStructures.list_core|dataStructures.list|dataStructures.ordered_list} xs - d
 * @return {generator} - e
 */
function fill(val, start, end, xs) {
    return function *fillIterator() {
        for (let x of asArray(xs).fill(val, start, end)) yield x;
    };
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
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
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [comparer] - b
 * @return {Number} - c
 */
function findIndex(xs, comparer = strictEquals) {
    return asArray(xs).findIndex(comparer);
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [comparer] - b
 * @return {Number} - c
 */
function findLastIndex(xs, comparer = strictEquals) {
    return asArray(xs).length - asArray(xs).reverse().findIndex(comparer);
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [predicate] - b
 * @return {*} - c
 */
function first(xs, predicate) {
    return strictEquals(javaScriptTypes.Function, type(predicate)) ? asArray(xs).find(predicate) : asArray(xs)[0];
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} fn - b
 * @param {*} [initial] - c
 * @return {*} - d
 */
function foldLeft(xs, fn, initial = 0) {
    return asArray(xs).reduce(fn, initial);
}

/**
 * @signature
 * @description d
 * @param {Array|dataStructures.list_core} arr - a
 * @param {function} op - b
 * @param {*} acc - c
 * @return {*} - d
 */
function foldRight(arr, op, acc) {
    var list = asArray(arr),
        len = list.length,
        res = acc || list[--len];
    while (0 < len) {
        res = op(list[--len], res, len, list);
    }
    return res;
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array} groupObject - b
 * @param {function} queryableConstructor - c
 * @return {generator} - d
 */
function groupBy(xs, groupObject, queryableConstructor) {
    return function *groupByIterator() {
        //gather all data from the iterable before grouping
        var groupedData = nestLists(groupData(asArray(xs), groupObject), 0, null, queryableConstructor);
        for (let x of groupedData) yield x;
    };
}

/**
 * @signature
 * @description d
 * @param {*} data - a
 * @param {number} depth - b
 * @param {string|null} key - c
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
 * @signature
 * @description d
 * @param {*} xs - a
 * @param {Array} groupObject - b
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
 * @signature
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
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array|generator|dataStructures.list_core} ys - b
 * @param {function} xSelector - c
 * @param {function} ySelector - d
 * @param {function} projector - e
 * @param {function} listFactory - f
 * @param {function} [comparer] - g
 * @return {generator} - h
 */
function groupJoin(xs, ys, xSelector, ySelector, projector, listFactory, comparer = strictEquals) {
    return function *groupJoinIterator() {
        var groupObj = [{ keySelector: ySelector, comparer: comparer, direction: sortDirection.ascending }];
        var groupedY = nestLists(groupData(asArray(ys), groupObj), 0, null, listFactory);

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
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array|generator|dataStructures.list_core} ys - b
 * @param {function} [comparer] - c
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
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
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
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array|generator|dataStructures.list_core} ys - b
 * @param {function} xSelector - c
 * @param {function} ySelector - d
 * @param {function} projector - e
 * @param {function} [comparer] - f
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
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [predicate] - b
 * @return {*} - c
 */
function last(xs, predicate) {
    if (strictEquals(javaScriptTypes.Function, type(predicate)))
        return asArray(xs).filter(predicate).slice(-1)[0];
    return asArray(xs).slice(-1)[0];
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} fn - b
 * @return {generator} - c
 */
function map(xs, fn) {
    return function *mapIterator() {
        for (let x of xs) {
            yield fn(x);
        }
    };
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
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
 * @signature 
 * @description -
 * @param {Array|generator|dataStructures.list_core} xs - some stuff
 * @param {Array|generator|dataStructures.list_core} ys - some other stuff
 * @return {generator} - some other other stuff
 */
function prepend(xs, ys) {
    return concat(ys, xs);
}

/**
 * @signature
 * @description d
 * @param {dataStructures.list|dataStructures.ordered_list|Array|generator} xs - A list
 * @param {Array} yss - An array of one or more lists
 * @return {generator} Returns a generator
 */
function prependAll(xs, yss) {
    return concatAll(toArray(yss[0]), yss.slice(1).concat([xs]));
}

/**
 * @signature
 * @description s
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} fn - b
 * @param {*} initial - c
 * @return {*} - d
 */
function reduceRight(xs, fn, initial) {
    return null == initial ? asArray(xs).reduceRight(fn) : asArray(xs).reduceRight(fn, initial);
}

/**
 * @signature
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
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @return {generator} - b
 */
function reverse(xs) {
    return function *reverseIterator() {
        for (let x of asArray(xs).reverse()) yield x;
    };
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
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
 * @signature
 * @description d
 * @param {Array|dataStructures.list_core} xs - Any iterable object that may be treated as an array
 * @param {number} [start] - A number representing the index of the array to being the slice
 * @param {number} [end] - A number representing the index of the array to end the slice
 * @return {generator} Returns a generator function that can be used to iterate the values
 * of the new sliced array one at a time.
 */
function slice(xs, start, end) {
    return function *_sliceIterator() {
        for (let item of asArray(xs).slice(start, end)) yield item;
    };
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array} orderObject - b
 * @return {generator} - d
 */
function sortBy(xs, orderObject) {
    return function *orderByIterator() {
        //gather all data from the xs before sorting
        var x_s = sortData(asArray(xs), orderObject);
        for (let x of x_s) yield x;
    };
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
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

var unfold = unfoldWith;

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array|generator|dataStructures.list_core} ys - b
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
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array|generator|dataStructures.list_core} ys - b
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

export { all, any, binarySearch, chain, concat, concatAll, contains, copyWithin, count, distinct, equals, except, fill, filter,
        findIndex, findLastIndex, first, foldLeft, foldRight, groupBy, groupJoin, intersect, intersperse, join, last, map, ofType,
        prepend, prependAll, reduceRight, repeat, reverse, skipWhile, slice, sortBy, takeWhile, unfold, union, zip };