import { observableStatus } from '../../helpers';

/**
 * @namespace stream
 */

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
 * @memberOf stream
 * @description:
 */
var subscriber = {
    get status() {
        return this._status || observableStatus.inactive;
    },
    set status(status) {
        this._status = Object.keys(observableStatus)
            .map(stat => observableStatus[stat])
            .includes(status) ?
            status : this.status;
    },
    get count() {
        return this._count || 0;
    },
    set count(cnt) {
        this._count = Number.isInteger(cnt) && -1 < cnt ? cnt : this.count;
    },
    get subscribers() {
        return this._subscribers || [];
    },
    set subscribers(subs) {
        this._subscribers = subs;
    },
    get subscriptions() {
        return this._subscriptions || [];
    },
    set subscriptions(subs) {
        this._subscriptions = subs;
    },
    removeSubscribers: function _removeSubscribers() {
        this.subscribers = [];
        return this;
    },
    removeSubscriber: function _removeSubscriber(s) {
        this.subscribers = this.subscribers.filter(sub => sub !== s);
        return this;
    },
    removeSubscription: function _removeSubscription(subscription) {
        this.subscriptions = this.subscriptions.filter(sub => sub !== subscription);
        return this;
    },
    /**
     * @description d
     * @memberOf stream.subscriber
     * @return {stream.subscriber} Returns this
     */
    removeSubscriptions: function _removeSubscriptions() {
        this.subscriptions.length = 0;
        return this;
    },
    /**
     * @description d
     * @param {*} item - a
     * @return {subscriber} - b
     */
    next: function _next(item) {
        this.subscribers.forEach(sub => sub.next(item));
        //this.subscriber.next(item);
        //return this;
        //Promise.resolve(item).then(this.then);
    },
    error: function _error(err) {
        this.status = observableStatus.complete;
        this.subscribers.forEach(sub => sub.error(err));
        //this.status = observableStatus.complete;
        //this.subscriber.error(err);
    },
    complete: function _complete() {
        this.status = observableStatus.complete;
        this.subscribers.forEach(function _completeSubscribers(sub) {
            if (observableStatus.complete !== sub.status) sub.complete();
        });
        //this.status = observableStatus.complete;
        //if (this.subscriber && observableStatus.complete !== this.subscriber.status) this.subscriber.complete();
    },
    initialize: function _initialize(next, error, complete) {
        this.status = observableStatus.active;
        this.count = 0;
        this.subscriptions = [];

        if (subscriber.isPrototypeOf(next)) {
            this.subscribers = this.subscribers.concat(next);
            next.subscriptions = next.subscriptions ? next.subscriptions.concat(this) : [this];
            return this;
        }
        this.subscribers = [{
            next: next,
            error: error,
            complete: complete
        }];
        return this;
    },
    onError: function _onError(error) {
        this.subscribers = this.subscribers.map(function _updateErrorHandler(s) {
            s.error = error;
            return s;
        });
        return this;
    },
    onComplete: function _onComplete(complete) {
        this.subscribers = this.subscribers.map(function _updateCompleteHandler(s) {
            s.complete = complete;
            return s;
        });
        return this;
    },
    unsubscribe: function _unsubscribe() {
        if (observableStatus.complete === this.status) return;
        this.complete();

        while (this.subscribers.length) {
            let sub = this.subscribers.shift();
            if (sub.unsubscribe) sub.unsubscribe();
        }

        while (this.subscriptions.length) {
            console.log(this.subscriptions);
            var subscription = this.subscriptions.shift();
            if (subscription.cleanUp) subscription.cleanUp();
            subscription.unsubscribe();
        }
        console.log(1);
    }
};

export { subscriber };