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
            if (isArray(item)) {
                var res = [];
                for (let it of item) {
                    res = res.concat(recursiveMap(it));
                }
                return res;
            }
            return fn(item);
        }
    };
}

export { deepMap };