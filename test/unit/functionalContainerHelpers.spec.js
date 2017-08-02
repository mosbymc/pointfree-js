import { isConstant, isEither, isFuture, isFunctor, isIdentity, isIo, isJust, isLeft,
        isList, isMaybe, isMonad, isNothing, isRight, isValidation } from '../../src/functionalContainerHelpers';
import { functors } from '../../src/containers/functors/functors';
import { monads } from '../../src/containers/monads/monads';

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
});