import { noop } from '../functionalHelpers';

var observer = {
    status: observerStatus.inactive,
    next: null,
    error: null,
    complete: null,
    unsubscribe: function _unsubscribe() {
        if (observerStatus.subscribed === this.status) {
            this.complete();
            this.status = observerStatus.unsubscribed;
        }
    }
};

function createObserver(next = noop, error = noop, complete = noop) {
    var o = Object.create(observer);
    o.next = function _next(item) {
        return next(item);
    };

    o.error = function _error(err) {
        return error(err);
    };

    o.complete = function _complete() {
        return complete();
    };
    return o;
}

var observerStatus = {
    inactive: 0,
    subscribed: 1,
    unsubscribed: 2
};

export { observer };