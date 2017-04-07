import { observableStatus } from '../helpers';
import { subscriber } from './subscribers/subscriber';
import { deepMapOperator, filterOperator, groupByOperator, itemBufferOperator, mapOperator, mergeOperator, timeBufferOperator } from './streamOperators/operators';

var observable = {
    get source() {
        return this._source;
    },
    set source(src) {
        this._source = src;
    },
    get operator() {
        return this._operator;
    },
    set operator(op) {
        this._operator = op;
    },
    map: function _map(fn) {
        return this.lift(Object.create(mapOperator).init(fn));
    },
    deepMap: function _deepMap(fn) {
        return this.lift(Object.create(deepMapOperator).init(fn));
    },
    filter: function _filter(pred) {
        return this.lift(Object.create(filterOperator).init(pred));
    },
    groupBy: function _groupBy(keySelector, comparer, bufferAmt = 0) {
        return this.lift(Object.create(groupByOperator).init(keySelector, comparer, bufferAmt))
    },
    merge: function _merge(...observables) {
        var transform;
        if ('function' === typeof observables[observables.length - 1]) {
            transform = observables[observables.length - 1];
            observables = observables.slice(0, observables.length - 1);
        }
        return this.lift(Object.create(mergeOperator).init([this].concat(observables), transform));
    },
    itemBuffer: function _itemBuffer(count) {
        return this.lift(Object.create(itemBufferOperator).init(count));
    },
    timeBuffer: function _timeBuffer(amt) {
        return this.lift(Object.create(timeBufferOperator).init(amt));
    },
    lift: function lift(operator) {
        var o = Object.create(observable);
        o.source = this;
        o.operator = operator;
        return o;
    },
    fromEvent: function _fromEvent(src, evt) {
        var o = Object.create(observable);
        o.source = src;
        o.event = evt;
        o.subscribe = function _subscribe(subscriber) {
            var source = this.source,
                event = this.event;

            function eventHandler(e) {
                return subscriber.next(e);
            }

            function unSub() {
                subscriber.status = observableStatus.complete;
                return source.removeEventListener(event, eventHandler);
            }
            source.addEventListener(event, eventHandler);
            subscriber.unsubscribe = unSub;
            return subscriber;
        };
        return o;
    },
    fromArray: function _fromArray(src, startingIdx = 0) {
        var o = Object.create(observable);
        o.source = src;
        o.idx = startingIdx;
        o.subscribe = function _subscribe(subscriber) {
            function unSub() {
                this.status = observableStatus.complete;
            }

            var runner = (function _runner() {
                if (subscriber.status !== observableStatus.paused && subscriber.status !== observableStatus.complete && this.idx < this.source.length) {
                    Promise.resolve(this.source[this.idx++])
                        .then(function _resolve(val) {
                            subscriber.next(val);
                            runner();
                        });
                }
                else {
                    var d = subscriber;
                    while (d.subscriber.subscriber) d = d.subscriber;
                    d.unsubscribe();
                }
            }).bind(this);

            Promise.resolve()
                .then(function _callRunner() {
                    runner();
                });

            subscriber.unsubscribe = unSub;
            return subscriber;
        };
        return o;
    },
    subscribe: function _subscribe(next, error, complete) {
        var s = Object.create(subscriber).initialize(next, error, complete);
        if (this.operator) this.operator.subscribe(s, this.source);
        return s;
    }
};

export { observable };