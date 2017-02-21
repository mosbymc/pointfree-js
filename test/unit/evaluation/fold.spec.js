import { fold } from '../../../src/evaluation/fold';

describe('Test fold', function testFold() {
    it('should return sum of values', function testFoldWithAddition() {
        var arr = [1, 2, 3, 4, 5];
        var foldRes = fold(arr, function _fold(val, cur) { return cur + val; }, 0);
        foldRes.should.eql(15);
    });

    it('should return product of values', function testFoldWithMultiplication() {
        var arr = [1, 2, 3, 4, 5];
        var foldRes = fold(arr, function _fold(val, cur) { return cur * val; }, 1);
        foldRes.should.eql(120);
    });

    it('should default initial to zero', function testFoldWithNoInitialValue() {
        var arr = [1, 2, 3, 4, 5];
        var foldRes = fold(arr, function _fold(val, cur) { return cur * val; });
        foldRes.should.eql(0);
    });
});