import { when, wrap, isArray, isObject, not, and } from '../functionalHelpers';

function deepFlatten(source, id) {
    return function *deepFlattenIterator() {
        var unyieldedData = [];
        for (let item of source) {
            //var res = flattener(item);

            if (id) console.log(res);

            if (isArray(res)) unyieldedData = unyieldedData.concat(res);
            if (unyieldedData.length) yield unyieldedData.shift();
            else yield res;
        }

        while (unyieldedData.length) yield unyieldedData.shift();
    };
}

function flattener(item) {
    return Array.prototype.concat.apply([], dataMapper(wrap(item)).map(function _flattenData(it) {
        return when(isArray, flattener, it);
    }));
}

function objectContainsOnlyArrays(data) {
    return Object.keys(data).every(function _isMadeOfArrays(key) {
        return isArray(data[key]);
    });
}

function objectToArray(data) {
    return Object.keys(data).map(function _transmogrify(key) {
        return dataMapper(data[key]);
    });
}

function dataMapper(data) {
    return data.map(function _dataMapper(item) {
        return when(isObjectButNotArray, when(objectContainsOnlyArrays, objectToArray), item);
    });
}

function isObjectButNotArray(item) {
    return and(not(isArray), isObject, item);
}

export { deepFlatten };