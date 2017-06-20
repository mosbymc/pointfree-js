import { functors } from '../../../../src/containers/functors/functors';
import { identity_functor } from '../../../../src/containers/functors/identity_functor';

var Identity = functors.Identity;

describe('Identity functor test', function _testIdentityFunctor() {
    describe('Identity object factory tests', function _testIdentityObjectFactory() {
        it('should return a new identity functor regardless of data type', function _testIdentityFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = Identity(),
                i2 = Identity(null),
                i3 = Identity(1),
                i4 = Identity(arr),
                i5 = Identity(obj),
                i6 = Identity(Symbol()),
                i7 = Identity('testing constant'),
                i8 = Identity(false);

            identity_functor.isPrototypeOf(i1).should.be.true;
            identity_functor.isPrototypeOf(i2).should.be.true;
            identity_functor.isPrototypeOf(i3).should.be.true;
            identity_functor.isPrototypeOf(i4).should.be.true;
            identity_functor.isPrototypeOf(i5).should.be.true;
            identity_functor.isPrototypeOf(i6).should.be.true;
            identity_functor.isPrototypeOf(i7).should.be.true;
            identity_functor.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #of function', function _testIdentityDotOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = Identity.of(),
                i2 = Identity.of(null),
                i3 = Identity.of(1),
                i4 = Identity.of(arr),
                i5 = Identity.of(obj),
                i6 = Identity.of(Symbol()),
                i7 = Identity.of('testing constant'),
                i8 = Identity.of(false);

            identity_functor.isPrototypeOf(i1).should.be.true;
            identity_functor.isPrototypeOf(i2).should.be.true;
            identity_functor.isPrototypeOf(i3).should.be.true;
            identity_functor.isPrototypeOf(i4).should.be.true;
            identity_functor.isPrototypeOf(i5).should.be.true;
            identity_functor.isPrototypeOf(i6).should.be.true;
            identity_functor.isPrototypeOf(i7).should.be.true;
            identity_functor.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });
    });

    describe('Identity functor object tests', function _testIdentityFunctorObject() {
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var i = Identity(1),
                err1 = false,
                err2 = false;
            i.should.have.ownPropertyDescriptor('_value', { value: 1, writable: false, configurable: false, enumerable: false });

            try {
                i._value = 2;
            }
            catch(e) {
                err1 = true;
            }
            err1.should.be.true;

            try {
                i.value = 2;
            }
            catch(e) {
                err2 = true;
            }

            err2.should.be.true;
        });

        it('should return a new identity functor instance with the mapped value', function _testIdentityFunctorMap() {
            var i = Identity(1),
                d = i.map(function _t() { return 2; });

            i.value.should.not.eql(d.value);
            i.should.not.equal(d);
        });

        it('should properly indicate equality when constant functors are indeed equal', function _testIdentityFunctorEquality() {
            var m1 = Identity(null),
                m2 = Identity(null),
                m3 = Identity(1),
                m4 = Identity(1),
                m5 = Identity(2);

            m1.equals(m2).should.be.true;
            m1.equals(m3).should.be.false;
            m1.equals(m4).should.be.false;
            m1.equals(m5).should.be.false;

            m2.equals(m3).should.be.false;
            m2.equals(m4).should.be.false;
            m2.equals(m5).should.be.false;

            m3.equals(m4).should.be.true;
            m3.equals(m5).should.be.false;

            m4.equals(m5).should.be.false;
        });

        it('should return a new identity functor regardless of data type', function _testIdentityFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i = Identity();

            var i1 = i.of(),
                i2 = i.of(null),
                i3 = i.of(1),
                i4 = i.of(arr),
                i5 = i.of(obj),
                i6 = i.of(Symbol()),
                i7 = i.of('testing constant'),
                i8 = i.of(false);

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should transform an identity functor to the other functor types', function _testIdentityFunctorTransforms() {
            var i = Identity(1);
            var c = i.mapToConstant(),
                e = i.mapToEither(),
                f = i.mapToFuture(),
                io = i.mapToIo(),
                l = i.mapToList(),
                left = i.mapToLeft(),
                m = i.mapToMaybe(),
                r = i.mapToRight();

            c.should.be.an('object');
            Object.getPrototypeOf(c).should.eql(Object.getPrototypeOf(functors.Constant()));

            e.should.be.an('object');
            Object.getPrototypeOf(e).should.eql(Object.getPrototypeOf(functors.Either()));

            f.should.be.an('object');
            Object.getPrototypeOf(f).should.eql(Object.getPrototypeOf(functors.Future()));

            io.should.be.an('object');
            Object.getPrototypeOf(io).should.eql(Object.getPrototypeOf(functors.Io()));

            l.should.be.an('object');
            Object.getPrototypeOf(l).should.eql(Object.getPrototypeOf(functors.List()));

            left.should.be.an('object');
            Object.getPrototypeOf(left).should.eql(Object.getPrototypeOf(functors.Left()));

            m.should.be.an('object');
            Object.getPrototypeOf(m).should.eql(Object.getPrototypeOf(functors.Maybe(1)));

            r.should.be.an('object');
            Object.getPrototypeOf(r).should.eql(Object.getPrototypeOf(functors.Right()));
        });

        it('should have a functioning iterator', function _testIdentityFunctorIterator() {
            var i1 = Identity(10),
                i2 = Identity({ a: 1, b: 2 });

            var i1Res = [...i1],
                i2Res = [...i2];

            i1Res.should.eql([i1.value]);
            i2Res.should.eql([i2.value]);
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testIdentityFunctorValueOf() {
            var i1 = Identity('Mark'),
                i2 = Identity(10);

            var str = 'Hello my name is: ' + i1,
                num1 = 15 * i2,
                num2 = 3 + i2,
                num3 = i2 - 6,
                num4 = i2 / 5;

            str.should.eql('Hello my name is: Mark');
            num1.should.eql(150);
            num2.should.eql(13);
            num3.should.eql(4);
            num4.should.eql(2);
        });

        it('should print the correct container type + value when .toString() is invoked', function _testIdentityFunctorToString() {
            var c1 = Identity(1),
                c2 = Identity(null),
                c3 = Identity([1, 2, 3]),
                c4 = Identity(Identity(Identity(5)));

            c1.toString().should.eql('Identity(1)');
            c2.toString().should.eql('Identity(null)');
            c3.toString().should.eql('Identity(1,2,3)');
            c4.toString().should.eql('Identity(Identity(Identity(5)))');
        });

        it('should have a .factory property that points to the factory function', function _testIdentityFunctorIsStupidViaFantasyLandSpecCompliance() {
            Identity(null).factory.should.eql(Identity);
            Identity(null).constructor.should.eql(Identity);
        });
    });
});