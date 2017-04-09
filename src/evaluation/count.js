import { javaScriptTypes } from '../helpers';

function count(source, predicate) {
    if (javaScriptTypes.undefined === predicate)
        return Array.from(source).length;
    return Array.from(source).filter(function filterItems(item) {
        return predicate(item);
    }).length;
}

export { count };