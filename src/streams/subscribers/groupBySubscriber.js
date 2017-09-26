import { subscriber } from './subscriber';
import { sortData } from '../../dataStructures/sort_util';

var groupBySubscriber = Object.create(subscriber, {
    next: {
        value: function _next(item) {
            if (this.buffer.length + 1 >= this.bufferAmount) {
                try {
                    var res = groupData(this.buffer.concat(item), [ { keySelector: this.keySelector, comparer: this.comparer, direction: 2 } ]);
                    this.subscriber.next(res);
                    this.buffer.length = 0;
                }
                catch (ex) {
                    this.subscriber.error(ex);
                }
            }
            else this.buffer[this.buffer.length] = item;
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, keySelector, comparer, bufferSize) {
            this.initialize(subscriber);
            this.keySelector = keySelector;
            this.comparer = comparer;
            this.bufferAmount = bufferSize;
            this.buffer = [];
            return this;
        },
        writable: false,
        configurable: false
    }
});

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