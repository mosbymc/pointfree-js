import * as monads from '../../../src/dataStructures/dataStructures';
import { future } from '../../../src/dataStructures/future';

var Future = monads.Future;

function identity(val) { return val; }

describe('Future functor test', function _testFutureFunctor() {
    describe('Future functor object tests', function _testFutureFunctorObject() {
        it('should return a new identity functor instance with the mapped value', function _testIdentityFunctorMap() {
            var f = Future.of(1),
                d = f.map(function _t() { return 2; });

            f.value.should.not.eql(d.value);
            f.should.not.equal(d);
        });

        it('should return the same type/value when using the #of function', function _testFutureDotOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = Future.of(),
                i2 = Future.of(null),
                i3 = Future.of(1),
                i4 = Future.of(arr),
                i5 = Future.of(obj),
                i6 = Future.of(Symbol()),
                i7 = Future.of('testing constant'),
                i8 = Future.of(false);

            future.isPrototypeOf(i1).should.be.true;
            future.isPrototypeOf(i2).should.be.true;
            future.isPrototypeOf(i3).should.be.true;
            future.isPrototypeOf(i4).should.be.true;
            future.isPrototypeOf(i5).should.be.true;
            future.isPrototypeOf(i6).should.be.true;
            future.isPrototypeOf(i7).should.be.true;
            future.isPrototypeOf(i8).should.be.true;

            //expect(undefined).to.eql(i1.extract);
            //expect(null).to.eql(i2.fork(identity, identity));
            //expect(1).to.eql(i3.extract);
            //expect(arr).to.eql(i4.extract);
            //expect(obj).to.eql(i5.extract);
            //expect('symbol').to.eql(typeof i6.extract);
            //expect('testing constant').to.eql(i7.extract);
            //expect(false).to.eql(i8.extract);
        });

        it('should wrap any value given to the function', function _testFutureDotWrap() {
            var f1 = Future.wrap(1),
                f2 = Future.wrap(x => x);

            f1.extract.should.be.a('function');
            f2.extract.should.be.a('function');
            f2.extract(identity, identity)(1).should.eql(1);
        });

        it('should build a future waiting to be rejected', function _testFutureDotReject() {
            var f = Future.reject(1);

            f.fork(identity, identity).should.eql(1);
        });

        it('should construct and empty future', function _testFutureDotEmpty() {
            var f = Future.empty();

            f.fork(identity, identity)(10).should.eql(10);
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

    describe('Test future', function _testFuture() {
        it('should create an empty future', function _testFutureDotEmpty() {
            var f1 = Future.empty();

            f1.isEmpty().should.be.true;
        });

        it('should represent a future in string form', function _testFutureDotToString() {
            var f = Future.of(1);

            f.toString().should.eql('Future()');
        });
    });
});