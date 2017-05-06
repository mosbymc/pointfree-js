//TODO: see if there is any real performance increase by just using .includes when a comparer hasn't been passed
//import { defaultEqualityComparer } from '../helpers';
import { when, not, isArray, delegatesTo } from '../functionalHelpers';
import { javaScriptTypes } from '../helpers';
import { ordered_m_list } from '../list_monad/list';

function contains(source, val, comparer) {
    source = when(not(isArray), Array.from, source);
    if (javaScriptTypes.undefined === typeof comparer)
        return source.includes(val);
    return source.some(function _checkEquality(item) {
        return comparer(item, val);
    });
}

function binary(source, val, comparer) {
    if (delegatesTo(source, ordered_m_list) && javaScriptTypes.undefined === typeof comparer)
        return binarySearch(when(not(isArray), Array.from, source), val, comparer);
    else return contains(source, val, comparer);
}

function binarySearch(source, left, right, val, comparer) {
    if (left > right) return false;
    var mid = (left + (right - left)) / 2,
        res = comparer(val, source[mid]);
    if (0 === res) return true;
    else if (0 < res) return binarySearch(source, left, mid - 1, val, comparer);
    else return binarySearch(source, mid + 1, right, val, comparer);
}

export { contains, binary };