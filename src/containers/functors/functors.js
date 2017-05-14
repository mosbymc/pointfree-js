import { Constant, _constant_f } from './constant_functor';
import { Identity, _identity_f } from './identity_functor';
import { Io, _io_f } from './io_functor';
import { List, list_functor_core } from './list_functor';
import { Maybe, _maybe_f } from './maybe_functor';

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

_constant_f.toList = _toList;
_constant_f.toIdentity = _toIdentity;
_constant_f.toIo = _toIo;
_constant_f.toMaybe = _toMaybe;

_identity_f.toList = _toList;
_identity_f.toConstant = _toConstant;
_identity_f.toIo = _toIo;
_identity_f.toMaybe = _toMaybe;

_io_f.toConstant = _toConstant;
_io_f.toIdentity = _toIdentity;
_io_f.toList = _toList;
_io_f.toMaybe = _toMaybe;

list_functor_core.toIdentity = _toIdentity;
list_functor_core.toIo = _toIo;
list_functor_core.toConstant = _toConstant;
list_functor_core.toMaybe = _toMaybe;

_maybe_f.toConstant = _toConstant;
_maybe_f.toIdentity = _toIdentity;
_maybe_f.toIo = _toIo;
_maybe_f.toList = _toList;

var functors = {
    Constant,
    Identity,
    Io,
    List,
    Maybe
};


export { functors };