import { sumGroup, multGroup, strGroup, allGroup, anyGroup } from '../../../src/groups/groups';

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

    describe('Test multGroup', function _testMultGroup() {
        it('should return the proper sum of two numbers', function _testMultConcatOnValues() {
            var m1 = multGroup(2),
                m2 = multGroup(5),
                m3 = multGroup(11),
                m4 = multGroup(37);

            m1.concat(m2).value.should.eql(10);
            m1.concat(m3).value.should.eql(22);
            m1.concat(m4).value.should.eql(74);

            m2.concat(m3).value.should.eql(55);
            m2.concat(m4).value.should.eql(185);

            m3.concat(m4).value.should.eql(407);

            //Associativity
            m1.concat(m2).concat(m3).concat(m4).value.should.eql(m1.concat(m2.concat(m3).concat(m4)).value);
        });

        it('should allow concatenation via .valueOf function', function _testSameValueViaMultiplyOperator() {
            var m1 = multGroup(2),
                m2 = multGroup(5),
                m3 = multGroup(11),
                m4 = multGroup(37);

            (m1 * m2).should.eql(10);
            (m1 * m3).should.eql(22);
            (m1 * m4).should.eql(74);

            (m2 * m3).should.eql(55);
            (m2 * m4).should.eql(185);

            (m3 * m4).should.eql(407);

            //Associativity
            (m1 + m2 + m3 + m4).should.eql(m1 + (m2 + (m3 + (m4))));
        });

        it('should revert the last operation performed on a mult', function _testMultGroupRevert() {
            var m1 = multGroup(2),
                m2 = multGroup(5),
                m3 = multGroup(11),
                m4 = multGroup(37);

            var m12 = m1.concat(m2).undo(),
                m13 = m1.concat(m3).undo(),
                m14 = m1.concat(m4).undo();

            m12.value.should.eql(m1.value);
            m13.value.should.eql(m1.value);
            m14.value.should.eql(m1.value);

            var m23 = m2.concat(m3).undo(),
                m24 = m2.concat(m4).undo();

            m23.value.should.eql(m2.value);
            m24.value.should.eql(m2.value);

            var m34 = m3.concat(m4).undo();

            m34.value.should.eql(m3.value);

            var s121 = m1.concat(m2).undo().undo();
            s121.value.should.eql(m1.concat(m2).value);

            var s131 = m1.concat(m3).undo().undo();
            s131.value.should.eql(m1.concat(m3).value);

            var s141 = m1.concat(m4).undo().undo();
            s141.value.should.eql(m1.concat(m4).value);
        });

        it('should perform inverted concatenation', function _testMultGroupInvertedConcatenation() {
            var m1 = multGroup(2),
                m2 = multGroup(5),
                m3 = multGroup(11),
                m4 = multGroup(37);

            var m12 = m1.inverseConcat(m2),
                m13 = m1.inverseConcat(m3),
                m14 = m1.inverseConcat(m4);

            m12.value.should.eql(0.4);
            m13.value.should.eql(0.18181818181818182);
            m14.value.should.eql(0.05405405405405405406);

            m12.undo().value.should.eql(2);
            m13.undo().value.should.eql(2);
            m14.undo().value.should.eql(2);

            var m23 = m2.inverseConcat(m3),
                m24 = m2.inverseConcat(m4);

            m23.value.should.eql(0.45454545454545456);
            m24.value.should.eql(0.1351351351351351354);

            m23.undo().value.should.eql(m2.value);
            m24.undo().value.should.eql(m2.value);

            var m34 = m3.inverseConcat(m4);

            m34.value.should.eql(0.2972972972972972973);
            m34.undo().value.should.eql(m3.value);

            m4.undo().value.should.eql(m4.value);
        });

        it('should perform concatenation on many groups via concatAll', function _testMultGroupConcatAll() {
            var m1 = multGroup(2),
                m2 = multGroup(5),
                m3 = multGroup(11),
                m4 = multGroup(37);

            var m1All = m1.concatAll(m2, m3, m4),
                m2All = m2.concatAll(m1, m3, m4),
                m3All = m3.concatAll(m1, m2, m4),
                m4All = m4.concatAll(m1, m2, m3);

            m1All.value.should.eql(4070);
            m1All.value.should.eql(m2All.value);
            m1All.value.should.eql(m3All.value);
            m1All.value.should.eql(m4All.value);

            m1All.undo().value.should.eql(110);
            m2All.undo().value.should.eql(110);
            m3All.undo().value.should.eql(110);
            m4All.undo().value.should.eql(370);
        });

        it('should perform inverted concatenation on many groups via inverseConcatAll', function _testMultGroupInverseConcatAll() {
            var m1 = multGroup(2),
                m2 = multGroup(5),
                m3 = multGroup(11),
                m4 = multGroup(37);

            var m1All = m1.inverseConcatAll(m2, m3, m4),
                m2All = m2.inverseConcatAll(m1, m3, m4),
                m3All = m3.inverseConcatAll(m1, m2, m4),
                m4All = m4.inverseConcatAll(m1, m2, m3);

            m1All.value.should.eql(0.000982800982800983);
            m2All.value.should.eql(0.006142506142506143);
            m3All.value.should.eql(0.029729729729729735);
            m4All.value.should.eql(0.33636363636363636);

            m1All.undo().value.should.eql(0.03636363636363637);
            m2All.undo().value.should.eql(0.2272727272727273);
            m3All.undo().value.should.eql(1.1);
            m4All.undo().value.should.eql(3.7);
        });

        it('should handle empty groups as identity during concatenation', function _testMultGroupEmptyConcatenation() {
            var m1 = multGroup(2),
                m2 = multGroup(5),
                m3 = multGroup(11),
                m4 = multGroup(37),
                me1 = multGroup.empty(),
                me2 = multGroup.empty();

            me1.isEmpty.should.be.true;
            me2.isEmpty.should.be.true;

            m1.isEmpty.should.be.false;
            m2.isEmpty.should.be.false;
            m3.isEmpty.should.be.false;
            m4.isEmpty.should.be.false;

            m1.concat(me1).value.should.eql(m1.value);
            m2.concat(me2).value.should.eql(m2.value);
            m3.concat(me1).value.should.eql(m3.value);
            m4.concat(me2).value.should.eql(m4.value);

            me1.concat(me2).value.should.eql(me1.value);
            me2.concat(me1).value.should.eql(me2.value);
            me1.value.should.eql(me2.value);

            me1.undo().value.should.eql(me1.value);
            me1.undo().value.should.eql(me2.value);

            me1.concat(me2).undo().value.should.eql(me1.value);
            me2.concat(me1).undo().value.should.eql(me2.value);

            me1.inverseConcat(me2).value.should.eql(me1.value);
            me2.inverseConcat(me1).value.should.eql(me2.value);

            me1.concatAll(m1, m2, m3, m4, me2).value.should.eql(m1.concatAll(m2, m3, m4).value);
            me1.concatAll(m1, m2, m3, m4, me1).value.should.eql(m1.concatAll(m2, m3, m4).value);

            me1.concat(m4).undo().value.should.eql(me1.value);
            me2.concat(m3).undo().value.should.eql(me2.value);

            me1.inverseConcatAll(m1, m2, m3, m4, me2).value.should.eql(0.00024570024570024575);
            me2.inverseConcatAll(m1, m2, m3, m4, me1).value.should.eql(0.00024570024570024575);
        });

        it('should represent the correct type and value of a sum group', function _testMultGroupToString() {
            var m1 = multGroup(2),
                m2 = multGroup(5),
                m3 = multGroup(11),
                m4 = multGroup(37),
                m5 = multGroup(-0),
                me = multGroup.empty();

            m1.toString().should.eql('Multiply(2)');
            m2.toString().should.eql('Multiply(5)');
            m3.toString().should.eql('Multiply(11)');
            m4.toString().should.eql('Multiply(37)');
            m5.toString().should.eql('Multiply(-0)');
            me.toString().should.eql('Multiply(1)');

            m1.concat(m2).toString().should.eql('Multiply(10)');
            m3.concat(m4).toString().should.eql('Multiply(407)');
            m1.concatAll(m2, m3, m4, me).toString().should.eql('Multiply(4070)');
        });

        it('should prevent writing to ._value, .value, ._prev, and .previous', function _testMultGroupRestrictedWrites() {
            var m = multGroup(10);

            expect(function _writeToDot_value() { m._value = 5; }).to.throw();
            expect(function _writeToDotValue() { m.value = 5; }).to.throw();
            expect(function _writeToDot_prev() { m._prev = 5; }).to.throw();
            expect(function _writeToDotPrevious() { m.previous = 5; }).to.throw();
        });
    });

    describe('Test allGroup', function _testAllGroup() {
        it('should return the proper sum of two numbers', function _testAllConcatOnValues() {
            var a1 = allGroup(true),
                a2 = allGroup(true),
                a3 = allGroup(false);

            a1.concat(a2).value.should.eql(true);
            a1.concat(a3).value.should.eql(false);

            a2.concat(a3).value.should.eql(false);

            //Associativity
            console.log(a1.concat(a2).concat(a3).value);
            a1.concat(a2).concat(a3).value.should.eql(a1.concat(a2.concat(a3)).value);
        });

        it('should allow concatenation via .valueOf function', function _testSameValueViaANDOperator() {
            var a1 = allGroup(true),
                a2 = allGroup(true),
                a3 = allGroup(false);

            ((a1 && a2).value).should.eql(true);
            ((a1 && a3).value).should.eql(false);

            ((a2 && a3).value).should.eql(false);

            //Associativity
            ((a1 && a2 && a3).value).should.eql((a1 && (a2 && a3)).value);
        });
    });
});