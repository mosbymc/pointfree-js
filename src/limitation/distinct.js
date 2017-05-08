import { cacher } from '../helpers';
import { strictEqual } from '../functionalHelpers';

function distinct(source, comparer = strictEqual) {
    var isInCache = cacher(comparer);

    return function *distinctIterator() {
        for (let item of source) {
            if (!isInCache(item)) yield item;
        }
    };
}

export { distinct };