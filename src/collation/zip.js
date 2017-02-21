import { when, not, isArray } from '../functionalHelpers';

function zip(source, enumerable, selector) {
    return function *zipIterator() {
        var res,
            idx = 0;
        enumerable = when(not(isArray), Array.from, enumerable);

        if (enumerable.length < 1) return [];

        for (let item of source) {
            if (idx > enumerable.length) return;
            res = selector(item, enumerable[idx]);
            if (undefined !== res) yield res;
            ++idx;
        }
    };
}

export { zip };