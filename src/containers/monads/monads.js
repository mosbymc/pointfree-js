import { Constant, _constant_m } from './constant_monad';
import { Either, Left, Right, _either_m } from './either_monad';
import { Future, _future_m } from './future_monad';
import { Identity, _identity_m } from './identity_monad';
import { Io, _io_m } from './io_monad';
import { List, _list_m, ordered_list_m } from './list_monad';
import { Maybe, _maybe_m } from './maybe_monad';

import { identity } from '../../functionalHelpers';

function _mapToConstant(fn = identity) {
    return Constant.of(fn(this.value));
}

function _mapToEither(fn = identity, fork) {
    return Either(fn(this.value), fork);
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

function _mapToLeft(fn = identity) {
    return Left(fn(this.value));
}

function _mapToList(fn = identity) {
    return List.from(fn(this.value));
}

function _mapToMaybe(fn = identity) {
    return Maybe.of(fn(this.value));
}

function _mapToRight(fn = identity) {
    return Right(fn(this.value));
}

_constant_m.mapToEither = _mapToEither;
_constant_m.mapToFuture = _mapToFuture;
_constant_m.mapToIdentity = _mapToIdentity;
_constant_m.mapToIo = _mapToIo;
_constant_m.mapToLeft = _mapToLeft;
_constant_m.mapToList = _mapToList;
_constant_m.mapToMaybe = _mapToMaybe;
_constant_m.mapToRight = _mapToRight;

_either_m.mapToConstant = _mapToConstant;
_either_m.mapToFuture = _mapToFuture;
_either_m.mapToIdentity = _mapToIdentity;
_either_m.mapToIo = _mapToIo;
_either_m.mapToList = _mapToList;
_either_m.mapToMaybe = _mapToMaybe;

_future_m.mapToConstant = _mapToConstant;
_future_m.mapToEither = _mapToEither;
_future_m.mapToIdentity = _mapToIdentity;
_future_m.mapToIo = _mapToIo;
_future_m.mapToLeft = _mapToLeft;
_future_m.mapToList = _mapToList;
_future_m.mapToMaybe = _mapToMaybe;
_future_m.mapToRight = _mapToRight;

_identity_m.mapToConstant = _mapToConstant;
_identity_m.mapToEither = _mapToEither;
_identity_m.mapToFuture = _mapToFuture;
_identity_m.mapToIo = _mapToIo;
_identity_m.mapToLeft = _mapToLeft;
_identity_m.mapToList = _mapToList;
_identity_m.mapToMaybe = _mapToMaybe;
_identity_m.mapToRight = _mapToRight;

_io_m.mapToConstant = _mapToConstant;
_io_m.mapToEither = _mapToEither;
_io_m.mapToFuture = _mapToFuture;
_io_m.mapToIdentity = _mapToIdentity;
_io_m.mapToLeft = _mapToLeft;
_io_m.mapToList = _mapToList;
_io_m.mapToMaybe = _mapToMaybe;
_io_m.mapToRight = _mapToRight;

_list_m.mapToConstant = _mapToConstant;
_list_m.mapToEither = _mapToEither;
_list_m.mapToFuture = _mapToFuture;
_list_m.mapToIdentity = _mapToIdentity;
_list_m.mapToIo = _mapToIo;
_list_m.mapToLeft = _mapToLeft;
_list_m.mapToMaybe = _mapToMaybe;
_list_m.mapToRight = _mapToRight;

ordered_list_m.mapToConstant = _mapToConstant;
ordered_list_m.mapToEither = _mapToEither;
ordered_list_m.mapToFuture = _mapToFuture;
ordered_list_m.mapToIdentity = _mapToIdentity;
ordered_list_m.mapToIo = _mapToIo;
ordered_list_m.mapToLeft = _mapToLeft;
ordered_list_m.mapToMaybe = _mapToMaybe;
ordered_list_m.mapToRight = _mapToRight;

_maybe_m.mapToConstant = _mapToConstant;
_maybe_m.mapToEither = _mapToEither;
_maybe_m.mapToIdentity = _mapToIdentity;
_maybe_m.mapToFuture = _mapToFuture;
_maybe_m.mapToIo = _mapToIo;
_maybe_m.mapToLeft = _mapToLeft;
_maybe_m.mapToList = _mapToList;
_maybe_m.mapToRight = _mapToRight;

var monads = {
    Constant,
    Either,
    Future,
    Identity,
    Io,
    Left,
    List,
    Maybe,
    Right
};

export { monads };