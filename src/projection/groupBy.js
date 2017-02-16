import { when, isArray, not } from '../functionalHelpers';
import { sortData2 } from  './sortHelpers';

function groupBy(source, groupObject) {
    return function *groupByIterator() {
        //gather all data from the source before grouping
        var groupedData = groupData(when(not(isArray), Array.from, source), groupObject);
        for (let item of groupedData) yield item;
    };
}

function groupData(data, groupObject) {
    var sortedData = sortData2(data, groupObject),
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
            if (group.key === field) {
                grp = group;
                return true;
            }
        }))
        return grp;
    else {
        grp = [];
        grp.key = field;
        arr.push(grp);
        return grp;
    }
}

export { groupBy };