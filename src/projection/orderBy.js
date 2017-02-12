import { when, isArray, not } from '../functionalHelpers';
import { sortData } from  './sortHelpers';

//TODO: I should probably make this take either a "fields" object, or a selector function
//TODO: It also seems an insertion sort would work better in terms of lazy evaluation... of course, if
//TODO: I can chain multiple calls to "orderBy/orderByDescending/thenBy/thenByDescending" together
//TODO: beneath the covers, then I'd need all the data up front.

//TODO: Since group by functionality will work the same way, it's probably best to think this through
//TODO: first before committing to a mode of functionality  now.
function orderBy(source, orderObject) {
    return function *orderByIterator() {
        //gather all data from the source before sorting
        yield sortData(when(not(isArray), Array.from, source), orderObject);
    };
}

export { orderBy };