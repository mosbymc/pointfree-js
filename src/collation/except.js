import { defaultEqualityComparer } from '../helpers';
import { when, not, isArray } from '../functionalHelpers';

function except(source, enumerable, comparer) {
    comparer = comparer || defaultEqualityComparer;

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