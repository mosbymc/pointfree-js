import { isArray } from '../functionalHelpers';
import { list_core } from '../list_monad/list';

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
    };
}

function flatMap2(source, fn) {
    return function *flatMap2Iterator() {
        for (let item of source) {
            if (null != item && item.map && 'function' === typeof item.map) {
                var res;
                if (list_core.isPrototypeOf(item)) res = item.map(fn).data;
                else res = item.map(fn);

                yield res;
            }
            else yield fn(item);
        }
    };
}

export { deepMap };