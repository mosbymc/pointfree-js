import { comparator, dataTypeValueNormalizer, cloneData, comparisons, defaultEqualityComparer } from '../helpers';
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
                if (!itemsToSort.length || defaultEqualityComparer(prevKeySelector(itemsToSort[0]), prevKeySelector(item)))
                    itemsToSort.push(item);
                else {
                    if (itemsToSort.length === 1) sortedSubData = sortedSubData.concat(itemsToSort);
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

export { sortData };