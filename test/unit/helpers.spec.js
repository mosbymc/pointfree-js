import { cacher, deepClone, deepCopy } from '../../src/helpers';
import { testData } from '../testData';

function checkClonedDataProps(orig, clone) {
    return Object.keys(orig).every(function checkEveryProp(key) {
        if ('object' !== typeof orig[key] && !Array.isArray(orig[key]))
            return orig[key].should.eql(clone[key]);
        else if (Array.isArray(orig[key]))
            return checkClonedArrayIndices(orig[key], clone[key]);
        return checkClonedDataProps(orig[key], clone[key]);
    });
}

function checkClonedArrayIndices(orig, clone) {
    return clone.every(function testValuesForEquality(item, idx) {
        if ('object' !== typeof item)
            return item.should.eql(orig[idx]);
        return checkClonedDataProps(orig[idx], item);
    });
}

describe('test helpers', function _testHelpers() {

    describe('deepCopy', function testCloneArray() {
        it('should clone arrays', function testCloneArray() {
            var clonedArr = deepCopy(testData.dataSource.data);
            expect(checkClonedArrayIndices(testData.dataSource.data, clonedArr)).to.be.true;
        });
    });

    describe('cacher', function testMemoizer() {
        it('should remember unique values for each instance', function testMemoizer() {
            function comparer(a, b) { return a === b; }
            var mem1 = cacher(comparer),
                mem2 = cacher(comparer),
                mem3 = cacher(comparer);

            testData.dataSource.data.forEach(function findUniques(item) {
                mem1(item).should.not.be.true;
                mem2(item).should.not.be.true;
                mem1(item).should.be.true;
            });

            [1, 1, 2, 2, 3, 3, 4, 4, 5, 5].forEach(function findUniques(item, idx) {
                mem3(item).should.eql(!!(idx % 2));
            });
        });
    });

    describe('Test deepClone', function _testDeepClone() {
        it('should clone a simple object', function _testSimpleObjectClone() {
            var obj = {
                a: 1,
                b: 2,
                c: '3',
                d: false,
                e: null,
                f: undefined,
                g: Symbol.iterator
            };

            var clonedObj = deepClone(obj);

            Object.keys(clonedObj).should.eql(Object.keys(obj));
            Object.getOwnPropertyNames(clonedObj).should.eql(Object.getOwnPropertyNames(obj));
            clonedObj.a.should.eql(obj.a);
            clonedObj.b.should.eql(obj.b);
            clonedObj.c.should.eql(obj.c);
            clonedObj.d.should.eql(obj.d);
            expect(clonedObj.e).to.eql(obj.e);
            expect(clonedObj.f).to.eql(obj.f);
            expect(clonedObj.g).to.eql(obj.g);

            Object.getPrototypeOf(clonedObj).should.eql(Object.getPrototypeOf(obj));
        });

        it('should clone a simple array', function _testArrayCloning() {
            var arr = [1, 2, 3, 4, 5],
                clonedArr = deepClone(arr);

            Object.getPrototypeOf(clonedArr).should.eql(Object.getPrototypeOf(arr));
            Object.getOwnPropertyNames(clonedArr).forEach(function _checkEachKey(key) {
                clonedArr[key].should.eql(arr[key]);
            });
        });

        it('should clone a simple function', function _testSimpleFunctionClone() {
            function func(){ return 10; }

            var clonedFunc = deepClone(func);

            Object.getPrototypeOf(clonedFunc).should.eql(Object.getPrototypeOf(func));
            Object.getOwnPropertyNames(clonedFunc).forEach(function _checkEachKey(key) {
                clonedFunc[key].should.eql(func[key]);
            });
            clonedFunc().should.eql(func());
        });

        it('should \'clone\' primitives', function _testPrimitiveClone() {
            var cloneStr = deepClone('test'),
                cloneNum = deepClone(2),
                cloneBool = deepClone(false),
                cloneNull = deepClone(null),
                cloneUndefined = deepClone(),
                cloneSymbol = deepClone(Symbol.iterator);

            cloneStr.should.eql('test');
            cloneNum.should.eql(2);
            cloneBool.should.eql(false);
            expect(cloneNull).to.be.null;
            expect(cloneUndefined).to.be.undefined;
            expect(cloneSymbol).to.eql(Symbol.iterator);
        });

        it('should clone objects with proper delegation', function _testDelegateCloning() {
            var delegate = { a: 1, b: 2 },
                delegator = Object.create(delegate);

            var clonedDelegator = deepClone(delegator);

            Object.getOwnPropertyNames(clonedDelegator).should.eql(Object.getOwnPropertyNames(delegator));
            Object.getPrototypeOf(clonedDelegator).should.eql(delegate);
        });

        it('should clone complex/nested objects', function _testNestedObjectCloning() {
            var delegateObj1 = {
                a: 1,
                b: function _b(val) { return val * 2; },
                g: {
                    h: 2
                }
            },
                delegateObj2 = Object.create(delegateObj1, {
                    c: {
                        value: 3
                    },
                    d: {
                        get: function _getFive() {
                            return 5;
                        }
                    }
                }),
                delegator = Object.create(delegateObj2, {
                    e: {
                        value: 6
                    },
                    f: {
                        value: '7'
                    }
                });

            var clonedDelegator = deepClone(delegator);
            Object.getPrototypeOf(clonedDelegator).should.eql(Object.getPrototypeOf(delegator));
            Object.getOwnPropertyNames(clonedDelegator).should.eql(Object.getOwnPropertyNames(delegator));
            clonedDelegator.d.should.eql(delegator.d);
            clonedDelegator.b().should.eql(delegator.b());
        });

        it('should not get caught in infinite recursion', function _testCloneDoesNotLoopInfinitely() {
            var obj = { a: 1, b: 2 };
            obj.g = {c: 3, e: 4, f: obj};

            var clonedObj = deepClone(obj);
            clonedObj.a.should.eql(obj.a);
            clonedObj.b.should.eql(obj.b);
            clonedObj.g.should.eql(obj.g);
            clonedObj.g.f.should.eql(clonedObj);

            Object.keys(obj).every(key => key in clonedObj).should.be.true;
            Object.keys(clonedObj).every(key => key in obj).should.be.true;
        });
    });
});
