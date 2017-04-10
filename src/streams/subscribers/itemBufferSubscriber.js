import { subscriber } from './subscriber';

var itemBufferSubscriber = Object.create(subscriber, {
    next: {
        value: function _next(val) {
            this.buffer[this.buffer.length] = val;
            if (this.buffer.length >= this.count) {
                this.subscriber.next(this.buffer.map(function _mapBuffer(item) { return item; }));
                this.buffer.length = 0;
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, count) {
            this.initialize(subscriber);
            this.buffer = [];
            this.count = count;
            return this;
        },
        writable: false,
        configurable: false
    }
});

export { itemBufferSubscriber };