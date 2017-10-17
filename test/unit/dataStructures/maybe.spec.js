import * as monads from '../../../src/dataStructures/dataStructures';
import { just, nothing } from '../../../src/dataStructures/maybe';

var Maybe = monads.Maybe,
    Just = monads.Just,
    Nothing = monads.Nothing;

describe('Maybe functor tests', function _testMaybeFunctor() {
    describe('Maybe object factory tests', function _testMaybeObjectFactory() {
        it('should return a new constant functor regardless of data type', function _testMaybeFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = Maybe(),
                i2 = Maybe(null),
                i3 = Maybe(1),
                i4 = Maybe(arr),
                i5 = Maybe(obj),
                i6 = Maybe(Symbol()),
                i7 = Maybe('testing constant'),
                i8 = Maybe(false);

            i1.should.eql(nothing);
            i2.should.eql(nothing);
            just.isPrototypeOf(i3).should.be.true;
            just.isPrototypeOf(i4).should.be.true;
            just.isPrototypeOf(i5).should.be.true;
            just.isPrototypeOf(i6).should.be.true;
            just.isPrototypeOf(i7).should.be.true;
            just.isPrototypeOf(i8).should.be.true;

            expect(null).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #of function', function _testMaybeDotOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = Maybe.of(),
                i2 = Maybe.of(null),
                i3 = Maybe.of(1),
                i4 = Maybe.of(arr),
                i5 = Maybe.of(obj),
                i6 = Maybe.of(Symbol()),
                i7 = Maybe.of('testing constant'),
                i8 = Maybe.of(false);

            just.isPrototypeOf(i1).should.be.true;
            just.isPrototypeOf(i2).should.be.true;
            just.isPrototypeOf(i3).should.be.true;
            just.isPrototypeOf(i4).should.be.true;
            just.isPrototypeOf(i5).should.be.true;
            just.isPrototypeOf(i6).should.be.true;
            just.isPrototypeOf(i7).should.be.true;
            just.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #Just function', function _testMaybeDotJust() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = Maybe.Just(),
                i2 = Maybe.Just(null),
                i3 = Maybe.Just(1),
                i4 = Maybe.Just(arr),
                i5 = Maybe.Just(obj),
                i6 = Maybe.Just(Symbol()),
                i7 = Maybe.Just('testing constant'),
                i8 = Maybe.Just(false);

            just.isPrototypeOf(i1).should.be.true;
            just.isPrototypeOf(i2).should.be.true;
            just.isPrototypeOf(i3).should.be.true;
            just.isPrototypeOf(i4).should.be.true;
            just.isPrototypeOf(i5).should.be.true;
            just.isPrototypeOf(i6).should.be.true;
            just.isPrototypeOf(i7).should.be.true;
            just.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #Nothing function', function _testMaybeDotNothing() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = Maybe.Nothing(),
                i2 = Maybe.Nothing(null),
                i3 = Maybe.Nothing(1),
                i4 = Maybe.Nothing(arr),
                i5 = Maybe.Nothing(obj),
                i6 = Maybe.Nothing(Symbol()),
                i7 = Maybe.Nothing('testing constant'),
                i8 = Maybe.Nothing(false);

            i1.should.eql(nothing);
            i2.should.eql(nothing);
            i3.should.eql(nothing);
            i4.should.eql(nothing);
            i5.should.eql(nothing);
            i6.should.eql(nothing);
            i7.should.eql(nothing);
            i8.should.eql(nothing);

            expect(null).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(null).to.eql(i3.value);
            expect(null).to.eql(i4.value);
            expect(null).to.eql(i5.value);
            expect(null).to.eql(i6.value);
            expect(null).to.eql(i7.value);
            expect(null).to.eql(i8.value);
        });

        it('should return correct boolean value when #is is invoked', function _testMaybeDotIs() {
            var m1 = Maybe(10),
                m2 = Maybe(),
                m3 = Maybe(null),
                c = monads.Constant(10),
                i = monads.Identity(10),
                f = Maybe.is,
                n = null,
                s = 'string',
                b = false;

            Maybe.is(m1).should.be.true;
            Maybe.is(m2).should.be.true;
            Maybe.is(m3).should.be.true;
            Maybe.is(c).should.be.false;
            Maybe.is(i).should.be.false;
            Maybe.is(f).should.be.false;
            Maybe.is(n).should.be.false;
            Maybe.is(s).should.be.false;
            Maybe.is(b).should.be.false;

            Nothing.is(m1).should.be.false;
            Nothing.is(m2).should.be.true;
            Nothing.is(m3).should.be.true;
            Nothing.is(c).should.be.false;
            Nothing.is(i).should.be.false;
            Nothing.is(f).should.be.false;
            Nothing.is(n).should.be.false;
            Nothing.is(s).should.be.false;
            Nothing.is(b).should.be.false;

            Just.is(m1).should.be.true;
            Just.is(m2).should.be.false;
            Just.is(m3).should.be.false;
            Just.is(c).should.be.false;
            Just.is(i).should.be.false;
            Just.is(f).should.be.false;
            Just.is(n).should.be.false;
            Just.is(s).should.be.false;
            Just.is(b).should.be.false;
        });

        it('should return correct results when isJust/isNothing is called on an either', function _testMaybeFactorIsLeftIsRightHelpers() {
            //var EitherSpy = sinon.spy(Maybe),
            var m1 = Maybe(1),
                m2 = Maybe('test'),
                m3 = Maybe(null),
                m4 = Maybe();

            //EitherSpy.callCount.should.eql(4);

            Maybe.isJust(m1).should.be.true;
            Maybe.isNothing(m1).should.be.false;

            Maybe.isJust(m2).should.be.true;
            Maybe.isNothing(m2).should.be.false;

            Maybe.isJust(m3).should.be.false;
            Maybe.isNothing(m3).should.be.true;

            Maybe.isJust(m4).should.be.false;
            Maybe.isNothing(m4).should.be.true;
        });

        it('should return a left or a right based on null value', function _testEitherDotFromNullable() {
            var m1 = Maybe.fromNullable(null),
                m2 = Maybe.fromNullable(1);

            m1.should.eql(nothing);
            just.isPrototypeOf(m2).should.be.true;

            m1.isNothing.should.be.true;
            m1.isJust.should.be.false;

            m2.isNothing.should.be.false;
            m2.isJust.should.be.true;
        });

        it('should return a maybe with the correct isJust/isNothing values set when using peripheral delegate creators', function _testMaybeperipheralCreators() {
            var j1 = Just(1),
                j2 = Just.of(null),
                n1 = Nothing(),
                n2 = Nothing.of(10);

            Object.getPrototypeOf(j1).should.eql(just);
            j1.value.should.eql(1);

            Object.getPrototypeOf(j2).should.eql(just);
            expect(j2.value).to.eql(null);

            n1.should.eql(nothing);
            expect(n1.value).to.eql(null);

            expect(n2.value).to.eql(null);
        });
    });

    describe('Maybe functor object tests', function _testMaybeFunctorObject() {
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var m = Maybe(1),
                err1 = false,
                err2 = false;
            m.should.have.ownPropertyDescriptor('_value', { value: 1, writable: false, configurable: false, enumerable: false });

            try {
                m._value = 2;
            }
            catch(e) {
                err1 = true;
            }
            err1.should.be.true;

            try {
                m.value = 2;
            }
            catch(e) {
                err2 = true;
            }

            err2.should.be.true;
        });

        it('should return correct boolean value for #isJust and #isNothing properties', function _testMaybeFunctorIsJustAndIsNothing() {
            var m1 = Maybe(),
                m2 = Maybe(null),
                m3 = Maybe.of(),
                m4 = Maybe.of(null),
                m5 = Maybe(1);

            m1.isJust.should.eql(false);
            m1.isNothing.should.eql(true);

            m2.isJust.should.eql(false);
            m2.isNothing.should.eql(true);

            m3.isJust.should.eql(true);
            m3.isNothing.should.eql(false);

            m4.isJust.should.eql(true);
            m4.isNothing.should.eql(false);

            m5.isJust.should.eql(true);
            m5.isNothing.should.eql(false);
        });

        it('should return a new maybe functor instance with the mapped value', function _testMaybeFunctorMap() {
            var m1 = Maybe(1),
                m2 = Maybe(),
                d1 = m1.map(function _t() { return 2; }),
                d2 = m2.map();

            m1.value.should.not.eql(d1.value);
            m1.should.not.equal(d1);

            expect(m2.value).to.eql(d2.value);
        });

        it('should return a new maybe instance with the bi-mapped value', function _testMaybeBiMap() {
            var f1 = x => x * x,
                f2 = x => x;

            var m1 = Maybe(1),
                m2 = Maybe(),
                d1 = m1.bimap(f1, f2),
                d2 = m2.bimap(f1, f2);

            d1.value.should.eql(1);
            expect(null).to.eql(d2.value);
        });

        it('should extract the underlying value of a just', function _testJustExtract() {
            Just(10).extract.should.eql(10);
            Just('10').extract.should.eql('10');
        });

        it('should properly indicate equality when constant monads are indeed equal', function _testMaybeFunctorEquality() {
            var m1 = Maybe(null),
                m2 = Maybe(null),
                m3 = Maybe(1),
                m4 = Maybe(1),
                m5 = Maybe(2),
                m6 = Maybe.Nothing(),
                m7 = Maybe.Nothing(1),
                m8 = Maybe.Just(),
                m9 = Maybe.Just(1);

            m1.equals(m2).should.be.true;
            m1.equals(m3).should.be.false;
            m1.equals(m4).should.be.false;
            m1.equals(m5).should.be.false;
            m1.equals(m6).should.be.true;
            m1.equals(m7).should.be.true;
            m1.equals(m8).should.be.false;
            m1.equals(m9).should.be.false;

            m2.equals(m3).should.be.false;
            m2.equals(m4).should.be.false;
            m2.equals(m5).should.be.false;
            m2.equals(m6).should.be.true;
            m2.equals(m7).should.be.true;
            m2.equals(m8).should.be.false;
            m2.equals(m9).should.be.false;

            m3.equals(m4).should.be.true;
            m3.equals(m5).should.be.false;
            m3.equals(m6).should.be.false;
            m3.equals(m7).should.be.false;
            m3.equals(m8).should.be.false;
            m3.equals(m9).should.be.true;

            m4.equals(m5).should.be.false;
            m4.equals(m6).should.be.false;
            m4.equals(m7).should.be.false;
            m4.equals(m8).should.be.false;
            m4.equals(m9).should.be.true;

            m5.equals(m6).should.be.false;
            m5.equals(m7).should.be.false;
            m5.equals(m8).should.be.false;
            m5.equals(m9).should.be.false;

            m6.equals(m7).should.be.true;
            m6.equals(m8).should.be.false;
            m6.equals(m9).should.be.false;

            m7.equals(m8).should.be.false;
            m7.equals(m9).should.be.false;

            m8.equals(m9).should.be.false;
        });

        it('should have a functioning iterator', function _testMaybeFunctorIterator() {
            var m1 = Maybe(10),
                m2 = Maybe({ a: 1, b: 2 });

            var m1Res = [...m1],
                m2Res = [...m2];

            m1Res.should.eql([m1.value]);
            m2Res.should.eql([m2.value]);
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testMaybeFunctorValueOf() {
            var m1 = Maybe('Mark'),
                m2 = Maybe(10);

            var str = 'Hello my name is: ' + m1,
                num1 = 15 * m2,
                num2 = 3 + m2,
                num3 = m2 - 6,
                num4 = m2 / 5;

            str.should.eql('Hello my name is: Mark');
            num1.should.eql(150);
            num2.should.eql(13);
            num3.should.eql(4);
            num4.should.eql(2);
        });

        it('should print the correct container type + value when .toString() is invoked', function _testMaybeFunctorToString() {
            var c1 = Maybe(1),
                c2 = Maybe(null),
                c3 = Maybe([1, 2, 3]),
                c4 = Maybe(Maybe(Maybe(5)));

            c1.toString().should.eql('Just(1)');
            c2.toString().should.eql('Nothing()');
            c3.toString().should.eql('Just(1,2,3)');
            c4.toString().should.eql('Just(Just(Just(5)))');
        });

        it('should return underlying value when just#fold is invoked', function _testJustFold() {
            Just(10).fold((x, y) => x + y * 15, 0).should.eql(150);
        });

        it('should return itself when fold is invoked on a nothing', function _testNothingFold() {
            var n = Nothing(),
                res = n.fold((x, y) => x + y * 15, 0);

            res.should.eql(n);
        });

        it('should return a Identity of a Just of 10 when #sequence is invoked', function _testJustSequence() {
            Just(10).sequence(monads.Identity).toString().should.eql('Identity(Just(10))');
        });

        it('should return a different data structure wrapping the nothing', function _testNothingSequence() {
            var n = Nothing(),
                res = n.sequence(monads.Identity);

            Object.getPrototypeOf(monads.Identity()).isPrototypeOf(res).should.be.true;
            res.value.should.eql(n);
        });

        it('should return a Just of an Identity of 3 when #traverse is invoked', function _testJustTraverse() {
            function test(val) {
                return monads.Identity(val + 2);
            }

            Just(1).traverse(monads.Identity, test).toString().should.eql('Identity(Just(3))');
        });

        it('should return a different data structure wrapping nothing', function _testNothingTraverse() {
            var n = Nothing(),
                res = n.traverse(monads.Identity, x => monads.Identity(x));

            Object.getPrototypeOf(monads.Identity()).isPrototypeOf(res).should.be.true;
            res.value.should.eql(n);
        });

        it('should have a .constructor property that points to the factory function', function _testMaybeFunctorIsStupidViaFantasyLandSpecCompliance() {
            Just(1).constructor.should.eql(Maybe);
            Nothing().constructor.should.eql(Maybe);
        });
    });
});