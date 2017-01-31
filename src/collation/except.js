import { defaultEqualityComparer } from '../helpers';

function except(source, collection, comparer) {
    comparer = comparer || defaultEqualityComparer;

    return function *exceptIterator() {
        var res;
        for (let item of source) {
            res = collection.some(function _comparer(it) {
                return comparer(item, it);
            });

            if (res) yield item;
        }
    };
}

export { except };