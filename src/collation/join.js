import { defaultEqualityComparer } from '../helpers';

function join(outer, inner, outerSelector, innerSelector, projector, comparer) {
    comparer = comparer || defaultEqualityComparer;
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