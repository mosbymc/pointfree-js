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
        if (this.buffer.length) {
            //the map is needed here because, due to the asynchronous nature of subscribers and the subsequent
            //clearing of the buffer, the subscriber#next argument would be nullified before it had a chance
            //to act on it.
            this.subscriber.next(this.buffer.map(function _mapBuffer(item) { return item; }));
            this.buffer.length = 0;
        }
    }

    this.id = setInterval((_interval).bind(this), interval);
    return this;
};

timeBufferSubscriber.cleanUp = function _cleanUp() {
    clearInterval(this.id);
    this.buffer.length = 0;
    subscriber.unsubscribe.call(this);
};

export { timeBufferSubscriber };