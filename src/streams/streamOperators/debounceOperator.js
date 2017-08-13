import { debounceSubscriber } from '../subscribers/debounceSubscriber';
import { initOperator, subscribe } from './operator_helpers';

var debounceOperator = {
    init: initOperator(['interval', 0]),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, debounceSubscriber);
    }
};

export { debounceOperator };