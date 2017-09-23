import { additionGroupFactory, multiplicationGroupFactory, andGroupFactory, orGroupFactory, stringMonoidFactory,
        subtractionMonoidFactory, xorMonoidFactory, functionMonoidFactory, divisionSemigroupFactory } from '../../../src/dataStructures/groups';

describe('Test groups, monoids, and semigroups', function _testGroupCommaMonoidsCommaAndSemigroups() {
    describe('Test groups', function _testGroups() {
        describe('Test additiveGroup', function _testAdditiveGroup() {

        });
    });

    describe('Test monoids', function _testMonoids() {
        describe('Test functionMonoid', function _testFunctionMonoid() {
            it('should return a function monoid object', function _testFunctionMonoidCreation() {
                var f = functionMonoidFactory(x => x * x);
                f.isEmpty.should.exist;
                f.isEmpty.should.be.a('boolean');
                f.factory.should.exist;
                f.factory.should.be.a('function');
                f.value.should.exist;
                f.value.should.be.a('function');
                f.toString.should.exist;
                f.toString.should.be.a('function');
                f.valueOf.should.exist;
                f.valueOf.should.be.a('function');
                f.concat.should.exist;
                f.concat.should.be.a('function');
                f.concatAll.should.exist;
                f.concatAll.should.be.a('function');
                f.extract.should.exist;
                f.extract.should.be.a('function');
                f[Symbol.iterator].should.exist;
            });

            it('should allow concatenation of two function monoids via function composition', function _testFunctionMonoidConcatenation() {
                var f1 = functionMonoidFactory(x => x * x),
                    f2 = functionMonoidFactory(x => Math.pow(x, x));

                var res = f1.concat(f2);
                Object.getPrototypeOf(f1).isPrototypeOf(res).should.be.true;
                res.extract()(2).should.eql(16);
            });

            it('should allow concatenation of multiple function monads at one time', function _testFunctionMonoidConcatAll() {
                var f1 = functionMonoidFactory(x => x * x),
                    f2 = functionMonoidFactory(x => Math.pow(x, x)),
                    f3 = functionMonoidFactory(x => x + 15),
                    res = f1.concatAll(f2, f3);

                Object.getPrototypeOf(f1).isPrototypeOf(res).should.be.true;
                res.extract()(2).should.eql(2);
            });

            it('should iterate the function monoid', function _testFunctionMonoidIterator() {
                var pow = x => Math.pow(x, x),
                    f = functionMonoidFactory(pow);

                for (let fn of f) fn.should.eql(pow);
            });
        });
    });
});