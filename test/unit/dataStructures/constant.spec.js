import * as monads from '../../../src/dataStructures/dataStructures';
import { constant } from '../../../src/dataStructures/constant';
import { identity } from '../../../src/combinators';

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

            constant.isPrototypeOf(c1).should.be.true;
            constant.isPrototypeOf(c2).should.be.true;
            constant.isPrototypeOf(c3).should.be.true;
            constant.isPrototypeOf(c4).should.be.true;
            constant.isPrototypeOf(c5).should.be.true;
            constant.isPrototypeOf(c6).should.be.true;
            constant.isPrototypeOf(c7).should.be.true;
            constant.isPrototypeOf(c8).should.be.true;

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

            constant.isPrototypeOf(c1).should.be.true;
            constant.isPrototypeOf(c2).should.be.true;
            constant.isPrototypeOf(c3).should.be.true;
            constant.isPrototypeOf(c4).should.be.true;
            constant.isPrototypeOf(c5).should.be.true;
            constant.isPrototypeOf(c6).should.be.true;
            constant.isPrototypeOf(c7).should.be.true;
            constant.isPrototypeOf(c8).should.be.true;

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
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var c = Constant(1),
                err1 = false,
                err2 = false;
            c.should.have.ownPropertyDescriptor('_value', { value: 1, writable: false, configurable: false, enumerable: false });

            try {
                c._value = 2;
            }
            catch(e) {
                err1 = true;
            }
            err1.should.be.true;

            try {
                c.value = 2;
            }
            catch(e) {
                err2 = true;
            }

            err2.should.be.true;
        });

        it('should return a new constant functor instance with the same underlying value when mapping', function _testConstantFunctorMap() {
            var c = Constant(1),
                d = c.map();

            c.value.should.eql(d.value);
            c.should.equal(d);
        });

        it('should return itself during a concat operation', function _testConcat() {
            Constant(1)
                .concat(Constant(2))
                .extract.should.eql(1);
        });

        it('should properly indicate equality when constant monads are indeed equal', function _testConstantFunctorEquality() {
            var m1 = Constant(null),
                m2 = Constant(null),
                m3 = Constant(1),
                m4 = Constant(1),
                m5 = Constant(2);

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

        it('should extract the underlying value of a constant', function _testConstantExtract() {
            Constant(10).extract.should.eql(10);
            Constant('10').extract.should.eql('10');
        });

        it('should transform a constant functor to the other functor types', function _testConstantFunctorTransforms() {
            var i = Constant(1);
            var c = i.mapToIdentity(),
                f = i.mapToFuture(),
                io = i.mapToIo(),
                l = i.mapToList(),
                left = i.mapToLeft(),
                m = i.mapToMaybe(),
                r = i.mapToRight();

            Object.getPrototypeOf(c).should.eql(Object.getPrototypeOf(monads.Identity()));
            Object.getPrototypeOf(f).should.eql(Object.getPrototypeOf(monads.Future()));
            Object.getPrototypeOf(io).should.eql(Object.getPrototypeOf(monads.Io()));
            Object.getPrototypeOf(l).should.eql(Object.getPrototypeOf(monads.List()));
            Object.getPrototypeOf(left).should.eql(Object.getPrototypeOf(monads.Left()));
            Object.getPrototypeOf(m).should.eql(Object.getPrototypeOf(monads.Just(1)));
            Object.getPrototypeOf(r).should.eql(Object.getPrototypeOf(monads.Right()));
        });

        it('should have a functioning iterator', function _testConstantFunctorIterator() {
            var c1 = Constant(10),
                c2 = Constant({ a: 1, b: 2 });

            var c1Res = [...c1],
                c2Res = [...c2];

            c1Res.should.eql([c1.value]);
            c2Res.should.eql([c2.value]);
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testConstantFunctorValueOf() {
            var c1 = Constant('Mark'),
                c2 = Constant(10);

            var str = 'Hello my name is: ' + c1,
                num1 = 15 * c2,
                num2 = 3 + c2,
                num3 = c2 - 6,
                num4 = c2 / 5;

            str.should.eql('Hello my name is: Mark');
            num1.should.eql(150);
            num2.should.eql(13);
            num3.should.eql(4);
            num4.should.eql(2);
        });

        it('should print the correct container type + value when .toString() is invoked', function testConstantFunctorToString() {
            var c1 = Constant(1),
                c2 = Constant(null),
                c3 = Constant([1, 2, 3]),
                c4 = Constant(Constant(Constant(5)));

            c1.toString().should.eql('Constant(1)');
            c2.toString().should.eql('Constant(null)');
            c3.toString().should.eql('Constant(1,2,3)');
            c4.toString().should.eql('Constant(Constant(Constant(5)))');
        });

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

        it('should ignore the function application and return a constant with the same underlying value', function _testConstantApply() {
            var c1 = Constant(10),
                c2 = Constant(x => x * x),
                res = c1.apply(c2);

            Object.getPrototypeOf(c1).isPrototypeOf(res).should.be.true;
            c1.extract.should.eql(res.extract);
        });

        it('should return underlying value when constant_functor#fold is invoked', function _testConstantFold() {
            Constant(10).fold(x => x * 15).should.eql(150);
        });

        it('should return a constant<T> and ignore the point when #sequence is invoked', function _testConstantSequence() {
            Constant(10).sequence(monads.Identity).toString().should.eql('Constant(10)');
        });

        it('should return a constant<T> and ignore the params when #traverse is invoked', function _testConstantTraverse() {
            Constant(1).traverse(monads.Identity).toString().should.eql('Constant(1)');
        });

        it('should have a .constructor property that points to the factory function', function _testConstantIsStupidViaFantasyLandSpecCompliance() {
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

            Constant.of(x).map(identity).value.should.eql(Constant.of(x).apply(Constant.of(identity)).value);

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