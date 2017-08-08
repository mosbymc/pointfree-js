import { timeBufferSubscriber } from '../subscribers/timeBufferSubscriber';

var timeBufferOperator = {
    init: function _init(amt) {
        this.interval = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(timeBufferSubscriber).init(subscriber, this.interval));
    }
};

export { timeBufferOperator };