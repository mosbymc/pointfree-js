import { mergeSubscriber } from '../subscribers/mergeSubscriber';

var mergeOperator = {
    get observables() {
        return this._observables || [];
    },
    set observables(arr) {
        this._observables = arr;
    },
    get transform() {
        return this._transform;
    },
    set transform(fn) {
        this._transform = fn;
    },
    init: function _init(observables, transform) {
        this.observables = observables;
        this.transform = transform;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(mergeSubscriber).init(subscriber, this.observables, this.transform));
    }
};

export { mergeOperator };