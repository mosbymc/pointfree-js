import { LazyIdentity, lazy_identity } from '../../../../src/dataStructures/lazy_dataStructures/_lazy_identity';
import * as monads from '../../../../src/dataStructures/dataStructures';

describe('Test lazy identity', function _testLazyIdentity() {
    describe('Identity object factory tests', function _testIdentityObjectFactory() {
        it('should return a new lazy identity regardless of data type', function _testIdentityFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = LazyIdentity(),
                i2 = LazyIdentity(null),
                i3 = LazyIdentity(1),
                i4 = LazyIdentity(arr),
                i5 = LazyIdentity(obj),
                i6 = LazyIdentity(Symbol()),
                i7 = LazyIdentity('testing constant'),
                i8 = LazyIdentity(false);

            lazy_identity.isPrototypeOf(i1).should.be.true;
            lazy_identity.isPrototypeOf(i2).should.be.true;
            lazy_identity.isPrototypeOf(i3).should.be.true;
            lazy_identity.isPrototypeOf(i4).should.be.true;
            lazy_identity.isPrototypeOf(i5).should.be.true;
            lazy_identity.isPrototypeOf(i6).should.be.true;
            lazy_identity.isPrototypeOf(i7).should.be.true;
            lazy_identity.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #of function', function _testIdentityOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = LazyIdentity.of(),
                i2 = LazyIdentity.of(null),
                i3 = LazyIdentity.of(1),
                i4 = LazyIdentity.of(arr),
                i5 = LazyIdentity.of(obj),
                i6 = LazyIdentity.of(Symbol()),
                i7 = LazyIdentity.of('testing constant'),
                i8 = LazyIdentity.of(false);

            lazy_identity.isPrototypeOf(i1).should.be.true;
            lazy_identity.isPrototypeOf(i2).should.be.true;
            lazy_identity.isPrototypeOf(i3).should.be.true;
            lazy_identity.isPrototypeOf(i4).should.be.true;
            lazy_identity.isPrototypeOf(i5).should.be.true;
            lazy_identity.isPrototypeOf(i6).should.be.true;
            lazy_identity.isPrototypeOf(i7).should.be.true;
            lazy_identity.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return correct boolean value when #is is invoked', function _testIdentityIs() {
            LazyIdentity.is(monads.Constant(10)).should.be.false;
            LazyIdentity.is(monads.Maybe(10)).should.be.false;
            LazyIdentity.is(LazyIdentity(10)).should.be.true;
            LazyIdentity.is(LazyIdentity.is).should.be.false;
            LazyIdentity.is(null).should.be.false;
            LazyIdentity.is('string').should.be.false;
            LazyIdentity.is(false).should.be.false;
        });

        it('should return an \'empty\' identity and no identity should be empty', function _testEmptyIdentity() {
            LazyIdentity.empty().isEmpty.should.be.false;
        });

        it('should lift any function to return an Identity wrapped value', function _testIdentityLift() {
            function t1() { return -1; }
            function t2() { return '-1'; }
            function t3(arg) { return arg; }

            var res1 = LazyIdentity.lift(t1)(),
                res2 = LazyIdentity.lift(t2)(),
                res3 = LazyIdentity.lift(t3)(15);

            res1.value.should.eql(LazyIdentity(-1).value);
            res1.toString().should.eql('LazyIdentity(-1)');

            res2.value.should.eql(LazyIdentity('-1').value);
            res2.toString().should.eql(res1.toString());

            res3.value.should.eql(LazyIdentity(15).value);
            res3.toString().should.eql('LazyIdentity(15)');
        });
    });

    describe('Identity monad object tests', function _testIdentityMonadObject() {
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var i = LazyIdentity(1),
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

        it('should return a new identity data structure instance with the mapped value', function _testIdentityMap() {
            var i = LazyIdentity(1),
                d = i.map(function _t() { return 2; });

            i.value.should.not.eql(d.value);
            i.should.not.equal(d);
        });

        it('should contramap over the input', function _testIdentityContramap() {
            LazyIdentity(x => x * x)
                .contramap(x => x + 10)
                .apply(LazyIdentity(5))
                .extract.should.eql(225);
        });

        it('should dimap over the input', function _testIdentityDimap() {
            LazyIdentity(x => x * x)
                .dimap(x => x + 5, x => x / 2)
                .apply(LazyIdentity(10))
                .extract.should.eql(112.5);
        });

        it('should properly indicate equality when constant monads are indeed equal', function _testIdentityEquality() {
            var m1 = LazyIdentity(null),
                m2 = LazyIdentity(null),
                m3 = LazyIdentity(1),
                m4 = LazyIdentity(1),
                m5 = LazyIdentity(2);

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

        it('should extract the underlying value of an identity', function _testIdentityExtract() {
            LazyIdentity(10).extract.should.eql(10);
            LazyIdentity('10').extract.should.eql('10');
        });

        it('should return its equivalent when extract is invoked during an extend', function _testIdentityExtend() {
            LazyIdentity(10).extend(i => i.extract).extract.should.eql(LazyIdentity(10).extract);
        });

        it('should represent the identity\'s \'type\' when \'Object.prototype.toString.call\' is invoked', function _testIdentityTypeString() {
            var i = LazyIdentity();

            //console.log(Object.prototype.toString.call(i));

            //Object.prototype.toString.call(i).should.eql('[object Identity]');
        });

        it('should have a functioning iterator', function _testIdentityIterator() {
            var i1 = LazyIdentity(10),
                i2 = LazyIdentity({ a: 1, b: 2 });

            var i1Res = [...i1],
                i2Res = [...i2];

            i1Res.should.eql([i1.value]);
            i2Res.should.eql([i2.value]);
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testIdentityValueOf() {
            var i1 = LazyIdentity('Mark'),
                i2 = LazyIdentity(10);

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

        it('should print the correct container type + value when .toString() is invoked', function _testIdentityToString() {
            LazyIdentity(1).toString().should.eql('LazyIdentity(1)');
            LazyIdentity(null).toString().should.eql('LazyIdentity(null)');
            LazyIdentity([1, 2, 3]).toString().should.eql('LazyIdentity(1,2,3)');
            LazyIdentity(LazyIdentity(LazyIdentity(5))).toString().should.eql('LazyIdentity(LazyIdentity(LazyIdentity(5)))');
        });

        it('should return the underlying value when the mjoin function property is called', function _testIdentityMjoin() {
            LazyIdentity(10).mjoin().value.should.eql(LazyIdentity(10).value);
            expect(LazyIdentity(null).mjoin().value).to.eql(LazyIdentity(null).value);
            LazyIdentity(LazyIdentity(1)).mjoin().value.should.eql(LazyIdentity(1).value);
        });

        it('should apply a mutating function to the underlying value and return the new value unwrapped in an Identity when chain is called', function _testIdentityChain() {
            LazyIdentity(10).chain(function _flatMap(val) {
                return LazyIdentity.of(5 * val);
            }).value.should.eql(50);

            LazyIdentity(LazyIdentity({ a: 1, b: 2 })).chain(function _flatMap(ma) {
                return ma.map(function _innerMap(val) {
                    return val.a + val.b;
                });
            }).value.should.eql(3);

            LazyIdentity(25).chain(function _flatMap(val) {
                return val + 2;
            }).value.should.eql(27);
        });

        it('should return the applied monad type after mapping the identity data structure\'s underlying value', function _testIdentityApply() {
            var i = LazyIdentity(function _identityMap(val) {
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

        it('should return underlying value when lazy_identity#fold is invoked', function _testConstantFold() {
            LazyIdentity(10).fold((x, y) => x + y * 15, 0).should.eql(150);
        });

        it('should return a Just of an Identity of 10 when #sequence is invoked', function _testConstantSequence() {
            LazyIdentity(10).sequence(monads.Maybe).toString().should.eql('Just(LazyIdentity(10))');
        });

        it('should return a Just of an Identity of 3 when #traverse is invoked', function _testConstantTraverse() {
            function test(val) {
                return monads.Maybe(val + 2);
            }

            LazyIdentity(1).traverse(monads.Maybe, test).toString().should.eql('Just(LazyIdentity(3))');
        });

        it('should have a .factory property that points to the factory function', function _testIdentityFactoryPointer() {
            LazyIdentity(null).factory.should.eql(LazyIdentity);
            LazyIdentity(null).constructor.should.eql(LazyIdentity);
        });

        it('should have the fantasy land aliases', function _testForFantasyLandAliasPresence() {
            var i = LazyIdentity();

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