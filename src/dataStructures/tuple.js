var positions = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

function Tuple(...args) {
    var t = Object.create(tuple, {
        _source: {
            value: args,
            writable: false,
            configurable: false
        }
    });

    args.forEach(function _setAccessorProps(arg, idx) {
        //Object.defineProperties doesn't accept 'positions[idx]' as a property name argument, so I have to
        //define these two props separately using Object.defineProperty instead. Also, while unlikely, tuple
        //only supports up to ten named properties, whereas I can index all properties regardless of how
        //many there are.
        Object.defineProperty(t, idx, {
            get: function _getIdx() { return arg; }
        });

        if (positions.length > idx) {
            Object.defineProperty(t, positions[idx], {
                get: function _getPlace() { return arg; }
            });
        }
    });

    return t;
}

Tuple.fromObject = function _fromObject(obj) {
    var objectProps = Object.keys(obj),
        t = Object.create(tuple, {
            _source: {
                value: objectProps.map(prop => obj[prop]),
                writable: false,
                configurable: false
            }
        });

    objectProps.forEach(function _setAccessorProps(arg, idx) {
        Object.defineProperty(t, idx, {
            get: function _getIdx() { return obj[arg]; }
        });

        Object.defineProperty(t, arg, {
            get: function _getProp() { return obj[arg]; }
        });

        if (positions.length > idx) {
            Object.defineProperty(t, positions[idx], {
                get: function _getPlace() { return obj[arg]; }
            });
        }
    });

    return t;
};

var tuple = {
    concat: function _concat(other) {
        return Tuple(this.source.concat(other.source));
    },
    toArray: function _toArray() {
        return this._source;
    },
    equals: function _equals(t) {
        return Object.getPrototypeOf(t).isPrototypeOf(this) && t._source.length === this._source.length &&
            t._source.every((item, idx) => this._source[idx] === item);
    },
    toString: function _toString() {
        return `Tuple(${this._source.join(',')})`;
    }
};