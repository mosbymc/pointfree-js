import { when, not, isArray } from '../functionalHelpers';

function concat(source, enumerable) {
    return function *concatIterator() {
        for (let item of source) {
            if (undefined !== item) yield item;
        }

        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of enumerable) {
            if (undefined !== item) yield item;
        }
    };
}

export { concat };