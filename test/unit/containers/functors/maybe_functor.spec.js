import { Maybe, _maybe_f } from '../../../../src/containers/functors/maybe_functor';

describe('Maybe functor tests', function _testMaybeFunctor() {
    describe('Maybe object factory tests', function _testMaybeObjectFactory() {
        it('should return a new constant functor regardless of data type', function testMaybeFactoryObjectCreation() {
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

            _maybe_f.isPrototypeOf(i1).should.be.true;
            _maybe_f.isPrototypeOf(i2).should.be.true;
            _maybe_f.isPrototypeOf(i3).should.be.true;
            _maybe_f.isPrototypeOf(i4).should.be.true;
            _maybe_f.isPrototypeOf(i5).should.be.true;
            _maybe_f.isPrototypeOf(i6).should.be.true;
            _maybe_f.isPrototypeOf(i7).should.be.true;
            _maybe_f.isPrototypeOf(i8).should.be.true;

            expect(null).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #of function', function testMaybeDotOf() {
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

            _maybe_f.isPrototypeOf(i1).should.be.true;
            _maybe_f.isPrototypeOf(i2).should.be.true;
            _maybe_f.isPrototypeOf(i3).should.be.true;
            _maybe_f.isPrototypeOf(i4).should.be.true;
            _maybe_f.isPrototypeOf(i5).should.be.true;
            _maybe_f.isPrototypeOf(i6).should.be.true;
            _maybe_f.isPrototypeOf(i7).should.be.true;
            _maybe_f.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #Just function', function testMaybeDotJust() {
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

            _maybe_f.isPrototypeOf(i1).should.be.true;
            _maybe_f.isPrototypeOf(i2).should.be.true;
            _maybe_f.isPrototypeOf(i3).should.be.true;
            _maybe_f.isPrototypeOf(i4).should.be.true;
            _maybe_f.isPrototypeOf(i5).should.be.true;
            _maybe_f.isPrototypeOf(i6).should.be.true;
            _maybe_f.isPrototypeOf(i7).should.be.true;
            _maybe_f.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #Nothing function', function testMaybeDotNothing() {
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

            _maybe_f.isPrototypeOf(i1).should.be.true;
            _maybe_f.isPrototypeOf(i2).should.be.true;
            _maybe_f.isPrototypeOf(i3).should.be.true;
            _maybe_f.isPrototypeOf(i4).should.be.true;
            _maybe_f.isPrototypeOf(i5).should.be.true;
            _maybe_f.isPrototypeOf(i6).should.be.true;
            _maybe_f.isPrototypeOf(i7).should.be.true;
            _maybe_f.isPrototypeOf(i8).should.be.true;

            expect(null).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(null).to.eql(i3.value);
            expect(null).to.eql(i4.value);
            expect(null).to.eql(i5.value);
            expect(null).to.eql(i6.value);
            expect(null).to.eql(i7.value);
            expect(null).to.eql(i8.value);
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
            var m = Maybe(1),
                d = m.map(function _t() { return 2; });

            m.value.should.not.eql(d.value);
            m.should.not.equal(d);
        });

        it('should return a new maybe functor instance with the same underlying value when flat mapping', function _testMaybeFunctorFlatMap() {
            var m1 = Maybe(1),
                m2 = Maybe(Maybe(1)),
                d1 = m1.flatMap(function _t() { return 2; }),
                d2 = m2.flatMap(function _t() { return 2; });

            m1.value.should.not.eql(d1.value);
            m1.should.not.equal(d1);

            m2.value.value.should.not.eql(d2.value);
            m2.should.not.equal(d2);

            d1.value.should.eql(d2.value);
        });

        it('should return a new maybe functor regardless of data type', function testMaybeFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                m = Maybe();

            var m1 = m.of(),
                m2 = m.of(null),
                m3 = m.of(1),
                m4 = m.of(arr),
                m5 = m.of(obj),
                m6 = m.of(Symbol()),
                m7 = m.of('testing constant'),
                m8 = m.of(false);

            expect(undefined).to.eql(m1.value);
            expect(null).to.eql(m2.value);
            expect(1).to.eql(m3.value);
            expect(arr).to.eql(m4.value);
            expect(obj).to.eql(m5.value);
            expect('symbol').to.eql(typeof m6.value);
            expect('testing constant').to.eql(m7.value);
            expect(false).to.eql(m8.value);
        });

        it('should print the correct container type + value when .toString() is invoked', function testMaybeFunctorToString() {
            var c1 = Maybe(1),
                c2 = Maybe(null),
                c3 = Maybe([1, 2, 3]),
                c4 = Maybe(Maybe(Maybe(5)));

            c1.toString().should.eql('Just(1)');
            c2.toString().should.eql('Nothing()');
            c3.toString().should.eql('Just(1,2,3)');
            c4.toString().should.eql('Just(Just(Just(5)))');
        });
    });
});