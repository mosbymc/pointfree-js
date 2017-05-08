import { when, not, isArray, strictEqual } from '../functionalHelpers';

function except(source, enumerable, comparer = strictEqual) {
    return function *exceptIterator() {
        var res;
        for (let item of source) {
            enumerable = when(not(isArray), Array.from, enumerable);
            res = !(enumerable.some(function _comparer(it) {
                return comparer(item, it);
            }));
            if (res) yield item;
        }
    };
}

export { except };