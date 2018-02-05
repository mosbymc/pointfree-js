import { mapping, filtering, gating, mapReducer, filterReducer, mapped, transduce, reduce, dropping, taking } from '../../src/transducers';
import { compose } from '../../src/combinators';

function sum(x, y) {
    return x + y;
}

function concat(arr, val) {
    return arr.concat(val);
}

var inc = x => x + 1;

describe('Test transducers', function _testTransducers() {
    describe('Test mapping', function _testMapping() {
        it('should act as an array map operation', function _testMappingAsArrayMap() {
            reduce(mapping(x => x + 1)(sum), 0, [1,2,3]).should.eql(9);
        });
    });

    describe('Test filtering', function _testFiltering() {
        it('should act as an array filter operation', function _testFilteringAsArrayFilter() {
            reduce(filtering(x => 1 < x)(concat), [], [1,2,3]).should.eql([2, 3]);
        });
    });

    describe('Test filtering and mapping composition', function _testFilteringAndMappingComposition() {
        it('should compose the filtering and mapping transducers', function _testComposition() {
            var divideByThree = mapping(x => x / 3),
                keepOnlyIntegers = filtering(x => 0 === x % 1),
                divBy3andOnlyIntegers = compose(divideByThree, keepOnlyIntegers);

            [3, 4, 9, 13, 14, 12].reduce(divBy3andOnlyIntegers(concat), []).should.eql([1, 3, 4]);

            var divBy3andOnlyIntegersAndSum = compose(divideByThree, keepOnlyIntegers)(sum);

            reduce(divBy3andOnlyIntegersAndSum, 0, [3, 4, 9, 13, 14, 12]).should.eql(8);
        });
    });

    describe('Test dropping', function _testDropping() {
        it('should drop the specified number of items', function _testDroppingNItems() {
            reduce(dropping(3)(concat),[],[1, 2, 3, 4, 5]).should.eql([4, 5]);
        });
    });

    describe('Test taking', function _testTaking() {
        it('should take the specified number of items', function _testTakingNItems() {
            reduce(compose(mapping(inc), taking(3))(concat), [], [3, 4, 9, 13, 14, 12, 56]).should.eql([4, 5, 10]);
        });
    });

    describe('Test dropping and taking composition', function _testDroppingAndTakingComposition() {
        it('should compose the dropping and taking functions', function _droppingAndTakingCompose() {
            reduce( compose(dropping(2), taking(3) )(concat), [], [3,4,9,13,14,12,45,56]).should.eql([9, 13, 14]);
        });
    });

    describe('Test gating', function _testGating() {
        it('should gate the data', function _testGate() {
            var stringsBetween2sAnd8s = compose(
                gating(x => 3 > x, x => 7 < x),//items less than 3 open the gate, items over 7 close it
                filtering(x => 'string' === typeof x)//of those that pass, only items that are strings
            );
            reduce(stringsBetween2sAnd8s(concat), [], ['zoop', 1, 5, 6, 'bloop', 7, 8, 9, 4, 'bop', 7, 8, 9, 2, 'barp'])
                .should.eql(['bloop', 'barp']);
        });
    });

    describe('Test mapReducer', function _testMapReducer() {
        it('should behave as an array map operation', function _testMapReducer() {
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(mapReducer((x) => x + 1), []).should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(mapReducer((x) => x * x), []).should.eql([0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
        });
    });

    describe('Test filterReducer', function _testFilterReducer() {
        it('should behave as an array filter operation', function _testFilterReducer() {
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce(filterReducer((x) => 0 === x % 2), []).should.eql([2, 4, 6, 8, 10]);
        });
    });

    describe('Test filterReducer and mapReducer composition', function _testComposition() {
        it('should compose well', function _testComposition() {
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                .reduce(mapReducer((x) => x + 1), [])
                .reduce(filterReducer((x) => 0 === x % 2), [])
                .should.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                .map((x) => x + 1)
                .filter((x) => 0 === x % 2));
        });
    });

    describe('Test mapping and filtering composition', function _testComposition() {
        it('should compose', function _testCompose() {
            var square = (x) => x * x,
                xform = compose(
                    filtering((x) => 0 === x % 2),
                    filtering((x) => 10 > x),
                    mapping(square),
                    mapping((x) => x + 1));

            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                .reduce(xform((xs, x) => {
                    xs.push(x);
                    return xs;
                }), []).should.eql([1, 5, 17, 37, 65]);
        });
    });

    describe('Test transduce', function _testTransduce() {
        it('should transduce', function _transduce() {
            var xform = compose(
                mapping((x) => x + 1),
                filtering((x) => 0 === x % 2));

            transduce(xform, (xs, x) => {
                xs.push(x);
                return xs;
            }, [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).should.eql([2, 4, 6, 8, 10]);

            transduce(xform, (sum, x) => sum + x, 0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).should.eql(30);
        });
    });
});