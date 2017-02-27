import { defaultEqualityComparer, memoizer } from '../helpers';

function distinct(source, comparer = defaultEqualityComparer) {
    var havePreviouslyViewed = memoizer(comparer);

    return function *distinctIterator() {
        for (let item of source) {
            if (!havePreviouslyViewed(item)) yield item;
        }
    };
}

export { distinct };