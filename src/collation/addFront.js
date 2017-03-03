import { when, not, isArray } from '../functionalHelpers';

function addFront(source, enumerable) {
    return function *addFront() {
        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of enumerable) {
            if (undefined !== item) yield item;
        }

        for (let item of source) {
            if (undefined !== item) yield item;
        }
    };
}

export { addFront };