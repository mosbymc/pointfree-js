import { itemBufferSubscriber } from '../subscribers/itemBufferSubscriber';
import { initOperator, subscribe } from './operator_helpers';

var itemBufferOperator = {
    init: function _init(amt) {
        this.count = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(itemBufferSubscriber).init(subscriber, this.count));
    }
};

/*
var itemBufferOperator = {
    init: initOperator('count'),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, itemBufferSubscriber);
    }
};
*/

export { itemBufferOperator };