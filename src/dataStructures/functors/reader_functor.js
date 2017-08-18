import { equalMaker, pointMaker, stringMaker, valueOf, get, orElse, getOrElse } from '../dataStructureHelpers';

function Reader(run) {
    return Object.create(reader, {
        run: {
            value: run
        }
    });
}

Reader.of = function _of(val) {
    return Reader(constant(val));
};

var reader = {
    chain: function _chain(f) {
        return Reader(e => f(this.run(e)).run(e));
    },
    map: function _map(f) {
        return this.chain(a => Reader.of(f(a)));
    },
    apply: function _apply(m) {
        return this.chain(f => m.map(f));
    }
};