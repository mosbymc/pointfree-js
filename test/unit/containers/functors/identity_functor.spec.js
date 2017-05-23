import { Identity, _identity_f } from '../../../../src/containers/functors/identity_functor';

describe('Identity functor test', function _testIdentityFunctor() {
    describe('Identity object factory tests', function _testIdentityObjectFactory() {
        it('should return a new constant functor regardless of data type', function testIdentityFactoryObjectCreation() {
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

            _identity_f.isPrototypeOf(i1).should.be.true;
            _identity_f.isPrototypeOf(i2).should.be.true;
            _identity_f.isPrototypeOf(i3).should.be.true;
            _identity_f.isPrototypeOf(i4).should.be.true;
            _identity_f.isPrototypeOf(i5).should.be.true;
            _identity_f.isPrototypeOf(i6).should.be.true;
            _identity_f.isPrototypeOf(i7).should.be.true;
            _identity_f.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #of function', function testIdentityDotOf() {
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

            _identity_f.isPrototypeOf(i1).should.be.true;
            _identity_f.isPrototypeOf(i2).should.be.true;
            _identity_f.isPrototypeOf(i3).should.be.true;
            _identity_f.isPrototypeOf(i4).should.be.true;
            _identity_f.isPrototypeOf(i5).should.be.true;
            _identity_f.isPrototypeOf(i6).should.be.true;
            _identity_f.isPrototypeOf(i7).should.be.true;
            _identity_f.isPrototypeOf(i8).should.be.true;

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

        it('should return a new identity functor instance with the same underlying value when flat mapping', function _testIdentityFunctorFlatMap() {
            var i = Identity(1),
                d = i.flatMap(function _t() { return 2; });

            i.value.should.not.eql(d.value);
            i.should.not.equal(d);
        });

        it('should return a new identity functor regardless of data type', function testIdentityFactoryObjectCreation() {
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

        it('should print the correct container type + value when .toString() is invoked', function testIdentityFunctorToString() {
            var c1 = Identity(1),
                c2 = Identity(null),
                c3 = Identity([1, 2, 3]),
                c4 = Identity(Identity(Identity(5)));

            c1.toString().should.eql('Identity(1)');
            c2.toString().should.eql('Identity(null)');
            c3.toString().should.eql('Identity(1,2,3)');
            c4.toString().should.eql('Identity(Identity(Identity(5)))');
        });
    });
});