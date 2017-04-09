import { when, not, isArray } from '../functionalHelpers';
import { javaScriptTypes } from '../helpers';

function zip(source, enumerable, selector) {
    return function *zipIterator() {
        var res,
            idx = 0;
        enumerable = when(not(isArray), Array.from, enumerable);

        if (!enumerable.length < 1) {
            for (let item of source) {
                if (idx > enumerable.length) return;
                res = selector(item, enumerable[idx]);
                if (javaScriptTypes.undefined !== res) yield res;
                ++idx;
            }
        }
    };
}

export { zip };