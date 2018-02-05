import * as monads from '../../../src/dataStructures/dataStructures';
import { future } from '../../../src/dataStructures/future';

var Future = monads.Future;

function identity(val) { return val; }

describe('Future test', function _testFuture() {
    describe('Future data structure', function _testFutureDataStructure() {
        it('should return a new future instance with the mapped value', function _testFutureMap() {
            var f = Future.of(1),
                d = f.map(function _t() { return 2; });

            f.source.should.not.eql(d.source);
            f.should.not.equal(d);
        });

        it('should return the same type/value when using the #of function', function _testFutureOf() {
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

        it('should wrap any value given to the function', function _testFutureWrap() {
            var f1 = Future.wrap(1),
                f2 = Future.wrap(x => x);

            f1.extract.should.be.a('function');
            f2.extract.should.be.a('function');
            f2.extract(identity, identity)(1).should.eql(1);
        });

        it('should build a future waiting to be rejected', function _testFutureReject() {
            var f = Future.reject(1);

            f.fork(identity, identity).should.eql(1);
        });

        it('should construct and empty future', function _testFutureEmpty() {
            var f = Future.empty();

            f.fork(identity, identity)(10).should.eql(10);
        });

        it('should have a functioning iterator', function _testFutureIterator() {
            function fn() {}
            var f1 = Future.of(10),
                f2 = Future(fn);

            var f1Res = [...f1],
                f2Res = [...f2];

            f1Res.should.eql([f1.value]);
            f2Res.should.eql([f2.value]);
        });
    });

    describe('Future data structure', function _testFuture() {
        it('should create an empty future', function _testFutureEmpty() {
            var f1 = Future.empty();

            f1.isEmpty().should.be.true;
        });

        it('should map a function over a future', function _testFutureMap(done) {
            Future(function _to(rej, res) {
                setTimeout(function _timeout() {
                    res(5);
                }, 25);
            })
                .map(x => x * x)
                .fork(console.error, function _res(res) {
                    res.should.eql(25);
                    done();
                });
        });

        it('should fail to map a function over a future', function _testFutureMapFailure(done) {
            Future(function _to(rej, res) {
                setTimeout(function _timeout() {
                    rej(5);
                }, 25);
            })
                .map(x => x * x)
                .fork(function _err(err) {
                    err.should.eql(5);
                    done();
                }, console.log);
        });

        it('should catch a thrown exception and call the reject handler when a mapping function throws', function _testFutureMapException(done) {
            Future(function _to(rej, res) {
                setTimeout(function _timeout() {
                    res(10);
                }, 10);
            })
                .map(function _exception(x) {
                    throw `x: ${x}`;
                })
                .fork(function _err(err) {
                    err.should.eql('x: 10');
                    done();
                });
        });

        it('should chain a function over a future', function _testFutureChain(done) {
            Future(function _to(rej, res) {
                setTimeout(function _timeout() {
                    res(5);
                }, 25);
            })
                .chain(function _chain(val) {
                    return Future.of(val * val);
                })
                .fork(console.error, function _res(res) {
                    res.should.eql(25);
                    done();
                });
        });

        it('should fail to chain a function over a future', function _testFutureChain(done) {
            Future(function _to(rej, res) {
                setTimeout(function _timeout() {
                    rej(5);
                }, 25);
            })
                .chain(function _chain(val) {
                    return Future.of(val * val);
                })
                .fork(function _err(err) {
                    err.should.eql(5);
                    done();
                }, console.log);
        });
        /*
        it('should flatten nested futures', function _testFutureJoin(done) {
            Future(function _to(rej, res) {
                setTimeout(function _timeout() {
                    res(5);
                }, 25);
            })
                .map(function _chain(val) {
                    return Future.of(val * val);
                })
                .mjoin()
                .fork(console.error, function _res(res) {
                    res.should.eql(25);
                    done();
                })
        });
        */

        it('should map the first function over a future', function _testFutureBimapSuccess(done) {
            Future(function _to(rej, res) {
                setTimeout(function _timeout() {
                    res(5);
                }, 25);
            })
                .bimap(x => x * x, x => x - 5)
                .fork(console.error, function _res(res) {
                    res.should.eql(25);
                    done();
                });
        });

        it('should map the second function over a future', function _testFutureBimapFailure(done) {
            Future(function _to(rej, res) {
                setTimeout(function _timeout() {
                    rej(5);
                }, 25);
            })
                .bimap(x => x * x, x => x - 5)
                .fork(function _err(err) {
                    err.should.eql(0);
                    done();
                }, console.log);
        });

        it('should return a boolean indicating future equality', function _testFutureEquals() {
            function fn1() {}
            function fn2() {}
            var f1 = Future(fn1),
                f2 = Future(fn1),
                f3 = Future(fn2);

            f1.equals(f2).should.be.true;
            f2.equals(f1).should.be.true;
            f1.equals(f3).should.be.false;
            f3.equals(f1).should.be.false;
            f2.equals(f3).should.be.false;
            f3.equals(f2).should.be.false;
        });

        it('should represent a future in string form', function _testFutureToString() {
            Future.of(1).toString().should.eql('Future()');
        });

        it('should represent the future\'s \'type\' when \'Object.prototype.toString.call\' is invoked', function _testFutureTypeString() {
            var i = Future(x => x);
            Object.prototype.toString.call(i).should.eql('[object Future]');
        });
    });
});