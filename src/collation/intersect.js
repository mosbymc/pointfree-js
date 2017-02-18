import { defaultEqualityComparer } from '../helpers';
import { when, not, isArray } from '../functionalHelpers';

function intersect(source, collection, comparer) {
    comparer = comparer || defaultEqualityComparer;

    return function *intersectIterator() {
        /*var res;
        for (let item of source) {
            res = havePreviouslyViewed(item);
            //TODO: I need to figure out a way to handle generator iterables here in order to ensure that the 'collection' includes
            //TODO: the item being examined. I also need to make sure I am executing generators consistently across the iterators.

            //TODO: The logic here needs adjusting.
            //if (!res && collection.includes(item)) yield item;
            collection = when(not(isArray), Array.from, collection);
            if (!res && ~collection.findIndex(function findMatchingItem(it) { return comparer(item, it); })) yield item;
        }*/
        collection = when(not(isArray), Array.from, collection);
        for (let item of source) {
            if (undefined !== item && collection.some(function _checkEquivalency(it) {
                    return comparer(item, it);
                }))
            {
                yield item;
            }
        }
    };
}

export { intersect };