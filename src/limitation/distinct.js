import { cacher } from '../helpers';
import { strictEquals } from '../functionalHelpers';

function distinct(source, comparer = strictEquals) {
    var isInCache = cacher(comparer);

    return function *distinctIterator() {
        for (let item of source) {
            if (!isInCache(item)) yield item;
        }
    };
}

export { distinct };