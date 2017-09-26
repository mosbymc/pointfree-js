import { subscriber } from './subscriber';

var mergeSubscriber = Object.create(subscriber, {
    next: {
        value: function _next(item) {
            if (this.transform) {
                var res;
                try {
                    res = this.transform(item, this.count++);
                }
                catch (err) {
                    this.subscriber.error(err);
                    return;
                }
                //Promise.resolve(res).then(this.then);
                this.subscriber.next(res);
            }
            else this.subscriber.next(item);
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, observables, transform) {
            this.transform = transform;
            observables.forEach(function _subscribeToEach(observable) {
                observable.subscribe(this);
            }, this);
            this.initialize(subscriber);
            return this;
        },
        writable: false,
        configurable: false
    }
});

/*
var mergeSubscriber = Object.create(subscriber, {
    next: {
        value: function _next(item) {
            if (this.transform) {
                var res;
                try {
                    res = this.transform(item, this.count++);
                }
                catch (err) {
                    this.subscriber.error(err);
                    return;
                }
                //Promise.resolve(res).then(this.then);
                this.subscriber.next(res);
            }
            else this.subscriber.next(item);
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, observables, transform) {
            console.log(Array.prototype.slice.call(arguments)[2]);
            this.transform = transform;
            observables.forEach(function _subscribeToEach(observable) {
                observable.subscribe(this);
            }, this);
            this.initialize(subscriber);
            return this;
        },
        writable: false,
        configurable: false
    }
});
*/

export { mergeSubscriber };