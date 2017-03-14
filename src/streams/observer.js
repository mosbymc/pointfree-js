var observer = {
    status: 1,
    next: function _next(fn) {
        return function _innerNext(...args) {
            return fn(...args);
        };
    },
    error: function _error(fn) {
        return function _innerError(...args) {
            return fn(...args);
        };
    },
    complete: function _complete(fn) {
        return function _innerComplete() {
            return fn();
        };
    },
    unsubscribe: function _unsubscribe() {
        this.status = 0;
    }
};

function createObserver(next, error, complete) {
    var o = Object.create(observer);
}

export { observer };