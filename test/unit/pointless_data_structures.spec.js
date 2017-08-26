import { isConstant, isEither, isFuture, isIdentity, isIo, isJust, isLeft,
    isList, isMaybe, isMonad, isNothing, isRight, isValidation } from '../../src/pointless_data_structures';
import * as monads from '../../src/dataStructures/monads/monads';

describe('Test functionalContainerHelpers', function _testFunctionalContainerHelpers() {
    describe('Test isMonad', function _testIsMonad() {
        it('should return true for any monad', function _testIsMonadWithMonads() {
            isMonad(monads.Constant(1)).should.be.true;
            isMonad(monads.List(1)).should.be.true;
            isMonad(monads.Identity(1)).should.be.true;
            isMonad(monads.Right(1)).should.be.true;
            isMonad(monads.Just(1)).should.be.true;
            isMonad(monads.Io(1)).should.be.true;
            isMonad(monads.Future(1)).should.be.true;
            isMonad(monads.Validation(1)).should.be.true;
            isMonad(monads.Nothing()).should.be.true;
            isMonad(monads.Left(1)).should.be.true;
        });
    });

    describe('Test isConstant', function _testIsConstant() {
        it('should return true for any constant container type', function _testIsConstantWithConstant() {
            isConstant(monads.Constant(1)).should.be.true;
        });

        it('should return false for any non-constant container type', function _testIsConstantWithNonConstant() {
            isConstant(monads.Identity(1)).should.be.false;
            isConstant(monads.Nothing()).should.be.false;
            isConstant(monads.List(1)).should.be.false;
            isConstant(monads.Left(1)).should.be.false;
            isConstant(monads.Right(1)).should.be.false;
            isConstant(monads.Just(1)).should.be.false;
            isConstant(monads.Io(1)).should.be.false;
            isConstant(monads.Future(1)).should.be.false;
            isConstant(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isEither', function _testIsEither() {
        it('should return true for any either container type', function _testIsEitherWithEitherContainer() {
            isEither(monads.Left(1)).should.be.true;
            isEither(monads.Right(1)).should.be.true;
        });

        it('should return false for any non-either container type', function _testIsEitherWithNonEitherContainer() {
            isEither(monads.Validation(1)).should.be.false;
            isEither(monads.Future(1)).should.be.false;
            isEither(monads.Io(1)).should.be.false;
            isEither(monads.Just(1)).should.be.false;
            isEither(monads.Nothing()).should.be.false;
            isEither(monads.Identity(1)).should.be.false;
            isEither(monads.List(1)).should.be.false;
            isEither(monads.Constant(1)).should.be.false;
        });
    });

    describe('Test isFuture', function _testIsFuture() {
        it('should return true for any future container type', function _testIsFutureWithFutureContainer() {
            isFuture(monads.Future(1)).should.be.true;
        });

        it('should return false for any non-future container type', function _testIsFutureWithNonFutureContainer() {
            isFuture(monads.Constant(1)).should.be.false;
            isFuture(monads.Left(1)).should.be.false;
            isFuture(monads.Right(1)).should.be.false;
            isFuture(monads.Nothing()).should.be.false;
            isFuture(monads.Just(1)).should.be.false;
            isFuture(monads.Identity(1)).should.be.false;
            isFuture(monads.Io(1)).should.be.false;
            isFuture(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isIdentity', function _testIsIdentity() {
        it('should return true for all identity container types', function _testIsIdentityWithIdentityContainer() {
            isIdentity(monads.Identity(1)).should.be.true;
        });

        it('should return false for any non-identity container type', function _testIsIdentityWithNonIdentityContainer() {
            isIdentity(monads.Constant(1)).should.be.false;
            isIdentity(monads.Left(1)).should.be.false;
            isIdentity(monads.Right(1)).should.be.false;
            isIdentity(monads.Nothing()).should.be.false;
            isIdentity(monads.Just(1)).should.be.false;
            isIdentity(monads.Future(1)).should.be.false;
            isIdentity(monads.Io(1)).should.be.false;
            isIdentity(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isIo', function _testIsIo() {
        it('should return true for all io container types', function _testIsIoWithIoContainer() {
            isIo(monads.Io.of(1)).should.be.true;
        });

        it('should return false for any non-io container type', function _testIsIoWithNonIoContainer() {

            isIo(monads.Constant(1)).should.be.false;
            isIo(monads.Left(1)).should.be.false;
            isIo(monads.Right(1)).should.be.false;
            isIo(monads.Nothing()).should.be.false;
            isIo(monads.Just(1)).should.be.false;
            isIo(monads.Future(1)).should.be.false;
            isIo(monads.Identity(1)).should.be.false;
            isIo(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isJust', function _testIsJust() {
        it('should return true for all just container types', function _testIsJustWithJustContainer() {
            isJust(monads.Just(1)).should.be.true;
        });

        it('should return false for any non-just container type', function _testIsJustWithNonJustContainer() {
            isJust(monads.Constant(1)).should.be.false;
            isJust(monads.Left(1)).should.be.false;
            isJust(monads.Right(1)).should.be.false;
            isJust(monads.Nothing()).should.be.false;
            isJust(monads.Future.of(1)).should.be.false;
            isJust(monads.Io.of(1)).should.be.false;
            isJust(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isLeft', function _testIsLeft() {
        it('should return true for all left container types', function _testIsLeftWithLeftContainer() {
            isLeft(monads.Left(1)).should.be.true;
        });

        it('should return false for any non-left container type', function _testIsLeftWithNonLeftContainer() {
            isLeft(monads.Constant(1)).should.be.false;
            isLeft(monads.Right(1)).should.be.false;
            isLeft(monads.Nothing()).should.be.false;
            isLeft(monads.Just(1)).should.be.false;
            isLeft(monads.Future(1)).should.be.false;
            isLeft(monads.Io(1)).should.be.false;
            isLeft(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isList', function _testIsList() {
        it('should return true for all list container types', function _testIsListWithListContainer() {
            isList(monads.List(1)).should.be.true;
        });

        it('should return false for any non-list container type', function _testIsListWithNonListContainer() {
            isList(monads.Constant(1)).should.be.false;
            isList(monads.Left(1)).should.be.false;
            isList(monads.Right(1)).should.be.false;
            isList(monads.Nothing()).should.be.false;
            isList(monads.Just(1)).should.be.false;
            isList(monads.Future(1)).should.be.false;
            isList(monads.Io(1)).should.be.false;
            isList(monads.Validation(1)).should.be.false;
            isList(monads.Identity(1)).should.be.false;
        });
    });

    describe('Test isMaybe', function _testIsMaybe() {
        it('should return true for all maybe container types', function _testIsMaybeWithMaybeContainer() {
            isMaybe(monads.Maybe(1)).should.be.true;
            isMaybe(monads.Just(1)).should.be.true;
            isMaybe(monads.Nothing()).should.be.true;
        });

        it('should return false for any non-maybe container type', function _testIsMaybeWithNonMaybeContainer() {
            isMaybe(monads.Constant(1)).should.be.false;
            isMaybe(monads.Left(1)).should.be.false;
            isMaybe(monads.Right(1)).should.be.false;
            isMaybe(monads.Identity(1)).should.be.false;
            isMaybe(monads.Future.of(1)).should.be.false;
            isMaybe(monads.Io.of(1)).should.be.false;
            isMaybe(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isNothing', function _testIsNothing() {
        it('should return true for all nothing container types', function _testIsNothingWithNothingContainer() {
            isNothing(monads.Nothing()).should.be.true;
        });

        it('should return false for any non-nothing container type', function _testIsNothingWithNonNothingContainer() {
            isNothing(monads.Constant(1)).should.be.false;
            isNothing(monads.Left(1)).should.be.false;
            isNothing(monads.Right(1)).should.be.false;
            isNothing(monads.Identity(1)).should.be.false;
            isNothing(monads.Just(1)).should.be.false;
            isNothing(monads.Future(1)).should.be.false;
            isNothing(monads.Io(1)).should.be.false;
            isNothing(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isRight', function _testIsRight() {
        it('should return true for all right container types', function _testIsRightWithRightContainer() {
            isRight(monads.Right(1)).should.be.true;
            isRight(monads.Either(1, 'right')).should.be.true;
        });

        it('should return false for any non-right container type', function _testIsRightWithNonRightContainer() {
            isRight(monads.Constant(1)).should.be.false;
            isRight(monads.Left(1)).should.be.false;
            isRight(monads.Identity(1)).should.be.false;
            isRight(monads.Nothing()).should.be.false;
            isRight(monads.Just(1)).should.be.false;
            isRight(monads.Future(1)).should.be.false;
            isRight(monads.Io(1)).should.be.false;
            isRight(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isValidation', function _testIsValidation() {
        it('should return true for all validation container types', function _testIsValidationWithValidationContainer() {
            isValidation(monads.Validation(1)).should.be.true;
        });

        it('should return false for any non-validation container type', function _testIsValidationWithNonValidationContainer() {
            isValidation(monads.Constant(1)).should.be.false;
            isValidation(monads.Left(1)).should.be.false;
            isValidation(monads.Right(1)).should.be.false;
            isValidation(monads.Nothing()).should.be.false;
            isValidation(monads.Just(1)).should.be.false;
            isValidation(monads.Future(1)).should.be.false;
            isValidation(monads.Io(1)).should.be.false;
            isValidation(monads.Identity(1)).should.be.false;
        });
    });
});