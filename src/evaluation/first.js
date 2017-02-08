import { javaScriptTypes } from '../helpers';

function first(source, predicate) {
    if (javaScriptTypes.function === typeof predicate)
        return Array.from(source).find(predicate);
    return Array.from(source)[0];
}

export { first };