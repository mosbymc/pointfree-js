import { monads } from '../../../../src/containers/monads/monads';
import { identity_monad } from '../../../../src/containers/monads/identity_monad';
import { identity } from '../../../../src/combinators';

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

            identity_monad.isPrototypeOf(i1).should.be.true;
            identity_monad.isPrototypeOf(i2).should.be.true;
            identity_monad.isPrototypeOf(i3).should.be.true;
            identity_monad.isPrototypeOf(i4).should.be.true;
            identity_monad.isPrototypeOf(i5).should.be.true;
            identity_monad.isPrototypeOf(i6).should.be.true;
            identity_monad.isPrototypeOf(i7).should.be.true;
            identity_monad.isPrototypeOf(i8).should.be.true;

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

            identity_monad.isPrototypeOf(i1).should.be.true;
            identity_monad.isPrototypeOf(i2).should.be.true;
            identity_monad.isPrototypeOf(i3).should.be.true;
            identity_monad.isPrototypeOf(i4).should.be.true;
            identity_monad.isPrototypeOf(i5).should.be.true;
            identity_monad.isPrototypeOf(i6).should.be.true;
            identity_monad.isPrototypeOf(i7).should.be.true;
            identity_monad.isPrototypeOf(i8).should.be.true;

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });
    });

    describe('Identity monad object tests', function _testIdentityMonadObject() {
        it('should return the underlying value when the mjoin function property is called', function _testIdentityMonadMjoin() {
            var i1 = Identity(10),
                i2 = Identity(null);

            i1.mjoin().should.eql(10);
            expect(i2.mjoin()).to.eql(null);
        });

        it('should apply a mutating function to the underlying value and return the new value unwrapped in an Identity when chain is called', function _testIdentityMonadChain() {
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

        it('should return the applied monad type after mapping the identity monad\'s underlying value', function _testIdentityMonadApply() {
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

        it('should have a .constructor property that points to the factory function', function _testIdentityMonadIsStupidViaFantasyLandSpecCompliance() {
            Identity(null).constructor.should.eql(Identity);
        });
    });

    describe('Identity laws test', function _testIdentityFunctorLaws() {
        it('should obey the identity law', function _testIdentityFunctorIdentityLaw() {
            var v = Identity(2);

            Identity(identity).ap(v).value.should.eql(v.mjoin());
        });

        it('should have a proper algebraic properties apply', function _testIdentityMonadAlgebraicProperties() {
            function _i(val) { return  val + 2; }
            var x = 2;
            var t = f => f(identity);

            //Composition
            Identity(identity).apply(Identity(identity).apply(Identity(2))).value.should.eql(Identity(identity).apply(Identity(identity)).apply(Identity(x)).value);

            //Identity
            Identity(identity).apply(Identity(identity)).value.should.eql(identity);

            //Homomorphism
            Identity.of(_i).apply(Identity.of(x)).value.should.eql(Identity.of(_i(x)).value);

            Identity.of(x).map(identity).value.should.eql(Identity.of(identity).apply(Identity.of(x)).value);

            //Interchange
            var u = Identity(t);
            Identity.of(t).apply(u).value.should.eql(u.apply(Identity.of(t)).value);

            var m = Identity(identity),
                g = Identity(11);

            function f(val) {
                return Identity(val);
            }

            function h(val) {
                return Identity(val + 7);
            }

            //Associativity
            m.chain(f).chain(h).value.should.eql(m.chain(x => f(x).chain(h)).value);

            Identity(2).map(x => x + 2).fold(monads.Right).value.should.eql(Identity(2).fold(monads.Right).map(x => x + 2).value);

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