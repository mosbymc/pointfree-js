import { defaultEqualityComparer, memoizer2 } from '../helpers';

function distinct(source, comparer = defaultEqualityComparer) {
    var havePreviouslyViewed = memoizer2(comparer);

    return function *distinctIterator() {
        for (let item of source) {
            if (!havePreviouslyViewed(item)) yield item;
        }
    };
}

export { distinct };