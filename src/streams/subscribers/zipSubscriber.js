import { subscriber } from './subscriber';
import { IndexSubscriber } from './indexedSubscriber';

var zipSubscriber = Object.create(subscriber);
zipSubscriber.next = function _next(item, observableIndex) {
    let bufferLen = this.buffer[observableIndex].push(item);
    let foundEach = true;
    this.buffer.forEach(function _checkBuffer(buf) {
        if (buf.length !== bufferLen) foundEach = false;
    });

    if (foundEach) {
        try {
            let args = [];
            this.buffer = this.buffer.filter(function _removeItems(buf) {
                args.push(buf[bufferLen - 1].shift());
                return buf;
            });
            if (this.transform) args = this.transform(...args);
            this.subscriber.next(args);
        }
        catch(err) {
            return this.subscriber.error(err);
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
    this.initialize(this.subscriber);
    return IndexSubscriber(this, observables.length);
};

export { zipSubscriber };