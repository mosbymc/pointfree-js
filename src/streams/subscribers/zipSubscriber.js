import { subscriber } from './subscriber';
import { IndexSubscriber } from './indexedSubscriber';

var zipSubscriber = Object.create(subscriber);
zipSubscriber.next = function _next(item, index) {
    let foundMissing = false,
        setItem = false;
    this.buffer = this.buffer.map(function _mapBuffer(buf, idx) {
        if (!buf[index] && !setItem) {
            buf[index] = item;
            setItem = true;
        }
        else if (!buf[index]) foundMissing = true;
    });

    if (!foundMissing) {
        try {
            this.subscriber.next(this.buffer.filter(buf => buf[index]));
        }
        catch (err) {
            this.subscriber.error(err);
        }
    }
};
zipSubscriber.init = function _init(subscriber, observables, transform) {
    this.transform = transform;
    this.subscriber = subscriber;
    observables.forEach(function _subscribeToEach(o, idx) {
        IndexSubscriber.fromObservable(o, this, idx);
    }, this);
    this.buffer = new Array(observables.length);
    this.buffer.forEach((buf, idx) => buf[idx] = {});
    return this.initialize(IndexSubscriber(subscriber, observables.length));
};

export { zipSubscriber };