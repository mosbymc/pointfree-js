import { _future_f } from '../functors/future_functor';

function Future(f) {

}

Future.of = function _of(a) {
    return 'function' === typeof a ? Future(a) :
        Future(function _wrapper() {
            return a;
        });
};

Future.unit = function _unit(val) {
    var f = Future(val);
    return f.complete();
};

var _future_m = Object.create(_future_f, {
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val) {
            return Future.of(val);
        }
    }
});

_future_m.ap = _future_m.apply;

export { Future, _future_m };