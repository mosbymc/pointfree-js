import { debounceSubscriber } from '../subscribers/debounceSubscriber';

var debounceOperator = {
    init: function _init(amt) {
        this.interval = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(debounceSubscriber).init(subscriber, this.interval));
    }
};

export { debounceOperator };