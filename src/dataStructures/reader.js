import { equals, stringMaker, valueOf } from './data_structure_util';

/**
 * @signature
 * @description d
 * @namespace Reader
 * @memberOf dataStructures
 * @property {function} of
 * @param {function} run - a
 * @return {dataStructures.reader} - b
 */
function Reader(run) {
    return Object.create(reader, {
        run: {
            value: run
        }
    });
}

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Reader
 * @param {*} val - a
 * @return {dataStructures.reader} - b
 */
Reader.of = function _of(val) {
    return Reader(constant(val));
};

/**
 * @description d
 * @memberOf dataStructures
 */
var reader = {
    chain: function _chain(f) {
        return Reader(e => f(this.run(e)).run(e));
    },
    map: function _map(f) {
        return this.chain(a => Reader.of(f(a)));
    },
    apply: function _apply(m) {
        return this.chain(f => m.map(f));
    },
    get [Symbol.toStringTag]() {
        return 'Reader';
    }
};