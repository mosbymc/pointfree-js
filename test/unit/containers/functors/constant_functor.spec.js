import { functors } from '../../../../src/containers/functors/functors';
import { constant_functor } from '../../../../src/containers/functors/constant_functor';

var Constant = functors.Constant;

describe('Constant functor tests', function _testConstantFunctor() {
    describe('Constant object factory tests', function _testConstantObjectFactory() {
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

            constant_functor.isPrototypeOf(c1).should.be.true;
            constant_functor.isPrototypeOf(c2).should.be.true;
            constant_functor.isPrototypeOf(c3).should.be.true;
            constant_functor.isPrototypeOf(c4).should.be.true;
            constant_functor.isPrototypeOf(c5).should.be.true;
            constant_functor.isPrototypeOf(c6).should.be.true;
            constant_functor.isPrototypeOf(c7).should.be.true;
            constant_functor.isPrototypeOf(c8).should.be.true;

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

            constant_functor.isPrototypeOf(c1).should.be.true;
            constant_functor.isPrototypeOf(c2).should.be.true;
            constant_functor.isPrototypeOf(c3).should.be.true;
            constant_functor.isPrototypeOf(c4).should.be.true;
            constant_functor.isPrototypeOf(c5).should.be.true;
            constant_functor.isPrototypeOf(c6).should.be.true;
            constant_functor.isPrototypeOf(c7).should.be.true;
            constant_functor.isPrototypeOf(c8).should.be.true;

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
                d = c.map();

            c.value.should.eql(d.value);
            c.should.not.equal(d);
        });

        it('should properly indicate equality when constant functors are indeed equal', function _testConstantFunctorEquality() {
            var m1 = Constant(null),
                m2 = Constant(null),
                m3 = Constant(1),
                m4 = Constant(1),
                m5 = Constant(2);

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

        it('should transform an constant functor to the other functor types', function _testConstantFunctorTransforms() {
            var i = Constant(1);
            var c = i.mapToIdentity(),
                e = i.mapToEither(),
                f = i.mapToFuture(),
                io = i.mapToIo(),
                l = i.mapToList(),
                left = i.mapToLeft(),
                m = i.mapToMaybe(),
                r = i.mapToRight();

            c.should.be.an('object');
            Object.getPrototypeOf(c).should.eql(Object.getPrototypeOf(functors.Identity()));

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
            Object.getPrototypeOf(m).should.eql(Object.getPrototypeOf(functors.Maybe()));

            r.should.be.an('object');
            Object.getPrototypeOf(r).should.eql(Object.getPrototypeOf(functors.Right()));
        });

        it('should have a functioning iterator', function _testConstantFunctorIterator() {
            var c1 = Constant(10),
                c2 = Constant({ a: 1, b: 2 });

            var c1Res = [...c1],
                c2Res = [...c2];

            c1Res.should.eql([c1.value]);
            c2Res.should.eql([c2.value]);
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testConstantFunctorValueOf() {
            var c1 = Constant('Mark'),
                c2 = Constant(10);

            var str = 'Hello my name is: ' + c1,
                num1 = 15 * c2,
                num2 = 3 + c2,
                num3 = c2 - 6,
                num4 = c2 / 5;

            str.should.eql('Hello my name is: Mark');
            num1.should.eql(150);
            num2.should.eql(13);
            num3.should.eql(4);
            num4.should.eql(2);
        });

        it('should print the correct container type + value when .toString() is invoked', function testConstantFunctorToString() {
            var c1 = Constant(1),
                c2 = Constant(null),
                c3 = Constant([1, 2, 3]),
                c4 = Constant(Constant(Constant(5)));

            c1.toString().should.eql('Constant(1)');
            c2.toString().should.eql('Constant(null)');
            c3.toString().should.eql('Constant(1,2,3)');
            c4.toString().should.eql('Constant(Constant(Constant(5)))');
        });

        it('should have a .constructor property that points to the factory function', function _testConstantFunctorIsStupidViaFantasyLandSpecCompliance() {
            Constant(null).constructor.should.eql(Constant);
        });
    });
});