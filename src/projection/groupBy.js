import { when, isArray, not, get, objectSet } from '../functionalHelpers';
import { sortData } from  './sortHelpers';
import { createNewQueryableDelegator } from '../queryObjects/queryDelegatorCreators';

function groupBy(source, groupObject) {
    return function *groupByIterator() {
        //gather all data from the source before grouping
        var groupedData = groupData(when(not(isArray), Array.from, source), groupObject);
        for (let item of groupedData) yield createNewQueryableDelegator(item);
    };
}

function groupData(data, groupObject) {
    var sortedData = sortData(data, groupObject),
        retData = [];

    sortedData.forEach(function _groupSortedData(item) {
        let grp = retData;
        groupObject.forEach(function _createGroupsByFields(group) {
            grp = findGroup(grp, group.keySelector(item));
        });
        grp[grp.length] = item;
    });

    return retData;
}

function findGroup(arr, field) {
    var grp;
    if (arr.some(function _findGroup(group) {
            if (get('key', group) === field) {
                grp = group;
                return true;
            }
        }))
        return grp;
    else {
        grp = [];
        objectSet(field, 'key', grp);
        arr.push(grp);
        return grp;
    }
}

export { groupBy };