import { observableStatus } from '../helpers';
import { subscriber } from './subscribers/subscriber';
import { deepMapOperator, filterOperator, groupByOperator, itemBufferOperator, mapOperator, mergeOperator, timeBufferOperator } from './streamOperators/operators';
import { generatorProto } from '../helpers';
import { wrap } from '../functionalHelpers';

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
    /**
     *
     * @param fn
     * @returns {observable}
     */
    map: function _map(fn) {
        return this.lift(Object.create(mapOperator).init(fn));
    },
    /**
     *
     * @param fn
     * @returns {observable}
     */
    deepMap: function _deepMap(fn) {
        return this.lift(Object.create(deepMapOperator).init(fn));
    },
    /**
     *
     * @param predicate
     * @returns {observable}
     */
    filter: function _filter(predicate) {
        return this.lift(Object.create(filterOperator).init(predicate));
    },
    /**
     *
     * @param keySelector
     * @param comparer
     * @param bufferAmt
     * @returns {observable}
     */
    groupBy: function _groupBy(keySelector, comparer, bufferAmt = 0) {
        return this.lift(Object.create(groupByOperator).init(keySelector, comparer, bufferAmt))
    },
    /**
     *
     * @param observables
     * @returns {observable}
     */
    merge: function _merge(...observables) {
        var transform;
        if ('function' === typeof observables[observables.length - 1]) {
            transform = observables[observables.length - 1];
            observables = observables.slice(0, observables.length - 1);
        }
        return this.lift(Object.create(mergeOperator).init([this].concat(observables), transform));
    },
    /**
     *
     * @param count
     * @returns {observable}
     */
    itemBuffer: function _itemBuffer(count) {
        return this.lift(Object.create(itemBufferOperator).init(count));
    },
    /**
     *
     * @param amt
     * @returns {observable}
     */
    timeBuffer: function _timeBuffer(amt) {
        return this.lift(Object.create(timeBufferOperator).init(amt));
    },
    /**
     *
     * @param operator
     * @returns {observable}
     */
    lift: function lift(operator) {
        var o = Object.create(observable);
        o.source = this;
        o.operator = operator;
        return o;
    },
    /**
     *
     * @param src
     * @param evt
     * @returns {observable}
     */
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
    /**
     *
     * @param src
     * @param startingIdx
     * @returns {observable}
     */
    fromList: function _fromList(src, startingIdx = 0) {
        var o = Object.create(observable);
        o.source = src;
        o.idx = startingIdx;
        o.subscribe = function _subscribe(subscriber) {
            function unSub() {
                this.status = observableStatus.complete;
            }

            var runner = (function _runner() {
                if (subscriber.status !== observableStatus.paused && subscriber.status !== observableStatus.complete && this.idx < this.source.length) {
                    for (let item of source) {
                        Promise.resolve(item)
                            .then(function _resolve(val) {
                                subscriber.next(val);
                                runner();
                            });
                    }
                }
                else {
                    //TODO: don't think I need to do this 'recursive' unsubscribe here since the
                    //TODO: unsubscribe function is itself recursive
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
    /**
     *
     * @param src
     * @returns {observable}
     */
    fromGenerator: function _fromGenerator(src) {
        var o = Object.create(observable);
        o.source = src;
        o.subscribe = function _subscribe(subscriber) {
            var it = this.source();
            var runner = (function _runner() {
                if (subscriber.status !== observableStatus.paused && subscriber.status !== observableStatus.complete) {
                    Promise.resolve(it.next())
                        .then(function _then(val) {
                            if (!it.done) {
                                subscriber.next(val);
                                runner();
                            }
                        });
                }
                else {
                    this.unsubscribe();
                }
            }).bind(this);
        };
        return o;
    },
    /**
     *
     * @param src
     * @returns {observable} - Returns a new observable
     */
    from: function _from(src) {
        if (generatorProto.isPrototypeOf(src)) return this.fromGenerator(src);
        return this.fromList(src[Symbol.iterator] ? src : wrap(src));
    },
    /**
     * Creates a new subscriber for this observable. Takes three function handlers;
     * a 'next' handler that receives each item after having passed through the lower
     * level subscribers, an 'error' handler that is called if an exception is thrown
     * while the stream is active, and a complete handler that is called whenever the
     * stream is done.
     * @param {function} next - A function handler
     * @param {function} error - A function handler
     * @param {function} complete - A function handler
     * @returns {subscriber}
     */
    subscribe: function _subscribe(next, error, complete) {
        var s = Object.create(subscriber).initialize(next, error, complete);
        if (this.operator) this.operator.subscribe(s, this.source);
        return s;
    }
};

export { observable };