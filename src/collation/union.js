import { defaultEqualityComparer, memoizer } from '../helpers';
import { when, not, isArray } from '../functionalHelpers';

function union(source, enumerable, comparer) {
    comparer = comparer || defaultEqualityComparer;
    var havePreviouslyViewed = memoizer(comparer);

    return function *unionIterator() {
        var res;
        for (let item of source) {
            res = havePreviouslyViewed(item);
            if (!res) yield item;
        }

        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of enumerable) {
            res = havePreviouslyViewed(item);
            if (!res) yield item;
        }
    };
}

export { union };