import { Constant, _constant_m } from './constant_monad';
import { Either, Left, Right, _either_m } from './either_monad';
import { Future, _future_m } from './future_monad';
import { Identity, _identity_m } from './identity_monad';
import { Io, _io_m } from './io_monad';
import { List, _list_m, ordered_list_m } from './list_monad';
import { Maybe, _maybe_m } from './maybe_monad';

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

_constant_m.mapToEither = mapToEither;
_constant_m.mapToFuture = mapToFuture;
_constant_m.mapToIdentity = mapToIdentity;
_constant_m.mapToIo = mapToIo;
_constant_m.mapToLeft = mapToLeft;
_constant_m.mapToList = mapToList;
_constant_m.mapToMaybe = mapToMaybe;
_constant_m.mapToRight = mapToRight;
_constant_m[Symbol.iterator] = containerIterator;

_either_m.mapToConstant = mapToConstant;
_either_m.mapToFuture = mapToFuture;
_either_m.mapToIdentity = mapToIdentity;
_either_m.mapToIo = mapToIo;
_either_m.mapToList = mapToList;
_either_m.mapToMaybe = mapToMaybe;
_either_m[Symbol.iterator] = containerIterator;

_future_m.mapToConstant = mapToConstant;
_future_m.mapToEither = mapToEither;
_future_m.mapToIdentity = mapToIdentity;
_future_m.mapToIo = mapToIo;
_future_m.mapToLeft = mapToLeft;
_future_m.mapToList = mapToList;
_future_m.mapToMaybe = mapToMaybe;
_future_m.mapToRight = mapToRight;
_future_m[Symbol.iterator] = containerIterator;

_identity_m.mapToConstant = mapToConstant;
_identity_m.mapToEither = mapToEither;
_identity_m.mapToFuture = mapToFuture;
_identity_m.mapToIo = mapToIo;
_identity_m.mapToLeft = mapToLeft;
_identity_m.mapToList = mapToList;
_identity_m.mapToMaybe = mapToMaybe;
_identity_m.mapToRight = mapToRight;
_identity_m[Symbol.iterator] = containerIterator;

_io_m.mapToConstant = mapToConstant;
_io_m.mapToEither = mapToEither;
_io_m.mapToFuture = mapToFuture;
_io_m.mapToIdentity = mapToIdentity;
_io_m.mapToLeft = mapToLeft;
_io_m.mapToList = mapToList;
_io_m.mapToMaybe = mapToMaybe;
_io_m.mapToRight = mapToRight;
_io_m[Symbol.iterator] = containerIterator;

_list_m.mapToConstant = mapToConstant;
_list_m.mapToEither = mapToEither;
_list_m.mapToFuture = mapToFuture;
_list_m.mapToIdentity = mapToIdentity;
_list_m.mapToIo = mapToIo;
_list_m.mapToLeft = mapToLeft;
_list_m.mapToMaybe = mapToMaybe;
_list_m.mapToRight = mapToRight;
_list_m[Symbol.iterator] = containerIterator;

ordered_list_m.mapToConstant = mapToConstant;
ordered_list_m.mapToEither = mapToEither;
ordered_list_m.mapToFuture = mapToFuture;
ordered_list_m.mapToIdentity = mapToIdentity;
ordered_list_m.mapToIo = mapToIo;
ordered_list_m.mapToLeft = mapToLeft;
ordered_list_m.mapToMaybe = mapToMaybe;
ordered_list_m.mapToRight = mapToRight;
ordered_list_m[Symbol.iterator] = containerIterator;

_maybe_m.mapToConstant = mapToConstant;
_maybe_m.mapToEither = mapToEither;
_maybe_m.mapToFuture = mapToFuture;
_maybe_m.mapToIdentity = mapToIdentity;
_maybe_m.mapToIo = mapToIo;
_maybe_m.mapToLeft = mapToLeft;
_maybe_m.mapToList = mapToList;
_maybe_m.mapToRight = mapToRight;
_maybe_m[Symbol.iterator] = containerIterator;

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