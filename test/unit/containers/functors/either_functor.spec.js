import * as functors from '../../../../src/dataStructures/functors/functors';
import { right_functor, left_functor } from '../../../../src/dataStructures/functors/either_functor';

var Either = functors.Either,
    Left = functors.Left,
    Right = functors.Right;

describe('Either functor tests', function _testEitherFunctor() {
    describe('Either object factory tests', function _testEitherObjectFactory() {
        it('should return a new either functor with the correct side', function _testEitherFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                e1 = Either(),
                e2 = Either(null, 'left'),
                e3 = Either(arr, 'right'),
                e4 = Either(obj, 'right');

            left_functor.isPrototypeOf(e1).should.be.true;
            left_functor.isPrototypeOf(e2).should.be.true;
            right_functor.isPrototypeOf(e3).should.be.true;
            right_functor.isPrototypeOf(e4).should.be.true;

            e1.isLeft.should.be.true;
            e1.isRight.should.not.be.true;
            e2.isLeft.should.be.true;
            e2.isRight.should.not.be.true;
            e3.isLeft.should.not.be.true;
            e3.isRight.should.be.true;
            e4.isLeft.should.not.be.true;
            e4.isRight.should.be.true;
        });

        it('should return the same type/value when using the #of function', function _testEitherDotOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                e1 = Either(),
                e2 = Either(null, 'left'),
                e3 = Either(arr, 'right'),
                e4 = Either(obj, 'right');

            left_functor.isPrototypeOf(e1).should.be.true;
            left_functor.isPrototypeOf(e2).should.be.true;
            right_functor.isPrototypeOf(e3).should.be.true;
            right_functor.isPrototypeOf(e4).should.be.true;

            e1.isLeft.should.be.true;
            e1.isRight.should.not.be.true;
            e2.isLeft.should.be.true;
            e2.isRight.should.not.be.true;
            e3.isLeft.should.not.be.true;
            e3.isRight.should.be.true;
            e4.isLeft.should.not.be.true;
            e4.isRight.should.be.true;
        });

        it('should return a left or a right', function _testEitherDotLeftAndEitherDotRight() {
            var r = Either.Right(10),
                l = Either.Left(10);

            right_functor.isPrototypeOf(r).should.be.true;
            left_functor.isPrototypeOf(l).should.be.true;

            r.isRight.should.be.true;
            r.isLeft.should.be.false;

            l.isRight.should.be.false;
            l.isLeft.should.be.true;
        });

        it('should return a left or a right based on null value', function _testEitherDotFromNullable() {
            var e1 = Either.fromNullable(null),
                e2 = Either.fromNullable(1);

            left_functor.isPrototypeOf(e1).should.be.true;
            right_functor.isPrototypeOf(e2).should.be.true;

            e1.isLeft.should.be.true;
            e1.isRight.should.be.false;

            e2.isLeft.should.be.false;
            e2.isRight.should.be.true;
        });

        it('should return correct boolean value when #is is invoked', function _testEitherDotIs() {
            var e1 = Either(10),
                e2 = Either(10, 'left'),
                e3 = Either(10, 'right'),
                m = functors.Maybe(10),
                i = functors.Identity(10),
                f = Either.is,
                n = null,
                s = 'string',
                b = false;

            Either.is(e1).should.be.true;
            Either.is(e2).should.be.true;
            Either.is(e3).should.be.true;
            Either.is(m).should.be.false;
            Either.is(i).should.be.false;
            Either.is(f).should.be.false;
            Either.is(n).should.be.false;
            Either.is(s).should.be.false;
            Either.is(b).should.be.false;

            Left.is(e1).should.be.true;
            Left.is(e2).should.be.true;
            Left.is(e3).should.be.false;
            Left.is(m).should.be.false;
            Left.is(i).should.be.false;
            Left.is(f).should.be.false;
            Left.is(n).should.be.false;
            Left.is(s).should.be.false;
            Left.is(b).should.be.false;

            Right.is(e1).should.be.false;
            Right.is(e2).should.be.false;
            Right.is(e3).should.be.true;
            Right.is(m).should.be.false;
            Right.is(i).should.be.false;
            Right.is(f).should.be.false;
            Right.is(n).should.be.false;
            Right.is(s).should.be.false;
            Right.is(b).should.be.false;
        });

        it('should return correct results when isLeft/isRight is called on an either', function _testEitherFactorIsLeftIsRightHelpers() {
            var EitherSpy = sinon.spy(Either),
                e1 = Left(1),
                e2 = Left('test'),
                e3 = Right(1),
                e4 = Right('test');

            //EitherSpy.callCount.should.eql(4);

            Either.isLeft(e1).should.be.true;
            Either.isRight(e1).should.be.false;

            Either.isLeft(e2).should.be.true;
            Either.isRight(e2).should.be.false;

            Either.isLeft(e3).should.be.false;
            Either.isRight(e3).should.be.true;

            Either.isLeft(e4).should.be.false;
            Either.isRight(e4).should.be.true;
        });
    });

    describe('Left and Right either functor creation tests', function _testLeftAndRightObjectCreation() {
        it('should return a new left either functor', function _testEitherCreationViaLeftFunction() {
            var e1 = Left(),
                e2 = Left(1),
                e3 = Left(null);

            e1.isLeft.should.be.true;
            e1.isRight.should.be.false;

            e2.isLeft.should.be.true;
            e2.isRight.should.be.false;

            e3.isLeft.should.be.true;
            e3.isRight.should.be.false;
        });

        it('should return a new right either functor', function _testEitherCreationViaRightFunction() {
            var e1 = Right(),
                e2 = Right(1),
                e3 = Right(null);

            e1.isLeft.should.be.false;
            e1.isRight.should.be.true;

            e2.isLeft.should.be.false;
            e2.isRight.should.be.true;

            e3.isLeft.should.be.false;
            e3.isRight.should.be.true;
        });
    });

    describe('Either functor object tests', function _testEitherFunctorObject() {
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var e = Either(1),
                err1 = false,
                err2 = false;
            e.should.have.ownPropertyDescriptor('_value', { value: 1, writable: false, configurable: false, enumerable: false });

            try {
                e._value = 2;
            }
            catch(e) {
                err1 = true;
            }
            err1.should.be.true;

            try {
                e.value = 2;
            }
            catch(e) {
                err2 = true;
            }

            err2.should.be.true;
        });

        it('should return a new either instance with a new value when mapping a right either', function _testRightEitherMapping() {
            var e1 = Right(1),
                e2 = Right([1, 2, 3]);

            var e1_1 = e1.map(function _m(i) { return i*2; }),
                e2_1 = e2.map(function _m(a) { return a.map(function t(i) { return i * 2 ;}); });

            right_functor.isPrototypeOf(e1_1).should.be.true;
            right_functor.isPrototypeOf(e2_1).should.be.true;

            e1_1.isLeft.should.be.false;
            e1_1.isRight.should.be.true;

            e2_1.isLeft.should.be.false;
            e2_1.isRight.should.be.true;

            e1_1.value.should.eql(2);
            e2_1.value.should.eql([2, 4, 6]);
        });

        it('should return a new either instance with the same value when mapping a left either', function _testLeftEitherMapping() {
            var e1 = Left(null),
                e2 = Left('this is a test');

            var e1_1 = e1.map(),
                e2_1 = e2.map();

            left_functor.isPrototypeOf(e1_1).should.be.true;
            left_functor.isPrototypeOf(e2_1).should.be.true;

            e1_1.isLeft.should.be.true;
            e1_1.isRight.should.be.false;

            e2_1.isLeft.should.be.true;
            e2_1.isRight.should.be.false;

            expect(e1_1.value).to.eql(e1.value);
            e2_1.value.should.eql(e2.value);
        });

        it('should properly indicate equality when constant functors are indeed equal', function _testEitherFunctorEquality() {
            var m1 = Either(null),
                m2 = Either(null),
                m3 = Either(1),
                m4 = Either(1),
                m5 = Either(2),
                m6 = Left(),
                m7 = Left(1),
                m8 = Right(),
                m9 = Right(1);

            m1.equals(6).should.be.false;
            expect(m1.value).to.not.equal(functors.Maybe(true).value);

            m1.equals(m2).should.be.true;
            m1.equals(m3).should.be.false;
            m1.equals(m4).should.be.false;
            m1.equals(m5).should.be.false;
            m1.equals(m6).should.be.false;
            m1.equals(m7).should.be.false;
            m1.equals(m8).should.be.false;
            m1.equals(m9).should.be.false;

            m2.equals(m3).should.be.false;
            m2.equals(m4).should.be.false;
            m2.equals(m5).should.be.false;
            m2.equals(m6).should.be.false;
            m2.equals(m7).should.be.false;
            m2.equals(m8).should.be.false;
            m2.equals(m9).should.be.false;

            m3.equals(m4).should.be.true;
            m3.equals(m5).should.be.false;
            m3.equals(m6).should.be.false;
            m3.equals(m7).should.be.true;
            m3.equals(m8).should.be.false;
            m3.equals(m9).should.be.false;

            m4.equals(m5).should.be.false;
            m4.equals(m6).should.be.false;
            m4.equals(m7).should.be.true;
            m4.equals(m8).should.be.false;
            m4.equals(m9).should.be.false;

            m5.equals(m6).should.be.false;
            m5.equals(m7).should.be.false;
            m5.equals(m8).should.be.false;
            m5.equals(m9).should.be.false;

            m6.equals(m7).should.be.false;
            m6.equals(m8).should.be.false;
            m6.equals(m9).should.be.false;

            m7.equals(m8).should.be.false;
            m7.equals(m9).should.be.false;

            m8.equals(m9).should.be.false;
        });

        it('should return a new constant functor regardless of data type', function _testEitherFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                e = Either(),
                e1 = e.of(),
                e2 = e.of(null),
                e3 = e.of(arr),
                e4 = e.of(obj);

            right_functor.isPrototypeOf(e1).should.be.true;
            right_functor.isPrototypeOf(e2).should.be.true;
            right_functor.isPrototypeOf(e3).should.be.true;
            right_functor.isPrototypeOf(e4).should.be.true;

            e1.isLeft.should.be.false;
            e1.isRight.should.be.true;
            e2.isLeft.should.be.false;
            e2.isRight.should.be.true;
            e3.isLeft.should.not.be.true;
            e3.isRight.should.be.true;
            e4.isLeft.should.not.be.true;
            e4.isRight.should.be.true;
        });

        it('should have a functioning iterator', function _testEitherFunctorIterator() {
            var e1 = Either(10),
                e2 = Either({ a: 1, b: 2 });

            var e1Res = [...e1],
                e2Res = [...e2];

            e1Res.should.eql([e1.value]);
            e2Res.should.eql([e2.value]);
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testEitherFunctorValueOf() {
            var e1 = Either('Mark'),
                e2 = Either(10);

            var str = 'Hello my name is: ' + e1,
                num1 = 15 * e2,
                num2 = 3 + e2,
                num3 = e2 - 6,
                num4 = e2 / 5;

            str.should.eql('Hello my name is: Mark');
            num1.should.eql(150);
            num2.should.eql(13);
            num3.should.eql(4);
            num4.should.eql(2);
        });

        it('should print the correct container type + value when .toString() is invoked', function _testEitherFunctorToString() {
            var c1 = Either(1, 'right'),
                c2 = Either(null),
                c3 = Either([1, 2, 3], 'left'),
                c4 = Either(Either(Either(5, 'right'), 'left'), 'right');

            c1.toString().should.eql('Right(1)');
            c2.toString().should.eql('Left(null)');
            c3.toString().should.eql('Left(1,2,3)');
            c4.toString().should.eql('Right(Left(Right(5)))');
        });

        it('should have a .constructor property that points to the factory function', function _testEitherFunctorIsStupidViaFantasyLandSpecCompliance() {
            Either(null).constructor.should.eql(Either);
        });
    });
});