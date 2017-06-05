import { Constant, constant_monad } from './constant_monad';
import { Either, Left, Right, either_monad } from './either_monad';
import { Future, future_monad } from './future_monad';
import { Identity, identity_monad } from './identity_monad';
import { Io, io_monad } from './io_monad';
import { List, list_monad, ordered_list_monad } from './list_monad';
import { Maybe, maybe_monad } from './maybe_monad';

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

constant_monad.mapToEither = mapToEither;
constant_monad.mapToFuture = mapToFuture;
constant_monad.mapToIdentity = mapToIdentity;
constant_monad.mapToIo = mapToIo;
constant_monad.mapToLeft = mapToLeft;
constant_monad.mapToList = mapToList;
constant_monad.mapToMaybe = mapToMaybe;
constant_monad.mapToRight = mapToRight;
constant_monad[Symbol.iterator] = containerIterator;

either_monad.mapToConstant = mapToConstant;
either_monad.mapToFuture = mapToFuture;
either_monad.mapToIdentity = mapToIdentity;
either_monad.mapToIo = mapToIo;
either_monad.mapToList = mapToList;
either_monad.mapToMaybe = mapToMaybe;
either_monad[Symbol.iterator] = containerIterator;

future_monad.mapToConstant = mapToConstant;
future_monad.mapToEither = mapToEither;
future_monad.mapToIdentity = mapToIdentity;
future_monad.mapToIo = mapToIo;
future_monad.mapToLeft = mapToLeft;
future_monad.mapToList = mapToList;
future_monad.mapToMaybe = mapToMaybe;
future_monad.mapToRight = mapToRight;
future_monad[Symbol.iterator] = containerIterator;

identity_monad.mapToConstant = mapToConstant;
identity_monad.mapToEither = mapToEither;
identity_monad.mapToFuture = mapToFuture;
identity_monad.mapToIo = mapToIo;
identity_monad.mapToLeft = mapToLeft;
identity_monad.mapToList = mapToList;
identity_monad.mapToMaybe = mapToMaybe;
identity_monad.mapToRight = mapToRight;
identity_monad[Symbol.iterator] = containerIterator;

io_monad.mapToConstant = mapToConstant;
io_monad.mapToEither = mapToEither;
io_monad.mapToFuture = mapToFuture;
io_monad.mapToIdentity = mapToIdentity;
io_monad.mapToLeft = mapToLeft;
io_monad.mapToList = mapToList;
io_monad.mapToMaybe = mapToMaybe;
io_monad.mapToRight = mapToRight;
io_monad[Symbol.iterator] = containerIterator;

list_monad.mapToConstant = mapToConstant;
list_monad.mapToEither = mapToEither;
list_monad.mapToFuture = mapToFuture;
list_monad.mapToIdentity = mapToIdentity;
list_monad.mapToIo = mapToIo;
list_monad.mapToLeft = mapToLeft;
list_monad.mapToMaybe = mapToMaybe;
list_monad.mapToRight = mapToRight;

ordered_list_monad.mapToConstant = mapToConstant;
ordered_list_monad.mapToEither = mapToEither;
ordered_list_monad.mapToFuture = mapToFuture;
ordered_list_monad.mapToIdentity = mapToIdentity;
ordered_list_monad.mapToIo = mapToIo;
ordered_list_monad.mapToLeft = mapToLeft;
ordered_list_monad.mapToMaybe = mapToMaybe;
ordered_list_monad.mapToRight = mapToRight;

maybe_monad.mapToConstant = mapToConstant;
maybe_monad.mapToEither = mapToEither;
maybe_monad.mapToFuture = mapToFuture;
maybe_monad.mapToIdentity = mapToIdentity;
maybe_monad.mapToIo = mapToIo;
maybe_monad.mapToLeft = mapToLeft;
maybe_monad.mapToList = mapToList;
maybe_monad.mapToRight = mapToRight;
maybe_monad[Symbol.iterator] = containerIterator;

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