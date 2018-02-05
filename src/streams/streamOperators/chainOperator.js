import { chainSubscriber } from '../subscribers/chainSubscriber';
import { initOperator, subscribe } from './operator_helpers';
import { noop } from '../../functionalHelpers';
import { identity } from '../../combinators';

var chainOperator = {
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
        return source.subscribe(Object.create(chainSubscriber).init(subscriber, this.transform));
    }
};
/*
var chainOperator = {
    init: initOperator(['transform', noop]),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, chainSubscriber);
    }
};*/

export { chainOperator };