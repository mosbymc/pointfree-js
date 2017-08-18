import * as monads from '../../../../src/dataStructures/monads/monads';
import { constant_monad } from '../../../../src/dataStructures/monads/constant_monad';
import { identity } from '../../../../src/combinators';

var Constant = monads.Constant;

describe('Constant monad tests', function _testConstantMonad() {
    describe('Constant object factory tests', function _testConstantObjectFactory() {
        it('should return a new constant monad regardless of data type', function testConstantMonadObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                c1 = Constant(),
                c2 = Constant(null),
                c3 = Constant(1),
                c4 = Constant(arr),
                c5 = Constant(obj),
                c6 = Constant(Symbol()),
                c7 = Constant('testing constant'),
                c8 = Constant(false);

            constant_monad.isPrototypeOf(c1).should.be.true;
            constant_monad.isPrototypeOf(c2).should.be.true;
            constant_monad.isPrototypeOf(c3).should.be.true;
            constant_monad.isPrototypeOf(c4).should.be.true;
            constant_monad.isPrototypeOf(c5).should.be.true;
            constant_monad.isPrototypeOf(c6).should.be.true;
            constant_monad.isPrototypeOf(c7).should.be.true;
            constant_monad.isPrototypeOf(c8).should.be.true;

            expect(undefined).to.eql(c1.value);
            expect(null).to.eql(c2.value);
            expect(1).to.eql(c3.value);
            expect(arr).to.eql(c4.value);
            expect(obj).to.eql(c5.value);
            expect('symbol').to.eql(typeof c6.value);
            expect('testing constant').to.eql(c7.value);
            expect(false).to.eql(c8.value);
        });

        it('should return the same type/value when using the #of function', function testConstantDotOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                c1 = Constant.of(),
                c2 = Constant.of(null),
                c3 = Constant.of(1),
                c4 = Constant.of(arr),
                c5 = Constant.of(obj),
                c6 = Constant.of(Symbol()),
                c7 = Constant.of('testing constant'),
                c8 = Constant.of(false);

            constant_monad.isPrototypeOf(c1).should.be.true;
            constant_monad.isPrototypeOf(c2).should.be.true;
            constant_monad.isPrototypeOf(c3).should.be.true;
            constant_monad.isPrototypeOf(c4).should.be.true;
            constant_monad.isPrototypeOf(c5).should.be.true;
            constant_monad.isPrototypeOf(c6).should.be.true;
            constant_monad.isPrototypeOf(c7).should.be.true;
            constant_monad.isPrototypeOf(c8).should.be.true;

            expect(undefined).to.eql(c1.value);
            expect(null).to.eql(c2.value);
            expect(1).to.eql(c3.value);
            expect(arr).to.eql(c4.value);
            expect(obj).to.eql(c5.value);
            expect('symbol').to.eql(typeof c6.value);
            expect('testing constant').to.eql(c7.value);
            expect(false).to.eql(c8.value);
        });

        it('should return correct boolean value when #is is invoked', function _testConstantDotIs() {
            var c = Constant(10),
                m = monads.Maybe(10),
                i = monads.Identity(10),
                f = Constant.is,
                n = null,
                s = 'string',
                b = false;

            Constant.is(c).should.be.true;
            Constant.is(m).should.be.false;
            Constant.is(i).should.be.false;
            Constant.is(f).should.be.false;
            Constant.is(n).should.be.false;
            Constant.is(s).should.be.false;
            Constant.is(b).should.be.false;
        });
    });

    describe('Constant monad object tests', function _testConstantMonadObject() {
        it('should return the underlying value when the mjoin function property is called', function _testConstantMonadMjoin() {
            var c1 = Constant(10),
                c2 = Constant(null),
                c3 = Constant(Constant(1));

            c1.mjoin().should.eql(Constant(10));
            expect(c2.mjoin()).to.eql(Constant(null));
            c3.mjoin().should.eql(Constant(1));
        });

        it('should apply a mutating function to the underlying value and return the new value unwrapped in an Constant when chain is called', function _testConstantMonadChain() {
            var c1 = Constant(10),
                c2 = Constant(Constant({ a: 1, b: 2 })),
                c3 = Constant(25);

            c1.chain(function _flatMap(val) {
                return Constant.of(5 * val);
            }).value.should.eql(10);

            c2.chain(function _flatMap(ma) {
                return ma.map(function _innerMap(val) {
                    return val.a + val.b;
                });
            }).value.should.eql(Constant({ a: 1, b: 2 }));

            c3.chain(function _flatMap(val) {
                return val + 2;
            }).value.should.eql(25);
        });

        it('should return the applied monad type after mapping the constant monad\'s underlying value', function _testConstantMonadApply() {
            var i = Constant(function _iconstantyMap(val) {
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

        it('should return underlying value when constant_functor#fold is invoked', function _testConstantDotFold() {
            Constant(10).fold(x => x * 15).should.eql(150);
        });

        it('should return a constant<T> and ignore the point when #sequence is invoked', function _testConstantDotSequence() {
            Constant(10).sequence(monads.Identity).toString().should.eql('Constant(10)');
        });

        it('should return a constant<T> and ignore the params when #traverse is invoked', function _testConstantDotTraverse() {
            Constant(1).traverse(monads.Identity).toString().should.eql('Constant(1)');
        });

        it('should have a .constructor property that points to the factory function', function _testConstantMonadIsStupidViaFantasyLandSpecCompliance() {
            Constant(null).constructor.should.eql(Constant);
        });
    });

    describe('Constant laws test', function _testConstantMonadLaws() {
        /*it('should obey the identity law', function _testConstantMonadIdentityLaw() {
            var v = Constant(2);

            Constant(Constant).ap(v).value.should.eql(v.mjoin());
        });*/

        it('should have a proper algebraic properties apply', function _testConstantMonadAlgebraicProperties() {
            function _i(val) { return  val + 2; }
            var x = 2;
            var t = f => f(Constant);

            //Composition
            Constant(identity).apply(Constant(identity).apply(Constant(2))).value.should.eql(Constant(identity).apply(Constant(identity)).apply(Constant(x)).value);

            //Identity
            Constant(identity).apply(Constant(identity)).value.should.eql(identity);

            Constant.of(x).map(identity).value.should.eql(Constant.of(identity).apply(Constant.of(x)).value);

            //Interchange
            var u = Constant(t);
            Constant.of(t).apply(u).value.should.eql(u.apply(Constant.of(t)).value);

            var m = Constant(identity),
                g = Constant(11);

            function f(val) {
                return Constant(val);
            }

            function h(val) {
                return monads.Identity(val + 7);
            }

            //Associativity
            m.chain(f).chain(h).value.should.eql(m.chain(x => f(x).chain(h)).value);

            function test(val) {
                return monads.Maybe(5 + val);
            }

            var wq = Constant(10);
            var bpb = Constant(monads.Maybe(10));

            function test2(val) {
                return monads.Maybe(val.value + 5);
            }


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