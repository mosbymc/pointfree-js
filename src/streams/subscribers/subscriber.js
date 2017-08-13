import { observableStatus } from '../../helpers';

/**
 * @typedef {Object}
 * @property {function} status
 * @property {function} count
 * @property {function} removeSubscriber
 * @property {function} removeSubscription
 * @property {function} removeSubscriptions
 * @property {function} next
 * @property {function} error
 * @property {function} complete
 * @property {function} initialize
 * @property {function} onNext
 * @property {function} onError
 * @property {function} onComplete
 * @description:
 */
var subscriber = {
    get status() {
        return this._status || observableStatus.inactive;
    },
    set status(status) {
        this._status = Object.keys(observableStatus)
            .map(function _statusValues(status) { return observableStatus[status]; })
            .includes(status) ?
            status : observableStatus.inactive;
    },
    get count() {
        return this._count || 0;
    },
    set count(cnt) {
        this._count = cnt || 0;
    },
    /**
     * @sig
     * @description d
     * @return {subscriber} - a
     */
    removeSubscriber: function _removeSubscriber() {
        this.subscriber = null;
        return this;
    },
    /**
     * @sig
     * @description d
     * @param {Object} subscription - a
     * @return {subscription} - b
     */
    removeSubscription: function _removeSubscription(subscription) {
        if (this.subscriptions.length) {
            this.subscriptions = this.subscriptions.filter(function _findSubscriber(sub) {
                return sub !== subscription;
            });
        }
    },
    /**
     * @sig
     * @description d
     * @return {subscriber} - a
     */
    removeSubscriptions: function _removeSubscriptions() {
        this.subscriptions.length = 0;
        return this;
    },
    /**
     * @sig
     * @description d
     * @param {*} item - a
     * @return {subscriber} - b
     */
    next: function _next(item) {
        this.subscriber.next(item);
        return this;
        //Promise.resolve(item).then(this.then);
    },
    error: function _error(err) {
        this.status = observableStatus.complete;
        this.subscriber.error(err);
    },
    complete: function _complete() {
        this.status = observableStatus.complete;
        if (this.subscriber && observableStatus.complete !== this.subscriber.status) this.subscriber.complete();
    },
    initialize: function _initialize(next, error, complete) {
        this.status = observableStatus.active;
        this.count = 0;
        this.subscriptions = [];
        this.then = (function _then(val) {
            return this.subscriber.next(val);
        }).bind(this);

        if (subscriber.isPrototypeOf(next)) {
            this.subscriber = next;
            next.subscriptions = next.subscriptions ? next.subscriptions.concat(this) : [].concat(this);
            return this;
        }
        this.subscriber = {
            next: next,
            error: error,
            complete: complete
        };
        return this;
    },
    onError: function _onError(error) {
        this.subscriber.error = error;
        return this;
    },
    onComplete: function _onComplete(complete) {
        this.subscriber.complete = complete;
        return this;
    },
    unsubscribe: function _unsubscribe() {
        if (observableStatus.complete === this.status) return;
        this.complete();
        if (this.subscriber && subscriber.isPrototypeOf(this.subscriber)) {
            var sub = this.subscriber;
            this.subscriber = null;
            sub.unsubscribe();
        }

        while (this.subscriptions.length) {
            var subscription = this.subscriptions.shift();
            if (subscription.cleanUp) subscription.cleanUp();
            subscription.unsubscribe();
        }
    }
};

export { subscriber };