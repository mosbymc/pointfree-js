//TODO: see if there is any real performance increase by just using .includes when a comparer hasn't been passed
//import { defaultEqualityComparer } from '../helpers';
import { when, not, isArray } from '../functionalHelpers';
import { javaScriptTypes } from '../helpers';

function contains(source, val, comparer) {
    source = when(not(isArray), Array.from, source);
    if (javaScriptTypes.undefined === typeof comparer)
        return source.includes(val);
    return source.some(function _checkEquality(item) {
        return comparer(item, val);
    });
}

export { contains };