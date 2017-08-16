import * as functors from './containers/functors/functors';
import * as monads from './containers/monads/monads';

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isConstant(fa) {
    return fa.factory === functors.Constant || fa.factory === monads.Constant;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isEither(fa) {
    return fa.factory === functors.Either || fa.factory === monads.Either;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isFunctor(fa) {
    return !!(fa && fa.factory && fa.factory === functors[fa.factory.name]);
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isFuture(fa) {
    return fa.factory === functors.Future || fa.factory === monads.Future;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIdentity(fa) {
    return fa.factory === functors.Identity || fa.factory === monads.Identity;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIo(fa) {
    return fa.factory === functors.Io || fa.factory === monads.Io;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isJust(fa) {
    return !!(fa.isJust && (fa.factory === functors.Maybe || fa.factory === monads.Maybe));
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isLeft(fa) {
    return !!(fa.isLeft && (fa.factory === functors.Either || fa.factory === monads.Either));
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isList(fa) {
    return (fa.factory === functors.List || fa.factory === monads.List);
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isMaybe(fa) {
    return !!((fa.isNothing && (fa.factory === functors.Maybe || fa.factory === monads.Maybe)) ||
        (fa.isJust && (fa.factory === functors.Maybe || fa.factory === monads.Maybe)));
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
function isMonad(ma) {
    return !!(ma && ma.factory && ma.factory === monads[ma.factory.name]);
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isNothing(fa) {
    return !!fa.isNothing;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isRight(fa) {
    return !!fa.isRight;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isValidation(fa) {
    return fa.factory === functors.Validation || fa.factory === monads.Validation;
}

export { isConstant, isEither, isFuture, isFunctor, isIdentity, isIo, isJust, isLeft, isList, isMaybe, isMonad, isNothing, isRight, isValidation };