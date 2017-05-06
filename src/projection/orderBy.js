import { when, isArray, not } from '../functionalHelpers';
import { sortData } from  './sortHelpers';
import { javaScriptTypes } from '../helpers';

function orderBy(source, orderObject, comparer) {
    return function *orderByIterator() {
        //gather all data from the source before sorting
        var orderedData = sortData(when(not(isArray), Array.from, source), orderObject, comparer);
        for (let item of orderedData) {
            if (javaScriptTypes.undefined !== typeof item) yield item;
        }
    };
}

export { orderBy };