import { filterSubscriber } from '../subscribers/filterSubscriber';

var filterOperator = {
    get predicate() {
        return this._predicate;
    },
    set predicate(fn) {
        this._predicate = fn;
    },
    init: function _init(pred) {
        this.predicate = pred;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(filterSubscriber).init(subscriber, this.predicate));
    }
};

export { filterOperator };