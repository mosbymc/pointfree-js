import { deepClone, sortComparer } from '../helpers';

/** @module dataStructures/sortHelpers */

/**
 * @sig
 * @description d
 * @param {Array} data - a
 * @param {Object} sortObject - b
 * @return {Array} - Returns an array sorted on 'n' fields in either ascending or descending
 * order for each field as specified in the 'sortObject' parameter
 */
function sortData(data, sortObject) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
        var comparer = sortObject.comparer && 'function' === typeof sort.comparer ? sort.comparer : sortComparer;
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
                    //TODO: see if there's a realistic way that length === 1 || 2 could be combined into one statement
                    if (1 === itemsToSort.length) sortedSubData = sortedSubData.concat(itemsToSort);
                    //else if (itemsToSort.length === 2) {
                        //sortedSubData = -1 < comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1]), sort.direction) ?
                            //sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                        /*if (sortDirection.descending === sort.ascending)
                            sortedSubData = -1 < comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1]), sort.direction) ?
                                sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                        else sortedSubData = 1 > comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1]), sort.direction) ?
                            sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                        */
                    //}
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
 * @sig
 * @description d
 * @param {Array} data - a
 * @param {function} keySelector - b
 * @param {function} comparer - c
 * @param {string} direction - d
 * @return {Array} - e
 */
function mergeSort(data, keySelector, comparer, direction) {
    if (2 > data.length) return data;
    var middle = parseInt(data.length / 2);
    return merge(mergeSort(data.slice(0, middle), keySelector, comparer, direction),
        mergeSort(data.slice(middle), keySelector, comparer, direction), keySelector, comparer, direction);
}

/**
 * @sig
 * @description d
 * @param {Array} left - a
 * @param {Array} right - b
 * @param {function} keySelector - c
 * @param {function} comparer - d
 * @param {string} direction - e
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
 * @sig
 * @description d
 * @param {Array} source - a
 * @param {string} dir - b
 * @param {function} keySelector - c
 * @param {function} keyComparer - d
 * @return {Array} - Returns a sort array
 */
function quickSort(source, dir, keySelector, keyComparer) {
    var i = 0,
        copy = [];

    while (i < source.length) {
        copy[i] = source[i];
        ++i;
    }
    qSort(copy, 0, source.length - 1, dir, keySelector, keyComparer);
    return copy;
}

/**
 * @sig
 * @description d
 * @param {Array} data - a
 * @param {number} left - b
 * @param {number} right - c
 * @param {string} dir - d
 * @param {function} keySelector - f
 * @param {function} keyComparer - g
 * @return {Array} - h
 */
function qSort(data, left, right, dir, keySelector, keyComparer) {
    do {
        var i = left,
            j = right,
            itemIdx = i + ((j - i) >> 1);

        do {
            while (i < data.length && 0 < keyComparer(keySelector, itemIdx, i, data, dir)) ++i;
            while (0 <= j && 0 > keyComparer(keySelector, itemIdx, j, data, dir)) --j;
            if (i > j) break;
            if (i < j) {
                let tmp = data[i];
                data[i] = data[j];
                data[j] = tmp;
            }
            ++i;
            --j;
        }
        while (i <= j);

        if (j - left <= right - i) {
            if (left < j) qSort(data, left, j, dir, keySelector, keyComparer);
            left = i;
        }
        else {
            if (i < right) qSort(data, i, right, dir, keySelector, keyComparer);
            right = j;
        }
    }
    while (left < right);
}

/**
 * @sig
 * @description d
 * @param {Array} source - a
 * @param {function} keySelector - b
 * @param {function} keyComparer - c
 * @param {string} direction - d
 * @return {Array} - e
 */
function insertionSort(source, keySelector, keyComparer, direction) {
    var i = 0,
        cop = [];

    while (i < source.length) {
        cop[i] = source[i];
        ++i;
    }
    iSort(cop, keySelector, keyComparer, direction);
    return cop;
}

/**
 * @sig
 * @description d
 * @param {Array} source - a
 * @param {function} keySelector - b
 * @param {function} keyComparer - c
 * @param {string} direction - d
 * @return {Array} e
 */
function iSort(source, keySelector, keyComparer, direction) {
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
}

export { sortData, quickSort };