import { mapSubscriber } from '../subscribers/mapSubscriber';
import { initOperator, subscribe } from './operator_helpers';
import { identity } from '../../combinators';

var mapOperator = {
    init: initOperator(['transform', identity]),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, mapSubscriber);
    }
};

export { mapOperator };