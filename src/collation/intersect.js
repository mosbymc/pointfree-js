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
            //TODO: I need to figure out a way to handle generator iterables here in order to ensure that the 'collection' includes
            //TODO: the item being examined. I also need to make sure I am executing generators consistently across the iterators.

            //TODO: The logic here needs adjusting.
            //if (!res && collection.includes(item)) yield item;
            collection = Array.isArray(collection) ? collection : Array.from(collection);
            if (!res && ~collection.findIndex(function findMatchingItem(it) { return comparer(item, it); })) yield item;
        }
    };
}

export { intersect };