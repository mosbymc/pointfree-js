import { deepClone, sortComparer } from '../helpers';

/**
 * @description:
 * @param: {Array} data
 * @param: {Object} sortObject
 * @param: {function} comparer
 * @return {Array} - Returns an array sorted on 'n' fields in either ascending or descending
 * order for each field as specified in the 'sortObject' parameter
 */
function sortData(data, sortObject, comparer = sortComparer) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
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
                    if (itemsToSort.length === 1) sortedSubData = sortedSubData.concat(itemsToSort);
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
                        sortedSubData = sortedSubData.concat(itemsToSort.length < 5001 ?
                            insertionSort(itemsToSort, sort.keySelector, comparer, sort.direction) : mergeSort(itemsToSort, sort.keySelector, comparer, sort.direction));
                        //sortedSubData = sortedSubData.concat(quickSort(itemsToSort, sort.direction, sort.keySelector, comparer));
                    }
                    itemsToSort.length = 0;
                    itemsToSort[0] = item;
                }
                if (idx === sortedData.length - 1) {
                    sortedSubData = sortedSubData.concat(itemsToSort.length < 5001 ?
                        insertionSort(itemsToSort, sort.keySelector, comparer, sort.direction) : mergeSort(itemsToSort, sort.keySelector, comparer, sort.direction));
                }
            });
            sortedData = sortedSubData;
        }
    });
    return sortedData;
}

/**
 * @description:
 * @param: {Array} data
 * @param: {function} keySelector
 * @param: {function} comparer
 * @param: {string} direction
 * @return {Array}
 */
function mergeSort(data, keySelector, comparer, direction) {
    if (data.length < 2) return data;
    var middle = parseInt(data.length / 2);
    return merge(mergeSort(data.slice(0, middle), keySelector, comparer, direction),
        mergeSort(data.slice(middle), keySelector, comparer, direction), keySelector, comparer, direction);
}

/**
 * @description:
 * @param: {Array} left
 * @param: {Array} right
 * @param: {function} keySelector
 * @param: {function} comparer
 * @param: {string} direction
 * @return {Array}
 */
function merge(left, right, keySelector, comparer, direction) {
    if (!left.length) return right;
    if (!right.length) return left;

    if (comparer(keySelector(left[0]), keySelector(right[0]), direction) > -1)
        return [deepClone(left[0])].concat(merge(left.slice(1, left.length), right, keySelector, comparer, direction));
    return [deepClone(right[0])].concat(merge(left, right.slice(1, right.length), keySelector, comparer, direction));
}

/**
 * @description:
 * @param: {Array} source
 * @param: {string} dir
 * @param: {function} keySelector
 * @param: {function} keyComparer
 * @return: {Array} - Returns a sort array
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
 * @description:
 * @param: {Array} data
 * @param: {number} left
 * @param: {number} right
 * @param: {string} dir
 * @param: {function} keySelector
 * @param: {function} keyComparer
 */
function qSort(data, left, right, dir, keySelector, keyComparer) {
    do {
        var i = left,
            j = right,
            itemIdx = i + ((j - i) >> 1);

        do {
            while (i < data.length && keyComparer(keySelector, itemIdx, i, data, dir) > 0) ++i;
            while (j >= 0 && keyComparer(keySelector, itemIdx, j, data, dir) < 0) --j;
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
 * @description:
 * @param: {Array} source
 * @param: {function} keySelector
 * @param: {function} keyComparer
 * @param: {string} direction
 * @return: {Array}
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
 * @description:
 * @param: {Array} source
 * @param: {function} keySelector
 * @param: {function} keyComparer
 * @param: {string} direction
 */
function iSort(source, keySelector, keyComparer, direction) {
    var i, j, item, val;
    for (i = 1; i < source.length; ++i) {
        item = source[i];
        val = keySelector(source[i]);
        j = i - 1;
        while (0 <= j && keyComparer(keySelector(source[j]), val, direction) < 0) {
            source[j + 1] = source[j];
            --j;
        }
        source[j + 1] = item;
    }
}

export { sortData, quickSort };