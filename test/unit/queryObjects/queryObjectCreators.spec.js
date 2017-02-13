import { createNewQueryableDelegator } from '../../../src/queryObjects/queryObjectCreators';
import { testData } from '../../testData';
import { functionTypes } from '../../../src/helpers';

function collectiveFunction(data) {
    return data;
}

function atomicFunction(item) {
    return item;
}

describe('createNewQueryableDelegator', function testQueryableDelegatorObjectCreation() {
    it('should create a new queryable object delegator with actual pipeline array', function testSuccessfulCreation() {
        var queryDelegator = createNewQueryableDelegator(testData.dataSource.data);

        expect(queryDelegator).to.exist;

        //Properties that should be present
        //queryDelegator._data.should.eql(testData.dataSource.data);
        expect(queryDelegator._evaluatedData).to.be.null;
        queryDelegator._currentDataIndex.should.eql(0);

        //Functions that should be present
        //queryDelegator._iterator.should.exist;
        //queryDelegator._iterator.should.be.a('function');

        //PROJECTION FUNCTIONS
        queryDelegator.flatten.should.exist;
        queryDelegator.flatten.should.be.a('function');
        queryDelegator.groupBy.should.exist;
        queryDelegator.groupBy.should.be.a('function');
        queryDelegator.flatten.should.exist;
        queryDelegator.flatten.should.be.a('function');
        queryDelegator.flattenDeep.should.exist;
        queryDelegator.flattenDeep.should.be.a('function');


        //COLLATION FUNCTIONS
        queryDelegator.concat.should.exist;
        queryDelegator.concat.should.be.a('function');
        queryDelegator.except.should.exist;
        queryDelegator.except.should.be.a('function');
        queryDelegator.groupJoin.should.exist;
        queryDelegator.groupJoin.should.be.a('function');
        queryDelegator.intersect.should.exist;
        queryDelegator.intersect.should.be.a('function');
        queryDelegator.join.should.exist;
        queryDelegator.join.should.be.a('function');
        queryDelegator.union.should.exist;
        queryDelegator.union.should.be.a('function');
        queryDelegator.zip.should.exist;
        queryDelegator.zip.should.be.a('function');


        //LIMITATION FUNCTIONS
        queryDelegator.where.should.exist;
        queryDelegator.where.should.be.a('function');
        queryDelegator.distinct.should.exist;
        queryDelegator.distinct.should.be.a('function');


        //EVALUATION FUNCTIONS
        queryDelegator.all.should.exist;
        queryDelegator.all.should.be.a('function');
        queryDelegator.any.should.exist;
        queryDelegator.any.should.be.a('function');
        queryDelegator.first.should.exist;
        queryDelegator.first.should.be.a('function');
        queryDelegator.last.should.exist;
        queryDelegator.last.should.be.a('function');


        queryDelegator._getData.should.exist;
        queryDelegator._getData.should.be.a('function');
        queryDelegator.take.should.exist;
        queryDelegator.take.should.be.a('function');
        queryDelegator.takeWhile.should.exist;
        queryDelegator.takeWhile.should.be.a('function');
        //queryDelegator.insertInto.should.exist;
        //queryDelegator.insertInto.should.be.a('function');

        //Functions that should not be present
        expect(queryDelegator.thenBy).to.not.exist;
        expect(queryDelegator.thenByDescending).to.not.exist;
        expect(queryDelegator.and).to.not.exist;
        expect(queryDelegator.or).to.not.exist;
        expect(queryDelegator.nand).to.not.exist;
        expect(queryDelegator.nor).to.not.exist;
        expect(queryDelegator.xand).to.not.exist;
        expect(queryDelegator.xor).to.not.exist;
    });

    it('should create a new queryable object delegator with a singe pipeline function object', function testSuccessfulCreation() {
        /*
        var queryDelegator = createNewQueryableDelegator(testData.dataSource.data, { fn: atomicFunction, functionType: functionTypes.atomic });

        expect(queryDelegator).to.exist;
        queryDelegator.should.be.ok;

        //Properties that should be present
        queryDelegator._data.should.eql(testData.dataSource.data);
        expect(queryDelegator._evaluatedData).to.be.null;
        queryDelegator._pipeline.should.exist;
        queryDelegator._pipeline.should.be.an('array');
        queryDelegator._pipeline[0].fn.should.eql(atomicFunction);
        queryDelegator._pipeline[0].functionType.should.eql(functionTypes.atomic);
        queryDelegator._currentPipelineIndex.should.eql(0);
        queryDelegator._currentDataIndex.should.eql(0);

        //Functions that should be present
        //queryDelegator._iterator.should.exist;
        //queryDelegator._iterator.should.be.a('function');
        queryDelegator.select.should.exist;
        queryDelegator.select.should.be.a('function');
        queryDelegator.insertInto.should.exist;
        queryDelegator.insertInto.should.be.a('function');
        queryDelegator.where.should.exist;
        queryDelegator.where.should.be.a('function');
        queryDelegator.join.should.exist;
        queryDelegator.join.should.be.a('function');
        queryDelegator.union.should.exist;
        queryDelegator.union.should.be.a('function');
        queryDelegator.zip.should.exist;
        queryDelegator.zip.should.be.a('function');
        queryDelegator.except.should.exist;
        queryDelegator.except.should.be.a('function');
        queryDelegator.intersect.should.exist;
        queryDelegator.intersect.should.be.a('function');
        queryDelegator.groupBy.should.exist;
        queryDelegator.groupBy.should.be.a('function');
        queryDelegator.distinct.should.exist;
        queryDelegator.distinct.should.be.a('function');
        queryDelegator.flatten.should.exist;
        queryDelegator.flatten.should.be.a('function');
        queryDelegator.flattenDeep.should.exist;
        queryDelegator.flattenDeep.should.be.a('function');
        queryDelegator._getData.should.exist;
        queryDelegator._getData.should.be.a('function');
        queryDelegator.take.should.exist;
        queryDelegator.take.should.be.a('function');
        queryDelegator.takeWhile.should.exist;
        queryDelegator.takeWhile.should.be.a('function');
        queryDelegator.any.should.exist;
        queryDelegator.any.should.be.a('function');
        queryDelegator.all.should.exist;
        queryDelegator.all.should.be.a('function');
        queryDelegator.first.should.exist;
        queryDelegator.first.should.be.a('function');
        queryDelegator.last.should.exist;
        queryDelegator.last.should.be.a('function');

        //Functions that should not be present
        expect(queryDelegator.thenBy).to.not.exist;
        expect(queryDelegator.thenByDescending).to.not.exist;
        expect(queryDelegator.and).to.not.exist;
        expect(queryDelegator.or).to.not.exist;
        expect(queryDelegator.nand).to.not.exist;
        expect(queryDelegator.nor).to.not.exist;
        expect(queryDelegator.xand).to.not.exist;
        expect(queryDelegator.xor).to.not.exist;
        */
    });

    it('should create a new queryable object delegator with an undefined pipeline', function testSuccessfulCreation() {
        /*
        var queryDelegator = createNewQueryableDelegator(testData.dataSource.data);

        expect(queryDelegator).to.exist;
        queryDelegator.should.be.ok;

        //Properties that should be present
        queryDelegator._data.should.eql(testData.dataSource.data);
        expect(queryDelegator._evaluatedData).to.be.null;
        queryDelegator._pipeline.should.exist;
        queryDelegator._pipeline.should.be.an('array');
        queryDelegator._pipeline.should.have.lengthOf(0);
        queryDelegator._currentPipelineIndex.should.eql(0);
        queryDelegator._currentDataIndex.should.eql(0);

        //Functions that should be present
        //queryDelegator._iterator.should.exist;
        //queryDelegator._iterator.should.be.a('function');
        queryDelegator.select.should.exist;
        queryDelegator.select.should.be.a('function');
        queryDelegator.insertInto.should.exist;
        queryDelegator.insertInto.should.be.a('function');
        queryDelegator.where.should.exist;
        queryDelegator.where.should.be.a('function');
        queryDelegator.join.should.exist;
        queryDelegator.join.should.be.a('function');
        queryDelegator.union.should.exist;
        queryDelegator.union.should.be.a('function');
        queryDelegator.zip.should.exist;
        queryDelegator.zip.should.be.a('function');
        queryDelegator.except.should.exist;
        queryDelegator.except.should.be.a('function');
        queryDelegator.intersect.should.exist;
        queryDelegator.intersect.should.be.a('function');
        queryDelegator.groupBy.should.exist;
        queryDelegator.groupBy.should.be.a('function');
        queryDelegator.distinct.should.exist;
        queryDelegator.distinct.should.be.a('function');
        queryDelegator.flatten.should.exist;
        queryDelegator.flatten.should.be.a('function');
        queryDelegator.flattenDeep.should.exist;
        queryDelegator.flattenDeep.should.be.a('function');
        queryDelegator._getData.should.exist;
        queryDelegator._getData.should.be.a('function');
        queryDelegator.take.should.exist;
        queryDelegator.take.should.be.a('function');
        queryDelegator.takeWhile.should.exist;
        queryDelegator.takeWhile.should.be.a('function');
        queryDelegator.any.should.exist;
        queryDelegator.any.should.be.a('function');
        queryDelegator.all.should.exist;
        queryDelegator.all.should.be.a('function');
        queryDelegator.first.should.exist;
        queryDelegator.first.should.be.a('function');
        queryDelegator.last.should.exist;
        queryDelegator.last.should.be.a('function');

        //Functions that should not be present
        expect(queryDelegator.thenBy).to.not.exist;
        expect(queryDelegator.thenByDescending).to.not.exist;
        expect(queryDelegator.and).to.not.exist;
        expect(queryDelegator.or).to.not.exist;
        expect(queryDelegator.nand).to.not.exist;
        expect(queryDelegator.nor).to.not.exist;
        expect(queryDelegator.xand).to.not.exist;
        expect(queryDelegator.xor).to.not.exist;
        */
    });

    it('should be undefined when trying to create a query delegatable without a proper pipeline', function testCreationFail() {
        /*
        var failedDelegate1 = createNewQueryableDelegator(testData.dataSource.data, function _pipeLine() {}),
            failedDelegate2 = createNewQueryableDelegator(testData.dataSource.data, null),
            failedDelegate3 = createNewQueryableDelegator(testData.dataSource.data, 1),
            failedDelegate4 = createNewQueryableDelegator(testData.dataSource.data, '1'),
            failedDelegate5 = createNewQueryableDelegator(testData.dataSource.data, true);

        expect(failedDelegate1).to.not.exist;
        expect(failedDelegate2).to.not.exist;
        expect(failedDelegate3).to.not.exist;
        expect(failedDelegate4).to.not.exist;
        expect(failedDelegate5).to.not.exist;
        */
    });
});