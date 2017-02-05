import { defaultEqualityComparer } from '../helpers';
import { when, not, isArray } from '../functionalHelpers';

function join(outer, inner, outerSelector, innerSelector, projector, comparer) {
    comparer = comparer || defaultEqualityComparer;
    inner = when(not(isArray), Array.from, inner);
    return function *joinIterator() {
        for (let outerItem of outer) {
            for (let innerItem of inner) {
                if (comparer(outerSelector(outerItem), innerSelector(innerItem)))
                    yield projector(outerItem, innerItem);
            }
        }
    };
}

export { join };