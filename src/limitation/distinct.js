import { defaultEqualityComparer, cacher } from '../helpers';

function distinct(source, comparer = defaultEqualityComparer) {
    var isInCache = cacher(comparer);

    return function *distinctIterator() {
        for (let item of source) {
            if (!isInCache(item)) yield item;
        }
    };
}

export { distinct };