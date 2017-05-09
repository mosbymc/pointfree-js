import { when, isArray, not } from '../functionalHelpers';
import { sortData } from  './sortHelpers';


function groupBy(source, groupObject, queryableConstructor) {
    return function *groupByIterator() {
        //gather all data from the source before grouping
        var groupedData = nestLists(groupData(when(not(isArray), Array.from, source), groupObject), 0, null, queryableConstructor);
        for (let item of groupedData) yield item;
    };
}

function nestLists(data, depth, key, queryableConstructor) {
    if (isArray(data)) {
        data = data.map(function _createLists(item) {
            if (null != item.key) return nestLists(item, depth + 1, item.key, queryableConstructor);
            return item;
        });
    }
    if (0 !== depth) {
        data = queryableConstructor(data);
        data.key = key;
    }
    return data;
}

function logLevels(d) {
    if (isArray(d)) {
        d.forEach(function i(b) { logLevels(b); });
    }
    console.log(d);
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
            if (group.key === field) {
                grp = group;
                return true;
            }
        }))
        return grp;
    else {
        grp = [];
        grp.key = field;
        //objectSet(field, 'key', grp);
        arr.push(grp);
        return grp;
    }
}

export { groupBy, groupData };