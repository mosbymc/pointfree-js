import { LazyMaybe, lazy_just, lazy_nothing, LazyJust } from '../../../../src/dataStructures/lazy_dataStructures/_lazy_maybe';
import * as monads from '../../../../src/dataStructures/dataStructures';

describe('Test lazy maybe', function _testLazyMaybe() {
    describe('Maybe object factory tests', function _testMaybeObjectFactory() {
        it('should return a new lazy maybe regardless of data type', function _testMaybeFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = LazyMaybe(),
                i2 = LazyMaybe(null),
                i3 = LazyMaybe(1),
                i4 = LazyMaybe(arr),
                i5 = LazyMaybe(obj),
                i6 = LazyMaybe(Symbol()),
                i7 = LazyMaybe('testing constant'),
                i8 = LazyMaybe(false);

            lazy_nothing.should.eql(i1);
            lazy_nothing.should.eql(i2);
            lazy_just.isPrototypeOf(i3).should.be.true;
            lazy_just.isPrototypeOf(i4).should.be.true;
            lazy_just.isPrototypeOf(i5).should.be.true;
            lazy_just.isPrototypeOf(i6).should.be.true;
            lazy_just.isPrototypeOf(i7).should.be.true;
            lazy_just.isPrototypeOf(i8).should.be.true;

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
                i1 = LazyMaybe.of(),
                i2 = LazyMaybe.of(null),
                i3 = LazyMaybe.of(1),
                i4 = LazyMaybe.of(arr),
                i5 = LazyMaybe.of(obj),
                i6 = LazyMaybe.of(Symbol()),
                i7 = LazyMaybe.of('testing constant'),
                i8 = LazyMaybe.of(false);

            lazy_just.isPrototypeOf(i1).should.be.true;
            lazy_just.isPrototypeOf(i2).should.be.true;
            lazy_just.isPrototypeOf(i3).should.be.true;
            lazy_just.isPrototypeOf(i4).should.be.true;
            lazy_just.isPrototypeOf(i5).should.be.true;
            lazy_just.isPrototypeOf(i6).should.be.true;
            lazy_just.isPrototypeOf(i7).should.be.true;
            lazy_just.isPrototypeOf(i8).should.be.true;

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
            var i = LazyMaybe(10),
                m = monads.Maybe(10),
                c = monads.Constant(10),
                f = LazyMaybe.is,
                n = null,
                s = 'string',
                b = false;

            LazyMaybe.is(c).should.be.false;
            LazyMaybe.is(m).should.be.false;
            LazyMaybe.is(i).should.be.true;
            LazyMaybe.is(f).should.be.false;
            LazyMaybe.is(n).should.be.false;
            LazyMaybe.is(s).should.be.false;
            LazyMaybe.is(b).should.be.false;
        });

        it('should return an \'empty\' maybe and no identity should be empty', function _testEmptyMaybe() {
            LazyMaybe.empty().isEmpty.should.be.true;
        });

        it('should lift any function to return an Maybe wrapped value', function _testMaybeLift() {
            function t1() { return -1; }
            function t2() { return '-1'; }
            function t3(arg) { return arg; }

            var res1 = LazyMaybe.lift(t1)(),
                res2 = LazyMaybe.lift(t2)(),
                res3 = LazyMaybe.lift(t3)(15);

            res1.value.should.eql(LazyMaybe(-1).value);
            res1.toString().should.eql('Just(-1)');

            res2.value.should.eql(LazyMaybe('-1').value);
            res2.toString().should.eql(res1.toString());

            res3.value.should.eql(LazyMaybe(15).value);
            res3.toString().should.eql('Just(15)');
        });

        it('should return the appropriate data structure based on a null value', function _testMaybeFromNullable() {
            var m1 = LazyMaybe.fromNullable(null),
                m2 = LazyMaybe.fromNullable(),
                m3 = LazyMaybe.fromNullable(1),
                m4 = LazyMaybe.fromNullable('1'),
                m5 = LazyMaybe.fromNullable([]),
                m6 = LazyMaybe.fromNullable({}),
                m7 = LazyMaybe.fromNullable(Symbol());

            lazy_nothing.should.eql(m1);
            lazy_nothing.should.eql(m2);
            lazy_just.isPrototypeOf(m3).should.be.true;
            lazy_just.isPrototypeOf(m4).should.be.true;
            lazy_just.isPrototypeOf(m5).should.be.true;
            lazy_just.isPrototypeOf(m6).should.be.true;
            lazy_just.isPrototypeOf(m7).should.be.true;
        });

        it('should return nothing', function _testMaybeNothing() {
            LazyMaybe.Nothing().should.eql(lazy_nothing);
        });

        it('should return a boolean indicating the correct data structure', function _testMaybeIsJust() {
            LazyMaybe.isJust(LazyMaybe()).should.be.false;
            LazyMaybe.isJust(LazyMaybe(1)).should.be.true;
        });

        it('should return a boolean indicating the correct data structure', function _testMaybeIsNothing() {
            LazyMaybe.isNothing(LazyMaybe()).should.be.true;
            LazyMaybe.isNothing(LazyMaybe(1)).should.be.false;
        });
    });

    describe('Just object factory tests', function _testJustObjectFactory() {
        it('should return a new lazy just', function _testJust() {
            Object.getPrototypeOf(LazyJust(1)).should.eql(lazy_just);
        });

        it('should return a new lazy just', function _testJustOf() {
            Object.getPrototypeOf(LazyJust.of(null)).should.eql(lazy_just);
        });

        it('should return a boolean indicating the data structure type', function _testJustIs() {
            LazyJust.is(LazyMaybe()).should.be.false;
            LazyJust.is(LazyMaybe(1)).should.be.true;
        });
    });

    describe('Maybe monad object tests', function _testMaybeDateStructure() {
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var i = LazyMaybe(1),
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
            var i = LazyMaybe(1),
                d = i.map(function _t() { return 2; });

            i.value.should.not.eql(d.value);
            i.should.not.equal(d);
        });

        it('should return a new maybe instance after applying the first function to the underlying', function _testMaybeBiMap() {
            var spy1 = sinon.spy(val => val * val),
                spy2 = sinon.spy(val => 1);

            var m1 = LazyMaybe(10),
                m2 = LazyMaybe();

            var m1Res = m1.bimap(spy1, spy2),
                m2Res = m2.bimap(spy1, spy2);

            m1Res.value.should.eql(100);
            spy1.should.have.been.calledOnce;

            expect(null).to.eql(m2Res.value);
            spy2.should.not.have.been.called;
        });

        it('should map over the input', function _testMaybeContramap() {
            LazyMaybe(x => x * x)
                .contramap(x => x + 10)
                .apply(LazyMaybe(5))
                .extract.should.eql(225);
        });

        it('should properly indicate equality when maybes are indeed equal', function _testMaybeEquality() {
            var m1 = LazyMaybe(null),
                m2 = LazyMaybe(null),
                m3 = LazyMaybe(1),
                m4 = LazyMaybe(1),
                m5 = LazyMaybe(2);

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
            LazyMaybe(10).extract.should.eql(10);
            LazyMaybe('10').extract.should.eql('10');
        });

        it('should represent the maybe\'s \'type\' when \'Object.prototype.toString.call\' is invoked', function _testMaybeTypeString() {
            var i = LazyMaybe();

            //console.log(Object.prototype.toString.call(i));

            //Object.prototype.toString.call(i).should.eql('[object Identity]');
        });

        it('should have a functioning iterator', function _testMaybeIterator() {
            var i1 = LazyMaybe(10),
                i2 = LazyMaybe({ a: 1, b: 2 }),
                i3 = LazyMaybe();

            var i1Res = [...i1],
                i2Res = [...i2],
                i3Res = [...i3];

            i1Res.should.eql([i1.value]);
            i2Res.should.eql([i2.value]);
            i3Res.should.eql([i3.value]);
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testMaybeValueOf() {
            var i1 = LazyMaybe('Mark'),
                i2 = LazyMaybe(10);

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
            LazyMaybe(1).toString().should.eql('Just(1)');
            LazyMaybe(null).toString().should.eql('Nothing()');
            LazyMaybe([1, 2, 3]).toString().should.eql('Just(1,2,3)');
            LazyMaybe(LazyMaybe(LazyMaybe(5))).toString().should.eql('Just(Just(Just(5)))');
        });

        it('should return the underlying value when the mjoin function property is called', function _testMaybeMjoin() {
            LazyMaybe(10).mjoin().value.should.eql(LazyMaybe(10).value);
            expect(LazyMaybe(null).mjoin().value).to.eql(LazyMaybe(null).value);
            LazyMaybe(LazyMaybe(1)).mjoin().value.should.eql(LazyMaybe(1).value);
        });

        it('should apply a mutating function to the underlying value and return the new value unwrapped in a maybe when chain is called', function _testMaybeChain() {
            LazyMaybe(10).chain(function _flatMap(val) {
                return LazyMaybe.of(5 * val);
            }).value.should.eql(50);

            LazyMaybe(LazyMaybe({ a: 1, b: 2 })).chain(function _flatMap(ma) {
                return ma.map(function _innerMap(val) {
                    return val.a + val.b;
                });
            }).value.should.eql(3);

            LazyMaybe(25).chain(function _flatMap(val) {
                return val + 2;
            }).value.should.eql(27);
        });

        it('should return the applied monad type after mapping the maybe\'s underlying value', function _testMaybeApply() {
            var i = LazyMaybe(function _identityMap(val) {
                return val ? val + 50 : 0;
            });

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
            LazyMaybe(10).fold((x, y) => x + y * 15, 0).should.eql(150);
        });

        it('should return an Identity of a Just of 10 when #sequence is invoked', function _testMaybeSequence() {
            LazyMaybe(10).sequence(monads.Identity).toString().should.eql('Identity(Just(10))');
            LazyMaybe().sequence(monads.Identity).toString().should.eql('Identity(Nothing())');
        });

        it('should return an Identity of a Just 3 when #traverse is invoked', function _testMaybeTraverse() {
            function test(val) {
                return monads.Identity(val + 2);
            }

            LazyMaybe(1).traverse(monads.Identity, test).toString().should.eql('Identity(Just(3))');
            LazyMaybe().traverse(monads.Identity, test).toString().should.eql('Identity(Nothing())');
        });

        it('should have an overridden Symbol.toStringTag operation', function _testMaybeToStringTag() {
            Object.prototype.toString.call(LazyMaybe()).should.eql('[object Nothing]');
            Object.prototype.toString.call(LazyMaybe(1)).should.eql('[object Just]');
        });

        it('should have a .factory property that points to the factory function', function _testMaybeFactoryPointer() {
            LazyMaybe(null).factory.should.eql(LazyMaybe);
            LazyMaybe(null).constructor.should.eql(LazyMaybe);
        });

        it('should have the fantasy land aliases', function _testForFantasyLandAliasPresence() {
            var i = LazyMaybe();

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