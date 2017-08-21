import * as monads from '../../../../src/dataStructures/monads/monads';
import { identity } from '../../../../src/dataStructures/monads/identity';

var Future = monads.Future;

describe('Future functor test', function _testFutureFunctor() {
    describe('Future functor object tests', function _testFutureFunctorObject() {
        it('should return a new identity functor instance with the mapped value', function _testIdentityFunctorMap() {
            var f = Future.of(1),
                d = f.map(function _t() { return 2; });

            f.value.should.not.eql(d.value);
            f.should.not.equal(d);
        });

        it('should have a functioning iterator', function _testFutureFunctorIterator() {
            function fn() {}
            var f1 = Future.of(10),
                f2 = Future(fn);

            var f1Res = [...f1],
                f2Res = [...f2];

            f1Res.should.eql([f1.value]);
            f2Res.should.eql([f2.value]);
        });
    });
});