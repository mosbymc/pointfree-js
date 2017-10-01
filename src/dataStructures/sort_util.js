import { deepClone, sortComparer } from '../helpers';

/** @module sort_util */

var sort_obj = {};

function createSortObject(selector, comparer, direction) {
    return Object.create(sort_obj, {
        keySelector: {
            value: selector
        },
        comparer: {
            value: comparer
        },
        direction: {
            value: direction
        }
    });
}

/**
 * @signature
 * @description d
 * @param {Array} data - a
 * @param {Array} sortObject - b
 * @return {Array} - Returns an array sorted on 'n' fields in either ascending or descending
 * order for each field as specified in the 'sortObject' parameter
 */
function sortData(data, sortObject) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
        var comparer = 'function' === typeof sort.comparer ? sort.comparer : sortComparer;
        if (0 === index) sortedData = 5001 > data.length ?
            insertionSort(data, sort.keySelector, comparer, sort.direction) : mergeSort(data, sort.keySelector, comparer, sort.direction);
        //if (index === 0) sortedData = quickSort(data, sort.direction, sort.keySelector, comparer);
        else {
            let sortedSubData = [],
                itemsToSort = [],
                prevKeySelector = sortObject[index - 1].keySelector;
            sortedData.forEach(function _sortData(item, idx) {
                //TODO: re-examine this logic; I think it is in reverse order
                if (!itemsToSort.length || 0 === comparer(prevKeySelector(itemsToSort[0]), prevKeySelector(item), sort.direction))
                    itemsToSort.push(item);
                else {
                    if (1 === itemsToSort.length) sortedSubData = sortedSubData.concat(itemsToSort);
                    else {
                        sortedSubData = sortedSubData.concat(5001 > itemsToSort.length ?
                            insertionSort(itemsToSort, sort.keySelector, comparer, sort.direction) : mergeSort(itemsToSort, sort.keySelector, comparer, sort.direction));
                        //sortedSubData = sortedSubData.concat(quickSort(itemsToSort, sort.direction, sort.keySelector, comparer));
                    }
                    itemsToSort.length = 0;
                    itemsToSort[0] = item;
                }
                if (idx === sortedData.length - 1) {
                    sortedSubData = sortedSubData.concat(5001 > itemsToSort.length ?
                        insertionSort(itemsToSort, sort.keySelector, comparer, sort.direction) : mergeSort(itemsToSort, sort.keySelector, comparer, sort.direction));
                }
            });
            sortedData = sortedSubData;
        }
    });
    return sortedData;
}

/**
 * @signature
 * @description d
 * @param {Array} data - a
 * @param {function} keySelector - b
 * @param {function} comparer - c
 * @param {number} direction - d
 * @return {Array} - e
 */
function mergeSort(data, keySelector, comparer, direction) {
    if (2 > data.length) return data;
    var middle = parseInt(data.length / 2);
    return merge(mergeSort(data.slice(0, middle), keySelector, comparer, direction),
        mergeSort(data.slice(middle), keySelector, comparer, direction), keySelector, comparer, direction);
}

/**
 * @signature
 * @description d
 * @param {Array} left - a
 * @param {Array} right - b
 * @param {function} keySelector - c
 * @param {function} comparer - d
 * @param {number} direction - e
 * @return {Array} - f
 */
function merge(left, right, keySelector, comparer, direction) {
    if (!left.length) return right;
    if (!right.length) return left;

    if (-1 < comparer(keySelector(left[0]), keySelector(right[0]), direction))
        return [deepClone(left[0])].concat(merge(left.slice(1, left.length), right, keySelector, comparer, direction));
    return [deepClone(right[0])].concat(merge(left, right.slice(1, right.length), keySelector, comparer, direction));
}

/**
 * @signature
 * @description d
 * @param {Array} source - a
 * @param {number} dir - b
 * @param {function} keySelector - c
 * @param {function} keyComparer - d
 * @return {Array} - Returns a sort array
 */
function quickSort(source, dir, keySelector, keyComparer) {
    if (0 === source.length) return source;
    var i = 0,
        copy = [];

    while (i < source.length) {
        copy[i] = source[i];
        ++i;
    }
    _quickSort(copy, 0, source.length - 1, keySelector, keyComparer, dir);
    return copy;
}

/**
 * @signature
 * @description d
 * @param {Array} data - a
 * @param {number} left - b
 * @param {number} right - c
 * @param {function} selector - f
 * @param {function} comparer - g
 * @param {number} dir - d
 * @return {Array} - h
 */
function _quickSort(data, left, right, selector, comparer, dir) {
    do {
        var i = left;
        var j = right;
        var currIdx = i + ((j - i) >> 1),
            curr = selector(data[currIdx]);

        do {
            while (i < data.length && 0 < comparer(selector, currIdx, i, curr, data, dir)) ++i;
            while (0 <= j && 0 > comparer(selector, currIdx, j, curr, data, dir)) --j;
            if (i > j) break;
            if (i < j) {
                let temp = data[i];
                data[i] = data[j];
                data[j] = temp;
            }
            i++;
            j--;
        } while (i <= j);
        if (j - left <= right - i) {
            if (left < j) _quickSort(data, left, j, selector, comparer, dir);
            left = i;
        }
        else {
            if (i < right) _quickSort(data, i, right, selector, comparer, dir);
            right = j;
        }
    } while (left < right);
}

/**
 * @signature
 * @description d
 * @param {Array} source - a
 * @param {function} keySelector - b
 * @param {function} keyComparer - c
 * @param {string} direction - d
 * @return {Array} - e
 */
function insertionSort(source, keySelector, keyComparer, direction) {
    if (0 === source.length) return source;
    var i = 0,
        copy = [];

    while (i < source.length) {
        copy[i] = source[i];
        ++i;
    }
    return _insertionSort(copy, keySelector, keyComparer, direction);
}

/**
 * @signature
 * @description d
 * @param {Array} source - a
 * @param {function} keySelector - b
 * @param {function} keyComparer - c
 * @param {string} direction - d
 * @return {Array} e
 */
function _insertionSort(source, keySelector, keyComparer, direction) {
    var i, j, item, val;
    for (i = 1; i < source.length; ++i) {
        item = source[i];
        val = keySelector(source[i]);
        j = i - 1;
        while (0 <= j && 0 > keyComparer(keySelector(source[j]), val, direction)) {
            source[j + 1] = source[j];
            --j;
        }
        source[j + 1] = item;
    }
    return source;
}

export { sortData, quickSort, mergeSort, insertionSort, createSortObject };