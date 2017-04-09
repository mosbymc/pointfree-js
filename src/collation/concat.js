import { when, not, isArray } from '../functionalHelpers';
import { javaScriptTypes } from '../helpers';

function concat(source, enumerables, argsCount) {
    return function *concatIterator() {
        for (let item of source) {
            if (javaScriptTypes.undefined !== item) yield item;
        }

        var enumerable;
        if (1 === argsCount) {
            enumerable = when(not(isArray), Array.from, enumerables);
            for (let item of enumerable) {
                if (javaScriptTypes.undefined !== item) yield item;
            }
        }
        else {
            for (let list of enumerables) {
                enumerable = when(not(isArray), Array.from, list);
                for (let item of enumerable) {
                    if (javaScriptTypes.undefined !== item) yield item;
                }
            }
        }
    };
}

export { concat };