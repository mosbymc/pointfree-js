import { subscriber } from './subscriber';

var itemBufferSubscriber = Object.create(subscriber);
itemBufferSubscriber.next = function _next(val) {
    this.buffer[this.buffer.length] = val;
    if (this.buffer.length >= this.count) {
        this.subscriber.next(this.buffer.map(function _mapBuffer(item) { return item; }));
        this.buffer.length = 0;
    }
};
itemBufferSubscriber.init = function _init(subscriber, count) {
    this.initialize(subscriber);
    this.buffer = [];
    this.count = count;
    return this;
};

export { itemBufferSubscriber };