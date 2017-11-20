import { mapSubscriber } from '../subscribers/mapSubscriber';
import { initOperator, subscribe } from './operator_helpers';
import { identity } from '../../combinators';

var mapOperator = {
    get transform() {
        return this._transform;
    },
    set transform(fn) {
        this._transform = fn;
    },
    init: function _init(projectionFunc = identity) {
        this.transform = projectionFunc;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(mapSubscriber).init(subscriber, this.transform));
    }
};

export { mapOperator };