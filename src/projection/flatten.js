import { isArray } from '../functionalHelpers';

function flatten(source) {
    return function *flattenIterator() {
        var unyieldedData = [];
        for (let item of source) {
            if (isArray(item)) unyieldedData = unyieldedData.concat(item);
            if (unyieldedData.length) yield unyieldedData.shift();
            else yield item;
        }

        while (unyieldedData.length) yield unyieldedData.shift();
    };
}

export { flatten };
