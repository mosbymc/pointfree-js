import { isArray } from '../functionalHelpers';

function deepMap(source, fn) {
    return function *deepMapIterator() {
        var results = [];
        for (let item of source) {
            let res = recursiveMap(item);
            if (isArray(res)) results = results.concat(res);
            if (results.length) yield results.shift();
            else if (undefined !== res) yield res;
        }

        while (results.length) yield results.shift();

        function recursiveMap(item) {
            if (isArray(item))
                return recursiveMap(item);
            return fn(item);
        }
    };
}

export { deepMap };