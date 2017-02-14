import { comparator, dataTypeValueNormalizer, cloneData, comparisons, defaultEqualityComparer } from '../helpers';
import { not } from '../functionalHelpers';

/*
function sortData(data, fields) {
    var sortedData = data;
    fields.forEach(function _sortItems(field, index) {
        if (index === 0) sortedData = mergeSort(data, field.key, field.dir, field.dataType);
        else {
            let sortedSubData = [],
                itemsToSort = [],
                prevField = fields[index - 1].key,
                prevType = fields[index - 1].dataType || 'string';
            sortedData.forEach(function _sortData(item, idx) {
                if (!itemsToSort.length || comparator('eq', dataTypeValueNormalizer(prevType, itemsToSort[0][prevField]), dataTypeValueNormalizer(prevType, item[prevField])))
                    itemsToSort.push(item);
                else {
                    if (itemsToSort.length === 1) sortedSubData = sortedSubData.concat(itemsToSort);
                    else sortedSubData = sortedSubData.concat(mergeSort(itemsToSort, field.key, field.dir, field.dataType || 'string'));
                    itemsToSort.length = 0;
                    itemsToSort.push(item);
                }
                if (idx === sortedData.length - 1)
                    sortedSubData = sortedSubData.concat(mergeSort(itemsToSort, field.key, field.dir, field.dataType || 'string'));
            });
            sortedData = sortedSubData;
        }
    });
    return sortedData;
}
*/

function sortData2(data, sortObject) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
        let comparer = sort.direction === 'asc' ? sort.comparer : not(sort.comparer);
        if (index === 0) sortedData = mergeSort2(data, sort.keySelector, comparer);
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
                        sortedSubData = sortedSubData.concat(mergeSort2(itemsToSort, sort.keySelector, comparer));
                    }
                    itemsToSort.length = 0;
                    itemsToSort.push(item);
                }
                if (idx === sortedData.length - 1) {
                    sortedSubData = sortedSubData.concat(mergeSort2(itemsToSort, sort.keySelector, comparer));
                }
            });
            sortedData = sortedSubData;
        }
    });
    return sortedData;
}

function mergeSort2(data, keySelector, comparer) {
    if (data.length < 2) return data;
    var middle = parseInt(data.length / 2);
    return merge2(mergeSort2(data.slice(0, middle), keySelector, comparer), mergeSort2(data.slice(middle), keySelector, comparer), keySelector, comparer);
}

function merge2(left, right, keySelector, comparer) {
    if (!left.length) return right;
    if (!right.length) return left;

    if (comparer(keySelector(left[0]), keySelector(right[0])))
        return [cloneData(left[0])].concat(merge2(left.slice(1, left.length), right, keySelector, comparer));
    return [cloneData(right[0])].concat(merge2(left, right.slice(1, right.length), keySelector, comparer));
}



/*
function mergeSort(data, field, direction, dataType) {
    if (data.length < 2) return data;
    var middle = parseInt(data.length / 2);
    return merge(mergeSort(data.slice(0, middle), field, direction, dataType), mergeSort(data.slice(middle, data.length), field, direction, dataType), field, direction, dataType);
}

function merge(left, right, field, direction, dataType) {
    if (!left.length) return right;
    if (!right.length) return left;

    var operator = direction === 'asc' ? comparisons.lessThanOrEqual : comparisons.greaterThanOrEqual;
    if (comparator(operator, dataTypeValueNormalizer(dataType || typeof left[0][field], left[0][field]), dataTypeValueNormalizer(dataType || typeof right[0][field], right[0][field])))
        return [cloneData(left[0])].concat(merge(left.slice(1, left.length), right, field, direction, dataType));
    else  return [cloneData(right[0])].concat(merge(left, right.slice(1, right.length), field, direction, dataType));
}
*/

/*
function sortAlgorithm(source, keySelector) {
    return function *sortAlgorithmIterator() {
        var res = [];
        for (let item of source) {
            if (!res.length) res[0] = item;
            else if (res.length === 1) {
                if (keySelector(res[0]) < keySelector(item))
                    res = res.concat(item);
                else
                    res = [item, res[0]];
            }
            else {
                let prev = res.length > 2,
                    middle = res.slice(0, res.length / 2),
                    found = false;
                while (!found) {
                    if (keySelector(middle) > keySelector(item)) {
                        if (prev) middle = middle.slice(0, middle.length / 2);
                        else {
                            res = [item].concat(res);
                            found = true;
                        }
                    }
                    else {
                        if (prev) middle = res.slice(res.length / 2);
                        else {
                            res = [item].concat(res);
                            found = true;
                        }
                    }
                }
            }
        }
    }
}*/

export { /*sortData,*/ sortData2 };