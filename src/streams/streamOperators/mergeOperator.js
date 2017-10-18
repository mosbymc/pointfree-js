import { mergeSubscriber } from '../subscribers/mergeSubscriber';
import { initOperator, subscribe } from './operator_helpers';

var mergeOperator = {
    //TODO: update this to take an optional 'merge' function that defaults to an identity for each observable if not provided
    get observables() {
        return this._observables || [];
    },
    set observables(arr) {
        this._observables = arr;
    },
    init: function _init(observables, transform) {
        //TODO: fix merge operator - it doesn't appear to be working as intended
        this.observables = observables;
        this.transform = transform;
        return this;
    },
    //TODO: update this to take an optional 'merge' function that defaults to an identity for each observable if not provided
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(mergeSubscriber).init(subscriber, this.observables, this.transform));
        //return subscribe.call(this, subscriber, source, mergeSubscriber);
    }
};

export { mergeOperator };