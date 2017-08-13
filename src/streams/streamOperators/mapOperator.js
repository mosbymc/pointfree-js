import { mapSubscriber } from '../subscribers/mapSubscriber';
import { initOperator, subscribe } from './operator_helpers';
import { noop } from '../../functionalHelpers';

var mapOperator = {
    init: initOperator('transform' /*['transform', noop]*/),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, mapSubscriber);
    }
};

export { mapOperator };