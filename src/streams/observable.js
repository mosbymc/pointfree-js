var observable = {
    subscribe: function _subscribe() {},
    of: function _of(...items) {},
    from: function _from() {},
    [Symbol.observable]: function _observable() { return this; }
};

export { observable };