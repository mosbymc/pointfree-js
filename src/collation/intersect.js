import { javaScriptTypes } from '../helpers';
import { isArray, strictEquals } from '../functionalHelpers';
import { when } from '../combinators';
import { not } from '../decorators';

function intersect(source, enumerable, comparer = strictEquals) {
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