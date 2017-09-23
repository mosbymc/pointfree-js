import { ap, apply, fmap, map, mapWith, flatMap, lift2, lift3, lift4, liftN, mjoin, pluckWith,
    chain, bind, mcompose, filter, intersect, except, isConstant, isEither, isFuture, isIdentity, isIo,
    isJust, isLeft, isList, isMaybe, isMonad, isNothing, isRight, isValidation, fold, sequence, traverse,
    contramap, isEmpty, equals, bimap, toList, toLeft, toRight, toEither, toIdentity, toMaybe, toNothing,
    toJust, toFuture, toConstant } from '../../src/pointless_data_structures';
import { Constant, Either, Future, Identity, Io, Just, Left, List, Maybe, Nothing, Right, Validation } from '../../src/dataStructures/monads/monads';

describe('Test functionalContainerHelpers', function _testFunctionalContainerHelpers() {
    describe('Test isMonad', function _testIsMonad() {
        it('should return true for any monad', function _testIsMonadWithMonads() {
            isMonad(Constant(1)).should.be.true;
            isMonad(List(1)).should.be.true;
            isMonad(Identity(1)).should.be.true;
            isMonad(Right(1)).should.be.true;
            isMonad(Just(1)).should.be.true;
            isMonad(Io(1)).should.be.true;
            isMonad(Future(1)).should.be.true;
            isMonad(Validation(1)).should.be.true;
            isMonad(Nothing()).should.be.true;
            isMonad(Left(1)).should.be.true;
        });
    });

    describe('Test isConstant', function _testIsConstant() {
        it('should return true for any constant container type', function _testIsConstantWithConstant() {
            isConstant(Constant(1)).should.be.true;
        });

        it('should return false for any non-constant container type', function _testIsConstantWithNonConstant() {
            isConstant(Identity(1)).should.be.false;
            isConstant(Nothing()).should.be.false;
            isConstant(List(1)).should.be.false;
            isConstant(Left(1)).should.be.false;
            isConstant(Right(1)).should.be.false;
            isConstant(Just(1)).should.be.false;
            isConstant(Io(1)).should.be.false;
            isConstant(Future(1)).should.be.false;
            isConstant(Validation(1)).should.be.false;
        });
    });

    describe('Test isEither', function _testIsEither() {
        it('should return true for any either container type', function _testIsEitherWithEitherContainer() {
            isEither(Left(1)).should.be.true;
            isEither(Right(1)).should.be.true;
        });

        it('should return false for any non-either container type', function _testIsEitherWithNonEitherContainer() {
            isEither(Validation(1)).should.be.false;
            isEither(Future(1)).should.be.false;
            isEither(Io(1)).should.be.false;
            isEither(Just(1)).should.be.false;
            isEither(Nothing()).should.be.false;
            isEither(Identity(1)).should.be.false;
            isEither(List(1)).should.be.false;
            isEither(Constant(1)).should.be.false;
        });
    });

    describe('Test isFuture', function _testIsFuture() {
        it('should return true for any future container type', function _testIsFutureWithFutureContainer() {
            isFuture(Future(1)).should.be.true;
        });

        it('should return false for any non-future container type', function _testIsFutureWithNonFutureContainer() {
            isFuture(Constant(1)).should.be.false;
            isFuture(Left(1)).should.be.false;
            isFuture(Right(1)).should.be.false;
            isFuture(Nothing()).should.be.false;
            isFuture(Just(1)).should.be.false;
            isFuture(Identity(1)).should.be.false;
            isFuture(Io(1)).should.be.false;
            isFuture(Validation(1)).should.be.false;
        });
    });

    describe('Test isIdentity', function _testIsIdentity() {
        it('should return true for all identity container types', function _testIsIdentityWithIdentityContainer() {
            isIdentity(Identity(1)).should.be.true;
        });

        it('should return false for any non-identity container type', function _testIsIdentityWithNonIdentityContainer() {
            isIdentity(Constant(1)).should.be.false;
            isIdentity(Left(1)).should.be.false;
            isIdentity(Right(1)).should.be.false;
            isIdentity(Nothing()).should.be.false;
            isIdentity(Just(1)).should.be.false;
            isIdentity(Future(1)).should.be.false;
            isIdentity(Io(1)).should.be.false;
            isIdentity(Validation(1)).should.be.false;
        });
    });

    describe('Test isIo', function _testIsIo() {
        it('should return true for all io container types', function _testIsIoWithIoContainer() {
            isIo(Io.of(1)).should.be.true;
        });

        it('should return false for any non-io container type', function _testIsIoWithNonIoContainer() {

            isIo(Constant(1)).should.be.false;
            isIo(Left(1)).should.be.false;
            isIo(Right(1)).should.be.false;
            isIo(Nothing()).should.be.false;
            isIo(Just(1)).should.be.false;
            isIo(Future(1)).should.be.false;
            isIo(Identity(1)).should.be.false;
            isIo(Validation(1)).should.be.false;
        });
    });

    describe('Test isJust', function _testIsJust() {
        it('should return true for all just container types', function _testIsJustWithJustContainer() {
            isJust(Just(1)).should.be.true;
        });

        it('should return false for any non-just container type', function _testIsJustWithNonJustContainer() {
            isJust(Constant(1)).should.be.false;
            isJust(Left(1)).should.be.false;
            isJust(Right(1)).should.be.false;
            isJust(Nothing()).should.be.false;
            isJust(Future.of(1)).should.be.false;
            isJust(Io.of(1)).should.be.false;
            isJust(Validation(1)).should.be.false;
        });
    });

    describe('Test isLeft', function _testIsLeft() {
        it('should return true for all left container types', function _testIsLeftWithLeftContainer() {
            isLeft(Left(1)).should.be.true;
        });

        it('should return false for any non-left container type', function _testIsLeftWithNonLeftContainer() {
            isLeft(Constant(1)).should.be.false;
            isLeft(Right(1)).should.be.false;
            isLeft(Nothing()).should.be.false;
            isLeft(Just(1)).should.be.false;
            isLeft(Future(1)).should.be.false;
            isLeft(Io(1)).should.be.false;
            isLeft(Validation(1)).should.be.false;
        });
    });

    describe('Test isList', function _testIsList() {
        it('should return true for all list container types', function _testIsListWithListContainer() {
            isList(List(1)).should.be.true;
        });

        it('should return false for any non-list container type', function _testIsListWithNonListContainer() {
            isList(Constant(1)).should.be.false;
            isList(Left(1)).should.be.false;
            isList(Right(1)).should.be.false;
            isList(Nothing()).should.be.false;
            isList(Just(1)).should.be.false;
            isList(Future(1)).should.be.false;
            isList(Io(1)).should.be.false;
            isList(Validation(1)).should.be.false;
            isList(Identity(1)).should.be.false;
        });
    });

    describe('Test isMaybe', function _testIsMaybe() {
        it('should return true for all maybe container types', function _testIsMaybeWithMaybeContainer() {
            isMaybe(Maybe(1)).should.be.true;
            isMaybe(Just(1)).should.be.true;
            isMaybe(Nothing()).should.be.true;
        });

        it('should return false for any non-maybe container type', function _testIsMaybeWithNonMaybeContainer() {
            isMaybe(Constant(1)).should.be.false;
            isMaybe(Left(1)).should.be.false;
            isMaybe(Right(1)).should.be.false;
            isMaybe(Identity(1)).should.be.false;
            isMaybe(Future.of(1)).should.be.false;
            isMaybe(Io.of(1)).should.be.false;
            isMaybe(Validation(1)).should.be.false;
        });
    });

    describe('Test isNothing', function _testIsNothing() {
        it('should return true for all nothing container types', function _testIsNothingWithNothingContainer() {
            isNothing(Nothing()).should.be.true;
        });

        it('should return false for any non-nothing container type', function _testIsNothingWithNonNothingContainer() {
            isNothing(Constant(1)).should.be.false;
            isNothing(Left(1)).should.be.false;
            isNothing(Right(1)).should.be.false;
            isNothing(Identity(1)).should.be.false;
            isNothing(Just(1)).should.be.false;
            isNothing(Future(1)).should.be.false;
            isNothing(Io(1)).should.be.false;
            isNothing(Validation(1)).should.be.false;
        });
    });

    describe('Test isRight', function _testIsRight() {
        it('should return true for all right container types', function _testIsRightWithRightContainer() {
            isRight(Right(1)).should.be.true;
            isRight(Either(1, 'right')).should.be.true;
        });

        it('should return false for any non-right container type', function _testIsRightWithNonRightContainer() {
            isRight(Constant(1)).should.be.false;
            isRight(Left(1)).should.be.false;
            isRight(Identity(1)).should.be.false;
            isRight(Nothing()).should.be.false;
            isRight(Just(1)).should.be.false;
            isRight(Future(1)).should.be.false;
            isRight(Io(1)).should.be.false;
            isRight(Validation(1)).should.be.false;
        });
    });

    describe('Test isValidation', function _testIsValidation() {
        it('should return true for all validation container types', function _testIsValidationWithValidationContainer() {
            isValidation(Validation(1)).should.be.true;
        });

        it('should return false for any non-validation container type', function _testIsValidationWithNonValidationContainer() {
            isValidation(Constant(1)).should.be.false;
            isValidation(Left(1)).should.be.false;
            isValidation(Right(1)).should.be.false;
            isValidation(Nothing()).should.be.false;
            isValidation(Just(1)).should.be.false;
            isValidation(Future(1)).should.be.false;
            isValidation(Io(1)).should.be.false;
            isValidation(Identity(1)).should.be.false;
        });
    });

    describe('Test map', function _testMap() {
        it('should map over any mappable data structure', function _testMap() {
            var res1 = mapWith(x => x * 2, Identity(4)),
                res2 = mapWith(x => x * x, Maybe(6)),
                res3 = mapWith(x => x + 15, Maybe()),
                res4 = map(Constant(10), x => x + 85);

            Object.getPrototypeOf(Identity()).isPrototypeOf(res1).should.be.true;
            res1.value.should.eql(8);

            Object.getPrototypeOf(Just()).isPrototypeOf(res2).should.be.true;
            res2.value.should.eql(36);

            Object.getPrototypeOf(Nothing()).isPrototypeOf(res3).should.be.true;
            expect(res3.value).to.be.null;

            Object.getPrototypeOf(Constant()).isPrototypeOf(res4).should.be.true;
            res4.value.should.eql(10);
        });
    });

    describe('Test mcompose', function _testMCompose() {
        it('should return something');
    });

    describe('Test apply', function _testApply() {
        it('should apply a function to an underlying value both contained within a data structure', function _testApply() {
            var i1 = Identity(x => x * x),
                i2 = Identity(15);

            var res = apply(i2, i1);
            Object.getPrototypeOf(i1).isPrototypeOf(res).should.be.true;
            res.value.should.eql(225);
        });
    });

    describe('Test fold', function _testFold() {
        it('should fold the data structure and return a value', function _testFold() {
            var i = Identity(10);

            fold((val, acc) => val + acc, 3, i).should.eql(13);
        });
    });

    describe('Test sequence', function _testSequence() {
        it('should sequence the identity', function _testSequence() {
            var i = Identity(1);
            var res = sequence(Maybe, i);

            Object.getPrototypeOf(Maybe(1)).isPrototypeOf(res).should.be.true;
            res.toString().should.eql('Just(Identity(1))');
        });
    });

    describe('Test traverse', function _testTraverse() {
        it('should traverse the identity', function _testTraverse() {
            var i = Identity(1),
                res = traverse(Maybe, x => Maybe(x * 10), i);

            Object.getPrototypeOf(Maybe(1)).isPrototypeOf(res).should.be.true;
            res.toString().should.eql('Just(Identity(10))');
        });
    });

    describe('Test contramap', function _testContramap() {
        it('should contramap the identity', function _testContramap() {
            var i1 = Identity(x => x * x),
                i2 = Identity(2);

            var res = chain(x => x, apply(i2, contramap(x => x + 5, i1)));
            Object.getPrototypeOf(Identity()).isPrototypeOf(res).should.be.true;
            res.value.should.eql(49);
        });
    });

    describe('Test lift', function _testLift() {
        it('should accept four data structures and a single function and return a data structure', function _testLift4() {
            var m1 = Identity(x => x + 5),
                m2 = Identity(x => x * x),
                m3 = Identity(x => x - 33),
                m4 = Identity(10);

            var mapper = f => g => h => i => h(g(f(i)));
            lift4(mapper, m1, m2, m3, m4).value.should.eql(192);
        });

        it('should arrive at the same value at lift4', function _testLiftNSameness() {
            var m1 = Identity(x => x + 5),
                m2 = Identity(x => x * x),
                m3 = Identity(x => x - 33),
                m4 = Identity(10),
                mapper = f => g => h => i => h(g(f(i)));
            liftN(mapper, m1, m2, m3, m4).value.should.eql(192);
        });

        it('should accept n data structures and a single function and return a data structure of the same shape', function _testLiftN() {
            var m1 = Identity(x => x + 5),
                m2 = Identity(x => x * (x - 1204145)),
                m3 = Identity(x => x - 178931),
                m4 = Identity(x => Math.pow(x, (x / 2))),
                m5 = Identity(x => x + 13),
                m6 = Identity(x => x - 4),
                m7 = Identity(3),
                mapper = f => g => h => i => j => k => l => k(f(g(h(i(j(k(l)))))));
            liftN(mapper, m1, m2, m3, m4, m5, m6, m7).value.should.eql(4499447710125);
        });
    });

    describe('Test equals', function _testEquals() {
        it('should not return true when the same data structure type has different values', function _testEqualsWithDifferentValues() {
            equals(Identity(1), Identity(2)).should.be.false;
            equals(Identity(true), Identity(2)).should.be.false;
            equals(Identity(1), Identity(true)).should.be.false;
            equals(Identity({}), Identity({})).should.be.false;
        });

        it('should not return true when different data structure types are compared', function _testEqualsWithDifferentTypes() {
            equals(Identity(1), Maybe(1)).should.be.false;
            equals(Maybe(1), Identity(1)).should.be.false;
            equals(Identity(true), Maybe(true)).should.be.false;
            equals(Maybe(true), Identity(true)).should.be.false;
        });

        it('should return false when both types and values are different', function _testEqualsWithDifferentTypesAndValues() {
            equals(Identity(1), Maybe(1)).should.be.false;
            equals(Maybe(false), Identity(true)).should.be.false;
        });

        it('should return true when types and values are the same', function _testEqualsWithSameTypesAndValues() {
            equals(Identity(1), Identity(1)).should.be.true;
            equals(Maybe(1), Maybe(1)).should.be.true;
        });

        it('should work with nested data structures', function _testEqualsWithNestedTypes() {
            equals(Identity(Identity(1)), Identity(1)).should.be.true;
            equals(Maybe(true), Maybe(Maybe(false))).should.be.false;
        });
    });
});