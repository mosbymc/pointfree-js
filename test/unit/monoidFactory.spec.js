import { monoidFactory } from '../../src/groups/monoidFactory';
import { pipe } from '../../src/combinators';

describe('monoidFactory tests', function _testMonoidFactory() {
    describe('mathematical monoids', function _testMathematicalMonoids() {
        it('should return proper values with addition', function _testAdditionBasedConcatenation() {
            var sumMonoid = monoidFactory(function _sum(y) {
                return sumMonoid(this.value + y.value);
            }, 'Sum');

            var sum1 = sumMonoid(10),
                sum2 = sumMonoid(0),
                sum3 = sumMonoid(5),
                sum4 = sumMonoid.empty(),
                sum5 = sum1.constructor(15),
                sum6 = sum5.constructor.empty();

            var sum1ConcatSum2 = sum1.concat(sum2),
                sum1ConcatSum3 = sum1.concat(sum3),
                sum1ConcatSum4 = sum1.concat(sum4),
                sum1ConcatSum5 = sum1.concat(sum5),
                sum1ConcatSum6 = sum1.concat(sum6);

            sum1ConcatSum2.value.should.eql(10);
            sum1ConcatSum2.toString().should.eql('Sum(10)');
            sum1ConcatSum3.value.should.eql(15);
            sum1ConcatSum3.toString().should.eql('Sum(15)');
            sum1ConcatSum4.value.should.eql(sum1ConcatSum2.value);
            sum1ConcatSum4.toString().should.eql(sum1ConcatSum2.toString());
            sum1ConcatSum5.value.should.eql(25);
            sum1ConcatSum5.toString().should.eql('Sum(25)');
            sum1ConcatSum6.value.should.eql(sum1ConcatSum2.value);
            sum1ConcatSum6.toString().should.eql(sum1ConcatSum2.toString());

            var sum2ConcatSum3 = sum2.concat(sum3),
                sum2ConcatSum4 = sum2.concat(sum4),
                sum2ConcatSum5 = sum2.concat(sum5),
                sum2ConcatSum6 = sum2.concat(sum6);

            sum2ConcatSum3.value.should.eql(5);
            sum2ConcatSum3.toString().should.eql('Sum(5)');
            sum2ConcatSum4.value.should.eql(0);
            sum2ConcatSum4.toString().should.eql('Sum(0)');
            sum2ConcatSum5.value.should.eql(15);
            sum2ConcatSum5.toString().should.eql('Sum(15)');
            sum2ConcatSum6.value.should.eql(0);
            sum2ConcatSum6.toString().should.eql('Sum(0)');

            var sum3ConcatSum4 = sum3.concat(sum4),
                sum3ConcatSum5 = sum3.concat(sum5),
                sum3ConcatSum6 = sum3.concat(sum6);

            sum3ConcatSum4.value.should.eql(5);
            sum3ConcatSum4.toString().should.eql('Sum(5)');
            sum3ConcatSum5.value.should.eql(20);
            sum3ConcatSum5.toString().should.eql('Sum(20)');
            sum3ConcatSum6.value.should.eql(5);
            sum3ConcatSum6.toString().should.eql('Sum(5)');

            var sum4ConcatSum5 = sum4.concat(sum5),
                sum4ConcatSum6 = sum4.concat(sum6);

            sum4ConcatSum5.value.should.eql(15);
            sum4ConcatSum5.toString().should.eql('Sum(15)');
            expect(sum4ConcatSum6.value).to.be.undefined;
            sum4ConcatSum6.toString().should.eql('Sum(empty)');

            var sum5ConcatSum6 = sum5.concat(sum6);

            sum5ConcatSum6.value.should.eql(15);
            sum5ConcatSum6.toString().should.eql('Sum(15)');

            sum1.concat(sum2).concat(sum3).concat(sum4).concat(sum5).concat(sum6)
                .should.eql(sum1.concat(sum2.concat(sum3.concat(sum4.concat(sum5.concat(sum6))))));
        });

        it('should return proper values with subtraction', function _testSubtractionBasedConcatenation() {
            var subMonoid = monoidFactory(function _sum(y) {
                return subMonoid(this.value - y.value);
            }, 'Sub');

            var sub1 = subMonoid(10),
                sub2 = subMonoid(0),
                sub3 = subMonoid(5),
                sub4 = subMonoid.empty(),
                sub5 = sub1.constructor(15),
                sub6 = sub5.constructor.empty();

            var sub1ConcatSub2 = sub1.concat(sub2),
                sub1ConcatSub3 = sub1.concat(sub3),
                sub1ConcatSub4 = sub1.concat(sub4),
                sub1ConcatSub5 = sub1.concat(sub5),
                sub1ConcatSub6 = sub1.concat(sub6);

            sub1ConcatSub2.value.should.eql(10);
            sub1ConcatSub2.toString().should.eql('Sub(10)');
            sub1ConcatSub3.value.should.eql(5);
            sub1ConcatSub3.toString().should.eql('Sub(5)');
            sub1ConcatSub4.value.should.eql(sub1ConcatSub2.value);
            sub1ConcatSub4.toString().should.eql(sub1ConcatSub2.toString());
            sub1ConcatSub5.value.should.eql(-5);
            sub1ConcatSub5.toString().should.eql('Sub(-5)');
            sub1ConcatSub6.value.should.eql(sub1ConcatSub2.value);
            sub1ConcatSub6.toString().should.eql(sub1ConcatSub2.toString());

            var sub2ConcatSub3 = sub2.concat(sub3),
                sub2ConcatSub4 = sub2.concat(sub4),
                sub2ConcatSub5 = sub2.concat(sub5),
                sub2ConcatSub6 = sub2.concat(sub6);

            sub2ConcatSub3.value.should.eql(-5);
            sub2ConcatSub3.toString().should.eql('Sub(-5)');
            sub2ConcatSub4.value.should.eql(0);
            sub2ConcatSub4.toString().should.eql('Sub(0)');
            sub2ConcatSub5.value.should.eql(-15);
            sub2ConcatSub5.toString().should.eql('Sub(-15)');
            sub2ConcatSub6.value.should.eql(0);
            sub2ConcatSub6.toString().should.eql('Sub(0)');

            var sub3ConcatSub4 = sub3.concat(sub4),
                sub3ConcatSub5 = sub3.concat(sub5),
                sub3ConcatSub6 = sub3.concat(sub6);

            sub3ConcatSub4.value.should.eql(5);
            sub3ConcatSub4.toString().should.eql('Sub(5)');
            sub3ConcatSub5.value.should.eql(-10);
            sub3ConcatSub5.toString().should.eql('Sub(-10)');
            sub3ConcatSub6.value.should.eql(5);
            sub3ConcatSub6.toString().should.eql('Sub(5)');

            var sub4ConcatSub5 = sub4.concat(sub5),
                sub4ConcatSub6 = sub4.concat(sub6);

            sub4ConcatSub5.value.should.eql(15);
            sub4ConcatSub5.toString().should.eql('Sub(15)');
            expect(sub4ConcatSub6.value).to.be.undefined;
            sub4ConcatSub6.toString().should.eql('Sub(empty)');

            var sub5ConcatSub6 = sub5.concat(sub6);

            sub5ConcatSub6.value.should.eql(15);
            sub5ConcatSub6.toString().should.eql('Sub(15)');

            sub1.concat(sub2).concat(sub3).concat(sub4).concat(sub5).concat(sub6)
                .should.eql(sub1.concat(sub2.concat(sub3.concat(sub4.concat(sub5.concat(sub6))))));
        });

        it('should return proper values with multiplication', function _testMultiplicationBasedConcatenation() {
            var multMonoid = monoidFactory(function _sum(y) {
                return multMonoid(this.value * y.value);
            }, 'Multiplication');

            var mult1 = multMonoid(10),
                mult2 = multMonoid(0),
                mult3 = multMonoid(-5),
                mult4 = multMonoid.empty(),
                mult5 = mult1.constructor(15),
                mult6 = mult5.constructor.empty();

            var mult1ConcatMult2 = mult1.concat(mult2),
                mult1ConcatMult3 = mult1.concat(mult3),
                mult1ConcatMult4 = mult1.concat(mult4),
                mult1ConcatMult5 = mult1.concat(mult5),
                mult1ConcatMult6 = mult1.concat(mult6);

            mult1ConcatMult2.value.should.eql(0);
            mult1ConcatMult2.toString().should.eql('Multiplication(0)');
            mult1ConcatMult3.value.should.eql(-50);
            mult1ConcatMult3.toString().should.eql('Multiplication(-50)');
            mult1ConcatMult4.value.should.eql(10);
            mult1ConcatMult4.toString().should.eql('Multiplication(10)');
            mult1ConcatMult5.value.should.eql(150);
            mult1ConcatMult5.toString().should.eql('Multiplication(150)');
            mult1ConcatMult6.value.should.eql(mult1ConcatMult4.value);
            mult1ConcatMult6.toString().should.eql(mult1ConcatMult4.toString());

            var mult2ConcatMult3 = mult2.concat(mult3),
                mult2ConcatMult4 = mult2.concat(mult4),
                mult2ConcatMult5 = mult2.concat(mult5),
                mult2ConcatMult6 = mult2.concat(mult6);

            mult2ConcatMult3.value.should.eql(-0);
            mult2ConcatMult3.toString().should.eql('Multiplication(-0)');
            mult2ConcatMult4.value.should.eql(-mult2ConcatMult3.value);
            mult2ConcatMult4.toString().should.eql('Multiplication(0)');
            mult2ConcatMult5.value.should.eql(mult2ConcatMult4.value);
            mult2ConcatMult5.toString().should.eql(mult2ConcatMult4.toString());
            mult2ConcatMult6.value.should.eql(mult2ConcatMult4.value);
            mult2ConcatMult6.toString().should.eql(mult2ConcatMult4.toString());

            var mult3ConcatMult4 = mult3.concat(mult4),
                mult3ConcatMult5 = mult3.concat(mult5),
                mult3ConcatMult6 = mult3.concat(mult6);

            mult3ConcatMult4.value.should.eql(-5);
            mult3ConcatMult4.toString().should.eql('Multiplication(-5)');
            mult3ConcatMult5.value.should.eql(-75);
            mult3ConcatMult5.toString().should.eql('Multiplication(-75)');
            mult3ConcatMult6.value.should.eql(mult3ConcatMult4.value);
            mult3ConcatMult6.toString().should.eql(mult3ConcatMult4.toString());

            var mult4ConcatMult5 = mult4.concat(mult5),
                mult4ConcatMult6 = mult4.concat(mult6);

            mult4ConcatMult5.value.should.eql(15);
            mult4ConcatMult5.toString().should.eql('Multiplication(15)');
            expect(mult4ConcatMult6.value).to.be.undefined;
            mult4ConcatMult6.toString().should.eql('Multiplication(empty)');

            var mult5ConcatMult6 = mult5.concat(mult6);

            mult5ConcatMult6.value.should.eql(15);
            mult5ConcatMult6.toString().should.eql('Multiplication(15)');

            mult1.concat(mult2).concat(mult3).concat(mult4).concat(mult5).concat(mult6)
                .should.eql(mult1.concat(mult2.concat(mult3.concat(mult4.concat(mult5.concat(mult6))))));
        });

        it('should return proper values with division', function _testDivisionBasedConcatenation() {
            var divisionMonoid = monoidFactory(function _sum(y) {
                return divisionMonoid(this.value / y.value);
            }, 'Division');

            var div1 = divisionMonoid(10),
                div2 = divisionMonoid(0),
                div3 = divisionMonoid(-5),
                div4 = divisionMonoid.empty(),
                div5 = div1.constructor(15),
                div6 = div5.constructor.empty();

            var div1ConcatDiv2 = div1.concat(div2),
                div1ConcatDiv3 = div1.concat(div3),
                div1ConcatDiv4 = div1.concat(div4),
                div1ConcatDiv5 = div1.concat(div5),
                div1ConcatDiv6 = div1.concat(div6);

            div1ConcatDiv2.value.should.eql(Infinity);
            div1ConcatDiv2.toString().should.eql('Division(Infinity)');
            div1ConcatDiv3.value.should.eql(-2);
            div1ConcatDiv3.toString().should.eql('Division(-2)');
            div1ConcatDiv4.value.should.eql(10);
            div1ConcatDiv4.toString().should.eql('Division(10)');
            div1ConcatDiv5.value.should.eql(0.6666666666666666);
            div1ConcatDiv5.toString().should.eql('Division(0.6666666666666666)');
            div1ConcatDiv6.value.should.eql(div1ConcatDiv4.value);
            div1ConcatDiv6.toString().should.eql(div1ConcatDiv4.toString());

            var div2ConcatDiv3 = div2.concat(div3),
                div2ConcatDiv4 = div2.concat(div4),
                div2ConcatDiv5 = div2.concat(div5),
                div2concatDiv6 = div2.concat(div6);

            div2ConcatDiv3.value.should.eql(-0);
            div2ConcatDiv3.toString().should.eql('Division(-0)');
            div2ConcatDiv4.value.should.eql(-div2ConcatDiv3.value);
            div2ConcatDiv4.toString().should.eql('Division(0)');
            div2ConcatDiv5.value.should.eql(div2ConcatDiv4.value);
            div2ConcatDiv5.toString().should.eql(div2ConcatDiv4.toString());
            div2concatDiv6.value.should.eql(div2ConcatDiv4.value);
            div2concatDiv6.toString().should.eql(div2ConcatDiv4.toString());

            var div3ConcatDiv4 = div3.concat(div4),
                div3ConcatDiv5 = div3.concat(div5),
                div3ConcatDic6 = div3.concat(div6);

            div3ConcatDiv4.value.should.eql(-5);
            div3ConcatDiv4.toString().should.eql('Division(-5)');
            div3ConcatDiv5.value.should.eql(-0.3333333333333333);
            div3ConcatDiv5.toString().should.eql('Division(-0.3333333333333333)');
            div3ConcatDic6.value.should.eql(div3ConcatDiv4.value);
            div3ConcatDic6.toString().should.eql(div3ConcatDiv4.toString());

            var div4ConcatDiv5 = div4.concat(div5),
                div4ConcatDiv6 = div4.concat(div6);

            div4ConcatDiv5.value.should.eql(15);
            div4ConcatDiv5.toString().should.eql('Division(15)');
            expect(div4ConcatDiv6.value).to.be.undefined;
            div4ConcatDiv6.toString().should.eql('Division(empty)');

            var div5ConcatDiv6 = div5.concat(div6);

            div5ConcatDiv6.value.should.eql(15);
            div5ConcatDiv6.toString().should.eql('Division(15)');

            div1.concat(div2).concat(div3).concat(div4).concat(div5).concat(div6)
                .should.eql(div1.concat(div2.concat(div3.concat(div4.concat(div5.concat(div6))))));
        });

        it('should return proper values with exponentiation', function _testExponentiationBasedConcatenation() {
            var expoMonoid = monoidFactory(function _sum(y) {
                return expoMonoid(Math.pow(this.value, y.value));
            }, 'Exponentiation');

            var expo1 = expoMonoid(10),
                expo2 = expoMonoid(0),
                expo3 = expoMonoid(-5),
                expo4 = expoMonoid.empty(),
                expo5 = expo1.constructor(15),
                expo6 = expo5.constructor.empty();

            var expo1ConcatExpo2 = expo1.concat(expo2),
                expo1ConcatExpo3 = expo1.concat(expo3),
                expo1ConcatExpo4 = expo1.concat(expo4),
                expo1ConcatExpo5 = expo1.concat(expo5),
                expo1ConcatExpo6 = expo1.concat(expo6);

            expo1ConcatExpo2.value.should.eql(1);
            expo1ConcatExpo2.toString().should.eql('Exponentiation(1)');
            expo1ConcatExpo3.value.should.eql(0.00001);
            expo1ConcatExpo3.toString().should.eql('Exponentiation(0.00001)');
            expo1ConcatExpo4.value.should.eql(10);
            expo1ConcatExpo4.toString().should.eql('Exponentiation(10)');
            expo1ConcatExpo5.value.should.eql(1000000000000000);
            expo1ConcatExpo5.toString().should.eql('Exponentiation(1000000000000000)');
            expo1ConcatExpo6.value.should.eql(expo1ConcatExpo4.value);
            expo1ConcatExpo6.toString().should.eql(expo1ConcatExpo4.toString());

            var expo2ConcatExpo3 = expo2.concat(expo3),
                expo2ConcatExpo4 = expo2.concat(expo4),
                expo2ConcatExpo5 = expo2.concat(expo5),
                expo2ConcatExpo6 = expo2.concat(expo6);

            expo2ConcatExpo3.value.should.eql(Infinity);
            expo2ConcatExpo3.toString().should.eql('Exponentiation(Infinity)');
            expo2ConcatExpo4.value.should.eql(0);
            expo2ConcatExpo4.toString().should.eql('Exponentiation(0)');
            expo2ConcatExpo5.value.should.eql(expo2ConcatExpo4.value);
            expo2ConcatExpo5.toString().should.eql(expo2ConcatExpo4.toString());
            expo2ConcatExpo6.value.should.eql(expo2ConcatExpo4.value);
            expo2ConcatExpo6.toString().should.eql(expo2ConcatExpo4.toString());

            var expo3ConcatExpo4 = expo3.concat(expo4),
                expo3ConcatExpo5 = expo3.concat(expo5),
                expo3ConcatExpo6 = expo3.concat(expo6);

            expo3ConcatExpo4.value.should.eql(-5);
            expo3ConcatExpo4.toString().should.eql('Exponentiation(-5)');
            expo3ConcatExpo5.value.should.eql(-30517578125);
            expo3ConcatExpo5.toString().should.eql('Exponentiation(-30517578125)');
            expo3ConcatExpo6.value.should.eql(expo3ConcatExpo4.value);
            expo3ConcatExpo6.toString().should.eql(expo3ConcatExpo4.toString());

            var expo4ConcatExpo5 = expo4.concat(expo5),
                expo4ConcatExpo6 = expo4.concat(expo6);

            expo4ConcatExpo5.value.should.eql(15);
            expo4ConcatExpo5.toString().should.eql('Exponentiation(15)');
            expect(expo4ConcatExpo6.value).to.be.undefined;
            expo4ConcatExpo6.toString().should.eql('Exponentiation(empty)');

            var expo5ConcatExpo6 = expo5.concat(expo6);

            expo5ConcatExpo6.value.should.eql(15);
            expo5ConcatExpo6.toString().should.eql('Exponentiation(15)');

            expo1.concat(expo2).concat(expo3).concat(expo4).concat(expo5).concat(expo6)
                .should.eql(expo1.concat(expo2.concat(expo3.concat(expo4.concat(expo5.concat(expo6))))));
        });

        it('should return proper values with modulation', function _testModulationBasedConcatenation() {
            var modMonoid = monoidFactory(function _sum(y) {
                return modMonoid(this.value % y.value);
            }, 'Modulus');

            var mod1 = modMonoid(10),
                mod2 = modMonoid(0),
                mod3 = modMonoid(-5),
                mod4 = modMonoid.empty(),
                mod5 = mod1.constructor(15),
                mod6 = mod5.constructor.empty();

            var mod1ConcatMod2 = mod1.concat(mod2),
                mod1ConcatMod3 = mod1.concat(mod3),
                mod1ConcatMod4 = mod1.concat(mod4),
                mod1ConcatMod5 = mod1.concat(mod5),
                mod1ConcatMod6 = mod1.concat(mod6);

            mod1ConcatMod2.value.should.eql(Number.NaN);
            mod1ConcatMod2.toString().should.eql('Modulus(NaN)');
            mod1ConcatMod3.value.should.eql(0);
            mod1ConcatMod3.toString().should.eql('Modulus(0)');
            mod1ConcatMod4.value.should.eql(10);
            mod1ConcatMod4.toString().should.eql('Modulus(10)');
            mod1ConcatMod5.value.should.eql(mod1ConcatMod4.value);
            mod1ConcatMod5.toString().should.eql(mod1ConcatMod4.toString());
            mod1ConcatMod6.value.should.eql(mod1ConcatMod4.value);
            mod1ConcatMod6.toString().should.eql(mod1ConcatMod4.toString());

            var mod2ConcatMod3 = mod2.concat(mod3),
                mod2ConcatMod4 = mod2.concat(mod4),
                mod2ConcatMod5 = mod2.concat(mod5),
                mod2ConcatMod6 = mod2.concat(mod6);

            mod2ConcatMod3.value.should.eql(0);
            mod2ConcatMod3.toString().should.eql('Modulus(0)');
            mod2ConcatMod4.value.should.eql(mod2ConcatMod3.value);
            mod2ConcatMod4.toString().should.eql(mod2ConcatMod3.toString());
            mod2ConcatMod5.value.should.eql(mod2ConcatMod4.value);
            mod2ConcatMod5.toString().should.eql(mod2ConcatMod4.toString());
            mod2ConcatMod6.value.should.eql(mod2ConcatMod4.value);
            mod2ConcatMod6.toString().should.eql(mod2ConcatMod4.toString());

            var mod3ConcatMod4 = mod3.concat(mod4),
                mod3ConcatMod5 = mod3.concat(mod5),
                mod3ConcatMod6 = mod3.concat(mod6);

            mod3ConcatMod4.value.should.eql(-5);
            mod3ConcatMod4.toString().should.eql('Modulus(-5)');
            mod3ConcatMod5.value.should.eql(mod3ConcatMod4.value);
            mod3ConcatMod5.toString().should.eql(mod3ConcatMod4.toString());
            mod3ConcatMod6.value.should.eql(mod3ConcatMod4.value);
            mod3ConcatMod6.toString().should.eql(mod3ConcatMod4.toString());

            var mod4ConcatMod5 = mod4.concat(mod5),
                mod4ConcatMod6 = mod4.concat(mod6);

            mod4ConcatMod5.value.should.eql(15);
            mod4ConcatMod5.toString().should.eql('Modulus(15)');
            expect(mod4ConcatMod6.value).to.be.undefined;
            mod4ConcatMod6.toString().should.eql('Modulus(empty)');

            var Mod5ConcatMod6 = mod5.concat(mod6);

            Mod5ConcatMod6.value.should.eql(15);
            Mod5ConcatMod6.toString().should.eql('Modulus(15)');

            mod1.concat(mod2).concat(mod3).concat(mod4).concat(mod5).concat(mod6)
                .should.eql(mod1.concat(mod2.concat(mod3.concat(mod4.concat(mod5.concat(mod6))))));
        });
    });

    describe('boolean monoid', function _testBooleanMonoid() {
        it('should return proper value with OR', function _testOrBooleanMonoid() {
            var orMonoid = monoidFactory(function _strMonoid(boolean) {
                return orMonoid(this.value || boolean.value);
            }, 'Or');

            var or1 = orMonoid(true),
                or2 = orMonoid(false),
                or3 = or1.constructor.empty(),
                or4 = orMonoid.empty();

            var or1ConcatOr2 = or1.concat(or2),
                or1ConcatOr3 = or1.concat(or3),
                or1ConcatOr4 = or1.concat(or4);

            or1ConcatOr2.value.should.eql(true);
            or1ConcatOr2.toString().should.eql('Or(true)');
            or1ConcatOr3.value.should.eql(or1ConcatOr2.value);
            or1ConcatOr3.toString().should.eql(or1ConcatOr2.toString());
            or1ConcatOr4.value.should.eql(or1ConcatOr2.value);
            or1ConcatOr4.toString().should.eql(or1ConcatOr2.toString());

            var or2ConcatOr3 = or2.concat(or3),
                or2ConcatOr4 = or2.concat(or4),
                or2ConcatOr1 = or2.concat(or1);

            or2ConcatOr3.value.should.eql(false);
            or2ConcatOr3.toString().should.eql('Or(false)');
            or2ConcatOr4.value.should.eql(or2ConcatOr3.value);
            or2ConcatOr4.toString().should.eql(or2ConcatOr3.toString());
            or2ConcatOr1.value.should.eql(true);
            or2ConcatOr1.toString().should.eql('Or(true)');

            var or3ConcatOr4 = or3.concat(or4);

            expect(or3ConcatOr4.value).to.eql();
            or3ConcatOr4.toString().should.eql('Or(empty)');

            or1.concat(or2).concat(or3).concat(or4).should.eql(or1.concat(or2.concat(or3.concat(or4))));
        });

        it('should return proper value with AND', function _testAndBooleanMonoid() {
            var andMonoid = monoidFactory(function _strMonoid(boolean) {
                return andMonoid(this.value && boolean.value);
            }, 'And');

            var and1 = andMonoid(true),
                and2 = andMonoid(false),
                and3 = and1.constructor.empty(),
                and4 = andMonoid.empty();

            var and1ConcatAnd2 = and1.concat(and2),
                and1ConcatAnd3 = and1.concat(and3),
                and1ConcatAnd4 = and1.concat(and4),
                and1ConcatAnd1 = and1.concat(and1);

            and1ConcatAnd2.value.should.eql(false);
            and1ConcatAnd2.toString().should.eql('And(false)');
            and1ConcatAnd3.value.should.eql(true);
            and1ConcatAnd3.toString().should.eql('And(true)');
            and1ConcatAnd4.value.should.eql(and1ConcatAnd3.value);
            and1ConcatAnd4.toString().should.eql(and1ConcatAnd3.toString());
            and1ConcatAnd1.value.should.eql(and1ConcatAnd3.value);
            and1ConcatAnd1.toString().should.eql(and1ConcatAnd3.toString());

            var and2ConcatAnd3 = and2.concat(and3),
                and2ConcatAnd4 = and2.concat(and4);

            and2ConcatAnd3.value.should.eql(false);
            and2ConcatAnd3.toString().should.eql('And(false)');
            and2ConcatAnd4.value.should.eql(and2ConcatAnd3.value);
            and2ConcatAnd4.toString().should.eql(and2ConcatAnd3.toString());

            var and3ConcatAnd4 = and3.concat(and4);

            expect(and3ConcatAnd4.value).to.eql();
            and3ConcatAnd4.toString().should.eql('And(empty)');

            and1.concat(and2).concat(and3).concat(and4).should.eql(and1.concat(and2.concat(and3.concat(and4))));
        });

        /*it('should return proper value with XOR', function _testXorBooleanMonoid() {
            var xorMonoid = monoidFactory(function _strMonoid(boolean) {
                return xorMonoid(this.value ^ boolean.value);
            }, 'Xor');

            var xor1 = xorMonoid(true),
                xor2 = xorMonoid(false),
                xor3 = xor1.constructor.empty(),
                xor4 = xorMonoid.empty();

            var xor1ConcatXor2 = xor1.concat(xor2),
                xor1ConcatXor3 = xor1.concat(xor3),
                xor1ConcatXor4 = xor1.concat(xor4),
                xor1ConcatXor1 = xor1.concat(xor1);

            xor1ConcatXor2.value.should.eql(false);
            xor1ConcatXor2.toString().should.eql('And(false)');
            xor1ConcatXor3.value.should.eql(true);
            xor1ConcatXor3.toString().should.eql('And(true)');
            xor1ConcatXor4.value.should.eql(xor1ConcatXor3.value);
            xor1ConcatXor4.toString().should.eql(xor1ConcatXor3.toString());
            xor1ConcatXor1.value.should.eql(xor1ConcatXor3.value);
            xor1ConcatXor1.toString().should.eql(xor1ConcatXor3.toString());

            var xor2ConcatXor3 = xor2.concat(xor3),
                xor2ConcatXor4 = xor2.concat(xor4),
                xor2ConcatXor2 = xor2.concat(xor2);

            xor2ConcatXor3.value.should.eql(false);
            xor2ConcatXor3.toString().should.eql('And(false)');
            xor2ConcatXor4.value.should.eql(xor2ConcatXor3.value);
            xor2ConcatXor4.toString().should.eql(xor2ConcatXor3.toString());

            var xor3ConcatXor4 = xor3.concat(xor4);

            expect(xor3ConcatXor4.value).to.eql();
            xor3ConcatXor4.toString().should.eql('And(empty)');
        });*/
    });

    describe('function monoid', function _testFunctionMonoid() {
        it('should compose the functions', function _testComposableFunctionMonoid() {
            function func1(val) { return 5 * val; }
            function func2(val) { return 10 - val; }
            function func3(val) { return 3 / val; }
            function func4(val) { return 15 + val; }

            var functionMonoid = monoidFactory(function _functionMonoid(f) {
                return functionMonoid(pipe(this.value, f.value));
            }, 'Function');

            var f1 = functionMonoid(func1),
                f2 = functionMonoid(func2),
                f3 = functionMonoid(func3),
                f4 = functionMonoid(func4),
                f5 = f1.constructor.empty(),
                f6 = functionMonoid.empty();

            var f1ConcatF2 = f1.concat(f2),
                f1ConcatF3 = f1.concat(f3),
                f1ConcatF4 = f1.concat(f4),
                f1ConcatF5 = f1.concat(f5),
                f1ConcatF6 = f1.concat(f6);

            f1ConcatF2.value(1).should.eql(5);
            f1ConcatF3.value(1).should.eql(0.6);
            f1ConcatF4.value(1).should.eql(20);
            f1ConcatF5.value(1).should.eql(5);
            f1ConcatF6.value(1).should.eql(5);

            var f2ConcatF3 = f2.concat(f3),
                f2ConcatF4 = f2.concat(f4),
                f2ConcatF5 = f2.concat(f5),
                f2ConcatF6 = f2.concat(f6);

            f2ConcatF3.value(1).should.eql(0.3333333333333333);
            f2ConcatF4.value(1).should.eql(24);
            f2ConcatF5.value(1).should.eql(9);
            f2ConcatF6.value(1).should.eql(9);

            var f3ConcatF4 = f3.concat(f4),
                f3ConcatF5 = f3.concat(f5),
                f3ConcatF6 = f3.concat(f6);

            f3ConcatF4.value(1).should.eql(18);
            f3ConcatF5.value(1).should.eql(3);
            f3ConcatF6.value(1).should.eql(3);

            var f4ConcatF5 = f4.concat(f5),
                f4ConcatF6 = f4.concat(f6);

            f4ConcatF5.value(1).should.eql(16);
            f4ConcatF6.value(1).should.eql(16);

            f1.concat(f2).concat(f3).concat(f4).concat(f5).concat(f6).value(1)
                .should.eql(f1.concat(f2.concat(f3.concat(f4.concat(f5.concat(f6))))).value(1));
        });
    });
});