import { observable } from '../../../src/streams/observable';

describe('Test observable', function _testObservable() {
    function noop() {}
    it('should return an observable delegator when any #from* function property is invoked', function _testObservableFromStar() {
        expect(observable.isPrototypeOf(observable.fromEvent(null, null))).to.be.true;
        expect(observable.isPrototypeOf(observable.fromList([1, 2, 3], null))).to.be.true;
        expect(observable.isPrototypeOf(observable.fromGenerator(null))).to.be.true;
        expect(observable.isPrototypeOf(observable.from([]))).to.be.true;
    });

    it('should return an observable delegator when any operator function property is invoked on an existing observable delegate', function _testObservableOperators() {
        var observer = observable.from([1, 2, 3]);

        expect(observable.isPrototypeOf(observer.map(noop))).to.be.true;
        expect(observable.isPrototypeOf(observer.filter(noop))).to.be.true;
        expect(observable.isPrototypeOf(observer.chain(noop))).to.be.true;
        expect(observable.isPrototypeOf(observer.groupBy(noop))).to.be.true;
        expect(observable.isPrototypeOf(observer.merge(noop))).to.be.true;
        expect(observable.isPrototypeOf(observer.itemBuffer(noop))).to.be.true;
        expect(observable.isPrototypeOf(observer.timeBuffer(noop))).to.be.true;
        expect(observable.isPrototypeOf(observer.debounce(noop))).to.be.true;
        expect(observable.isPrototypeOf(observer.lift(noop))).to.be.true;
    });

    it('should allow chaining of operations on an observable', function _testObservableOperationChaining() {
        expect(observable.isPrototypeOf(observable.fromList([1, 2, 3, 4, 5])
            .groupBy(noop)
            .map(noop)
            .filter(noop)
            .merge(noop)
        )).to.be.true;
    });

    it('should yield out the values from a list observable', function _testObservableList(done) {
        var list = [1, 2, 3, 4, 5],
            res = [];

        observable.fromList(list, 0)
            .map(function _mapList(val) {
                return val * 2;
            })
            .subscribe(val => res.push(val),
                console.error,
                function _complete() {
                    res.should.eql([2, 4, 6, 8, 10]);
                    done();
                });
    });

    it('should use the default value when none is provided', function _testMapWithoutMappingFunctionArgument(done) {
        var list = [1, 2, 3, 4, 5],
            res = [];

        observable.fromList(list, 0)
            .map()      // => no map function
            .subscribe(val => res.push(val),
                console.error,
                function _complete() {
                    res.should.eql(list);
                    done();
                });
    });
});