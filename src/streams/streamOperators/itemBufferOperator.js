import { itemBufferSubscriber } from '../subscribers/itemBufferSubscriber';

var itemBufferOperator = {
    init: function _init(amt) {
        this.count = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(itemBufferSubscriber).init(subscriber, this.count));
    }
};

export { itemBufferOperator };