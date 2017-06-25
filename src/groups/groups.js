import { groupFactory } from './group_factory';

var sumGroup = groupFactory((x, y) => x + y, x => -x, 0, 'Sum');

var multGroup = groupFactory((x, y) => x * y, x => 1 / x, 1, 'Multiply');

var strGroup = groupFactory((x, y) => x + y, x => x, '', 'String');

var allGroup = groupFactory(_all, x => !x, null, 'All');

var anyGroup = groupFactory((x, y) => !!(x || y), x => !x, false, 'Any');

function _all(x, y) {
    return !!(x && y);
}






var subGroup = groupFactory((x, y) => x - y, x => -x, 0, 'Sub');

var divGroup = groupFactory((x, y) => x / y, x => 1 / x, 1, 'Division');

var firstGroup = groupFactory(function _firstConcat(y) {
    return firstGroup(this.value);
}, 'First');

export { sumGroup, multGroup, strGroup, allGroup, anyGroup };