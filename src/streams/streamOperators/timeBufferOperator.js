import { timeBufferSubscriber } from '../subscribers/timeBufferSubscriber';
import { initOperator, subscribe } from './operator_helpers';

var timeBufferOperator = {
    init: function _init(amt) {
        this.interval = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(timeBufferSubscriber).init(subscriber, this.interval));
    }
};

/*
var timeBufferOperator = {
    init: initOperator(['interval', 0]),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, timeBufferSubscriber);
    }
};
*/

export { timeBufferOperator };