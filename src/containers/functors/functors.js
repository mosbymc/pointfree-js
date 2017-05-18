import { Constant, _constant_f } from './constant_functor';
import { Either, Left, Right, _either_f } from './either_functor';
import { Future, _future_f } from './future_functor';
import { Identity, _identity_f } from './identity_functor';
import { Io, _io_f } from './io_functor';
import { List, list_functor_core } from './list_functor';
import { Maybe, _maybe_f } from './maybe_functor';

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

_constant_f.mapToEither = _mapToEither;
_constant_f.mapToFuture = _mapToFuture;
_constant_f.mapToIdentity = _mapToIdentity;
_constant_f.mapToIo = _mapToIo;
_constant_f.mapToLeft = _mapToLeft;
_constant_f.mapToList = _mapToList;
_constant_f.mapToMaybe = _mapToMaybe;
_constant_f.mapToRight = _mapToRight;

_either_f.mapToConstant = _mapToConstant;
_either_f.mapToFuture = _mapToFuture;
_either_f.mapToIdentity = _mapToIdentity;
_either_f.mapToIo = _mapToIo;
_either_f.mapToList = _mapToList;
_either_f.mapToMaybe = _mapToMaybe;

_future_f.mapToConstant = _mapToConstant;
_future_f.mapToEither = _mapToEither;
_future_f.mapToIdentity = _mapToIdentity;
_future_f.mapToIo = _mapToIo;
_future_f.mapToLeft = _mapToLeft;
_future_f.mapToList = _mapToList;
_future_f.mapToMaybe = _mapToMaybe;
_future_f.mapToRight = _mapToRight;

_identity_f.mapToConstant = _mapToConstant;
_identity_f.mapToEither = _mapToEither;
_identity_f.mapToFuture = _mapToFuture;
_identity_f.mapToIo = _mapToIo;
_identity_f.mapToLeft = _mapToLeft;
_identity_f.mapToList = _mapToList;
_identity_f.mapToMaybe = _mapToMaybe;
_identity_f.mapToRight = _mapToRight;

_io_f.mapToConstant = _mapToConstant;
_io_f.mapToEither = _mapToEither;
_io_f.mapToFuture = _mapToFuture;
_io_f.mapToIdentity = _mapToIdentity;
_io_f.mapToLeft = _mapToLeft;
_io_f.mapToList = _mapToList;
_io_f.mapToMaybe = _mapToMaybe;
_io_f.mapToRight = _mapToRight;

list_functor_core.mapToConstant = _mapToConstant;
list_functor_core.mapToEither = _mapToEither;
list_functor_core.mapToFuture = _mapToFuture;
list_functor_core.mapToIo = _mapToIo;
list_functor_core.mapToIdentity = _mapToIdentity;
list_functor_core.mapToLeft = _mapToLeft;
list_functor_core.mapToMaybe = _mapToMaybe;
list_functor_core.mapToRight = _mapToRight;

_maybe_f.mapToConstant = _mapToConstant;
_maybe_f.mapToEither = _mapToEither;
_maybe_f.mapToFuture = _mapToFuture;
_maybe_f.mapToIdentity = _mapToIdentity;
_maybe_f.mapToIo = _mapToIo;
_maybe_f.mapToLeft = _mapToLeft;
_maybe_f.mapToList = _mapToList;
_maybe_f.mapToRight = _mapToRight;

var functors = {
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


export { functors };