import { chainSubscriber } from '../subscribers/chainSubscriber';
import { initOperator, subscribe } from './operator_helpers';
import { noop } from '../../functionalHelpers';

var chainOperator = {
    init: initOperator(['transform', noop]),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, chainSubscriber);
    }
};

export { chainOperator };