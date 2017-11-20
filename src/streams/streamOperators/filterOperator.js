import { filterSubscriber } from '../subscribers/filterSubscriber';
import { initOperator, subscribe } from './operator_helpers';
import { defaultPredicate } from '../../functionalHelpers';

var filterOperator = {
    get predicate() {
        return this._predicate;
    },
    set predicate(fn) {
        this._predicate = fn;
    },
    init: function _init(pred = defaultPredicate) {
        this.predicate = pred;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(filterSubscriber).init(subscriber, this.predicate));
    }
};

/*
var filterOperator = {
    init: initOperator(['predicate', defaultPredicate]),
    subscribe: function _subscribe(subscriber, source) {
        return subscribe.call(this, subscriber, source, filterSubscriber);
    }
};
*/

export { filterOperator };