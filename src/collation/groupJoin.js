import { defaultEqualityComparer } from '../helpers';

function groupJoin(outer, inner, outerSelector, innerSelector, projector, comparer) {
    comparer = comparer || defaultEqualityComparer;

    return function *groupJoinIterator() {
        var innerGroups = [];
        for (let innerItem of inner) {
            let foundMatch = false;
            let innerRes = innerSelector(innerItem);
            innerGroups.forEach(function _findMatchingGroup(grp) {
                if (comparer(grp.key, innerRes)) {
                    grp.items[grp.items.length] = inner;
                    foundMatch = true;
                }
            });

            if (!foundMatch) {
                innerGroups[innerGroups.length] = { key: innerRes, items: [inner] };
            }
        }

        for (let outerItem of outer) {
            var innerMatch =  innerGroups.find(function _compareByKeys(innerItem) {
                return comparer(outerSelector(outerItem), innerItem.key);
            });

            yield projector(outerItem, undefined === innerMatch ? [] : innerMatch.items );
        }
    };
}

export { groupJoin };