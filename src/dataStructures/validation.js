import { apply, chain, join, equals, stringMaker, valueOf } from './data_structure_util';

var Validation = {
    success: function _success(val) {
        return Success(val);
    },
    failure: function _failure(val) {
        return Failure(val);
    },
    of: function _of(val) {
        return Success(val);
    },
    is: function _is(val) {
        let proto = Object.getPrototypeOf(val);
        return proto === success || proto === failure;
    }
};

function Success(suc) {
    return Object.create(success, {
        _value: {
            value: suc,
            writable: false,
            configurable: false
        }
    });
}

function Failure(fail) {
    return Object.create(failure, {
        _value: {
            value: [fail],
            writable: false,
            configurable: false
        }
    });
}

var success = {
    get value() {
        return this._value;
    },
    get extract() {
        return this._value;
    },
    isSuccess: function _isSuccess() {
        return true;
    },
    isFailure: function _isFailure() {
        return false;
    },
    concat: function _concat(other) {
        return other;
    }
};

var failure = {
    get value() {
        return this._value;
    },
    get extract() {
        return this._value;
    },
    isSuccess: function _isSuccess() {
        return false;
    },
    isFailure: function _isFailure() {
        return true;
    },
    concat: function _concat(other) {
        return other.isSuccess() ? this : Failure(this.value.concat(other.value));
    }
};

export { Validation, Success, Failure, success, failure };