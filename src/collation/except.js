import { defaultEqualityComparer } from '../helpers';
import { when, not, isArray } from '../functionalHelpers';

function except(source, collection, comparer) {
    comparer = comparer || defaultEqualityComparer;

    return function *exceptIterator() {
        var res;
        for (let item of source) {
            collection = when(not(isArray), Array.from, collection);
            res = !(collection.some(function _comparer(it) {
                return comparer(item, it);
            }));
            if (res) yield item;
        }
    };
}

export { except };