import { defaultEqualityComparer, memoizer2 } from '../helpers';

function union(source, collection, comparer) {
    comparer = comparer || defaultEqualityComparer;
    var havePreviouslyViewed = memoizer2(comparer);

    return function *unionIterator() {
        var res;
        for (let item of source) {
            res = havePreviouslyViewed(item);
            if (!res) yield item;
        }

        for (let item of collection) {
            res = havePreviouslyViewed(item);
            if (!res) yield item;
        }
    };
}

export { union };