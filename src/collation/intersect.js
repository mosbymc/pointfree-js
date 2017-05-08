import { javaScriptTypes } from '../helpers';
import { when, not, isArray, strictEqual } from '../functionalHelpers';

function intersect(source, enumerable, comparer = strictEqual) {
    return function *intersectIterator() {
        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of source) {
            if (javaScriptTypes.undefined !== item && enumerable.some(function _checkEquivalency(it) {
                    return comparer(item, it);
                }))
            {
                yield item;
            }
        }
    };
}

export { intersect };