import { itemBufferSubscriber } from '../subscribers/itemBufferSubscriber';
import { initOperator, subscribe } from './operator_helpers';

var itemBufferOperator = {
    init: initOperator('count'),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, itemBufferSubscriber);
    }
};

export { itemBufferOperator };