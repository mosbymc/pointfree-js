var distinctOperator = {
    get comparer() {
        return this._comparer;
    },
    set comparer(comparer) {
        this._comparer = comparer;
    },
    init: function _init(comparer) {
        this.comparer = comparer;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(distinctSubscriber).init(subscriber, this.comparer));
    }
};

export { distinctOperator };