import * as monads from '../../../../src/dataStructures/monads/monads';
import { identity } from '../../../../src/dataStructures/monads/identity';

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

        it('all get/getOrElse functions should return the underlying value of an Identity', function _testGetOrElse() {
            function orElseFunc() { return 15; }
            var orElseVal = orElseFunc();

            var obj = { a: 1 },
                arr = [1, 2, 3];

            var nullI = Identity(null),
                undefinedI = Identity(),
                numberI = Identity(2),
                stringI = Identity('2'),
                objectI = Identity(obj),
                arrayI = Identity(arr);

            expect(nullI.get()).to.be.null;
            expect(nullI.getOrElse(orElseFunc)).to.be.null;
            expect(nullI.orElse(orElseVal)).to.be.null;

            expect(undefinedI.get()).to.be.undefined;
            expect(undefinedI.getOrElse(orElseFunc)).to.be.undefined;
            expect(undefinedI.orElse(orElseVal)).to.be.undefined;

            numberI.get().should.eql(2);
            numberI.getOrElse(orElseFunc).should.eql(2);
            numberI.orElse(orElseVal).should.eql(2);

            stringI.get().should.eql('2');
            stringI.getOrElse(orElseFunc).should.eql('2');
            stringI.orElse(orElseVal).should.eql('2');

            objectI.get().should.eql(obj);
            objectI.getOrElse(orElseFunc).should.eql(obj);
            objectI.orElse(orElseVal).should.eql(obj);

            arrayI.get().should.eql(arr);
            arrayI.getOrElse(orElseFunc).should.eql(arr);
            arrayI.orElse(orElseVal).should.eql(arr);
        });

        it('should return a new identity functor instance with the mapped value', function _testIdentityFunctorMap() {
            var i = Identity(1),
                d = i.map(function _t() { return 2; });

            i.value.should.not.eql(d.value);
            i.should.not.equal(d);
        });

        it('should properly indicate equality when constant monads are indeed equal', function _testIdentityFunctorEquality() {
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

        it('should return a new identity functor regardless of data type', function _testIdentityFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i = Identity();

            var i1 = i.of(),
                i2 = i.of(null),
                i3 = i.of(1),
                i4 = i.of(arr),
                i5 = i.of(obj),
                i6 = i.of(Symbol()),
                i7 = i.of('testing constant'),
                i8 = i.of(false);

            expect(undefined).to.eql(i1.value);
            expect(null).to.eql(i2.value);
            expect(1).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect(obj).to.eql(i5.value);
            expect('symbol').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect(false).to.eql(i8.value);
        });

        it('should map an identity functor to the other functor types', function _testIdentityFunctorMapTransform() {
            var i = Identity(1);
            var c = i.mapToConstant(),
                f = i.mapToFuture(),
                io = i.mapToIo(),
                l = i.mapToList(),
                left = i.mapToLeft(),
                m = i.mapToMaybe(),
                r = i.mapToRight();

            c.should.be.an('object');
            Object.getPrototypeOf(c).should.eql(Object.getPrototypeOf(monads.Constant()));

            f.should.be.an('object');
            Object.getPrototypeOf(f).should.eql(Object.getPrototypeOf(monads.Future()));

            io.should.be.an('object');
            Object.getPrototypeOf(io).should.eql(Object.getPrototypeOf(monads.Io()));

            l.should.be.an('object');
            Object.getPrototypeOf(l).should.eql(Object.getPrototypeOf(monads.List()));

            left.should.be.an('object');
            Object.getPrototypeOf(left).should.eql(Object.getPrototypeOf(monads.Left()));

            m.should.be.an('object');
            Object.getPrototypeOf(m).should.eql(Object.getPrototypeOf(monads.Maybe(1)));

            r.should.be.an('object');
            Object.getPrototypeOf(r).should.eql(Object.getPrototypeOf(monads.Right()));
        });

        it('should transform an identity functor to the other functor types', function _testIdentityFunctorTransform() {
            var i = Identity(1);

            var c = i.toConstant(),
                f = i.toFuture(),
                io = i.toIo(),
                l = i.toList(),
                left = i.toLeft(),
                m = i.toMaybe(),
                r = i.toRight();

            c.should.be.an('object');
            Object.getPrototypeOf(c).should.eql(Object.getPrototypeOf(monads.Constant()));

            f.should.be.an('object');
            Object.getPrototypeOf(f).should.eql(Object.getPrototypeOf(monads.Future()));

            io.should.be.an('object');
            Object.getPrototypeOf(io).should.eql(Object.getPrototypeOf(monads.Io()));

            l.should.be.an('object');
            Object.getPrototypeOf(l).should.eql(Object.getPrototypeOf(monads.List()));

            left.should.be.an('object');
            Object.getPrototypeOf(left).should.eql(Object.getPrototypeOf(monads.Left()));

            m.should.be.an('object');
            Object.getPrototypeOf(m).should.eql(Object.getPrototypeOf(monads.Maybe(1)));

            r.should.be.an('object');
            Object.getPrototypeOf(r).should.eql(Object.getPrototypeOf(monads.Right()));
        });

        it('should have a functioning iterator', function _testIdentityFunctorIterator() {
            var i1 = Identity(10),
                i2 = Identity({ a: 1, b: 2 });

            var i1Res = [...i1],
                i2Res = [...i2];

            i1Res.should.eql([i1.value]);
            i2Res.should.eql([i2.value]);
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testIdentityFunctorValueOf() {
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

        it('should print the correct container type + value when .toString() is invoked', function _testIdentityFunctorToString() {
            var c1 = Identity(1),
                c2 = Identity(null),
                c3 = Identity([1, 2, 3]),
                c4 = Identity(Identity(Identity(5)));

            c1.toString().should.eql('Identity(1)');
            c2.toString().should.eql('Identity(null)');
            c3.toString().should.eql('Identity(1,2,3)');
            c4.toString().should.eql('Identity(Identity(Identity(5)))');
        });

        it('should return the underlying value when the mjoin function property is called', function _testIdentityMonadMjoin() {
            var i1 = Identity(10),
                i2 = Identity(null),
                i3 = Identity(Identity(1));

            i1.mjoin().should.eql(Identity(10));
            expect(i2.mjoin()).to.eql(Identity(null));
            i3.mjoin().should.eql(Identity(1));
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

        it('should return underlying value when constant_functor#fold is invoked', function _testConstantDotFold() {
            Identity(10).fold((x, y) => x + y * 15, 0).should.eql(150);
        });

        it('should return a Just of an Identity of 10 when #sequence is invoked', function _testConstantDotSequence() {
            Identity(10).sequence(monads.Maybe).toString().should.eql('Just(Identity(10))');
        });

        it('should return a Just of an Identity of 3 when #traverse is invoked', function _testConstantDotTraverse() {
            function test(val) {
                return monads.Maybe(val + 2);
            }

            Identity(1).traverse(monads.Maybe, test).toString().should.eql('Just(Identity(3))');
        });

        it('should have a .factory property that points to the factory function', function _testIdentityFunctorIsStupidViaFantasyLandSpecCompliance() {
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
            i.empty.should.eql(i['fantasy-land/empty']);
            i.of.should.eql(i['fantasy-land/of']);
        });
    });

    describe('Identity laws test', function _testIdentityFunctorLaws() {
        /*it('should obey the identity law', function _testIdentityFunctorIdentityLaw() {
            var v = Identity(2);

            Identity(identity).ap(v).value.should.eql(v.mjoin());
        });*/

        it('should have a proper algebraic properties apply', function _testIdentityMonadAlgebraicProperties() {
            function _i(val) { return  val + 2; }
            var x = 2;
            var i = x => x;
            var t = f => f(i);

            //Composition
            Identity(i).apply(Identity(i).apply(Identity(2))).value.should.eql(Identity(i).apply(Identity(i)).apply(Identity(x)).value);

            //Identity
            Identity(i).apply(Identity(i)).value.should.eql(i);

            //Homomorphism
            Identity.of(_i).apply(Identity.of(x)).value.should.eql(Identity.of(_i(x)).value);

            Identity.of(x).map(i).value.should.eql(Identity.of(i).apply(Identity.of(x)).value);

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