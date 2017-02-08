import { javaScriptTypes } from '../helpers';

function last(source, predicate) {
    var data = Array.from(source);
    if (javaScriptTypes.function === typeof predicate)
        data = data.filter(predicate);
    return data[data.length - 1];
}

export { last };