import { Constant, _constant_f } from './constant_functor';
import { Either, Left, Right, _either_f } from './either_functor';
import { Future, _future_f } from './future_functor';
import { Identity, _identity_f } from './identity_functor';
import { Io, _io_f } from './io_functor';
import { List, list_core } from './list_functor';
import { Maybe, Just, Nothing, _maybe_f } from './maybe_functor';

import { toFunctorType, containerIterator } from '../../containerHelpers';

var mapToConstant = toFunctorType(Constant),
    mapToEither = toFunctorType(Either),
    mapToFuture = toFunctorType(Future),
    mapToIdentity = toFunctorType(Identity),
    mapToIo = toFunctorType(Io),
    mapToLeft = toFunctorType(Left),
    mapToList = toFunctorType(List),
    mapToMaybe = toFunctorType(Maybe),
    mapToRight = toFunctorType(Right);

_constant_f.mapToEither = mapToEither;
_constant_f.mapToFuture = mapToFuture;
_constant_f.mapToIdentity = mapToIdentity;
_constant_f.mapToIo = mapToIo;
_constant_f.mapToLeft = mapToLeft;
_constant_f.mapToList = mapToList;
_constant_f.mapToMaybe = mapToMaybe;
_constant_f.mapToRight = mapToRight;
_constant_f[Symbol.iterator] = containerIterator;

_either_f.mapToConstant = mapToConstant;
_either_f.mapToFuture = mapToFuture;
_either_f.mapToIdentity = mapToIdentity;
_either_f.mapToIo = mapToIo;
_either_f.mapToList = mapToList;
_either_f.mapToMaybe = mapToMaybe;
_either_f[Symbol.iterator] = containerIterator;

_future_f.mapToConstant = mapToConstant;
_future_f.mapToEither = mapToEither;
_future_f.mapToIdentity = mapToIdentity;
_future_f.mapToIo = mapToIo;
_future_f.mapToLeft = mapToLeft;
_future_f.mapToList = mapToList;
_future_f.mapToMaybe = mapToMaybe;
_future_f.mapToRight = mapToRight;
_future_f[Symbol.iterator] = containerIterator;

_identity_f.mapToConstant = mapToConstant;
_identity_f.mapToEither = mapToEither;
_identity_f.mapToFuture = mapToFuture;
_identity_f.mapToIo = mapToIo;
_identity_f.mapToLeft = mapToLeft;
_identity_f.mapToList = mapToList;
_identity_f.mapToMaybe = mapToMaybe;
_identity_f.mapToRight = mapToRight;
_identity_f[Symbol.iterator] = containerIterator;

_io_f.mapToConstant = mapToConstant;
_io_f.mapToEither = mapToEither;
_io_f.mapToFuture = mapToFuture;
_io_f.mapToIdentity = mapToIdentity;
_io_f.mapToLeft = mapToLeft;
_io_f.mapToList = mapToList;
_io_f.mapToMaybe = mapToMaybe;
_io_f.mapToRight = mapToRight;
_io_f[Symbol.iterator] = containerIterator;

list_core.mapToConstant = mapToConstant;
list_core.mapToEither = mapToEither;
list_core.mapToFuture = mapToFuture;
list_core.mapToIdentity = mapToIdentity;
list_core.mapToIo = mapToIo;
list_core.mapToLeft = mapToLeft;
list_core.mapToMaybe = mapToMaybe;
list_core.mapToRight = mapToRight;

_maybe_f.mapToConstant = mapToConstant;
_maybe_f.mapToEither = mapToEither;
_maybe_f.mapToFuture = mapToFuture;
_maybe_f.mapToIdentity = mapToIdentity;
_maybe_f.mapToIo = mapToIo;
_maybe_f.mapToLeft = mapToLeft;
_maybe_f.mapToList = mapToList;
_maybe_f.mapToRight = mapToRight;
_maybe_f[Symbol.iterator] = containerIterator;

var functors = {
    Constant,
    Either,
    Future,
    Identity,
    Io,
    Just,
    Left,
    List,
    Maybe,
    Nothing,
    Right
};


export { functors };