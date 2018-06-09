import { LazyEither, lazy_right, lazy_left, LazyRight, LazyLeft } from '../../../../src/dataStructures/lazy_dataStructures/_lazy_either';
import * as monads from '../../../../src/dataStructures/dataStructures';

describe('Test lazy maybe', function _testLazyEither() {
    describe('Maybe object factory tests', function _testMaybeObjectFactory() {
        it('should return a new lazy maybe regardless of data type', function _testMaybeFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = LazyEither(),
                i2 = LazyEither(null),
                i3 = LazyEither(1, 'right'),
                i4 = LazyEither(arr, 'right'),
                i5 = LazyEither(obj, 'right'),
                i6 = LazyEither(Symbol(), 'right'),
                i7 = LazyEither('testing constant', 'right'),
                i8 = LazyEither(false, 'right');

            lazy_left.should.eql(i1);
            lazy_left.should.eql(i2);
            lazy_right.isPrototypeOf(i3).should.be.true;
            lazy_right.isPrototypeOf(i4).should.be.true;
            lazy_right.isPrototypeOf(i5).should.be.true;
            lazy_right.isPrototypeOf(i6).should.be.true;
            lazy_right.isPrototypeOf(i7).should.be.true;
            lazy_right.isPrototypeOf(i8).should.be.true;

            expect(null).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #of function', function _testMaybeOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = LazyEither.of(),
                i2 = LazyEither.of(null),
                i3 = LazyEither.of(1),
                i4 = LazyEither.of(arr),
                i5 = LazyEither.of(obj),
                i6 = LazyEither.of(Symbol()),
                i7 = LazyEither.of('testing constant'),
                i8 = LazyEither.of(false);

            lazy_right.isPrototypeOf(i1).should.be.true;
            lazy_right.isPrototypeOf(i2).should.be.true;
            lazy_right.isPrototypeOf(i3).should.be.true;
            lazy_right.isPrototypeOf(i4).should.be.true;
            lazy_right.isPrototypeOf(i5).should.be.true;
            lazy_right.isPrototypeOf(i6).should.be.true;
            lazy_right.isPrototypeOf(i7).should.be.true;
            lazy_right.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return correct boolean value when #is is invoked', function _testMaybeIs() {
            var i = LazyEither(10),
                m = monads.Maybe(10),
                c = monads.Constant(10),
                f = LazyEither.is,
                n = null,
                s = 'string',
                b = false;

            LazyEither.is(c).should.be.false;
            LazyEither.is(m).should.be.false;
            LazyEither.is(i).should.be.true;
            LazyEither.is(f).should.be.false;
            LazyEither.is(n).should.be.false;
            LazyEither.is(s).should.be.false;
            LazyEither.is(b).should.be.false;
        });

        it('should return an \'empty\' maybe and no identity should be empty', function _testEmptyMaybe() {
            LazyEither.empty().isEmpty.should.be.true;
        });

        it('should lift any function to return an Maybe wrapped value', function _testMaybeLift() {
            function t1() { return -1; }
            function t2() { return '-1'; }
            function t3(arg) { return arg; }

            var res1 = LazyEither.lift(t1)(),
                res2 = LazyEither.lift(t2)(),
                res3 = LazyEither.lift(t3)(15);

            res1.value.should.eql(LazyEither(-1, 'right').value);
            res1.toString().should.eql('Right(-1)');

            res2.value.should.eql(LazyEither('-1', 'right').value);
            res2.toString().should.eql(res1.toString());

            res3.value.should.eql(LazyEither(15, 'right').value);
            res3.toString().should.eql('Right(15)');
        });

        it('should return the appropriate data structure based on a null value', function _testMaybeFromNullable() {
            var m1 = LazyEither.fromNullable(null),
                m2 = LazyEither.fromNullable(),
                m3 = LazyEither.fromNullable(1),
                m4 = LazyEither.fromNullable('1'),
                m5 = LazyEither.fromNullable([]),
                m6 = LazyEither.fromNullable({}),
                m7 = LazyEither.fromNullable(Symbol());

            //lazy_left.isPrototypeOf(m1).should.be.true;
            //lazy_left.isPrototypeOf(m2).should.be.true;
            lazy_right.isPrototypeOf(m3).should.be.true;
            lazy_right.isPrototypeOf(m4).should.be.true;
            lazy_right.isPrototypeOf(m5).should.be.true;
            lazy_right.isPrototypeOf(m6).should.be.true;
            lazy_right.isPrototypeOf(m7).should.be.true;
        });

        it('should return nothing', function _testMaybeNothing() {
            LazyLeft().should.eql(lazy_left);
            LazyEither.Left().should.eql(lazy_left);
        });

        it('should return a boolean indicating the correct data structure', function _testMaybeIsJust() {
            LazyEither.isRight(LazyEither()).should.be.false;
            LazyEither.isRight(LazyEither(1, 'right')).should.be.true;
        });

        it('should return a boolean indicating the correct data structure', function _testMaybeIsNothing() {
            LazyEither.isLeft(LazyEither()).should.be.true;
            LazyEither.isLeft(LazyEither(1, 'right')).should.be.false;
        });
    });

    describe('Just object factory tests', function _testJustObjectFactory() {
        it('should return a new lazy just', function _testJust() {
            Object.getPrototypeOf(LazyRight(1)).should.eql(lazy_right);
        });

        it('should return a new lazy just', function _testJustOf() {
            Object.getPrototypeOf(LazyRight.of(null)).should.eql(lazy_right);
        });

        it('should return a boolean indicating the data structure type', function _testJustIs() {
            LazyRight.is(LazyEither()).should.be.false;
            LazyRight.is(LazyEither(1, 'right')).should.be.true;
        });
    });

    describe('Maybe monad object tests', function _testMaybeDateStructure() {
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var i = LazyEither(1, 'right'),
                err1 = false,
                err2 = false;

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

        it('should return a new maybe instance with the mapped value', function _testMaybeMap() {
            var i = LazyEither(1, 'right'),
                d = i.map(function _t() { return 2; });

            i.value.should.not.eql(d.value);
            i.should.not.equal(d);
        });

        it('should return a new maybe instance after applying the first function to the underlying', function _testMaybeBiMap() {
            var spy1 = sinon.spy(val => val * val),
                spy2 = sinon.spy(val => 1);

            var m1 = LazyEither(10, 'right'),
                m2 = LazyEither(5);

            var m1Res = m1.bimap(spy1, spy2),
                m2Res = m2.bimap(spy1, spy2);

            m1Res.value.should.eql(100);
            spy1.should.have.been.calledOnce;

            expect(null).to.eql(m2Res.value);
            spy2.should.not.have.been.called;
        });

        it('should map over the input', function _testMaybeContramap() {
            LazyEither(x => x * x, 'right')
                .contramap(x => x + 10)
                .apply(LazyEither(5, 'right'))
                .extract.should.eql(225);
        });

        it('should properly indicate equality when maybes are indeed equal', function _testMaybeEquality() {
            var m1 = LazyEither(null),
                m2 = LazyEither(null),
                m3 = LazyEither(1, 'right'),
                m4 = LazyEither(1, 'right'),
                m5 = LazyEither(2, 'right');

            m1.equals(m2).should.be.true;
            m1.equals(m3).should.be.false;
            m1.equals(m4).should.be.false;
            m1.equals(m5).should.be.false;

            m2.equals(m3).should.be.false;
            m2.equals(m4).should.be.false;
            m2.equals(m5).should.be.false;

            m3.equals(m4).should.be.true;
            m3.equals(m5).should.be.true;

            m4.equals(m5).should.be.true;
        });

        it('should extract the underlying value of a maybe', function _testMaybeExtract() {
            LazyEither(10, 'right').extract.should.eql(10);
            LazyEither('10', 'right').extract.should.eql('10');
        });

        it('should represent the maybe\'s \'type\' when \'Object.prototype.toString.call\' is invoked', function _testMaybeTypeString() {
            var i = LazyEither();

            //console.log(Object.prototype.toString.call(i));

            //Object.prototype.toString.call(i).should.eql('[object Identity]');
        });

        it('should have a functioning iterator', function _testMaybeIterator() {
            var i1 = LazyEither(10, 'right'),
                i2 = LazyEither({ a: 1, b: 2 }, 'right'),
                i3 = LazyEither();

            var i1Res = [...i1],
                i2Res = [...i2],
                i3Res = [...i3];

            i1Res.should.eql([i1.value]);
            i2Res.should.eql([i2.value]);
            i3Res.should.eql([i3.value]);
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testMaybeValueOf() {
            var i1 = LazyEither('Mark', 'right'),
                i2 = LazyEither(10, 'right');

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

        it('should print the correct container type + value when .toString() is invoked', function _testMaybeToString() {
            LazyEither(1, 'right').toString().should.eql('Right(1)');
            LazyEither(null).toString().should.eql('Left()');
            LazyEither([1, 2, 3], 'right').toString().should.eql('Right(1,2,3)');
            LazyEither(LazyEither(LazyEither(5, 'right'), 'right'), 'right').toString().should.eql('Right(Right(Right(5)))');
        });

        it('should return the underlying value when the mjoin function property is called', function _testMaybeMjoin() {
            LazyEither(10, 'right').mjoin().value.should.eql(LazyEither(10, 'right').value);
            expect(LazyEither(null).mjoin().value).to.eql(LazyEither(null).value);
            LazyEither(LazyEither(1, 'right'), 'right').mjoin().value.should.eql(LazyEither(1, 'right').value);
        });

        it('should apply a mutating function to the underlying value and return the new value unwrapped in a maybe when chain is called', function _testMaybeChain() {
            LazyEither(10, 'right').chain(function _flatMap(val) {
                return LazyEither.of(5 * val);
            }).value.should.eql(50);

            LazyEither(LazyEither({ a: 1, b: 2 }, 'right'), 'right').chain(function _flatMap(ma) {
                return ma.map(function _innerMap(val) {
                    return val.a + val.b;
                });
            }).value.should.eql(3);

            LazyEither(25, 'right').chain(function _flatMap(val) {
                return val + 2;
            }).value.should.eql(27);
        });

        it('should return the applied monad type after mapping the maybe\'s underlying value', function _testMaybeApply() {
            var i = LazyEither(function _identityMap(val) {
                return val ? val + 50 : 0;
            }, 'right');

            var c = monads.Constant(10),
                e1 = monads.Either(100, 'right'),
                e2 = monads.Either('error'),
                l = monads.List([1, 2, 3, 4, 5]),
                m1 = monads.Maybe(15),
                m2 = monads.Maybe(null),
                m3 = monads.Maybe(false);

            var cRes = i.apply(c),
                e1Res = i.apply(e1),
                e2Res = i.apply(e2),
                lRes =  i.apply(l),
                m1Res = i.apply(m1),
                m2Res = i.apply(m2),
                m3Res = i.apply(m3);

            Object.getPrototypeOf(lRes).should.eql(Object.getPrototypeOf(monads.List()));
            Object.getPrototypeOf(cRes).should.eql(monads.Constant());
            Object.getPrototypeOf(e1Res).should.eql(monads.Right());
            e2Res.isRight.should.be.false;
            e2Res.isLeft.should.be.true;
            //Object.getPrototypeOf(m1Res).should.eql(monads.Maybe(65));
            //Object.getPrototypeOf(m2Res).should.eql(monads.Maybe());
            //Object.getPrototypeOf(m3Res).should.eql(monads.Maybe(false));
        });

        it('should return underlying value when maybe#fold is invoked', function _testMaybeFold() {
            LazyEither(10, 'right').fold((x, y) => x + y * 15, 0).should.eql(150);
        });

        it('should return an Identity of a Just of 10 when #sequence is invoked', function _testMaybeSequence() {
            LazyEither(10, 'right').sequence(monads.Identity).toString().should.eql('Identity(Right(10))');
            LazyEither().sequence(monads.Identity).toString().should.eql('Identity(Left())');
        });

        it('should return an Identity of a Just 3 when #traverse is invoked', function _testMaybeTraverse() {
            function test(val) {
                return monads.Identity(val + 2);
            }

            LazyEither(1, 'right').traverse(monads.Identity, test).toString().should.eql('Identity(Right(3))');
            LazyEither().traverse(monads.Identity, test).toString().should.eql('Identity(Left())');
        });

        it('should have an overridden Symbol.toStringTag operation', function _testMaybeToStringTag() {
            Object.prototype.toString.call(LazyEither()).should.eql('[object Left]');
            Object.prototype.toString.call(LazyEither(1, 'right')).should.eql('[object Right]');
        });

        it('should have a .factory property that points to the factory function', function _testMaybeFactoryPointer() {
            LazyEither(null).factory.should.eql(LazyEither);
            LazyEither(null).constructor.should.eql(LazyEither);
        });

        it('should have the fantasy land aliases', function _testForFantasyLandAliasPresence() {
            var i = LazyEither();

            //i.map.should.eql(i['fantasy-land/map']);
            //i.chain.should.eql(i['fantasy-land/chain']);
            //i.ap.should.eql(i['fantasy-land/ap']);
            //i.bimap.should.eql(i['fantasy-land/bimap']);
            //i.reduce.should.eql(i['fantasy-land/reduce']);
            //i.traverse.should.eql(i['fantasy-land/traverse']);
            //i.equals.should.eql(i['fantasy-land/equals']);
        });
    });
});