import { cloneData, defaultEqualityComparer, sortComparer, sortDirection } from '../helpers';
import { not } from '../functionalHelpers';

function sortData(data, sortObject) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
        let comparer = sort.direction === 'asc' ? sort.comparer : not(sort.comparer);
        if (index === 0) sortedData = mergeSort(data, sort.keySelector, comparer);
        else {
            let sortedSubData = [],
                itemsToSort = [],
                prevKeySelector = sortObject[index - 1].keySelector;
            sortedData.forEach(function _sortData(item, idx) {
                //TODO: re-examine this logic; I think it is in reverse order
                if (!itemsToSort.length || defaultEqualityComparer(prevKeySelector(itemsToSort[0]), prevKeySelector(item)))
                    itemsToSort.push(item);
                else {
                    //TODO: see if there's a realistic way that length === 1 || 2 could be combined into one statement
                    if (itemsToSort.length === 1) sortedSubData = sortedSubData.concat(itemsToSort);
                    else if (itemsToSort.length === 2) {
                        sortedSubData = comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1])) ?
                            sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                    }
                    else {
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

    if (comparer(keySelector(left[0]), keySelector(right[0])))
        return [cloneData(left[0])].concat(merge(left.slice(1, left.length), right, keySelector, comparer));
    return [cloneData(right[0])].concat(merge(left, right.slice(1, right.length), keySelector, comparer));
}

function quickSort(source, keySelector, keyComparer) {
    var count = source.length,
        i = 0,
        cop = [];

    while (i < source.length) {
        cop[i] = source[i];
        ++i;
    }
    qSort(cop, 0, count - 1, keySelector, keyComparer);
    return cop;
}

function qSort(data, left, right, dir, keySelector, keyComparer) {
    do {
        var i = left,
            j = right,
            itemIdx = i + ((j - i) >> 1),
            x = keySelector(data[itemIdx]);

        do {
            while (i < data.length && dir === sortDirection.Ascending ? keyComparer(keySelector, itemIdx, i, x, data) > 0 :
                keyComparer(keySelector, itemIdx, i, x, data) < 0) ++i;
            while (j >= 0 && dir === sortDirection.Ascending ? keyComparer(keySelector, itemIdx, j, x, data) < 0 :
                keyComparer(keySelector, itemIdx, j, x, data) < 0) --j;
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

export { sortData, quickSort };