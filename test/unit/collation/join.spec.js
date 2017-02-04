import { join } from '../../../src/collation/join';
import { testData } from '../../testData';

describe('Test join...', function testJoin() {
    describe('...using default equality comparer', function testJoinWithArrays() {
        it('should return all test data items that share the same name', function testJoinOnFirstName() {
            function selector(item) {
                return item.FirstName;
            }

            function projector(a, b) {
                return {
                    outerFirstName: a.FirstName,
                    innerFirstName: b.FirstName
                }
            }

            var duplicateNames = Array.prototype.concat.apply([],testData.dataSource.data.map(function _findDupes(item) {
                return Array.prototype.concat.apply([], testData.dataSource.data.filter(function _innerDupes(it) {
                    return item.FirstName === it.FirstName;
                }));
            }));

            var joinIterable = join(testData.dataSource.data, testData.dataSource.data, selector, selector, projector),
                joinRes = Array.from(joinIterable());

            joinRes.forEach(function _validateResults(item) {
                item.outerFirstName.should.eql(item.innerFirstName);
            });
            joinRes.should.have.lengthOf(duplicateNames.length);
        });
    });
});