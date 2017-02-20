import { ofType } from '../../../src/limitation/ofType';
import { javaScriptTypes } from '../../../src/helpers';
import { testData } from '../../testData';

function typeTest() {}
var obj = {};

var typeTestData = [typeTest, Object.create(obj), 'string', 12345, false, Symbol(), null, undefined];

describe('Test ofType', function testOfType() {
    it('should return all test data items when filtered by object', function testOfTypeWithObject() {
        var ofTypeIterable = ofType(testData.dataSource.data, 'object'),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(testData.dataSource.data.length);
        ofTypeRes.should.eql(testData.dataSource.data);
    });

    it('should return all test data items when filtered by specified object', function testOfTypeWithSpecifiedObject() {
        var objType = {
            FirstName: '',
            LastName: '',
            Phone: '',
            Email: '',
            Address: '',
            City: '',
            State: '',
            Zip: '',
            drillDownData: []
        };
        var ofTypeIterable = ofType(testData.dataSource.data, objType),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(testData.dataSource.data.length);
        ofTypeRes.should.eql(testData.dataSource.data);
    });

    it('should return nothing when asked for function types', function testOfTypeWithFunctions() {
        var ofTypeIterable = ofType(testData.dataSource.data, javaScriptTypes.function),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(0);
    });

    it('should return nothing when asked for number types', function testOfTypeWithNumbers() {
        var ofTypeIterable = ofType(testData.dataSource.data, javaScriptTypes.number),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(0);
    });

    it('should return nothing when asked for string types', function testOfTypeWithStrings() {
        var ofTypeIterable = ofType(testData.dataSource.data, javaScriptTypes.string),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(0);
    });

    it('should return nothing when asked for boolean types', function testOfTypeWithBooleans() {
        var ofTypeIterable = ofType(testData.dataSource.data, javaScriptTypes.boolean),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(0);
    });

    it('should return nothing when asked for symbol types', function testOfTypeWithSymbols() {
        var ofTypeIterable = ofType(testData.dataSource.data, javaScriptTypes.symbol),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(0);
    });

    it('should return nothing when asked for null values', function testOfTypeWithNullValues() {
        var ofTypeIterable = ofType(testData.dataSource.data, null),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(0);
    });

    it('should return the object in typeTestData', function testOfTypeAgainstTypeTestDataWithObjects() {
        var ofTypeIterable = ofType(typeTestData, obj),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(1);
        expect(obj.isPrototypeOf(ofTypeRes[0])).to.be.true;
    });

    it('should return the function in typeTestData', function testOfTypeAgainstTypeTestDataWithFunctions() {
        var ofTypeIterable1 = ofType(typeTestData, javaScriptTypes.function),
            ofTypeIterable2 = ofType(typeTestData, typeTest),
            ofTypeRes1 = Array.from(ofTypeIterable1()),
            ofTypeRes2 = Array.from(ofTypeIterable2());

        ofTypeRes1.should.have.lengthOf(1);
        ofTypeRes2.should.have.lengthOf(1);
        ofTypeRes1.should.eql(ofTypeRes2);
        ofTypeRes2[0].should.eql(typeTest);
    });

    it('should return the null value in typeTestData', function testOfTypeAgainstTypeTestDataWithNullValue() {
        var ofTypeIterable = ofType(typeTestData, null),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(1);
        expect(ofTypeRes[0]).to.eql(null);
    });

    it('should return the boolean value in typeTestData', function testOfTypeAgainstTypeTestDataWithBooleanValue() {
        var ofTypeIterable = ofType(typeTestData, javaScriptTypes.boolean),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(1);
        expect(ofTypeRes[0]).to.be.false;
    });

    it('should return the undefined value in typeTestData', function testTypeOfAgainstTypeTestDataWithUndefinedValue() {
        var ofTypeIterable = ofType(typeTestData, javaScriptTypes.undefined),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(1);
        expect(ofTypeRes[0]).to.be.undefined;
    });

    it('should return the number in typeTestData', function testTypeOfAgainstTypeTestDataWithNumbers() {
        var ofTypeIterable = ofType(typeTestData, javaScriptTypes.number),
            ofTypeRes = Array.from(ofTypeIterable());

        ofTypeRes.should.have.lengthOf(1);
        ofTypeRes[0].should.eql(12345);
    });
});