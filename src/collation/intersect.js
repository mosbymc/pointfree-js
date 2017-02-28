import { defaultEqualityComparer } from '../helpers';
import { when, not, isArray } from '../functionalHelpers';

function intersect(source, enumerable, comparer) {
    comparer = comparer || defaultEqualityComparer;

    return function *intersectIterator() {
        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of source) {
            if (undefined !== item && enumerable.some(function _checkEquivalency(it) {
                    return comparer(item, it);
                }))
            {
                yield item;
            }
        }
    };
}

export { intersect };