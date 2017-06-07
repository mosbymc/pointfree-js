import { monads } from '../../../../src/containers/monads/monads';
import { identity_monad } from '../../../../src/containers/monads/identity_monad';
import { identity } from '../../../../src/functionalHelpers';

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
            var i1 = Identity(Identity(10)),
                i2 = Identity(Identity({ a: 1, b: 2 })),
                i3 = Identity(25);

            i1.flatMap(function _flatMap(val) {
                return 5 * val;
            }).value.should.eql(50);

            i2.flatMap(function _flatMap(val) {
                return val.a + val.b;
            }).value.should.eql(3);

            i3.flatMap(function _flatMap(val) {
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
            Object.getPrototypeOf(e1Res).should.eql(monads.Either());
            Object.getPrototypeOf(e2Res).should.eql(monads.Either());
            Object.getPrototypeOf(m1Res).should.eql(monads.Maybe());
            Object.getPrototypeOf(m2Res).should.eql(monads.Maybe());
            Object.getPrototypeOf(m3Res).should.eql(monads.Maybe());
        });

        it('should have a proper algebraic properties apply', function _testIdentityMonadAlgebraicProperties() {
            function _i(val) { return  val + 2; }
            var x = 2;
            function t(f) {
                console.log(f);
                return function _f(g) {
                    console.log(g);
                    return function _g(x) {
                        console.log(x);
                        return f(g(x));
                    };
                };
            }

            var Ii = Identity(identity);

            //console.log(Ii.apply(Ii).apply(Ii).value);

            console.log(Ii.map(t).value.toString());

            console.log(Ii.apply(Ii.map(t)).value.toString());

            //console.log(Ii.apply(Ii.apply(Ii.apply(Ii.map(t)))).value());

            //console.log(Ii.apply(Ii.apply(Ii.apply(Ii.apply(Ii.map(t))))).value());

            //Composition
            //console.log(Ii.apply(Ii.apply(Ii.apply(Ii.map(t))).value));

            //Identity
            Ii.apply(Ii).value.should.eql(Ii.value);

            //Homomorphism
            Identity.of(_i).apply(Identity.of(x)).value.should.eql(Identity.of(_i(x)).value);

            //Ii.apply(Identity(2)).value.should.eql(Identity(2).apply(Identity.of(f => f(y))).value);

        });

        it('should have a .constructor property that points to the factory function', function _testIdentityMonadIsStupidViaFantasyLandSpecCompliance() {
            Identity(null).constructor.should.eql(Identity);
        });
    });
});