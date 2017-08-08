import { subscriber } from './subscriber';
import { javaScriptTypes } from '../../helpers';

var debounceSubscriber = Object.create(subscriber, {
    next: {
        value: function _next(item) {
            if (null != this.id) this.tearDownTimeout();
            this.lastItem = item;
            this.lastTick = Date.now();
            this.id = setTimeout((this.getTimeoutFunc).bind(this), this.interval, item);
        }
    },
    init: {
        value: function _init(subscriber, interval) {
            this.initialize(subscriber);
            this.lastTick = null;
            this.lastItem = undefined;
            this.interval = interval;
            this.id = null;
            return this;
        }
    },
    getTimeoutFunc: {
        get: function _getTimeoutFunc() {
            return function timeoutFunc(item) {
                var thisTick = Date.now();
                if (this.lastTick <= thisTick - this.interval) {
                    var tmp = this.lastItem;
                    this.lastItem = undefined;
                    this.lastTick = thisTick;
                    this.subscriber.next(tmp);
                }
                else {
                    this.lastTick = thisTick;
                    this.lastItem = item;
                }
            };
        }
    },
    cleanUp: {
        value: function _cleanUp() {
            this.tearDownTimeout();
            this.lastTick = undefined;
            this.lastItem = undefined;
        }
    },
    tearDownTimeout: {
        value: function _tearDownTimeout() {
            if (this.id && javaScriptTypes.Number === typeof this.id) {
                clearTimeout(this.id);
                this.id = null;
            }
        }
    }
});

export { debounceSubscriber };