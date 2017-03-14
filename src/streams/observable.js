var observable = {
    source: null,
    of: function _of(...items) {},
    from: function _from() {},
    [Symbol.observable]: function _observable() { return this; }
};

var eventObservable = Object.create(observable);
eventObservable.subscribe = function _subscribe(observer) {
    this.source.addEventListener(function _handler(e) {
        return observer.next(e);
    });
};

var listObservable = Object.create(observable);
listObservable.subscribe = function _subscribe(observer) {
    for (let item of this.source) {
        return observer.next(item);
    }
};

export { observable };