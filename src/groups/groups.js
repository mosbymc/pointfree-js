import { groupFactory } from './group_factory';

var xor = (x, y) => !!(x ^ y);

var xnor = (x, y) => x && y || !x && !y;



var sumGroup = groupFactory((x, y) => x + y, (x, y) => x - y, x => -x, 0, 'Sum');

var multGroup = groupFactory((x, y) => x * y, (x, y) => x * (1 / y), x => 1 / x, 1, 'Multiply');

var strGroup = groupFactory((x, y) => x + y, (x, y) => x.slice(x.lastIndexOf(y)), x => x, '', 'String');

var xorGroup = groupFactory(xor, (x, y) => !(x ^ y), x => x, false, 'Xor');

var xnorGroup = groupFactory(xnor, xnor, x => x, false, 'Xnor');




var allGroup = groupFactory(_all, x => x, undefined, 'All');

var anyGroup = groupFactory((x, y) => !!(x || y), x => !x, undefined, 'Any');

function _all(x, y) {
    return !!(x && y);
}




var subGroup = groupFactory((x, y) => x - y, x => -x, 0, 'Sub');

var divGroup = groupFactory((x, y) => x / y, x => 1 / x, 1, 'Division');

var firstGroup = groupFactory(function _firstConcat(y) {
    return firstGroup(this.value);
}, 'First');

export { sumGroup, multGroup, strGroup, xorGroup, xnorGroup };