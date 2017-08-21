import * as monads from './dataStructures/monads/monads';

/** @module functional_data_structure_helpers */

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isConstant(fa) {
    return fa.factory === monads.Constant;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isEither(fa) {
    return fa.factory === monads.Either;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isFuture(fa) {
    return fa.factory === monads.Future;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIdentity(fa) {
    return fa.factory === monads.Identity;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIo(fa) {
    return fa.factory === monads.Io;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isJust(fa) {
    return !!(fa.isJust && fa.factory === monads.Maybe);
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isLeft(fa) {
    return !!(fa.isLeft && fa.factory === monads.Either);
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isList(fa) {
    return fa.factory === monads.List;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isMaybe(fa) {
    return !!((fa.isNothing && (fa.factory === monads.Maybe)) ||
        (fa.isJust && (fa.factory === monads.Maybe)));
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
    return fa.factory === monads.Validation;
}

export { isConstant, isEither, isFuture, isIdentity, isIo, isJust, isLeft, isList, isMaybe, isMonad, isNothing, isRight, isValidation };