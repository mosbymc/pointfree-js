import { Constant, _constant_m } from './constant_monad';
import { Either, Left, Right, _either_m } from './either_monad';
import { Future, _future_m } from './future_monad';
import { Identity, _identity_m } from './identity_monad';
import { Io, _io_m } from './io_monad';
import { List, _list_m, ordered_list_m } from './list_monad';
import { Maybe, _maybe_m } from './maybe_monad';

import { toFunctorType } from '../../containerHelpers';

_constant_m.mapToEither = toFunctorType(Either);
_constant_m.mapToFuture = toFunctorType(Future);
_constant_m.mapToIdentity = toFunctorType(Identity);
_constant_m.mapToIo = toFunctorType(Io);
_constant_m.mapToLeft = toFunctorType(Left);
_constant_m.mapToList = toFunctorType(List);
_constant_m.mapToMaybe = toFunctorType(Maybe);
_constant_m.mapToRight = toFunctorType(Right);

_either_m.mapToConstant = toFunctorType(Constant);
_either_m.mapToFuture = toFunctorType(Future);
_either_m.mapToIdentity = toFunctorType(Identity);
_either_m.mapToIo = toFunctorType(Io);
_either_m.mapToList = toFunctorType(List);
_either_m.mapToMaybe = toFunctorType(Maybe);

_future_m.mapToConstant = toFunctorType(Constant);
_future_m.mapToEither = toFunctorType(Either);
_future_m.mapToIdentity = toFunctorType(Identity);
_future_m.mapToIo = toFunctorType(Io);
_future_m.mapToLeft = toFunctorType(Left);
_future_m.mapToList = toFunctorType(List);
_future_m.mapToMaybe = toFunctorType(Maybe);
_future_m.mapToRight = toFunctorType(Right);

_identity_m.mapToConstant = toFunctorType(Constant);
_identity_m.mapToEither = toFunctorType(Either);
_identity_m.mapToFuture = toFunctorType(Future);
_identity_m.mapToIo = toFunctorType(Io);
_identity_m.mapToLeft = toFunctorType(Left);
_identity_m.mapToList = toFunctorType(List);
_identity_m.mapToMaybe = toFunctorType(Maybe);
_identity_m.mapToRight = toFunctorType(Right);

_io_m.mapToConstant = toFunctorType(Constant);
_io_m.mapToEither = toFunctorType(Either);
_io_m.mapToFuture = toFunctorType(Future);
_io_m.mapToIdentity = toFunctorType(Identity);
_io_m.mapToLeft = toFunctorType(Left);
_io_m.mapToList = toFunctorType(List);
_io_m.mapToMaybe = toFunctorType(Maybe);
_io_m.mapToRight = toFunctorType(Right);

_list_m.mapToConstant = toFunctorType(Constant);
_list_m.mapToEither = toFunctorType(Either);
_list_m.mapToFuture = toFunctorType(Future);
_list_m.mapToIdentity = toFunctorType(Identity);
_list_m.mapToIo = toFunctorType(Io);
_list_m.mapToLeft = toFunctorType(Left);
_list_m.mapToMaybe = toFunctorType(Maybe);
_list_m.mapToRight = toFunctorType(Right);

ordered_list_m.mapToConstant = toFunctorType(Constant);
ordered_list_m.mapToEither = toFunctorType(Either);
ordered_list_m.mapToFuture = toFunctorType(Future);
ordered_list_m.mapToIdentity = toFunctorType(Identity);
ordered_list_m.mapToIo = toFunctorType(Io);
ordered_list_m.mapToLeft = toFunctorType(Left);
ordered_list_m.mapToMaybe = toFunctorType(Maybe);
ordered_list_m.mapToRight = toFunctorType(Right);

_maybe_m.mapToConstant = toFunctorType(Constant);
_maybe_m.mapToEither = toFunctorType(Either);
_maybe_m.mapToIdentity = toFunctorType(Identity);
_maybe_m.mapToFuture = toFunctorType(Future);
_maybe_m.mapToIo = toFunctorType(Io);
_maybe_m.mapToLeft = toFunctorType(Left);
_maybe_m.mapToList = toFunctorType(List);
_maybe_m.mapToRight = toFunctorType(Right);

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