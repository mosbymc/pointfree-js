import { curry } from './functionalHelpers';

var apply = curry(function _apply(ma, mb) {
    return mb.apply(ma);
});

var fmap = curry(function _fmap(fn, m) {
    return m.flatMap(fn);
});

var flatMap = fmap;

var map = curry(function _map(fn, m) {
    return m.map(fn);
});

function mjoin(m) {
    return m.join();
}

export { apply, fmap, map, mjoin };