import { isArray } from '../functionalHelpers';
import { when } from '../combinators';
import { not } from '../decorators';
import { javaScriptTypes } from '../helpers';

function addFront(source, enumerable) {
    return function *addFront() {
        enumerable = when(not(isArray), Array.from, enumerable);
        for (let item of enumerable) {
            if (javaScriptTypes.undefined !== item) yield item;
        }

        for (let item of source) {
            if (javaScriptTypes.undefined !== item) yield item;
        }
    };
}

export { addFront };