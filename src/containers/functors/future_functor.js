function Future(fn) {
    return Object.create(_future_f, {
        _fork: {
            value: fn,
            writable: false,
            configurable: false
        }
    });
}

Future.of = function _of(a) {
    return 'function' === typeof a ? Future(a) :
        Future(function _runner(rej, res) {
        return res(a)
    });
};

Future.unit = function _unit(val) {
    var f = Future(val);
    return f.complete();
};

var _future_f = {
    /**
     * @description:
     * @return: {@see _future_f}
     */
    get fork() {
        return this._fork;
    },
    subscribers: [],
    map: function _map(fn) {
        return this.of((function _futureMap(reject, resolve) {
            return this.fork(function _rej(err) {
                return reject(err);
            }, function _res(val) {
                return resolve(fn(val));
            })
        }).bind(this));
    },
    //TODO: probably need to compose here, not actually map over the value; this is a temporary fill-in until
    //TODO: I have time to finish working on the Future
    flatMap: function _flatMap(fn) {
        return _future_f.isPrototypeOf(this.value) ? this.value.map(fn) :
            this.of(fn(this.value));
    },
    of: function _of(a) {
        return Future.of(a);
    },
    toString: function _toString() {
        return `Future${this.fork}`;
    }
};

export { Future, _future_f };