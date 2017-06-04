import { javaScriptTypes } from '../helpers';
import { when, not, isArray, strictEqual } from '../functionalHelpers';

/*
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
}*/

function join(outer, inner, outerSelector, innerSelector, projector, comparer = strictEqual) {
    return function *join2Iterator(flag) {
        var groupedInner = groupData(when(not(isArray), Array.from, inner), innerSelector, flag),
            grp;

        if (flag) console.log(groupedInner);

        for (let outerItem of outer) {
            for (let group of groupedInner) {
                if (comparer(outerSelector(outerItem), group.key)) {
                    grp = group;
                    break;
                }
            }

            if (grp) {
                for (let item of grp) {
                    yield projector(outerItem, item);
                }
            }
        }
    }
}

function groupData(data, keySelector) {
    var groupedData = [],
        key, idx;

    data.forEach(function _groupData(item) {
        key = keySelector(item);
        idx = groupedData.findIndex(function _findIndexOfKey(grp) {
            return isDeepEqual(grp.key, key);
        });

        if (~idx) {
            groupedData[idx].push(item);
        }
        else {
            groupedData[groupedData.length] = [item];
            groupedData[groupedData.length - 1].key = key;
        }
    });
    return groupedData;
}

function isDeepEqual(a, b) {
    if (a === b) return true;

    if ('object' === typeof a && 'object' === typeof b) {
        if ((Array.isArray(a) && !Array.isArray(b)) || (!Array.isArray(a) && Array.isArray(b))) return false;
        if (Array.isArray(a) && Array.isArray((b))) {
            return a.every(function _testIndices(item, idx) {
                return isDeepEqual(item, b[idx]);
            });
        }
        return Object.keys(a).every(function _testObjKeys(key) {
            return key in b && isDeepEqual(a[key], b[key]);
        });
    }
}

export { join };