import { Constant, constant_functor } from './constant_functor';
import { Either, Left, Right, right_functor, left_functor } from './either_functor';
import { Future, future_functor } from './future_functor';
import { Identity, identity_functor } from './identity_functor';
import { Io, io_functor } from './io_functor';
import { List, list_core } from './list_functor';
import { Maybe, Just, Nothing, just_functor, nothing_functor } from './maybe_functor';
import { Validation, validation_functor } from './validation_functor';
import { applyTransforms, containerIterator, lifter } from '../dataStructureHelpers';

/**
 * @module dataStructures/functors
 * @namespace functors
 */

//Natural Transformations (nt):
//.fold(f) -> f = functor type factory
//nt(x)mapWith(fn) === nt(x.mapWith(fn))

/**
 * @memberOf functors.constant_functor
 * @type {containerIterator}
 * @description Iterator for the constant functor. Allows the constant functor
 * to be iterated via for-of or Array#from.
 */
constant_functor[Symbol.iterator] = containerIterator;
future_functor[Symbol.iterator] = containerIterator;

/**
 * @memberOf functors.identity_functor
 * @type {containerIterator}
 * @description Iterator for the identity functor. Allows the identity functor
 * to be iterated via for-or of Array#from.
 */
identity_functor[Symbol.iterator] = containerIterator;
io_functor[Symbol.iterator] = containerIterator;
just_functor[Symbol.iterator] = containerIterator;

/**
 * @memberOf functors.left_functor
 * @type {containerIterator}
 * @description Iterator for the left functor. Allows the left functor to
 * be iterated via for-of or Array#from.
 */
left_functor[Symbol.iterator] = containerIterator;
nothing_functor[Symbol.iterator] = containerIterator;

/**
 * @memberOf functors.right_functor
 * @type {containerIterator}
 * @description Iterator for the right functor. Allows the right functor to
 * be iterated via for-of or Aray#from.
 */
right_functor[Symbol.iterator] = containerIterator;
validation_functor[Symbol.iterator] = containerIterator;

/**
 * @memberOf functors.Constant
 * @type {Function}
 * @description Lifts any non-constant returning function into a {@link functors.constant_functor}
 * returning function.
 */
Constant.lift = lifter(Constant);
Either.lift = lifter(Either);
Future.lift = lifter(Future);

/**
 * @memberOf functors.Identity
 * @type {Function}
 * @description Lifts any non-identity returning function into a {@link functors.identity_functor}
 * returning function.
 */
Identity.lift = lifter(Identity);
Io.lift = lifter(Io);
Just.lift = lifter(Just);

/**
 * @memberOf functors.Left
 * @type {Function}
 * @description Lifts any non-left returning function into a {@link functors.left_functor}
 * returning function.
 */
Left.lift = lifter(Left);
List.lift = lifter(List);
Maybe.lift = lifter(Maybe);
Nothing.lift = lifter(Nothing);

/**
 * @memberOf functors.Right
 * @type {Function}
 * @description Lifts any non-right returning function into a {@link functors.right_functor}
 * returning function.
 */
Right.lift = lifter(Right);
Validation.lift = lifter(Validation);

var functors = [
    { factory: Constant, delegate: constant_functor },
    { factory: Future, delegate: future_functor },
    { factory: Identity, delegate: identity_functor },
    { factory: Io, delegate: io_functor },
    { factory: Just, delegate: just_functor },
    { factory: Left, delegate: left_functor },
    { factory: List, delegate: list_core },
    { factory: Maybe },
    { factory: Nothing, delegate: nothing_functor },
    { factory: Right, delegate: right_functor },
    { factory: Validation, delegate: validation_functor }
];

applyTransforms(functors);


export { Constant, Either, Future, Identity, Io, Just, Left, List, Maybe, Nothing, Right, Validation };