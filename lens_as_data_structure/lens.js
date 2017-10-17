function Lens(...route) {
    return Object.create(lens, {
        _route: {
            value: Array.isArray(route[0]) ? route[0] : route,
            writable: false,
            configurable: false
        }
    });
}

Lens.of = function _of(path) {
    path = path.toString();
    return Object.create(lens, {
        _route: {
            value: path,
            writable: false,
            configurable: false
        }
    });
};

Lens.empty = function _empty() {
    return Lens('');
};

var lens = {
    get route() {
        return this._route;
    },
    map: function _map() {

    },
    chain: function _chain(fn) {
        return Object.getPrototypeOf(this).isPrototypeOf(fn);
    },
    concat: function _concat(l) {
        return Lens(this.route.concat(l.route));
    }
};