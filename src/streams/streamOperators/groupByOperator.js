import { groupBySubscriber } from '../subscribers/groupBySubscriber';
import { initOperator, subscribe } from './operator_helpers';

var groupByOperator = {
    init: initOperator('keySelector, comparer, bufferAmount'),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, groupBySubscriber);
    }
};

export { groupByOperator };