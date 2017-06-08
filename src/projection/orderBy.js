import { isArray } from '../functionalHelpers';
import { when } from '../combinators';
import { not } from '../decorators';
import { sortData } from  './sortHelpers';
import { javaScriptTypes } from '../helpers';

function orderBy(source, orderObject, comparer) {
    return function *orderByIterator() {
        //gather all data from the source before sorting
        orderObject.comparer = comparer;
        var orderedData = sortData(when(not(isArray), Array.from, source), orderObject);
        for (let item of orderedData) {
            if (javaScriptTypes.undefined !== typeof item) yield item;
        }
    };
}

export { orderBy };