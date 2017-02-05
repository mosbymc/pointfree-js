import { defaultEqualityComparer } from '../helpers';

function groupJoin(outer, inner, outerSelector, innerSelector, projector, comparer) {
    comparer = comparer || defaultEqualityComparer;

    return function *groupJoinIterator() {
        var innerGroups = [];
        for (let innerItem of inner) {
            let innerRes = innerSelector(innerItem);
            var matchingGroup = innerGroups.find(function _findInnerGroup(grp) {
                return comparer(grp.key, innerRes);
            });

            if (!matchingGroup) matchingGroup = { key: innerRes, items: [innerItem] };
            innerGroups[innerGroups.length] = matchingGroup;
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