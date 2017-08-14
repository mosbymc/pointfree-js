import { mergeSubscriber } from '../subscribers/mergeSubscriber';
import { initOperator, subscribe } from './operator_helpers';

var mergeOperator = {
    //TODO: update this to take an optional 'merge' function that defaults to an identity for each observable if not provided
    init: initOperator('transform', 'observables'),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, mergeSubscriber);
    }
};

export { mergeOperator };