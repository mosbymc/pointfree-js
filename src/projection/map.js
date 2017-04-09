import { javaScriptTypes } from '../helpers';

function map(source, fn) {
    return function *mapIterator() {
        for (let item of source) {
            let res = fn(item);
            if (javaScriptTypes.undefined !== res) yield res;
        }
    };
}

export { map };