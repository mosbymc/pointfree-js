import { Constant, constant_functor } from './constant_functor';
import { Either, Left, Right, right_functor, left_functor } from './either_functor';
import { Future, future_functor } from './future_functor';
import { Identity, identity_functor } from './identity_functor';
import { Io, io_functor } from './io_functor';
import { List, list_core } from './list_functor';
import { Maybe, Just, Nothing, just_functor, nothing_functor } from './maybe_functor';
import { Validation, validation_functor } from './validation_functor';

import { toContainerType, containerIterator } from '../../containerHelpers';

var mapToConstant = toContainerType(Constant),
    mapToEither = toContainerType(Either),
    mapToFuture = toContainerType(Future),
    mapToIdentity = toContainerType(Identity),
    mapToIo = toContainerType(Io),
    mapToLeft = toContainerType(Left),
    mapToList = toContainerType(List),
    mapToMaybe = toContainerType(Maybe),
    mapToRight = toContainerType(Right),
    mapToValidation = toContainerType(Validation);

function toConstant() { return this.mapToConstant(); }
function toEither() { return this.mapToEither(); }
function toFuture() { return this.mapToFuture(); }
function toIdentity() { return this.mapToIdentity(); }
function toIo() { return this.mapToIo(); }
function toLeft() { return this.mapToLeft(); }
function toList() { return this.mapToList(); }
function toMaybe() { return this.mapToMaybe(); }
function toRight() { return this.mapToRight(); }
function toValidation() { return this.mapToValidation(); }

//Natural Transformations (nt):
//.fold(f) -> f = functor type factory
//nt(x)mapWith(fn) === nt(x.mapWith(fn))

constant_functor.mapToEither = mapToEither;
constant_functor.mapToFuture = mapToFuture;
constant_functor.mapToIdentity = mapToIdentity;
constant_functor.mapToIo = mapToIo;
constant_functor.mapToLeft = mapToLeft;
constant_functor.mapToList = mapToList;
constant_functor.mapToMaybe = mapToMaybe;
constant_functor.mapToRight = mapToRight;
constant_functor.mapToValidation = mapToValidation;
constant_functor[Symbol.iterator] = containerIterator;

future_functor.mapToConstant = mapToConstant;
future_functor.mapToEither = mapToEither;
future_functor.mapToIdentity = mapToIdentity;
future_functor.mapToIo = mapToIo;
future_functor.mapToLeft = mapToLeft;
future_functor.mapToList = mapToList;
future_functor.mapToMaybe = mapToMaybe;
future_functor.mapToRight = mapToRight;
future_functor.mapToValidation = mapToValidation;
future_functor[Symbol.iterator] = containerIterator;

identity_functor.mapToConstant = mapToConstant;
identity_functor.mapToEither = mapToEither;
identity_functor.mapToFuture = mapToFuture;
identity_functor.mapToIo = mapToIo;
identity_functor.mapToLeft = mapToLeft;
identity_functor.mapToList = mapToList;
identity_functor.mapToMaybe = mapToMaybe;
identity_functor.mapToRight = mapToRight;
identity_functor.mapToValidation = mapToValidation;
identity_functor[Symbol.iterator] = containerIterator;

io_functor.mapToConstant = mapToConstant;
io_functor.mapToEither = mapToEither;
io_functor.mapToFuture = mapToFuture;
io_functor.mapToIdentity = mapToIdentity;
io_functor.mapToLeft = mapToLeft;
io_functor.mapToList = mapToList;
io_functor.mapToMaybe = mapToMaybe;
io_functor.mapToRight = mapToRight;
io_functor.mapToValidation = mapToValidation;
io_functor[Symbol.iterator] = containerIterator;

just_functor.mapToConstant = mapToConstant;
just_functor.mapToEither = mapToEither;
just_functor.mapToFuture = mapToFuture;
just_functor.mapToIdentity = mapToIdentity;
just_functor.mapToIo = mapToIo;
just_functor.mapToList = mapToList;
just_functor.mapToValidation = mapToValidation;
just_functor[Symbol.iterator] = containerIterator;

left_functor.mapToConstant = mapToConstant;
left_functor.mapToFuture = mapToFuture;
left_functor.mapToIdentity = mapToIdentity;
left_functor.mapToIo = mapToIo;
left_functor.mapToList = mapToList;
left_functor.mapToMaybe = mapToMaybe;
left_functor.mapToValidation = mapToValidation;
left_functor[Symbol.iterator] = containerIterator;

list_core.mapToConstant = mapToConstant;
list_core.mapToEither = mapToEither;
list_core.mapToFuture = mapToFuture;
list_core.mapToIdentity = mapToIdentity;
list_core.mapToIo = mapToIo;
list_core.mapToLeft = mapToLeft;
list_core.mapToMaybe = mapToMaybe;
list_core.mapToRight = mapToRight;
list_core.mapToValidation = mapToValidation;

nothing_functor.mapToConstant = mapToConstant;
nothing_functor.mapToEither = mapToEither;
nothing_functor.mapToFuture = mapToFuture;
nothing_functor.mapToIdentity = mapToIdentity;
nothing_functor.mapToIo = mapToIo;
nothing_functor.mapToLeft = mapToLeft;
nothing_functor.mapToList = mapToList;
nothing_functor.mapToRight = mapToRight;
nothing_functor.mapToValidation = mapToValidation;
nothing_functor[Symbol.iterator] = containerIterator;

right_functor.mapToConstant = mapToConstant;
right_functor.mapToFuture = mapToFuture;
right_functor.mapToIdentity = mapToIdentity;
right_functor.mapToIo = mapToIo;
right_functor.mapToList = mapToList;
right_functor.mapToMaybe = mapToMaybe;
right_functor.mapToValidation = mapToValidation;
right_functor[Symbol.iterator] = containerIterator;

validation_functor.mapToConstant = mapToConstant;
validation_functor.mapToEither = mapToEither;
validation_functor.mapToFuture = mapToFuture;
validation_functor.mapToIdentity = mapToIdentity;
validation_functor.mapToIo = mapToIo;
validation_functor.mapToLeft = mapToLeft;
validation_functor.mapToList = mapToList;
validation_functor.mapToMaybe = mapToMaybe;
validation_functor.mapToRight = mapToRight;
validation_functor[Symbol.iterator] = containerIterator;

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
    Right,
    Validation
};

Object.defineProperties(constant_functor, {
    toEither: {
        get: toEither
    }
});


export { functors };