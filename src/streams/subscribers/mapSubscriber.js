import { subscriber } from './subscriber';

var mapSubscriber = Object.create(subscriber);
mapSubscriber.next = function _next(item) {
    var res;
    try {
        res = this.transform(item, this.count++);
    }
    catch (err) {
        this.subscriber.error(err);
        return;
    }
    this.subscriber.next(res);
    //Promise.resolve(res).then(this.then);
};
mapSubscriber.init = function _init(subscriber, transform) {
    this.initialize(subscriber);
    this.transform = transform;
    return this;
};

export { mapSubscriber };