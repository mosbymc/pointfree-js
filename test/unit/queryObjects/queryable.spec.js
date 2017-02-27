import { queryable, internal_queryable } from '../../../src/queryObjects/queryable';
import { testData } from '../../testData';

describe('Test queryable', function testQueryable() {
    it('should properly extend the queryable object', function testQueryableExtension() {
        queryable.extend('testFunc', function _testFunc(source) {
            return function *testFuncIterator() {
                for (let item of source) yield item;
            }
        });

        var q1 = queryable.from(testData.dataSource.data),
            q2 = q1.testFunc(),
            q2Data = q2.data;

        expect(internal_queryable.isPrototypeOf(q2)).to.be.true;
        q2Data.should.have.lengthOf(testData.dataSource.data.length);
        q2Data.should.eql(testData.dataSource.data);
    });

    it('should create a new queryable delegator object with appropriate source form', function testQueryableDotFrom() {
        function genWrapper(data) {
            return function *genny() {
                for (let item of data)
                    yield item;
            }
        }

        var stringSource = 'This is a stringy source';

        var q1 = queryable.from(testData.dataSource.data),
            q2 = queryable.from(genWrapper(testData.dataSource.data)),
            q3 = queryable.from(q1),
            q4 = queryable.from(),
            q5 = queryable.from(null),
            q6 = queryable.from({ a: 1, b: 2}),
            q7 = queryable.from(stringSource),
            q8 = queryable.from(1),
            q9 = queryable.from(false);

        q1.source.should.eql(testData.dataSource.data);
        q2.source.should.not.eql(testData.dataSource.data);
        q3.source.should.eql(q1);
        q4.source.should.be.an('array');
        q4.source.should.have.lengthOf(0);
        q5.source.should.be.an('array');
        q5.source.should.have.lengthOf(1);
        q6.source.should.be.an('array');
        q6.source.should.have.lengthOf(1);
        q7.source.should.be.an('array');
        q7.source.should.have.lengthOf(stringSource.length);
        q8.source.should.be.an('array');
        q8.source.should.have.lengthOf(1);
        q9.source.should.be.an('array');
        q9.source.should.have.lengthOf(1);
    });
});