import { javaScriptTypes } from '../helpers';
import { isArray, strictEqual } from '../functionalHelpers';
import { when } from '../combinators';
import { not } from '../decorators';

function groupJoin(outer, inner, outerSelector, innerSelector, projector, comparer = strictEqual) {
    return function *groupJoinIterator() {
        var innerGroups = [];
        inner = when(not(isArray), Array.from, inner);
        for (let innerItem of inner) {
            var innerRes = innerSelector(innerItem);
            var matchingGroup = innerGroups.find(_findInnerGroup);

            if (!matchingGroup) matchingGroup = { key: innerRes, items: [innerItem] };
            innerGroups[innerGroups.length] = matchingGroup;
        }

        for (var outerItem of outer) {
            var innerMatch =  innerGroups.find(_compareByKeys);
            let res = projector(outerItem, undefined === innerMatch ? [] : innerMatch.items );
            if (javaScriptTypes.undefined !== res) yield res;
        }

        function _findInnerGroup(grp) {
            return comparer(grp.key, innerRes);
        }

        function _compareByKeys(innerItem) {
            return comparer(outerSelector(outerItem), innerItem.key);
        }
    };
}

export { groupJoin };