import { distinct } from '../../../src/limitation/distinct';
import { testData } from '../../testData';

var distinctNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    repeatedNumbers = distinctNumbers.map(function _numberRepeater(num) {
        if (num % 2) return num;
        return num + 1;
    });

function nameComparer(a, b) {
    return `${ a.FirstName } ${ a.LastName }` === `${ b.FirstName } ${ b.LastName }`;
}

function mechanicComparer(a, b) {
    return a.drillDownData.some(function sameMechanicAndCar(item) {
        return item.MechanicName === b.drillDownData[0].MechanicName && item.Make === b.drillDownData[0].Make
            && item.Model === b.drillDownData[0].Model && item.Year === b.drillDownData[0].Year;
    });
}

describe('Test distinct...', function testDistinct() {
    describe('...using default comparer', function testDistinctWithDefaultComparer() {
        it('should return all when comparing by reference on test data', function testForDistinctness() {
            var distinctIterable = distinct(testData.dataSource.data),
                distinctRes = Array.from(distinctIterable());

            distinctRes.should.have.lengthOf(testData.dataSource.data.length);
            distinctRes.should.eql(testData.dataSource.data);
        });

        it('should return all distinct primitive values', function testDistinctWithUniquePrimitiveValues() {
            var distinctIterable = distinct(distinctNumbers),
                distinctRes = Array.from(distinctIterable());

            distinctRes.should.have.lengthOf(distinctNumbers.length);
            distinctRes.should.eql(distinctNumbers);
        });

        it('should return half the length of repeated numbers', function testDistinctWithRepeatedPrimitives() {
            var distinctIterable = distinct(repeatedNumbers),
                distinctRes = Array.from(distinctIterable());

            distinctRes.should.have.lengthOf(repeatedNumbers.length / 2);
            distinctRes.should.eql([1, 3, 5, 7, 9]);
        });
    });

    describe('...using defined comparer', function testDistinctWithDefinedComparer() {
        it('should return items with distinct full names', function testDistinctFullNames() {
            var distinctIterable = distinct(testData.dataSource.data, nameComparer),
                distinctRes = Array.from(distinctIterable());

            var viewedNames = [];
            distinctRes.forEach(function _checkDistinctness(item) {
                viewedNames.should.not.include(item.FirstName + ' ' + item.LastName);
                viewedNames.push(item.FirstName + ' ' + item.LastName);
            });
        });

        it('should return items with unique mechanics and cars', function testDistinctMechanicsAndCars() {
            var distinctIterable = distinct(testData.dataSource.data, mechanicComparer),
                distinctRes = Array.from(distinctIterable());

            var viewedMechanics = [];
            distinctRes.forEach(function _checkDistinctness(item) {
                expect(viewedMechanics.every(function checkEveryMechanic(it) {
                    return it.MechanicName !== item.drillDownData[0].MechanicName || it.Make !== item.drillDownData[0].Make
                        || it.Model !== item.drillDownData[0].Model || it.Year !== item.drillDownData[0].Year;
                })).to.be.true;
                viewedMechanics = viewedMechanics.concat(item.drillDownData);
            });
        });
    });

    describe('...using generators', function testDistinctWithGenerators() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        it('should return all when comparing by reference on test data', function testForDistinctness() {
            var distinctIterable = distinct(gen(testData.dataSource.data)),
                distinctRes = Array.from(distinctIterable());

            distinctRes.should.have.lengthOf(testData.dataSource.data.length);
            distinctRes.should.eql(testData.dataSource.data);
        });

        it('should return all distinct primitive values', function testDistinctWithUniquePrimitiveValues() {
            var distinctIterable = distinct(gen(distinctNumbers)),
                distinctRes = Array.from(distinctIterable());

            distinctRes.should.have.lengthOf(distinctNumbers.length);
            distinctRes.should.eql(distinctNumbers);
        });

        it('should return half the length of repeated numbers', function testDistinctWithRepeatedPrimitives() {
            var distinctIterable = distinct(gen(repeatedNumbers)),
                distinctRes = Array.from(distinctIterable());

            distinctRes.should.have.lengthOf(repeatedNumbers.length / 2);
            distinctRes.should.eql([1, 3, 5, 7, 9]);
        });

        it('should return items with distinct full names', function testDistinctFullNames() {
            var distinctIterable = distinct(gen(testData.dataSource.data), nameComparer),
                distinctRes = Array.from(distinctIterable());

            var viewedNames = [];
            distinctRes.forEach(function _checkDistinctness(item) {
                viewedNames.should.not.include(item.FirstName + ' ' + item.LastName);
                viewedNames.push(item.FirstName + ' ' + item.LastName);
            });
        });

        it('should return items with unique mechanics and cars', function testDistinctMechanicsAndCars() {
            var distinctIterable = distinct(gen(testData.dataSource.data), mechanicComparer),
                distinctRes = Array.from(distinctIterable());

            var viewedMechanics = [];
            distinctRes.forEach(function _checkDistinctness(item) {
                expect(viewedMechanics.every(function checkEveryMechanic(it) {
                    return it.MechanicName !== item.drillDownData[0].MechanicName || it.Make !== item.drillDownData[0].Make
                        || it.Model !== item.drillDownData[0].Model || it.Year !== item.drillDownData[0].Year;
                })).to.be.true;
                viewedMechanics = viewedMechanics.concat(item.drillDownData);
            });
        });
    });
});