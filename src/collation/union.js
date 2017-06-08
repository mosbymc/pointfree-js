import { cacher } from '../helpers';
import { isArray, strictEqual } from '../functionalHelpers';
import { when } from '../combinators';
import { not } from '../decorators';

function union(source, enumerable, comparer = strictEqual) {
    var isInCache = cacher(comparer);

    return function *unionIterator() {
        for (let item of source) {
            if (!isInCache(item)) yield item;
        }

        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of enumerable) {
            if (!isInCache(item)) yield item;
        }
    };
}

export { union };