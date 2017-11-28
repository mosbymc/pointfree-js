import { after, apply, before, binary, bindFunction, bindWith, /*guardAfter,*/ guard, hyloWith, lateApply, leftApply, maybe,
        not, once, repeat, rightApply, safe, tap, ternary, tryCatch, unary, unfold, voidFn } from '../../src/decorators';

describe('Decorators Test', function _testDecorators() {
    describe('Test after', function _testAfter() {
        it('Should call the function before the decorator', function _testDecorationCalledAfterFunction() {
            function addTwo(num) { return num + 2; }
            function multFive(num) { return num * 5; }
            var func = sinon.spy(addTwo),
                decorator = sinon.spy(multFive);

            var res = after(func, decorator, 5);

            res.should.eql(7);
            expect(decorator.calledAfter(func)).to.be.true;
        });
    });

    describe('Test apply', function _testApply() {
        it('should run a function with the given args', function _apply() {
            function t(...args) { return args.reverse(); }

            var applyT = apply(t),
                tRes = applyT(1, 2, 3, 4, 5);

            tRes.should.be.an('array');
            tRes.should.eql([5, 4, 3, 2, 1]);
        });
    });

    describe('Test before', function _testBefore() {
        it('Should call the function after the decorator', function _testDecorationCalledBeforeFunction() {
            function addTwo(num) { return num + 2; }
            function multFive(num) { return num * 5; }
            var func = sinon.spy(addTwo),
                decorator = sinon.spy(multFive);

            var res = before(func, decorator, 5);

            res.should.eql(7);
            expect(decorator.calledBefore(func)).to.be.true;
        });
    });

    describe('Test binary', function _testBinary() {
        it('should make all functions binary', function _binaryTest() {
            function nullary() { return Array.prototype.slice.call(arguments, 0); }
            function unary(arg1) { return Array.prototype.slice.call(arguments, 0); }
            function ternary(arg1, arg2, arg3) { return Array.prototype.slice.call(arguments, 0); }

            var binaryNullary = binary(nullary),
                binaryUnary = binary(unary),
                binaryTernary = binary(ternary);

            var bn = binaryNullary(1),
                bu = binaryUnary(1),
                bt = binaryTernary(1);

            bn.should.be.a('function');
            bu.should.be.a('function');
            bt.should.be.a('function');

            var bnRes = bn(2),
                buRes = bu(2),
                btRes = bt(2);

            bnRes.should.be.an('array');
            bnRes.should.eql([1, 2]);

            buRes.should.be.an('array');
            buRes.should.eql([1, 2]);

            btRes.should.be.an('array');
            btRes.should.eql([1, 2]);
        });
    });

    describe('Test bindFunction', function _testBindFunction() {
        it('should bind a function to a context', function _testFunctionBinding() {
            function addTwoToPropA() {
                this.a += 2;
                return this;
            }

            var obj = { a: 3 },
                bindSpy = sinon.spy(addTwoToPropA);

            var resFn = bindFunction(obj, bindSpy),
                res = resFn();

            res.should.be.an('object');
            res.a.should.eql(5);
            expect(bindSpy.calledOn(obj)).to.be.true;
        });
    });

    describe('Test bindWith', function _testBindWith() {
        it('should bind a function to a context', function _testBindWith() {
            function addTwoToPropA() {
                this.a += 2;
                return this;
            }

            var obj = { a: 3 },
                bindSpy = sinon.spy(addTwoToPropA);

            var resFn = bindWith(bindSpy, obj),
                res = resFn();

            res.should.be.an('object');
            res.a.should.eql(5);
            expect(bindSpy.calledOn(obj)).to.be.true;
        });
    });

    /*
    describe('Test guardAfter', function _testGuardAfter() {
        it('should run the first function last', function _testGuardAfterWithSuccessfulFns() {
            function func1(o) { console.log(o); o.a *= 4; return o; }
            function func2(o) { console.log(o); o.a += 15; return true; }
            function func3(o) { console.log(o); o.a += 6; return true; }

            var obj = { a: 1 },
                guardAfterFn = guardAfter(func1, func2, func3),
                guardAfterRes = guardAfterFn(obj);

            guardAfterRes.should.be.a('object');
            guardAfterRes.a.should.be.a('number');
            guardAfterRes.a.should.eql(256);
        });
    });
    */

    describe('Test guard', function _testGuard() {
        it('should run the first function last', function _testGuardWithSuccessfulFns() {
            function func1(o) { o.a *= 4; return o; }
            function func2(o) { o.a += 15; return true; }
            function func3(o) { o.a += 6; return true; }

            var func1Spy = sinon.spy(func1);

            var obj = { a: 1 },
                guardFn = guard(func1Spy, func2, func3),
                guardRes = guardFn(obj);

            guardRes.should.be.a('object');
            guardRes.a.should.be.a('number');
            guardRes.a.should.eql(88);
            func1Spy.should.have.been.calledOnce;
        });

        it('should not run the guarded function when a guard fails', function _testGuardWithFailureFns() {
            function func1(o) { o.a *= 4; return o; }
            function func2(o) { o.a += 15; return false; }
            function func3(o) { o.a += 6; return true; }

            var func1Spy = sinon.spy(func1),
                func2Spy = sinon.spy(func2),
                func3Spy = sinon.spy(func3),
                obj = { a: 1 },
                guardFn = guard(func1Spy, func2Spy, func3Spy),
                guardRes = guardFn(obj);

            expect(guardRes).to.be.undefined;
            func1Spy.should.not.have.been.called;
            func2Spy.should.have.been.calledOnce;
            func3Spy.should.not.have.been.called;
        });
    });

    describe('Test lateApply', function _TestLateApply() {
        it('should work like apply but add an extra function invocation', function _testLateApply() {
            function doSomething(arg1, arg2, arg3, arg4) {
                return arg1 + arg2 + arg3 + arg4;
            }

            let someSpy = sinon.spy(doSomething),
                later = lateApply(someSpy);

            var laterRes = later(1, 2, 3, 4);
            laterRes.should.be.a('function');
            laterRes().should.eql(10);
            someSpy.should.have.been.called.once;
        });
    });

    describe('Test leftApply', function _testLeftApply() {
        it('Should return the result of normal function invocation with arguments', function _testLeftApply() {
            function doStuff(arg1, arg2, arg3, arg4, arg5) {
                return arg1 + arg2 * arg3 - arg4 / arg5;
            }

            var leftApplyFn = leftApply(doStuff),
                leftApplyRes = leftApplyFn(1, 2, 3, 4, 5);

            leftApplyRes.should.eql(6.2);
        });
    });

    describe('Test maybe', function _testMaybe() {
        function maybeFn(arg1, arg2) {
            return arg1 + arg2;
        }

        it('should not invoke the function when args are null', function _testMaybeWithNullArgs() {
            var maybeSpy = sinon.spy(maybeFn),
                m = maybe(maybeSpy),
                mRes = m(null);

            maybeSpy.should.not.have.been.called;
            expect(mRes).to.be.null;
        });

        it('should not invoke the function when args are undefined', function _testMaybeWithNoArgs() {
            var maybeSpy = sinon.spy(maybeFn),
                m = maybe(maybeSpy),
                mRes = m();

            maybeSpy.should.not.have.been.called;
            expect(mRes).to.be.null;
        });

        it('should invoke the function when one or more arguments are provided', function _testMaybeWithTwoArgs() {
            var maybeSpy = sinon.spy(maybeFn),
                m = maybe(maybeSpy),
                mRes = m(1, 3);

            maybeSpy.should.have.been.calledOnce;
            mRes.should.eql(4);
        });
    });

    describe('Test once', function _testOnce() {
        it('should only be invoked once', function _ensureAFunctionIsInvokedOnlyOnce() {
            function runMe() { return 1; }

            var runMeSpy = sinon.spy(runMe),
                runMeOnce = once(runMeSpy);
            runMeOnce();
            runMeOnce();

            runMeSpy.should.have.been.calledOnce;
        });
    });

    describe('Test repeat', function _testRepeat() {
        it('should call a function the specified number of times', function _testRepeatTenTimes() {
            function rep(val) { return val++; }

            var repSpy = sinon.spy(rep);

            var res = repeat(10, repSpy);

            res.should.eql(10);
            repSpy.callCount.should.eql(10);
        });
    });

    describe('Test rightApply', function _testRightApply() {
        it('should apply the argument from right to left', function _testRightApply() {
            function doStuff(arg1, arg2, arg3, arg4, arg5) {
                return arg1 + arg2 * arg3 - arg4 / arg5;
            }

            var rightApplyFn = rightApply(doStuff),
                rightApplyRes = rightApplyFn(5, 4, 3, 2, 1);

            rightApplyRes.should.eql(6.2);
        });
    });

    describe('Test safe', function _testSafe() {
        it('should prevent running a function when null/undefined arguments are passed', function _testSafeWillNullArg() {
            function _t(arg) { return arg; }
            var _tSpy = sinon.spy(_t),
                safe_t = safe(_tSpy);

            var res1 = safe_t(undefined, undefined);
            var res2 = safe_t(null);

            expect(res1).to.be.undefined;
            expect(res2).to.be.undefined;

            _tSpy.should.not.have.been.called;
        });

        it('should prevent running a function when no params are passed', function _testSafeWithNoArgs() {
            function _t(arg) { return arg; }
            var _tSpy = sinon.spy(_t),
                safe_t = safe(_tSpy);

            var res = safe_t();

            expect(res).to.be.undefined;
            _tSpy.should.not.have.been.called;
        });

        it('should successfully invoke a function when correct params are passed', function _testSafeWithGoodArgs() {
            function _t(arg) { return arg; }
            var _tSpy = sinon.spy(_t),
                safe_t = safe(_tSpy);

            var res = safe_t(10, 12, true, 'string');

            res.should.eql(10);
            _tSpy.should.have.been.calledOnce;
        });
    });

    describe('Test tap', function _testTap() {
        it('should apply the function to the argument and return the argument', function _testTap() {
            function tapper(arg) {
                return arg + 10;
            }

            let tapperSpy = sinon.spy(tapper),
                tapped = tap(tapperSpy, 5);

            tapped.should.eql(5);
            tapperSpy.should.have.been.called.once;
            tapperSpy.should.have.returned(15);
        });
    });

    describe('Test ternary', function _testTernary() {
        it('should make a nullary function ternary', function _testTernaryOnANullaryFunction() {
            function _nullary() { return Array.prototype.slice.call(arguments); }

            var res = ternary(_nullary)(1)(2)(3);

            res.should.be.an('array');
            res.should.eql([1, 2, 3]);
        });

        it('should leave a ternary function \'untouched\'', function _testTernaryOnATernaryFunction() {
            function _ternary(arg1, arg2, arg3) { return Array.prototype.slice.call(arguments); }

            var res = ternary(_ternary)(1)(2)(3);

            res.should.be.an('array');
            res.should.eql([1, 2, 3]);
        });

        it('should turn a quarternary function into a ternary function', function _testTernaryOnAQuaternaryFunction() {
            function quarternary(arg1, arg2, arg3, arg4) { return Array.prototype.slice.call(arguments); }

            var res = ternary(quarternary)(1)(2)(3);

            res.should.be.an('array');
            res.should.eql([1, 2, 3]);
        });
    });

    describe('Test tryCatch', function _tryCatch() {
        function catcher(ex, ...args) {
            return args.concat(ex);
        }

        it('should not invoke the catcher if no exception is thrown', function _testTryCatchWithNoException() {
            function tryer(x) {
                return x;
            }

            var res = tryCatch(catcher, tryer)(1);
            res.should.eql(1);
        });

        it('should invoke the catcher if the tryer throws', function _testTryCatchWithAnException() {
            function tryer(x, y) {
                throw new Error("exception!");
            }

            var res = tryCatch(catcher, tryer)(1, 2);

            res.should.be.an('array');
            res.should.eql([1, 2, new Error("exception!")]);
        });
    });

    describe('Test unary', function _testUnary() {
        it('should make all functions unary', function _unaryTest() {
            function nullary() { return Array.prototype.slice.call(arguments, 0); }
            function binary(arg1, arg2) { return Array.prototype.slice.call(arguments, 0); }
            function ternary(arg1, arg2, arg3) { return Array.prototype.slice.call(arguments, 0); }

            var unaryNullary = unary(nullary),
                unaryBinary = unary(binary),
                unaryTernary = unary(ternary);

            var unRes = unaryNullary(1),
                ubRes = unaryBinary(1),
                utRes = unaryTernary(1);

            unRes.should.be.an('array');
            unRes.should.eql([1]);

            ubRes.should.be.an('array');
            ubRes.should.eql([1]);

            utRes.should.be.an('array');
            utRes.should.eql([1]);
        });

        it('should allow a param to be passed in during decoration', function _testUnaryWithArg() {
            function _duo(x, y) { return Array.prototype.slice.call(arguments); }

            var res = unary(_duo, 2);

            res.should.be.an('array');
            res.should.eql([2]);
        });
    });

    describe('Test unfold', function _testUnfold() {
        it('should unfold the generator and return an array of values', function _testUnfold() {
            function sum(list) {
                let res = 0;
                for(let i of list) {
                    res += i;
                }
                return res;
            }

            let unfolded = unfold(5, n => 0 < n ? { value: n, next: n - 1 } : { done: true });
                sum(unfolded()).should.eql(15);
        });
    });

    describe('Test voidFn', function _testVoidFn() {
        it('should void the return value of a function', function _voidFnTest() {
            function _test() { return true; }

            var resFn = voidFn(_test),
                res = resFn();

            expect(res).to.be.undefined;
        });
    });
});