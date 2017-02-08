import { javaScriptTypes } from '../helpers';

function any(source, predicate) {
    if (javaScriptTypes.function !== typeof predicate)
        return Array.from(source).length > 0;
    return Array.from(source).some(predicate);
}

export { any };