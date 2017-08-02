import { functors } from './containers/functors/functors';
import { monads } from './containers/monads/monads';

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isConstant(fa) {
    return fa.factory === functors.Constant || fa.factory === monads.Constant;
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isEither(fa) {
    return fa.factory === functors.Either || fa.factory === monads.Either;
}

/**
 * @type:
 * @description:
 * @param: {Functor} fa
 * @return: {boolean}
 */
function isFunctor(fa) {
    return !!(fa && fa.factory && fa.factory === functors[fa.factory.name]);
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isFuture(fa) {
    return fa.factory === functors.Future || fa.factory === monads.Future;
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isIdentity(fa) {
    return fa.factory === functors.Identity || fa.factory === monads.Identity;
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isIo(fa) {
    return fa.factory === functors.Io || fa.factory === monads.Io;
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return {boolean}
 */
function isJust(fa) {
    return !!(fa.isJust && fa.factory === functors.Just || fa.factory === monads.Just);
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isLeft(fa) {
    return !!(fa.isLeft && fa.factory === functors.Either || fa.factor === monads.Either);
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isList(fa) {
    return fa.factory === functors.List || fa.factory === monads.List;
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isMaybe(fa) {
    return (fa.factory === functors.Just || fa.factory === functors.Nothing || fa.factory === monads.Just || fa.factory === monads.Nothing);
}

/**
 * @type:
 * @description:
 * @param: {Monad} ma
 * @return: {boolean}
 */
function isMonad(ma) {
    return !!(ma && ma.factory && ma.factory === monads[ma.factory.name]);
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isNothing(fa) {
    return !!fa.isNothing;
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isRight(fa) {
    return !!fa.isRight;
}

/**
 * @type:
 * @description:
 * @param: {Functor|Monad} fa
 * @return: {boolean}
 */
function isValidation(fa) {
    return fa.factory === functors.Validation || fa.factory === monads.Validation;
}

export { isConstant, isEither, isFuture, isFunctor, isIdentity, isIo, isJust, isLeft, isList, isMaybe, isMonad, isNothing, isRight, isValidation };