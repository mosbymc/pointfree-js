import { kestrel } from '../functionalHelpers';

function just(item) {
    return Object.create(_just, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

just.of = function _of(item) {
    return just(item);
};

var _just = {
    get value() {
        return this._value;
    },
    map: kestrel(this),
    apply: function _apply(ma) {
        return ma.map(this.value);
    },
    flatMap: this.map,
    join: this.map,
    of: function _of(item) {
        return just.of(item);
    },
    toString: function _toString() {
        return `Just(${this.value})`;
    }
};

export { just, _just };