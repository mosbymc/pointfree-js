function monoidFactory(concatFn, type) {
    var emptyObj = Object.create({});

    function _monoid(x) {
        return Object.create({}, {
            _value: {
                value: x
            },
            value: {
                get: function _getValue() {
                    return this.isEmpty ? undefined : this._value;
                }
            },
            concat: {
                value: function _concat(other) {
                    return this.isEmpty ? _monoid(other._value)
                        : other.isEmpty ? _monoid(this._value) : concatFn.call(this, other);
                }
            },
            constructor: {
                value: _monoid
            },
            isEmpty: {
                value: emptyObj.isPrototypeOf(x)
            },
            toString: {
                value: function _toString() {
                    return `${type}(${toString.call(this)})`;
                }
            }
        });
    }

    function toString() {
        if (this.isEmpty) return 'empty';
        if (Object.is(-0, this.value)) return '-0';
        return this.value.toString();
    }

    _monoid.empty = function _empty() {
        return _monoid(Object.create(emptyObj));
    };

    return _monoid;
}

export { monoidFactory };