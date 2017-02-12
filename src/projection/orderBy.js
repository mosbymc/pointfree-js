import { identity, ifElse, wrap, isArray, not } from '../functionalHelpers';
import { sortData } from  './sortHelpers';

//TODO: I should probably make this take either a "fields" object, or a selector function
//TODO: It also seems an insertion sort would work better in terms of lazy evaluation... of course, if
//TODO: I can chain multiple calls to "orderBy/orderByDescending/thenBy/thenByDescending" together
//TODO: beneath the covers, then I'd need all the data up front.

//TODO: Since group by functionality will work the same way, it's probably best to think this through
//TODO: first before committing to a mode of functionality  now.
function orderBy(source, fields) {
    return function *orderByIterator() {

    };
}

function orderByDescending(fields) {
    return function groupDataExecutor(data) {
        return orderData(fields, data);
    }
}

function orderData(fields, data) {
    return sortData(ifElse(not(isArray), wrap, identity, data), fields);
}

export { orderBy, orderByDescending };