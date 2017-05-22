import { Constant, _constant_f } from '../../../../src/containers/functors/constant_functor';

describe('Constant functor tests', function _testConstantFunctor() {
    describe('Constant object factory test', function _testConstantObjectFactory() {
        it('should return a new constant functor regardless of data type', function testConstantFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                c1 = Constant(),
                c2 = Constant(null),
                c3 = Constant(1),
                c4 = Constant(arr),
                c5 = Constant(obj),
                c6 = Constant(Symbol()),
                c7 = Constant('testing constant'),
                c8 = Constant(false);

            _constant_f.isPrototypeOf(c1).should.be.true;
            _constant_f.isPrototypeOf(c2).should.be.true;
            _constant_f.isPrototypeOf(c3).should.be.true;
            _constant_f.isPrototypeOf(c4).should.be.true;
            _constant_f.isPrototypeOf(c5).should.be.true;
            _constant_f.isPrototypeOf(c6).should.be.true;
            _constant_f.isPrototypeOf(c7).should.be.true;
            _constant_f.isPrototypeOf(c8).should.be.true;

            expect(undefined).to.eql(c1.value);
            expect(null).to.eql(c2.value);
            expect(1).to.eql(c3.value);
            expect(arr).to.eql(c4.value);
            expect(obj).to.eql(c5.value);
            expect('symbol').to.eql(typeof c6.value);
            expect('testing constant').to.eql(c7.value);
            expect(false).to.eql(c8.value);
        });

        it('should return the same type/value when using the #of function', function testConstantDotOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                c1 = Constant.of(),
                c2 = Constant.of(null),
                c3 = Constant.of(1),
                c4 = Constant.of(arr),
                c5 = Constant.of(obj),
                c6 = Constant.of(Symbol()),
                c7 = Constant.of('testing constant'),
                c8 = Constant.of(false);

            _constant_f.isPrototypeOf(c1).should.be.true;
            _constant_f.isPrototypeOf(c2).should.be.true;
            _constant_f.isPrototypeOf(c3).should.be.true;
            _constant_f.isPrototypeOf(c4).should.be.true;
            _constant_f.isPrototypeOf(c5).should.be.true;
            _constant_f.isPrototypeOf(c6).should.be.true;
            _constant_f.isPrototypeOf(c7).should.be.true;
            _constant_f.isPrototypeOf(c8).should.be.true;

            expect(undefined).to.eql(c1.value);
            expect(null).to.eql(c2.value);
            expect(1).to.eql(c3.value);
            expect(arr).to.eql(c4.value);
            expect(obj).to.eql(c5.value);
            expect('symbol').to.eql(typeof c6.value);
            expect('testing constant').to.eql(c7.value);
            expect(false).to.eql(c8.value);
        });
    });

    describe('Constant functor object tests', function _testConstantFunctorObject() {
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var c = Constant(1),
                err1 = false,
                err2 = false;
            c.should.have.ownPropertyDescriptor('_value', { value: 1, writable: false, configurable: false, enumerable: false });

            try {
                c._value = 2;
            }
            catch(e) {
                err1 = true;
            }
            err1.should.be.true;

            try {
                c.value = 2;
            }
            catch(e) {
                err2 = true;
            }

            err2.should.be.true;
        });

        it('should return a new constant functor instance with the same underlying value when mapping', function _testConstantFunctorMap() {
            var c = Constant(1),
                d = c.map(function _t() { return 2; });

            c.value.should.eql(d.value);
            c.should.not.equal(d);
        });

        it('should return a new constant functor instance with the same underlying value when flat mapping', function _testConstantFunctorFlatMap() {
            var c = Constant(1),
                d = c.flatMap(function _t() { return 2; });

            c.value.should.eql(d.value);
            c.should.not.equal(d);
        });

        it('should return a new constant functor regardless of data type', function testConstantFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                c = Constant();

            var c1 = c.of(),
                c2 = c.of(null),
                c3 = c.of(1),
                c4 = c.of(arr),
                c5 = c.of(obj),
                c6 = c.of(Symbol()),
                c7 = c.of('testing constant'),
                c8 = c.of(false);

            expect(undefined).to.eql(c1.value);
            expect(null).to.eql(c2.value);
            expect(1).to.eql(c3.value);
            expect(arr).to.eql(c4.value);
            expect(obj).to.eql(c5.value);
            expect('symbol').to.eql(typeof c6.value);
            expect('testing constant').to.eql(c7.value);
            expect(false).to.eql(c8.value);
        });

        it('should print the correct container type + value when .toString() is invoked', function testConstantFunctorToString() {
            var c1 = Constant(1),
                c2 = Constant(null),
                c3 = Constant([1, 2, 3]);

            c1.toString().should.eql('Constant(1)');
            c2.toString().should.eql('Constant(null)');
            c3.toString().should.eql('Constant(1,2,3)');
        });
    });
});