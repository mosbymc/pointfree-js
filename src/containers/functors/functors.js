import { Constant, _constant_f } from './constant_functor';
import { Either, Left, Right, _either_f } from './either_functor';
import { Future, _future_f } from './future_functor';
import { Identity, _identity_f } from './identity_functor';
import { Io, _io_f } from './io_functor';
import { List, list_functor_core } from './list_functor';
import { Maybe, _maybe_f } from './maybe_functor';

import { toFunctorType } from '../../containerHelpers';

_constant_f.mapToEither = toFunctorType(Either);
_constant_f.mapToFuture = toFunctorType(Future);
_constant_f.mapToIdentity = toFunctorType(Identity);
_constant_f.mapToIo = toFunctorType(Io);
_constant_f.mapToLeft = toFunctorType(Left);
_constant_f.mapToList = toFunctorType(List);
_constant_f.mapToMaybe = toFunctorType(Maybe);
_constant_f.mapToRight = toFunctorType(Right);

_either_f.mapToConstant = toFunctorType(Constant);
_either_f.mapToFuture = toFunctorType(Future);
_either_f.mapToIdentity = toFunctorType(Identity);
_either_f.mapToIo = toFunctorType(Io);
_either_f.mapToList = toFunctorType(List);
_either_f.mapToMaybe = toFunctorType(Maybe);

_future_f.mapToConstant = toFunctorType(Constant);
_future_f.mapToEither = toFunctorType(Either);
_future_f.mapToIdentity = toFunctorType(Identity);
_future_f.mapToIo = toFunctorType(Io);
_future_f.mapToLeft = toFunctorType(Left);
_future_f.mapToList = toFunctorType(List);
_future_f.mapToMaybe = toFunctorType(Maybe);
_future_f.mapToRight = toFunctorType(Right);

_identity_f.mapToConstant = toFunctorType(Constant);
_identity_f.mapToEither = toFunctorType(Either);
_identity_f.mapToFuture = toFunctorType(Future);
_identity_f.mapToIo = toFunctorType(Io);
_identity_f.mapToLeft = toFunctorType(Left);
_identity_f.mapToList = toFunctorType(List);
_identity_f.mapToMaybe = toFunctorType(Maybe);
_identity_f.mapToRight = toFunctorType(Right);

_io_f.mapToConstant = toFunctorType(Constant);
_io_f.mapToEither = toFunctorType(Either);
_io_f.mapToFuture = toFunctorType(Future);
_io_f.mapToIdentity = toFunctorType(Identity);
_io_f.mapToLeft = toFunctorType(Left);
_io_f.mapToList = toFunctorType(List);
_io_f.mapToMaybe = toFunctorType(Maybe);
_io_f.mapToRight = toFunctorType(Right);

list_functor_core.mapToConstant = toFunctorType(Constant);
list_functor_core.mapToEither = toFunctorType(Either);
list_functor_core.mapToFuture = toFunctorType(Future);
list_functor_core.mapToIo = toFunctorType(Io);
list_functor_core.mapToIdentity = toFunctorType(Identity);
list_functor_core.mapToLeft = toFunctorType(Left);
list_functor_core.mapToMaybe = toFunctorType(Maybe);
list_functor_core.mapToRight = toFunctorType(Right);

_maybe_f.mapToConstant = toFunctorType(Constant);
_maybe_f.mapToEither = toFunctorType(Either);
_maybe_f.mapToFuture = toFunctorType(Future);
_maybe_f.mapToIdentity = toFunctorType(Identity);
_maybe_f.mapToIo = toFunctorType(Io);
_maybe_f.mapToLeft = toFunctorType(Left);
_maybe_f.mapToList = toFunctorType(List);
_maybe_f.mapToRight = toFunctorType(Right);

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