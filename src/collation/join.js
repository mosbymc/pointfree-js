import { javaScriptTypes } from '../helpers';
import { when, not, isArray, strictEqual } from '../functionalHelpers';

function join(outer, inner, outerSelector, innerSelector, projector, comparer = strictEqual) {
    return function *joinIterator() {
        inner = when(not(isArray), Array.from, inner);
        for (let outerItem of outer) {
            for (let innerItem of inner) {
                if (comparer(outerSelector(outerItem), innerSelector(innerItem))) {
                    let res = projector(outerItem, innerItem);
                    if (javaScriptTypes.undefined !== res) yield res;
                }

            }
        }
    };
}

export { join };