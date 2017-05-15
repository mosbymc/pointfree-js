import { Constant, _constant_f } from './constant_functor';
import { Future, _future_f } from './future_functor';
import { Identity, _identity_f } from './identity_functor';
import { Io, _io_f } from './io_functor';
import { List, list_functor_core } from './list_functor';
import { Maybe, _maybe_f } from './maybe_functor';

import { identity } from '../../functionalHelpers';

function _mapToConstant(fn = identity) {
    return Constant.of(fn(this.value));
}

function _mapToFuture(fn = identity) {
    return Future.of(fn(this.value));
}

function _mapToIdentity(fn = identity) {
    return Identity.of(fn(this.value));
}

function _mapToIo(fn = identity) {
    return Io.of(fn(this.value));
}

function _mapToList(fn = identity) {
    return List.from(fn(this.value));
}

function _mapToMaybe(fn = identity) {
    return Maybe.of(fn(this.value));
}

_constant_f.mapToFuture = _mapToFuture;
_constant_f.mapToIdentity = _mapToIdentity;
_constant_f.maoToIo = _mapToIo;
_constant_f.mapToList = _mapToList;
_constant_f.mapToMaybe = _mapToMaybe;

_future_f.mapToConstant = _mapToConstant;
_future_f.mapToIdentity = _mapToIdentity;
_future_f.mapToIo = _mapToIo;
_future_f.mapToList = _mapToList;
_future_f.mapToMaybe = _mapToMaybe;

_identity_f.mapToConstant = _mapToConstant;
_identity_f.mapToFuture = _mapToFuture;
_identity_f.maoToIo = _mapToIo;
_identity_f.mapToList = _mapToList;
_identity_f.mapToMaybe = _mapToMaybe;

_io_f.mapToConstant = _mapToConstant;
_io_f.mapToFuture = _mapToFuture;
_io_f.mapToIdentity = _mapToIdentity;
_io_f.mapToList = _mapToList;
_io_f.mapToMaybe = _mapToMaybe;

list_functor_core.mapToConstant = _mapToConstant;
list_functor_core.mapToFuture = _mapToFuture;
list_functor_core.maoToIo = _mapToIo;
list_functor_core.mapToIdentity = _mapToIdentity;
list_functor_core.mapToMaybe = _mapToMaybe;

_maybe_f.mapToConstant = _mapToConstant;
_maybe_f.mapToFuture = _mapToFuture;
_maybe_f.mapToIdentity = _mapToIdentity;
_maybe_f.maoToIo = _mapToIo;
_maybe_f.mapToList = _mapToList;

var functors = {
    Constant,
    Future,
    Identity,
    Io,
    List,
    Maybe
};


export { functors };