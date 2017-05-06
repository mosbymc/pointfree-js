import { defaultEqualityComparer, cacher } from '../helpers';
import { when, not, isArray } from '../functionalHelpers';

function union(source, enumerable, comparer) {
    comparer = comparer || defaultEqualityComparer;
    var isInCache = cacher(comparer);

    return function *unionIterator() {
        for (let item of source) {
            if (!isInCache(item)) yield item;
        }

        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of enumerable) {
            if (!isInCache(item)) yield item;
        }
    };
}

export { union };