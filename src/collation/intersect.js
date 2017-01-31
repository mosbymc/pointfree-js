import { defaultEqualityComparer, memoizer2 } from '../helpers';

function intersect(source, collection, comparer) {
    comparer = comparer || defaultEqualityComparer;
    var havePreviouslyViewed = memoizer2(comparer);

    function intersectFunc(item) {
        return havePreviouslyViewed(item);
    }

    return function *intersectIterator() {
        var res;
        for (let item of source) {
            res = intersectFunc(item);
            if (!res && collection.includes(item)) yield item;
        }
    };
}

export { intersect };