import { Constant, _constant_m } from './constant_monad';
import { Future, _future_m } from './future_monad';
import { Identity, _identity_m } from './identity_monad';
import { Io, _io_m } from './io_monad';
import { List, _list_m, ordered_list_m } from './list_monad';
import { Maybe, _maybe_m } from './maybe_monad';

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

_constant_m.mapToFuture = _mapToFuture;
_constant_m.mapToIdentity = _mapToIdentity;
_constant_m.mapToIo = _mapToIo;
_constant_m.mapToList = _mapToList;
_constant_m.mapToMaybe = _mapToMaybe;

_future_m.mapToConstant = _mapToConstant;
_future_m.mapToIdentity = _mapToIdentity;
_future_m.mapToIo = _mapToIo;
_future_m.mapToList = _mapToList;
_future_m.mapToMaybe = _mapToMaybe;

_identity_m.mapToConstant = _mapToConstant;
_identity_m.mapToFuture = _mapToFuture;
_identity_m.mapToIo = _mapToIo;
_identity_m.mapToList = _mapToList;
_identity_m.mapToMaybe = _mapToMaybe;

_io_m.mapToConstant = _mapToConstant;
_io_m.mapToFuture = _mapToFuture;
_io_m.mapToIdentity = _mapToIdentity;
_io_m.mapToList = _mapToList;
_io_m.mapToMaybe = _mapToMaybe;

_list_m.mapToConstant = _mapToConstant;
_list_m.mapToFuture = _mapToFuture;
_list_m.mapToIdentity = _mapToIdentity;
_list_m.mapToIo = _mapToIo;
_list_m.mapToMaybe = _mapToMaybe;

ordered_list_m.mapToConstant = _mapToConstant;
ordered_list_m.mapToFuture = _mapToFuture;
ordered_list_m.mapToIdentity = _mapToIdentity;
ordered_list_m.mapToIo = _mapToIo;
ordered_list_m.mapToMaybe = _mapToMaybe;

_maybe_m.mapToIdentity = _mapToIdentity;
_maybe_m.mapToFuture = _mapToFuture;
_maybe_m.mapToIo = _mapToIo;
_maybe_m.mapToConstant = _mapToConstant;
_maybe_m.mapToList = _mapToList;

var monads = {
    Constant,
    Future,
    Identity,
    Io,
    List,
    Maybe
};

export { monads };