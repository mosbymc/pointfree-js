import { filterSubscriber } from '../subscribers/filterSubscriber';
import { initOperator, subscribe } from './operator_helpers';
import { defaultPredicate } from '../../functionalHelpers';

var filterOperator = {
    init: initOperator(['predicate', defaultPredicate]),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, filterSubscriber);
    }
};

export { filterOperator };