import { isArray } from '../functionalHelpers';

function deepMap(source, fn) {
    return function *deepMapIterator() {
        var results = [];
        for (let item of source) {
            let res = recursiveMap(item);
            if (results.length) {
                results = results.concat(res);
                yield results.shift();
            }
            else if (undefined !== res) {
                if (isArray(res)) {
                    yield res.shift();
                    results = results.concat(res);
                }
                else yield res;
            }
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

function flatMap(source, fn) {
    return function *flatMapIterator() {
        var results = [];
        for (let item of source) {
            var res = fn(item);
            if (res.length) {
                results = results.concat(res);
                yield results.shift();
            }
            else if (undefined !== res) {
                if (isArray(res)) {
                    yield res.shift();
                    results = results.concat(res);
                }
            }
            else yield res;
        }

        while (results.length) yield results.shift();
    }
}

export { deepMap };