import { compose } from '../src/combinators';

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
    return Object.create(lens, {
        _route: {
            value: path.toString(),
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
    map: function _map(fn) {
        return Lens(fn(this.route));
    },
    chain: function _chain(fn) {
        var res = fn(this.route);
        return Object.getPrototypeOf(this).isPrototypeOf(res) ? res : Lens(res);
    },
    concat: function _concat(l) {
        return Lens(this.route.concat(l.route));
    },
    compose: function _compose(...lenses) {
        return Lens(this.route(lenses.map(lens => lens.route)));
    }
};

function L2d2Factory(path) {
    return Object.create(l2d2, {
        _path: {
            value: path,
            writable: false,
            configurable: false
        }
    });
}

var l2d2 = {
    get path() {
        return this._path;
    },
    compose: function _compose(path) {
        return L2d2Factory(compose(this.path, path));
    }
};