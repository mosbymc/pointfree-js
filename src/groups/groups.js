import { groupFactory } from './group_factory';

var sumGroup = groupFactory((x, y) => x + y, x => -x, 0, 'Sum');

var subGroup = groupFactory((x, y) => x - y, x => -x, 0, 'Sub');

var multGroup = groupFactory((x, y) => x * y, x => 1 / x, 1, 'Multiply');

var divGroup = groupFactory((x, y) => x / y, x => 1 / x, 1, 'Division');


var strGroup = groupFactory((x, y) => x + y, x => x, '', 'String');

var allGroup = groupFactory(function _allConcat(y) {
    return allGroup(this.value && y.value);
}, 'All');

var anyGroup = groupFactory(function _anyConcat(y) {
    return anyGroup(this.value || y.value);
}, 'Any');

var firstGroup = groupFactory(function _firstConcat(y) {
    return firstGroup(this.value);
}, 'First');

export { sumGroup, subGroup, multGroup, divGroup };