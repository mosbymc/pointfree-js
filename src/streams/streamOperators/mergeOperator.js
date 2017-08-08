import { mergeSubscriber } from '../subscribers/mergeSubscriber';

var mergeOperator = {
    get observables() {
        return this._observables || [];
    },
    set observables(arr) {
        this._observables = arr;
    },
    init: function _init(observables) {
        this.observables = observables;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(mergeSubscriber).init(subscriber, this.observables));
    }
};

export { mergeOperator };