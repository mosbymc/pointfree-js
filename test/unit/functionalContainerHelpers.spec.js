import { isConstant, isEither, isFuture, isFunctor, isIdentity, isIo, isJust, isLeft,
        isList, isMaybe, isMonad, isNothing, isRight, isValidation } from '../../src/functionalContainerHelpers';
import * as functors from '../../src/dataStructures/functors/functors';
import * as monads from '../../src/dataStructures/monads/monads';

describe('Test functionalContainerHelpers', function _testFunctionalContainerHelpers() {
    describe('Test isFunctor', function _testIsFunctor() {
        it('should return true for any functor', function _testIsFunctorWithFunctors() {
            isFunctor(functors.Constant(1)).should.be.true;
            isFunctor(functors.List(1)).should.be.true;
            isFunctor(functors.Identity(1)).should.be.true;
            isFunctor(functors.Right(1)).should.be.true;
            isFunctor(functors.Just(1)).should.be.true;
            isFunctor(functors.Io(1)).should.be.true;
            isFunctor(functors.Future(1)).should.be.true;
            isFunctor(functors.Validation(1)).should.be.true;
            isFunctor(functors.Nothing()).should.be.true;
            isFunctor(functors.Left(1)).should.be.true;
        });

        it('should return false for any non functor', function _testIsFunctorWithMonads() {
            isFunctor(monads.Constant(1)).should.be.false;
            isFunctor(monads.List(1)).should.be.false;
            isFunctor(monads.Identity(1)).should.be.false;
            isFunctor(monads.Right(1)).should.be.false;
            isFunctor(monads.Just(1)).should.be.false;
            isFunctor(monads.Io(1)).should.be.false;
            isFunctor(monads.Future(1)).should.be.false;
            isFunctor(monads.Validation(1)).should.be.false;
            isFunctor(monads.Nothing()).should.be.false;
            isFunctor(monads.Left(1)).should.be.false;
        });
    });

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

        it('should return false for any non monad', function _testIsMonadWithFunctors() {
            isMonad(functors.Constant(1)).should.be.false;
            isMonad(functors.List(1)).should.be.false;
            isMonad(functors.Identity(1)).should.be.false;
            isMonad(functors.Right(1)).should.be.false;
            isMonad(functors.Just(1)).should.be.false;
            isMonad(functors.Io(1)).should.be.false;
            isMonad(functors.Future(1)).should.be.false;
            isMonad(functors.Validation(1)).should.be.false;
            isMonad(functors.Nothing()).should.be.false;
            isMonad(functors.Left(1)).should.be.false;
        });
    });

    describe('Test isConstant', function _testIsConstant() {
        it('should return true for any constant container type', function _testIsConstantWithConstant() {
            isConstant(functors.Constant(1)).should.be.true;
            isConstant(monads.Constant(1)).should.be.true;
        });

        it('should return false for any non-constant container type', function _testIsConstantWithNonConstant() {
            isConstant(functors.Identity(1)).should.be.false;
            isConstant(functors.Nothing()).should.be.false;
            isConstant(functors.List(1)).should.be.false;
            isConstant(functors.Left(1)).should.be.false;
            isConstant(functors.Right(1)).should.be.false;
            isConstant(functors.Just(1)).should.be.false;
            isConstant(functors.Io(1)).should.be.false;
            isConstant(functors.Future(1)).should.be.false;
            isConstant(functors.Validation(1)).should.be.false;

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
            isEither(functors.Left(1)).should.be.true;
            isEither(functors.Right(1)).should.be.true;

            isEither(monads.Left(1)).should.be.true;
            isEither(monads.Right(1)).should.be.true;
        });

        it('should return false for any non-either container type', function _testIsEitherWithNonEitherContainer() {
            isEither(functors.Validation(1)).should.be.false;
            isEither(functors.Future(1)).should.be.false;
            isEither(functors.Io(1)).should.be.false;
            isEither(functors.Just(1)).should.be.false;
            isEither(functors.Nothing()).should.be.false;
            isEither(functors.Identity(1)).should.be.false;
            isEither(functors.List(1)).should.be.false;
            isEither(functors.Constant(1)).should.be.false;

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
            isFuture(functors.Future(1)).should.be.true;
            isFuture(monads.Future(1)).should.be.true;
        });

        it('should return false for any non-future container type', function _testIsFutureWithNonFutureContainer() {
            isFuture(functors.Constant(1)).should.be.false;
            isFuture(functors.Left(1)).should.be.false;
            isFuture(functors.Right(1)).should.be.false;
            isFuture(functors.Nothing()).should.be.false;
            isFuture(functors.Just(1)).should.be.false;
            isFuture(functors.Identity(1)).should.be.false;
            isFuture(functors.Io(1)).should.be.false;
            isFuture(functors.Validation(1)).should.be.false;

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
            isIdentity(functors.Identity(1)).should.be.true;
            isIdentity(monads.Identity(1)).should.be.true;
        });

        it('should return false for any non-identity container type', function _testIsIdentityWithNonIdentityContainer() {
            isIdentity(functors.Constant(1)).should.be.false;
            isIdentity(functors.Left(1)).should.be.false;
            isIdentity(functors.Right(1)).should.be.false;
            isIdentity(functors.Nothing()).should.be.false;
            isIdentity(functors.Just(1)).should.be.false;
            isIdentity(functors.Future(1)).should.be.false;
            isIdentity(functors.Io(1)).should.be.false;
            isIdentity(functors.Validation(1)).should.be.false;

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
            isIo(functors.Io(1)).should.be.true;
            isIo(monads.Io(1)).should.be.true;
        });

        it('should return false for any non-io container type', function _testIsIoWithNonIoContainer() {
            isIo(functors.Constant(1)).should.be.false;
            isIo(functors.Left(1)).should.be.false;
            isIo(functors.Right(1)).should.be.false;
            isIo(functors.Nothing()).should.be.false;
            isIo(functors.Just(1)).should.be.false;
            isIo(functors.Future(1)).should.be.false;
            isIo(functors.Identity(1)).should.be.false;
            isIo(functors.Validation(1)).should.be.false;

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
            isJust(functors.Just(1)).should.be.true;
            isJust(monads.Just(1)).should.be.true;
        });

        it('should return false for any non-just container type', function _testIsJustWithNonJustContainer() {
            isJust(functors.Constant(1)).should.be.false;
            isJust(functors.Left(1)).should.be.false;
            isJust(functors.Right(1)).should.be.false;
            isJust(functors.Nothing()).should.be.false;
            isJust(functors.Future(1)).should.be.false;
            isJust(functors.Io(1)).should.be.false;
            isJust(functors.Validation(1)).should.be.false;

            isJust(monads.Constant(1)).should.be.false;
            isJust(monads.Left(1)).should.be.false;
            isJust(monads.Right(1)).should.be.false;
            isJust(monads.Nothing()).should.be.false;
            isJust(monads.Future(1)).should.be.false;
            isJust(monads.Io(1)).should.be.false;
            isJust(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isLeft', function _testIsLeft() {
        it('should return true for all left container types', function _testIsLeftWithLeftContainer() {
            isLeft(functors.Left(1)).should.be.true;
            isLeft(monads.Left(1)).should.be.true;
        });

        it('should return false for any non-left container type', function _testIsLeftWithNonLeftContainer() {
            isLeft(functors.Constant(1)).should.be.false;
            isLeft(functors.Right(1)).should.be.false;
            isLeft(functors.Nothing()).should.be.false;
            isLeft(functors.Just(1)).should.be.false;
            isLeft(functors.Future(1)).should.be.false;
            isLeft(functors.Io(1)).should.be.false;
            isLeft(functors.Validation(1)).should.be.false;

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
            isList(functors.List(1)).should.be.true;
            isList(monads.List(1)).should.be.true;
        });

        it('should return false for any non-list container type', function _testIsListWithNonListContainer() {
            isList(functors.Constant(1)).should.be.false;
            isList(functors.Left(1)).should.be.false;
            isList(functors.Right(1)).should.be.false;
            isList(functors.Nothing()).should.be.false;
            isList(functors.Just(1)).should.be.false;
            isList(functors.Future(1)).should.be.false;
            isList(functors.Io(1)).should.be.false;
            isList(functors.Validation(1)).should.be.false;
            isList(functors.Identity(1)).should.be.false;

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
            isMaybe(functors.Maybe(1)).should.be.true;
            isMaybe(functors.Just(1)).should.be.true;
            isMaybe(functors.Nothing()).should.be.true;
            isMaybe(monads.Maybe(1)).should.be.true;
            isMaybe(monads.Just(1)).should.be.true;
            isMaybe(monads.Nothing()).should.be.true;
        });

        it('should return false for any non-maybe container type', function _testIsMaybeWithNonMaybeContainer() {
            isMaybe(functors.Constant(1)).should.be.false;
            isMaybe(functors.Left(1)).should.be.false;
            isMaybe(functors.Right(1)).should.be.false;
            isMaybe(functors.Identity(1)).should.be.false;
            isMaybe(functors.Future(1)).should.be.false;
            isMaybe(functors.Io(1)).should.be.false;
            isMaybe(functors.Validation(1)).should.be.false;

            isMaybe(monads.Constant(1)).should.be.false;
            isMaybe(monads.Left(1)).should.be.false;
            isMaybe(monads.Right(1)).should.be.false;
            isMaybe(monads.Identity(1)).should.be.false;
            isMaybe(monads.Future(1)).should.be.false;
            isMaybe(monads.Io(1)).should.be.false;
            isMaybe(monads.Validation(1)).should.be.false;
        });
    });

    describe('Test isNothing', function _testIsNothing() {
        it('should return true for all nothing container types', function _testIsNothingWithNothingContainer() {
            isNothing(functors.Nothing()).should.be.true;
            isNothing(monads.Nothing()).should.be.true;
        });

        it('should return false for any non-nothing container type', function _testIsNothingWithNonNothingContainer() {
            isNothing(functors.Constant(1)).should.be.false;
            isNothing(functors.Left(1)).should.be.false;
            isNothing(functors.Right(1)).should.be.false;
            isNothing(functors.Identity(1)).should.be.false;
            isNothing(functors.Just(1)).should.be.false;
            isNothing(functors.Future(1)).should.be.false;
            isNothing(functors.Io(1)).should.be.false;
            isNothing(functors.Validation(1)).should.be.false;

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
            isRight(functors.Right(1)).should.be.true;
            isRight(functors.Either(1, 'right')).should.be.true;
            isRight(monads.Right(1)).should.be.true;
            isRight(monads.Either(1, 'right')).should.be.true;
        });

        it('should return false for any non-right container type', function _testIsRightWithNonRightContainer() {
            isRight(functors.Constant(1)).should.be.false;
            isRight(functors.Left(1)).should.be.false;
            isRight(functors.Identity(1)).should.be.false;
            isRight(functors.Nothing()).should.be.false;
            isRight(functors.Just(1)).should.be.false;
            isRight(functors.Future(1)).should.be.false;
            isRight(functors.Io(1)).should.be.false;
            isRight(functors.Validation(1)).should.be.false;

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
            isValidation(functors.Validation(1)).should.be.true;
            isValidation(monads.Validation(1)).should.be.true;
        });

        it('should return false for any non-validation container type', function _testIsValidationWithNonValidationContainer() {
            isValidation(functors.Constant(1)).should.be.false;
            isValidation(functors.Left(1)).should.be.false;
            isValidation(functors.Right(1)).should.be.false;
            isValidation(functors.Nothing()).should.be.false;
            isValidation(functors.Just(1)).should.be.false;
            isValidation(functors.Future(1)).should.be.false;
            isValidation(functors.Io(1)).should.be.false;
            isValidation(functors.Identity(1)).should.be.false;

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