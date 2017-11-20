import { subscriber } from './subscriber';
import { javaScriptTypes } from '../../helpers';

var debounceSubscriber = Object.create(subscriber);

debounceSubscriber.next = function _next(item) {
    if (null != this.id) this.tearDownTimeout();
    this.lastItem = item;
    this.lastTick = Date.now();
    this.id = setTimeout((this.timeoutFunc).bind(this), this.interval, item);
};

debounceSubscriber.init = function _init(subscriber, interval) {
    this.initialize(subscriber);
    this.lastTick = null;
    this.lastItem = undefined;
    this.interface = interval;
    this.id = null;
    this.subscriber = subscriber;
    return this;
};

debounceSubscriber.cleanUp = function _cleanUp() {
    this.tearDownTimeout();
    this.lastTick = undefined;
    this.lastItem = undefined;
    subscriber.unsubscribe.call(this);
};

debounceSubscriber.tearDownTimeout = function _tearDownTimeout() {
    if (this.id && javaScriptTypes.Number === typeof this.id) {
        clearTimeout(this.id);
        this.id = null;
    }
};

Object.defineProperty(
    debounceSubscriber,
    'timeoutFunc', {
        get: function _getTimeoutFunc() {
            return function timeoutFunc(item) {
                var thisTick = Date.now();
                if (this.lastTick <= thisTick - this.interval) {
                    this.buffer.push(this.lastItem);
                    this.lastItem = undefined;
                    this.lastTick = thisTick;
                    var buffer = this.buffer;
                    this.subscriber.next(buffer.pop());
                }
                else {
                    this.lastTick = thisTick;
                    this.lastItem = item;
                }
            };
        }
    }
);

export { debounceSubscriber };