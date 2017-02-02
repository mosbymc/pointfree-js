import { when, not, isArray } from '../functionalHelpers';

function zip(source, collection, selector) {
    return function *zipIterator() {
        var res,
            idx = 0;
        collection = when(not(isArray), Array.from, collection);

        if (collection.length < 1) return [];

        for (let item of source) {
            if (idx > collection.length) return;
            res = selector(item, collection[idx]);
            if (undefined !== res) yield res;
            ++idx;
        }
    };
}

export { zip };