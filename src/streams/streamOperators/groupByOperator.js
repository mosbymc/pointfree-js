import { groupBySubscriber } from '../subscribers/groupBySubscriber';

var groupByOperator = {
    get keySelector() {
        return this._keySelector;
    },
    set keySelector(ks) {
        this._keySelector = ks;
    },
    get comparer() {
        return this._comparer;
    },
    set comparer(c) {
        this._comparer = c;
    },
    get bufferAmount() {
        return this._bufferAmount || 0;
    },
    set bufferAmount(amt) {
        this._bufferAmount = amt;
    },
    init: function _init(keySelector, comparer, bufferAmount) {
        this.keySelector = keySelector;
        this.comparer = comparer;
        this.bufferAmount = bufferAmount;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(groupBySubscriber).init(subscriber, this.keySelector, this.comparer, this.bufferAmount));
    }
};

export { groupByOperator };