import { subscriber } from './subscriber';

var filterSubscriber = Object.create(subscriber);
filterSubscriber.next = function _next(item) {
    try {
        if (this.predicate(item, this.count++))
            this.subscriber.next(item);
        //Promise.resolve(item).then(this.then);
    }
    catch (err) {
        this.subscriber.error(err);
    }
};
filterSubscriber.init = function _init(subscriber, predicate) {
    this.initialize(subscriber);
    this.predicate = predicate;
    return this;
};

export { filterSubscriber };