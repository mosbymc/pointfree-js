import { subscriber } from './subscriber';

var itemBufferSubscriber = Object.create(subscriber);

itemBufferSubscriber.next = function _next(item) {
    if (this.buffer.length >= this.count) {
        let buffer = this.buffer.map(b => b);
        this.subscriber.next(buffer);
        this.buffer = [];
    }
};

itemBufferSubscriber.init = function _init(subscriber, count) {
    this.initialize(subscriber);
    this.buffer = [];
    this.count = count;
    this.subscriber = subscriber;
    return this;
};

export { itemBufferSubscriber };