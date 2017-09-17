import { monoidTypeFactory, stringMonoidFactory, additiveMonoidFactory, multiplicativeMonoidFactory, andMonoidFactory, orMonoidFactory } from '../../../src/dataStructures/monoids';

describe('Test monoids', function _testMonoids() {
    describe('Test string monoid factory', function _testStringMonoidFactory() {
        it('should create a string monoid', function _testNewStringMonoidCreation() {
            var sm1 = stringMonoidFactory(''),
                sm2 = stringMonoidFactory('Hello!'),
                sm3 = stringMonoidFactory(' My name is Mark.'),
                sm4 = stringMonoidFactory.empty;

            sm1.value.should.eql(sm4.value);
            sm1.isEmpty.should.be.true;
            sm4.isEmpty.should.be.true;
            sm2.isEmpty.should.be.false;
            sm3.isEmpty.should.be.false;

            sm2.concat(sm3).value.should.eql('Hello! My name is Mark.');
            sm1.concat(sm1).value.should.eql(sm1.value);
            sm2.concat(sm1).value.should.eql(sm2.value);
            sm3.concat(sm4).value.should.eql(sm3.value);
        });
    });

    describe('Test additive monoid', function _testAdditiveMonoid() {
        it('should create an additive monoid', function _testNewAdditiveMonoidCreation() {
            var am1 = additiveMonoidFactory(0),
                am2 = additiveMonoidFactory(5),
                am3 = additiveMonoidFactory(7),
                am4 = additiveMonoidFactory.empty;

            am1.value.should.eql(am4.value);
            am1.isEmpty.should.be.true;
            am2.isEmpty.should.be.false;
            am3.isEmpty.should.be.false;
            am4.isEmpty.should.be.true;

            am2.concat(am3).value.should.eql(12);
            am1.concat(am1).value.should.eql(am1.value);
            am2.concat(am1).value.should.eql(am2.value);
            am3.concat(am4).value.should.eql(am3.value);
        });
    });

    describe('Test multiplicative monoid', function _testMultiplicativeMonoid() {
        it('should create a multiplicative monoid', function _testNewMultiplicativeMonoidCreation() {
            var mm1 = multiplicativeMonoidFactory(1),
                mm2 = multiplicativeMonoidFactory(5),
                mm3 = multiplicativeMonoidFactory(7),
                mm4 = multiplicativeMonoidFactory.empty;

            mm1.value.should.eql(mm4.value);
            mm1.isEmpty.should.be.true;
            mm2.isEmpty.should.be.false;
            mm3.isEmpty.should.be.false;
            mm4.isEmpty.should.be.true;

            mm2.concat(mm3).value.should.eql(35);
            mm1.concat(mm1).value.should.eql(mm4.value);
            mm2.concat(mm1).value.should.eql(mm2.value);
            mm3.concat(mm4).value.should.eql(mm3.value);
        });
    });
});