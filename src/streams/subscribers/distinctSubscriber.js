import { subscriber } from './subscriber';
import { cacher } from '../../helpers';

var distinctSubscriber = Object.create(subscriber);
distinctSubscriber.next = function _next(item) {
    try {
        if (!this.cached(item)) this.subscriber.next(item);
    }
    catch (err) {
        this.subscriber.error(err);
    }
};

distinctSubscriber.init = function _init(subscriber, comparer) {
    this.initialize(subscriber);
    this.cached = cacher(comparer);
    this.subscriber = subscriber;
    return this;
};

export { distinctSubscriber };