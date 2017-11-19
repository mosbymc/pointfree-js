import { subscriber } from './subscriber';

var distinctSubscriber = Object.create(subscriber);
distinctSubscriber.next = function _next(item) {
    var sub = this.subscriber;
    try {
        if (!this.cached(item)) Promise.resolve(item).then(it => sub.next(it));// this.subscriber.next(item);
    }
    catch (err) {
        Promise.resolve(err).then(e => sub.error(e));
        //this.subscriber.error(err);
    }
};

distinctSubscriber.init = function _init(subscriber, comparer) {
    this.initialize(subscriber);
    this.cached = cacher(comparer);
    this.subscriber = subscriber;
    return this;
};

export { distinctSubscriber };