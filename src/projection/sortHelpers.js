import { comparator, dataTypeValueNormalizer, cloneData, comparisons } from '../helpers';

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

export { sortData };