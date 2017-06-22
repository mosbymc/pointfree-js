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
        });
    });
});