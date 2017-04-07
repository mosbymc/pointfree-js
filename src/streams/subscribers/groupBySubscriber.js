import { subscriber } from './subscriber';
import { sortData } from '../../projection/sortHelpers';

var groupBySubscriber = Object.create(subscriber);
groupBySubscriber.next = function _next(item) {
    if (this.buffer.length + 1 >= this.bufferAmount) {
        try {
            var res = groupData(this.buffer, [ { keySelector: this.keySelector, comparer: this.comparer, direction: 'desc' } ]);
            this.subscriber.next(res);
            this.buffer.length = 0;
        }
        catch (ex) {
            this.subscriber.error(ex);
        }
    }
    else this.buffer[this.buffer.length] = item;
};
groupBySubscriber.init = function _init(subscriber, keySelector, comparer, bufferAmount) {
    this.initialize(subscriber);
    this.keySelector = keySelector;
    this.comparer = comparer;
    this.bufferAmount = bufferAmount;
    this.buffer = [];
    return this;
};

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
        arr.push(grp);
        return grp;
    }
}

export { groupBySubscriber };