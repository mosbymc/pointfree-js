import * as monads from '../../../src/dataStructures/dataStructures';
import { identity } from '../../../src/dataStructures/identity';

var Identity = monads.Identity;

describe('Identity monad test', function _testIdentityMonad() {
    describe('Identity object factory tests', function _testIdentityObjectFactory() {
        it('should return a new identity monad regardless of data type', function _testIdentityFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = Identity(),
                i2 = Identity(null),
                i3 = Identity(1),
                i4 = Identity(arr),
                i5 = Identity(obj),
                i6 = Identity(Symbol()),
                i7 = Identity('testing constant'),
                i8 = Identity(false);

            identity.isPrototypeOf(i1).should.be.true;
            identity.isPrototypeOf(i2).should.be.true;
            identity.isPrototypeOf(i3).should.be.true;
            identity.isPrototypeOf(i4).should.be.true;
            identity.isPrototypeOf(i5).should.be.true;
            identity.isPrototypeOf(i6).should.be.true;
            identity.isPrototypeOf(i7).should.be.true;
            identity.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return the same type/value when using the #of function', function _testIdentityDotOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = Identity.of(),
                i2 = Identity.of(null),
                i3 = Identity.of(1),
                i4 = Identity.of(arr),
                i5 = Identity.of(obj),
                i6 = Identity.of(Symbol()),
                i7 = Identity.of('testing constant'),
                i8 = Identity.of(false);

            identity.isPrototypeOf(i1).should.be.true;
            identity.isPrototypeOf(i2).should.be.true;
            identity.isPrototypeOf(i3).should.be.true;
            identity.isPrototypeOf(i4).should.be.true;
            identity.isPrototypeOf(i5).should.be.true;
            identity.isPrototypeOf(i6).should.be.true;
            identity.isPrototypeOf(i7).should.be.true;
            identity.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should return correct boolean value when #is is invoked', function _testIdentityDotIs() {
            var i = Identity(10),
                m = monads.Maybe(10),
                c = monads.Constant(10),
                f = Identity.is,
                n = null,
                s = 'string',
                b = false;

            Identity.is(c).should.be.false;
            Identity.is(m).should.be.false;
            Identity.is(i).should.be.true;
            Identity.is(f).should.be.false;
            Identity.is(n).should.be.false;
            Identity.is(s).should.be.false;
            Identity.is(b).should.be.false;
        });

        it('should return an \'empty\' identity and no identity should be empty', function _testEmptyIdentity() {
            var i = Identity.empty();
            i.isEmpty().should.be.false;
        });

        it('should lift any function to return an Identity wrapped value', function _testIdentityDotLift() {
            function t1() { return -1; }
            function t2() { return '-1'; }
            function t3(arg) { return arg; }

            var res1 = Identity.lift(t1)(),
                res2 = Identity.lift(t2)(),
                res3 = Identity.lift(t3)(15);

            res1.should.eql(Identity(-1));
            res1.toString().should.eql('Identity(-1)');

            res2.should.eql(Identity('-1'));
            res2.toString().should.eql(res1.toString());

            res3.should.eql(Identity(15));
            res3.toString().should.eql('Identity(15)');
        });
    });

    describe('Identity monad object tests', function _testIdentityMonadObject() {
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var i = Identity(1),
                err1 = false,
                err2 = false;
            i.should.have.ownPropertyDescriptor('_value', { value: 1, writable: false, configurable: false, enumerable: false });

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

        it('should return a new identity functor instance with the mapped value', function _testIdentityFunctorMap() {
            var i = Identity(1),
                d = i.map(function _t() { return 2; });

            i.value.should.not.eql(d.value);
            i.should.not.equal(d);
        });

        it('should map over the input', function _testIdentityContramap() {
            Identity(5).apply(Identity(x => x * x)
                .contramap(x => x + 10))
                .extract.should.eql(225);
        });

        it('should dimap over the identity', function _testIdentityDimap() {
            Identity(5).apply(Identity(x => x * x)
                .dimap(x => x + 10, x => x / 5))
                .extract.should.eql(45);
        });

        it('should properly indicate equality when identities are indeed equal', function _testIdentityEquality() {
            var m1 = Identity(null),
                m2 = Identity(null),
                m3 = Identity(1),
                m4 = Identity(1),
                m5 = Identity(2);

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

        it('should map an identity to the other functor types', function _testIdentityMapTransform() {
            var i = Identity(1);
            var c = i.mapToConstant(),
                f = i.mapToFuture(),
                io = i.mapToIo(),
                l = i.mapToList(),
                left = i.mapToLeft(),
                m = i.mapToMaybe(),
                r = i.mapToRight();

            expect(i.mapToIdentity).to.be.undefined;
            Object.getPrototypeOf(c).should.eql(Object.getPrototypeOf(monads.Constant()));
            Object.getPrototypeOf(f).should.eql(Object.getPrototypeOf(monads.Future()));
            Object.getPrototypeOf(io).should.eql(Object.getPrototypeOf(monads.Io()));
            Object.getPrototypeOf(l).should.eql(Object.getPrototypeOf(monads.List()));
            Object.getPrototypeOf(left).should.eql(Object.getPrototypeOf(monads.Left()));
            Object.getPrototypeOf(m).should.eql(Object.getPrototypeOf(monads.Maybe(1)));
            Object.getPrototypeOf(r).should.eql(Object.getPrototypeOf(monads.Right()));
        });

        it('should extract the underlying value of an identity', function _testIdentityExtract() {
            Identity(10).extract.should.eql(10);
            Identity('10').extract.should.eql('10');
        });

        it('should represent the identity\'s \'type\' when \'Object.prototype.toString.call\' is invoked', function _testIdentityTypeString() {
            var i = Identity();

            //console.log(Object.prototype.toString.call(i));

            //Object.prototype.toString.call(i).should.eql('[object Identity]');
        });

        it('should have a functioning iterator', function _testIdentityIterator() {
            var i1 = Identity(10),
                i2 = Identity({ a: 1, b: 2 });

            var i1Res = [...i1],
                i2Res = [...i2];

            i1Res.should.eql([i1.value]);
            i2Res.should.eql([i2.value]);
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testIdentityValueOf() {
            var i1 = Identity('Mark'),
                i2 = Identity(10);

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

        it('should print the correct data structure type + value when .toString() is invoked', function _testIdentityToString() {
            var c1 = Identity(1),
                c2 = Identity(null),
                c3 = Identity([1, 2, 3]),
                c4 = Identity(Identity(Identity(5)));

            c1.toString().should.eql('Identity(1)');
            c2.toString().should.eql('Identity(null)');
            c3.toString().should.eql('Identity(1,2,3)');
            c4.toString().should.eql('Identity(Identity(Identity(5)))');
        });

        it('should return the underlying value when the join function property is called', function _testIdentityJoin() {
            var i1 = Identity(10),
                i2 = Identity(null),
                i3 = Identity(Identity(1));

            i1.join().should.eql(Identity(10));
            expect(i2.join()).to.eql(Identity(null));
            i3.join().should.eql(Identity(1));
        });

        it('should apply a mutating function to the underlying value and return the new value unwrapped in an identity when chain is called', function _testIdentityChain() {
            var i1 = Identity(10),
                i2 = Identity(Identity({ a: 1, b: 2 })),
                i3 = Identity(25);

            i1.chain(function _flatMap(val) {
                return Identity.of(5 * val);
            }).value.should.eql(50);

            i2.chain(function _flatMap(ma) {
                return ma.map(function _innerMap(val) {
                    return val.a + val.b;
                });
            }).value.should.eql(3);

            i3.chain(function _flatMap(val) {
                return val + 2;
            }).value.should.eql(27);
        });

        /*
        it('should return the applied data structure\'s type after mapping the identity\'s underlying value', function _testIdentityApply() {
            var i = Identity(function _identityMap(val) {
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
        */

        it('should return underlying value when identity#fold is invoked', function _testIdentityFold() {
            Identity(10).fold((x, y) => x + y * 15, 0).should.eql(150);
        });

        it('should return a Just of an Identity of 10 when #sequence is invoked', function _testIdentitySequence() {
            Identity(10).sequence(monads.Maybe).toString().should.eql('Just(Identity(10))');
        });

        it('should return a Just of an Identity of 3 when #traverse is invoked', function _testIdentityTraverse() {
            function test(val) {
                return monads.Maybe(val + 2);
            }

            Identity(1).traverse(monads.Maybe, test).toString().should.eql('Just(Identity(3))');
        });

        it('should have a .factory property that points to the factory function', function _testIdentityIsStupidViaFantasyLandSpecCompliance() {
            Identity(null).factory.should.eql(Identity);
            Identity(null).constructor.should.eql(Identity);
        });

        it('should have the fantasy land aliases', function _testForFantasyLandAliasPresence() {
            var i = Identity();

            i.map.should.eql(i['fantasy-land/map']);
            i.chain.should.eql(i['fantasy-land/chain']);
            i.ap.should.eql(i['fantasy-land/ap']);
            i.bimap.should.eql(i['fantasy-land/bimap']);
            i.reduce.should.eql(i['fantasy-land/reduce']);
            i.traverse.should.eql(i['fantasy-land/traverse']);
            i.equals.should.eql(i['fantasy-land/equals']);
        });
    });

    describe('Identity laws test', function _testIdentityFunctorLaws() {
        /*it('should obey the identity law', function _testIdentityFunctorIdentityLaw() {
            var v = Identity(2);

            Identity(identity).ap(v).value.should.eql(v.mjoin());
        });*/

        it('should have a proper algebraic properties monad_apply', function _testIdentityMonadAlgebraicProperties() {
            function _i(val) { return  val + 2; }
            var x = 2;
            var i = x => x;
            var t = f => f(i);

            //Composition
            Identity(1).apply(Identity(x => x * x).apply(Identity(x => x + 2).map(f => g => x => f(g(x))))).value
                .should.eql(Identity(1).apply(Identity(x => x * x)).apply(Identity(x => x + 2)).value)

            //Identity
            Identity(i).apply(Identity(i)).value.should.eql(i);

            //Homomorphism
            var pow = x => x * x;
            Identity.of(5).apply(Identity.of(pow)).value.should.eql(Identity.of(pow(5)).value);

            Identity.of(x).map(i).value.should.eql(Identity.of(x).apply(Identity.of(i)).value);

            //Interchange
            var u = Identity(t);
            Identity.of(t).apply(u).value.should.eql(u.apply(Identity.of(t)).value);

            var m = Identity(i),
                g = Identity(11);

            function f(val) {
                return Identity(val);
            }

            function h(val) {
                return Identity(val + 7);
            }

            function rightMaker(v1, v2) {
                return monads.Right(v1 + v2);
            }

            //Associativity
            m.chain(f).chain(h).value.should.eql(m.chain(x => f(x).chain(h)).value);

            Identity(2).map(x => x + 2).fold(rightMaker, 0).value.should.eql(Identity(2).fold(rightMaker, 0).map(x => x + 2).value);

            //Traversable Identity
            Identity(2).traverse(monads.Maybe, monads.Maybe.of).toString().should.eql(monads.Maybe.of(Identity(2)).toString());

            function test2(val) {
                return monads.Maybe(val.value + 5);
            }

            function test3(m) {
                return m.map(traverseMap);
            }

            function traverseMap(val) {
                return val + 5;
            }

            function fromNullable(fn) {
                return function _fromNullable(...args) {
                    return monads.Maybe(fn(...args));
                };
            }
            var nullableTraverse = fromNullable(traverseMap);

            function test4(val) {
                return monads.Either(2 * val, 'right').traverse(Identity, test5);
            }

            function test5(val) {
                return monads.Maybe(val + 2);
            }

            Identity(10).traverse(monads.Maybe, test4).toString().should.eql(monads.Just(Identity(monads.Right(22))).toString());



            //var yy = mona.of(identity(10));
            //var gg = yy.traverse(test);


            /*
             > t(u.traverse(F, x => x)) is equivalent to u.traverse(G, t) for any t such that t(a).map(f) is equivalent to t(a.map(f)) (naturality)
             > u.traverse(F, F.of) is equivalent to F.of(u) for any Applicative F (identity)
             > u.traverse(Compose, x => new Compose(x)) === new Compose(u.traverse(F, x => x).map(x => x.traverse(G, x => x)))
                    for Compose defined below and any Applicatives F and G (composition)
             */
        });
    });
});