import { Constant, constant_functor } from './constant_functor';
import { Either, Left, Right, either_functor } from './either_functor';
import { Future, future_functor } from './future_functor';
import { Identity, identity_functor } from './identity_functor';
import { Io, io_functor } from './io_functor';
import { List, list_core } from './list_functor';
import { Maybe, Just, Nothing, maybe_functor } from './maybe_functor';

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

constant_functor.mapToEither = mapToEither;
constant_functor.mapToFuture = mapToFuture;
constant_functor.mapToIdentity = mapToIdentity;
constant_functor.mapToIo = mapToIo;
constant_functor.mapToLeft = mapToLeft;
constant_functor.mapToList = mapToList;
constant_functor.mapToMaybe = mapToMaybe;
constant_functor.mapToRight = mapToRight;
constant_functor[Symbol.iterator] = containerIterator;

either_functor.mapToConstant = mapToConstant;
either_functor.mapToFuture = mapToFuture;
either_functor.mapToIdentity = mapToIdentity;
either_functor.mapToIo = mapToIo;
either_functor.mapToList = mapToList;
either_functor.mapToMaybe = mapToMaybe;
either_functor[Symbol.iterator] = containerIterator;

future_functor.mapToConstant = mapToConstant;
future_functor.mapToEither = mapToEither;
future_functor.mapToIdentity = mapToIdentity;
future_functor.mapToIo = mapToIo;
future_functor.mapToLeft = mapToLeft;
future_functor.mapToList = mapToList;
future_functor.mapToMaybe = mapToMaybe;
future_functor.mapToRight = mapToRight;
future_functor[Symbol.iterator] = containerIterator;

identity_functor.mapToConstant = mapToConstant;
identity_functor.mapToEither = mapToEither;
identity_functor.mapToFuture = mapToFuture;
identity_functor.mapToIo = mapToIo;
identity_functor.mapToLeft = mapToLeft;
identity_functor.mapToList = mapToList;
identity_functor.mapToMaybe = mapToMaybe;
identity_functor.mapToRight = mapToRight;
identity_functor[Symbol.iterator] = containerIterator;

io_functor.mapToConstant = mapToConstant;
io_functor.mapToEither = mapToEither;
io_functor.mapToFuture = mapToFuture;
io_functor.mapToIdentity = mapToIdentity;
io_functor.mapToLeft = mapToLeft;
io_functor.mapToList = mapToList;
io_functor.mapToMaybe = mapToMaybe;
io_functor.mapToRight = mapToRight;
io_functor[Symbol.iterator] = containerIterator;

list_core.mapToConstant = mapToConstant;
list_core.mapToEither = mapToEither;
list_core.mapToFuture = mapToFuture;
list_core.mapToIdentity = mapToIdentity;
list_core.mapToIo = mapToIo;
list_core.mapToLeft = mapToLeft;
list_core.mapToMaybe = mapToMaybe;
list_core.mapToRight = mapToRight;

maybe_functor.mapToConstant = mapToConstant;
maybe_functor.mapToEither = mapToEither;
maybe_functor.mapToFuture = mapToFuture;
maybe_functor.mapToIdentity = mapToIdentity;
maybe_functor.mapToIo = mapToIo;
maybe_functor.mapToLeft = mapToLeft;
maybe_functor.mapToList = mapToList;
maybe_functor.mapToRight = mapToRight;
maybe_functor[Symbol.iterator] = containerIterator;

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