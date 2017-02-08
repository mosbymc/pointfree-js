import { javaScriptTypes } from '../helpers';

function all(source, predicate) {
    if (javaScriptTypes.function !== typeof predicate)
        return false;
    return Array.from(source).every(predicate);
}

export { all };