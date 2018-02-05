import { subscriber } from './subscriber';
import { IndexSubscriber } from './indexedSubscriber';
import { observableStatus } from '../../helpers';

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
    function mergeComplete(mergeables) {
        return (function _complete() {
            if (this.mergeables.every(m => observableStatus.complete === m.status)) return this.subscriber.complete();
        }).bind(this);
    }

    this.mergeables = [];
    this.transform = transform;
    this.subscriber = subscriber;
    observables.forEach(function _subscribeToEach(o, idx) {
        this.mergeables = this.mergeables.concat(IndexSubscriber.fromObservable(o, this, idx));
    }, this);
    this.buffer = new Array(observables.length);
    this.buffer.forEach((buf, idx) => buf[idx] = {});
    this.initialize(this.subscriber);
    /*
    this.mergeables = this.mergeables.concat(IndexSubscriber(this, observables.length));
    //return IndexSubscriber(this, observables.length);
    this.complete = mergeComplete.call(this, this.mergeables);
    return this.mergeables[this.mergeables.length - 1];
     */
    return IndexSubscriber(this, observables.length);
};

export { zipSubscriber };