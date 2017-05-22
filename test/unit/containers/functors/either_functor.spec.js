import { Either, Left, Right, _either_f } from '../../../../src/containers/functors/either_functor';

describe('Either functor tests', function _testEitherFunctor() {
    describe('Either object factory tests', function _testEitherObjectFactory() {
        it('should return a new either functor with the correct side', function testEitherFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                e1 = Either(),
                e2 = Either(null, 'left'),
                e3 = Either(arr, 'right'),
                e4 = Either(obj, 'right');

            _either_f.isPrototypeOf(e1).should.be.true;
            _either_f.isPrototypeOf(e2).should.be.true;
            _either_f.isPrototypeOf(e3).should.be.true;
            _either_f.isPrototypeOf(e4).should.be.true;

            e1.isLeft.should.be.true;
            e1.isRight.should.not.be.true;
            e2.isLeft.should.be.true;
            e2.isRight.should.not.be.true;
            e3.isLeft.should.not.be.true;
            e3.isRight.should.be.true;
            e4.isLeft.should.not.be.true;
            e4.isRight.should.be.true;
        });

        it('should return the same type/value when using the #of function', function testEitherDotOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                e1 = Either(),
                e2 = Either(null, 'left'),
                e3 = Either(arr, 'right'),
                e4 = Either(obj, 'right');

            _either_f.isPrototypeOf(e1).should.be.true;
            _either_f.isPrototypeOf(e2).should.be.true;
            _either_f.isPrototypeOf(e3).should.be.true;
            _either_f.isPrototypeOf(e4).should.be.true;

            e1.isLeft.should.be.true;
            e1.isRight.should.not.be.true;
            e2.isLeft.should.be.true;
            e2.isRight.should.not.be.true;
            e3.isLeft.should.not.be.true;
            e3.isRight.should.be.true;
            e4.isLeft.should.not.be.true;
            e4.isRight.should.be.true;
        });

        it('should return correct results when isLeft/isRight is called on an either', function _testEitherFactorIsLeftIsRightHelpers() {
            var EitherSpy = sinon.spy(Either),
                e1 = Left(1),
                e2 = Left('test'),
                e3 = Right(1),
                e4 = Right('test');

            //EitherSpy.callCount.should.eql(4);

            Either.isLeft(e1).should.be.true;
            Either.isRight(e1).should.be.false;

            Either.isLeft(e2).should.be.true;
            Either.isRight(e2).should.be.false;

            Either.isLeft(e3).should.be.false;
            Either.isRight(e3).should.be.true;

            Either.isLeft(e4).should.be.false;
            Either.isRight(e4).should.be.true;
        });
    });

    describe('Left and Right either functor creation tests', function _testLeftAndRightObjectCreation() {
        it('should return a new left either functor', function _testEitherCreationViaLeftFunction() {
            var e1 = Left(),
                e2 = Left(1),
                e3 = Left(null);

            e1.isLeft.should.be.true;
            e1.isRight.should.be.false;

            e2.isLeft.should.be.true;
            e2.isRight.should.be.false;

            e3.isLeft.should.be.true;
            e3.isRight.should.be.false;
        });

        it('should return a new right either functor', function _testEitherCreationViaRightFunction() {
            var e1 = Right(),
                e2 = Right(1),
                e3 = Right(null);

            e1.isLeft.should.be.false;
            e1.isRight.should.be.true;

            e2.isLeft.should.be.false;
            e2.isRight.should.be.true;

            e3.isLeft.should.be.false;
            e3.isRight.should.be.true;
        });
    });

    describe('Either functor object tests', function _testEitherFunctorObject() {
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var e = Either(1),
                err1 = false,
                err2 = false;
            e.should.have.ownPropertyDescriptor('_value', { value: 1, writable: false, configurable: false, enumerable: false });

            try {
                e._value = 2;
            }
            catch(e) {
                err1 = true;
            }
            err1.should.be.true;

            try {
                e.value = 2;
            }
            catch(e) {
                err2 = true;
            }

            err2.should.be.true;
        });

        it('should return a new either instance with a new value when mapping a right either', function _testRightEitherMapping() {
            var e1 = Right(1),
                e2 = Right([1, 2, 3]);

            var e1_1 = e1.map(function _m(i) { return i*2; }),
                e2_1 = e2.map(function _m(a) { return a.map(function t(i) { return i * 2 ;}); });

            _either_f.isPrototypeOf(e1_1).should.be.true;
            _either_f.isPrototypeOf(e2_1).should.be.true;

            e1_1.isLeft.should.be.false;
            e1_1.isRight.should.be.true;

            e2_1.isLeft.should.be.false;
            e2_1.isRight.should.be.true;

            e1_1.value.should.eql(2);
            e2_1.value.should.eql([2, 4, 6]);
        });

        it('should return a new either instance with the same value when mapping a left either', function _testLeftEitherMapping() {
            var e1 = Left(null),
                e2 = Left('this is a test');

            var e1_1 = e1.map(function _nothin() { return true; }),
                e2_1 = e2.map(function _nothin2() { return false; });

            _either_f.isPrototypeOf(e1_1).should.be.true;
            _either_f.isPrototypeOf(e2_1).should.be.true;

            e1_1.isLeft.should.be.true;
            e1_1.isRight.should.be.false;

            e2_1.isLeft.should.be.true;
            e2_1.isRight.should.be.false;

            expect(e1_1.value).to.eql(e1.value);
            e2_1.value.should.eql(e2.value);
        });

        it('should return a new either instance with a new value when flat mapping a nested right either', function _testRightEitherFlatMapping() {
            var e1 = Right(Right(1)),
                e2 = Right(Right([1, 2, 3])),
                e3 = Right(1);

            var e1_1 = e1.flatMap(function _changeNum() { return 10; }),
                e2_1 = e2.flatMap(function _changeNums(item) { return item.map(function _changeNum(it) { return it * 5; }); }),
                e3_1 = e3.flatMap(function _changeNum() { return 2; });

            _either_f.isPrototypeOf(e1_1).should.be.true;
            _either_f.isPrototypeOf(e2_1).should.be.true;
            _either_f.isPrototypeOf(e3_1).should.be.true;

            e1_1.isLeft.should.be.false;
            e1_1.isRight.should.be.true;

            e2_1.isLeft.should.be.false;
            e2_1.isRight.should.be.true;

            e3_1.isLeft.should.be.false;
            e3_1.isRight.should.be.true;

            e1_1.value.should.eql(10);
            e2_1.value.should.eql([5, 10, 15]);
            e3_1.value.should.eql(2);
        });

        it('should return a new either instance with the same value when flat mapping a nest left either', function _testLeftEitherFlatMapping() {
            var e1 = Left(Left(1)),
                e2 = Left(Left([1, 2, 3])),
                e3 = Left(1);

            var e1_1 = e1.flatMap(function _changeNum() { return 10; }),
                e2_1 = e2.flatMap(function _changeNums(item) { return item.map(function _changeNum(it) { return it * 5; }); }),
                e3_1 = e3.flatMap(function _changeNum() { return 2; });

            _either_f.isPrototypeOf(e1_1).should.be.true;
            _either_f.isPrototypeOf(e2_1).should.be.true;
            _either_f.isPrototypeOf(e3_1).should.be.true;

            console.log(e3_1.toString());

            e1_1.isLeft.should.be.true;
            e1_1.isRight.should.be.false;

            e2_1.isLeft.should.be.true;
            e2_1.isRight.should.be.false;

            e3_1.isLeft.should.be.true;
            e3_1.isRight.should.be.false;

            e1_1.value.should.eql(1);
            e2_1.value.should.eql([1, 2, 3]);
            e3_1.value.should.eql(1);
        });

        it('should return a new constant functor regardless of data type', function testConstantFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                e = Either(),
                e1 = e.of(),
                e2 = e.of(null),
                e3 = e.of(arr),
                e4 = e.of(obj);

            _either_f.isPrototypeOf(e1).should.be.true;
            _either_f.isPrototypeOf(e2).should.be.true;
            _either_f.isPrototypeOf(e3).should.be.true;
            _either_f.isPrototypeOf(e4).should.be.true;

            e1.isLeft.should.be.false;
            e1.isRight.should.be.true;
            e2.isLeft.should.be.false;
            e2.isRight.should.be.true;
            e3.isLeft.should.not.be.true;
            e3.isRight.should.be.true;
            e4.isLeft.should.not.be.true;
            e4.isRight.should.be.true;
        });

        it('should print the correct container type + value when .toString() is invoked', function testConstantFunctorToString() {
            var c1 = Either(1, 'right'),
                c2 = Either(null),
                c3 = Either([1, 2, 3], 'left'),
                c4 = Either(Either(Either(5, 'right'), 'left'), 'right');

            c1.toString().should.eql('Right(1)');
            c2.toString().should.eql('Left(null)');
            c3.toString().should.eql('Left(1,2,3)');
            c4.toString().should.eql('Right(Left(Right(5)))');
        });
    });
});