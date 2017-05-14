import { Constant, _constant_m } from './constant_monad';
import { Identity, _identity_m } from './identity_monad';
import { Io, _io_m } from './io_monad';
import { List, _list_m, ordered_list_m } from './list_monad';
import { Maybe, _maybe_m } from './maybe_monad';

function _toConstant() {
    return Constant.of(this.value);
}

function _toIdentity() {
    return Identity.of(this.value);
}

function _toIo() {
    return Io.of(this.value);
}

function _toList() {
    return List.from(this.value);
}

function _toMaybe() {
    return Maybe.of(this.value);
}

_constant_m.toIdentity = _toIdentity;
_constant_m.toIo = _toIo;
_constant_m.toList = _toList;
_constant_m.toMaybe = _toMaybe;

_identity_m.toConstant = _toConstant;
_identity_m.toIo = _toIo;
_identity_m.toList = _toList;
_identity_m.toMaybe = _toMaybe;

_list_m.toConstant = _toConstant;
_list_m.toIdentity = _toIdentity;
_list_m.toIo = _toIo;
_list_m.toMaybe = _toMaybe;

ordered_list_m.toConstant = _toConstant;
ordered_list_m.toIdentity = _toIdentity;
ordered_list_m.toIo = _toIo;
ordered_list_m.toMaybe = _toMaybe;

_maybe_m.toIdentity = _toIdentity;
_maybe_m.toIo = _toIo;
_maybe_m.toConstant = _toConstant;
_maybe_m.toList = _toList;

var monads = {
    Constant,
    Identity,
    Io,
    List,
    Maybe
};

export { monads };