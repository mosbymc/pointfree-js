import { subscriber } from './subscriber';

var timeBufferSubscriber = Object.create(subscriber);

Object.defineProperty(
    timeBufferSubscriber,
    'id',
    {
        get: function _getId() {
            return this._id || 0;
        },
        set: function _setId(val) {
            this._id = val;
        }
    }
);

timeBufferSubscriber.next = function _next(val) {
    this.buffer[this.buffer.length] = val;
};

timeBufferSubscriber.init = function _init(subscriber, interval) {
    this.initialize(subscriber);
    this.buffer = [];
    this.now = Date.now;

    function _interval() {
        var buffer = this.buffer.map(b => b);
        if (buffer.length) {
            this.subscriber.next(buffer.map(i => i));
            this.buffer.length = 0;
        }
    }

    this.id = setInterval((_interval).bind(this), interval);
    this.subscriber = subscriber;
    return this;
};

timeBufferSubscriber.cleanUp = function _cleanUp() {
    clearInterval(this.id);
    this.buffer.length = 0;
    subscriber.unsubscribe.call(this);
};

export { timeBufferSubscriber };