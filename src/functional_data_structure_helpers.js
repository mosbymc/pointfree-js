import * as functors from './dataStructures/functors/functors';
import * as monads from './dataStructures/monads/monads';

/** @module functional_data_structure_helpers */

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isConstant(fa) {
    return fa.factory === functors.Constant || fa.factory === monads.Constant;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isEither(fa) {
    return fa.factory === functors.Either || fa.factory === monads.Either;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isFunctor(fa) {
    return !!(fa && fa.factory && fa.factory === functors[fa.factory.name]);
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isFuture(fa) {
    return fa.factory === functors.Future || fa.factory === monads.Future;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIdentity(fa) {
    return fa.factory === functors.Identity || fa.factory === monads.Identity;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIo(fa) {
    return fa.factory === functors.Io || fa.factory === monads.Io;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isJust(fa) {
    return fa.isJust && (fa.factory === functors.Maybe || fa.factory === monads.Maybe);
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isLeft(fa) {
    return fa.isLeft && (fa.factory === functors.Either || fa.factory === monads.Either);
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isList(fa) {
    return fa.factory === functors.List || fa.factory === monads.List;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isMaybe(fa) {
    return (fa.isNothing && (fa.factory === functors.Maybe || fa.factory === monads.Maybe)) ||
        (fa.isJust && (fa.factory === functors.Maybe || fa.factory === monads.Maybe));
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
function isMonad(ma) {
    return !!(ma && ma.factory && ma.factory === monads[ma.factory.name]);
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isNothing(fa) {
    return !!fa.isNothing;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isRight(fa) {
    return !!fa.isRight;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isValidation(fa) {
    return fa.factory === functors.Validation || fa.factory === monads.Validation;
}

export { isConstant, isEither, isFuture, isFunctor, isIdentity, isIo, isJust, isLeft, isList, isMaybe, isMonad, isNothing, isRight, isValidation };