import { subscriber } from './subscriber';

var mergeSubscriber = Object.create(subscriber);
mergeSubscriber.next = function _next(item) {
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
};
mergeSubscriber.init = function _init(subscriber, observables, transform) {
    this.transform = transform;
    observables.forEach(function _subscribeToEach(observable) {
        observable.subscribe(this);
    }, this);
    this.initialize(subscriber);
    return this;
};

export { mergeSubscriber };