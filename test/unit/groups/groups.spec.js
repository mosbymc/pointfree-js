import { sumGroup, subGroup, multGroup, divGroup } from '../../../src/groups/groups';

describe('Test Groups', function _testGroups() {
    describe('Test sumGroup', function _testSumGroup() {
        it('should return the proper sum of two numbers', function _testSumConcatOnValues() {
            var s1 = sumGroup(1),
                s2 = sumGroup(5),
                s3 = sumGroup(11),
                s4 = sumGroup(37);

            s1.concat(s2).value.should.eql(6);
            s1.concat(s3).value.should.eql(12);
            s1.concat(s4).value.should.eql(38);

            s2.concat(s3).value.should.eql(16);
            s2.concat(s4).value.should.eql(42);

            s3.concat(s4).value.should.eql(48);

            //Associativity
            s1.concat(s2).concat(s3).concat(s4).value.should.eql(s1.concat(s2.concat(s3).concat(s4)).value);
        });

        it('should allow concatenation via .valueOf function', function _testSameValueViaPlusOperator() {
            var s1 = sumGroup(1),
                s2 = sumGroup(5),
                s3 = sumGroup(11),
                s4 = sumGroup(37);

            (s1 + s2).should.eql(6);
            (s1 + s3).should.eql(12);
            (s1 + s4).should.eql(38);

            (s2 + s3).should.eql(16);
            (s2 + s4).should.eql(42);

            (s3 + s4).should.eql(48);

            //Associativity
            (s1 + s2 + s3 + s4).should.eql(s1 + (s2 + (s3 + (s4))));
        });

        it('should revert the last operation performed on a sum', function _testSumGroupRevert() {
            var s1 = sumGroup(1),
                s2 = sumGroup(5),
                s3 = sumGroup(11),
                s4 = sumGroup(37);

            var s12 = s1.concat(s2).undo(),
                s13 = s1.concat(s3).undo(),
                s14 = s1.concat(s4).undo();

            s12.value.should.eql(s1.value);
            s13.value.should.eql(s1.value);
            s14.value.should.eql(s1.value);

            var s23 = s2.concat(s3).undo(),
                s24 = s2.concat(s4).undo();

            s23.value.should.eql(s2.value);
            s24.value.should.eql(s2.value);

            var s34 = s3.concat(s4).undo();

            s34.value.should.eql(s3.value);

            var s121 = s1.concat(s2).undo().undo();
            s121.value.should.eql(s1.concat(s2).value);

            var s131 = s1.concat(s3).undo().undo();
            s131.value.should.eql(s1.concat(s3).value);

            var s141 = s1.concat(s4).undo().undo();
            s141.value.should.eql(s1.concat(s4).value);
        });

        it('should perform inverted concatenation', function _testSumGroupInvertedConcatenation() {
            var s1 = sumGroup(1),
                s2 = sumGroup(5),
                s3 = sumGroup(11),
                s4 = sumGroup(37);

            var s12 = s1.inverseConcat(s2),
                s13 = s1.inverseConcat(s3),
                s14 = s1.inverseConcat(s4);

            s12.value.should.eql(-4);
            s13.value.should.eql(-10);
            s14.value.should.eql(-36);

            s12.undo().value.should.eql(1);
            s13.undo().value.should.eql(1);
            s14.undo().value.should.eql(1);

            var s23 = s2.inverseConcat(s3),
                s24 = s2.inverseConcat(s4);

            s23.value.should.eql(-6);
            s24.value.should.eql(-32);

            s23.undo().value.should.eql(s2.value);
            s24.undo().value.should.eql(s2.value);

            var s34 = s3.inverseConcat(s4);

            s34.value.should.eql(-26);
            s34.undo().value.should.eql(s3.value);

            s4.undo().value.should.eql(s4.value);
        });

        it('should perform concatenation on many groups via concatAll', function _testSumGroupConcatAll() {
            var s1 = sumGroup(1),
                s2 = sumGroup(5),
                s3 = sumGroup(11),
                s4 = sumGroup(37);

            var s1All = s1.concatAll(s2, s3, s4),
                s2All = s2.concatAll(s1, s3, s4),
                s3All = s3.concatAll(s1, s2, s4),
                s4All = s4.concatAll(s1, s2, s3);

            s1All.value.should.eql(54);
            s1All.value.should.eql(s2All.value);
            s1All.value.should.eql(s3All.value);
            s1All.value.should.eql(s4All.value);

            s1All.undo().value.should.eql(17);
            s2All.undo().value.should.eql(17);
            s3All.undo().value.should.eql(17);
            s4All.undo().value.should.eql(43);
        });

        it('should perform inverted concatenation on many groups via inverseConcatAll', function _testSumGroupInverseConcatAll() {
            var s1 = sumGroup(1),
                s2 = sumGroup(5),
                s3 = sumGroup(11),
                s4 = sumGroup(37);

            var s1All = s1.inverseConcatAll(s2, s3, s4),
                s2All = s2.inverseConcatAll(s1, s3, s4),
                s3All = s3.inverseConcatAll(s1, s2, s4),
                s4All = s4.inverseConcatAll(s1, s2, s3);

            s1All.value.should.eql(-52);
            s2All.value.should.eql(-44);
            s3All.value.should.eql(-32);
            s4All.value.should.eql(20);

            s1All.undo().value.should.eql(-15);
            s2All.undo().value.should.eql(-7);
            s3All.undo().value.should.eql(5);
            s4All.undo().value.should.eql(31);
        });

        it('should handle empty groups as identity during concatenation', function _testSumGroupEmptyConcatenation() {
            var s1 = sumGroup(1),
                s2 = sumGroup(5),
                s3 = sumGroup(11),
                s4 = sumGroup(37),
                se1 = sumGroup.empty(),
                se2 = sumGroup.empty();

            se1.isEmpty.should.be.true;
            se2.isEmpty.should.be.true;

            s1.isEmpty.should.be.false;
            s2.isEmpty.should.be.false;
            s3.isEmpty.should.be.false;
            s4.isEmpty.should.be.false;

            s1.concat(se1).value.should.eql(s1.value);
            s2.concat(se2).value.should.eql(s2.value);
            s3.concat(se1).value.should.eql(s3.value);
            s4.concat(se2).value.should.eql(s4.value);

            se1.concat(se2).value.should.eql(se1.value);
            se2.concat(se1).value.should.eql(se2.value);
            se1.value.should.eql(se2.value);

            se1.undo().value.should.eql(se1.value);
            se1.undo().value.should.eql(se2.value);

            se1.concat(se2).undo().value.should.eql(se1.value);
            se2.concat(se1).undo().value.should.eql(se2.value);

            se1.inverseConcat(se2).value.should.eql(se1.value);
            se2.inverseConcat(se1).value.should.eql(se2.value);

            se1.concatAll(s1, s2, s3, s4, se2).value.should.eql(s1.concatAll(s2, s3, s4).value);
            se1.concatAll(s1, s2, s3, s4, se1).value.should.eql(s1.concatAll(s2, s3, s4).value);

            se1.concat(s4).undo().value.should.eql(se1.value);
            se2.concat(s3).undo().value.should.eql(se2.value);

            se1.inverseConcatAll(s1, s2, s3, s4, se2).value.should.eql(-54);
            se2.inverseConcatAll(s1, s2, s3, s4, se1).value.should.eql(-54);
        });

        it('should represent the correct type and value of a sum group', function _testSumGroupToString() {
            var s1 = sumGroup(1),
                s2 = sumGroup(5),
                s3 = sumGroup(11),
                s4 = sumGroup(37),
                s5 = sumGroup(-0),
                se = sumGroup.empty();

            s1.toString().should.eql('Sum(1)');
            s2.toString().should.eql('Sum(5)');
            s3.toString().should.eql('Sum(11)');
            s4.toString().should.eql('Sum(37)');
            s5.toString().should.eql('Sum(-0)');
            se.toString().should.eql('Sum(0)');

            s1.concat(s2).toString().should.eql('Sum(6)');
            s3.concat(s4).toString().should.eql('Sum(48)');
            s1.concatAll(s2, s3, s4, se).toString().should.eql('Sum(54)');
        });

        it('should prevent writing to ._value, .value, ._prev, and .previous', function _testSumGroupRestrictedWrites() {
            var s = sumGroup(10);

            expect(function _writeToDot_value() { s._value = 5; }).to.throw();
            expect(function _writeToDotValue() { s.value = 5; }).to.throw();
            expect(function _writeToDot_prev() { s._prev = 5; }).to.throw();
            expect(function _writeToDotPrevious() { s.previous = 5; }).to.throw();
        });
    });
});