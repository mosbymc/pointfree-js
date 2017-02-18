import { when, ifElse, isArray, isObject } from '../functionalHelpers';

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

function flatteningFunc(data) {
    return ifElse(isArray, mapData, when(isObject, when(objectContainsOnlyArrays, getObjectKeysAsArray)), data);
}

function mapData(data) {
    return Array.prototype.concat.apply([], data.map(function flattenArray(item) {
        return flatteningFunc(item);
    }));
}

function getObjectKeysAsArray(data) {
    return Object.keys(data).map(function _flattenKeys(key) {
        return flatteningFunc(data[key]);
    });
}

function objectContainsOnlyArrays(data) {
    return Object.keys(data).every(function _isMadeOfArrays(key) {
        return isArray(data[key]);
    });
}

export { deepFlatten };