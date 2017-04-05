import { curry, isArray } from '../functionalHelpers';

var observableStatus = {
    inactive: 0,
    active: 1,
    paused: 2,
    complete: 3
};

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
                    while (d.dest.dest) d = d.dest;
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
        var s = Object.create(subscriber).initialize(next, error, complete),
            ret;
        if (this.operator) {
            ret = this.operator.subscribe(s, this.source);
        }
        else {
            ret = this.subscribe(s);
        }

        s.unsubscribe = function _unsubscribe() {
            if (observableStatus.complete === this.status) return;
            this.status = observableStatus.complete;
            var retProto = Object.getPrototypeOf(ret);
            //TODO: not sure of the order that needs to happen here, or if it even matters
            //Have to use Function#call property to invoke the prototype's unsubscribe method in case,
            //as it is with the timeBufferSubscriber, a specific property of the subscriber is needed
            //in order to perform the unsubscription.
            if (retProto.unsubscribe) retProto.unsubscribe.call(ret);
            ret.unsubscribe();
        };
        return s;
    }
};

var mapOperator = {
    get transform() {
        return this._transform;
    },
    set transform(fn) {
        this._transform = fn;
    },
    init: function _init(projectionFunc) {
        this.transform = projectionFunc;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(mapSubscriber).init(subscriber, this.transform));
    }
};

var deepMapOperator = {
    get transform() {
        return this._transform;
    },
    set transform(fn) {
        this._transform = fn;
    },
    init: function _init(projectionFunc) {
        this.transform = projectionFunc;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(deepMapSubscriber).init(subscriber, this.transform));
    }
};

var filterOperator = {
    get predicate() {
        return this._predicate;
    },
    set predicate(fn) {
        this._predicate = fn;
    },
    init: function _init(pred) {
        this.predicate = pred;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(filterSubscriber).init(subscriber, this.predicate));
    }
};

var mergeOperator = {
    get observables() {
        return this._observables || [];
    },
    set observables(arr) {
        this._observables = arr;
    },
    get transform() {
        return this._transform;
    },
    set transform(fn) {
        this._transform = fn;
    },
    init: function _init(observables, transform) {
        this.observables = observables;
        this.transform = transform;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(mergeSubscriber).init(subscriber, this.observables, this.transform));
    }
};

var timeBufferOperator = {
    init: function _init(amt) {
        this.interval = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(timeBufferSubscriber).init(subscriber, this.interval));
    }
};

var itemBufferOperator = {
    init: function _init(amt) {
        this.count = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(itemBufferSubscriber).init(subscriber, this.count));
    }
};


var subscriber = {
    get status() {
        return this._status || observableStatus.inactive;
    },
    set status(status) {
        this._status = Object.keys(observableStatus)
            .map(function _statusValues(status) { return observableStatus[status]; })
            .includes(status) ?
            status : observableStatus.inactive;
    },
    get count() {
        return this._count || 0;
    },
    set count(cnt) {
        this._count = cnt || 0;
    },
    get subscribers() {
        return this._subscribers || [];
    },
    set subscribers(subs) {
        this._subscribers = (this._subscribers || []).concat(subs);
    },
    next: function _next(item) {
        Promise.resolve(item).then(this.then);
    },
    error: function _error(err) {
        this.status = observableStatus.complete;
        this.dest.error(err);
    },
    complete: function _complete() {
        this.status = observableStatus.complete;
        this.dest.complete();
    },
    initialize: function _initialize(next, error, complete) {
        this.status = observableStatus.active;
        this.count = 0;
        this.then = (function _then(val) {
            return this.dest.next(val);
        }).bind(this);

        if (subscriber.isPrototypeOf(next)) {
            this.dest = next;
            next.subscribers = this;
            return this;
        }
        this.dest = {
            next: next,
            error: error,
            complete: complete
        };
        return this;
    }
};

var mapSubscriber = Object.create(subscriber);
mapSubscriber.next = function _next(item) {
    var res;
    try {
        res = this.transform(item, this.count++);
    }
    catch (err) {
        this.dest.error(err);
        return;
    }
    Promise.resolve(res).then(this.then);
};
mapSubscriber.init = function _init(subscriber, transform) {
    this.initialize(subscriber);
    this.transform = transform;
    return this;
};

//TODO: need to see how to handle a deep map (as well as flatten); should I return entire
//TODO: collection at once? Or one item at a time? And if the latter, when does each item
//TODO: get returned?
var deepMapSubscriber = Object.create(subscriber);
deepMapSubscriber.next = function _next(item) {
    var mappedResult;
    try {
        mappedResult = recursiveMap(item);
    }
    catch (err) {
        this.dest.error(err);
        return;
    }
    Promise.resolve(mappedResult).then(this.then);

    function recursiveMap(item) {
        if (isArray(item)) {
            var res = [];
            for (let it of item) {
                res = res.concat(recursiveMap(it));
            }
            return res;
        }
        return this.transform(item, this.count++);
    }
};
deepMapSubscriber.init = function _init(subscriber, transform) {
    this.initialize(subscriber);
    this.transform = transform;
    return this;
};

var filterSubscriber = Object.create(subscriber);
filterSubscriber.next = function _next(item) {
    try {
        if (this.predicate(item, this.count++))
            Promise.resolve(item).then(this.then);
    }
    catch (err) {
        this.dest.error(err);
    }
};
filterSubscriber.init = function _init(subscriber, predicate) {
    this.initialize(subscriber);
    this.predicate = predicate;
    return this;
};

var mergeSubscriber = Object.create(subscriber);
mergeSubscriber.next = function _next(item) {
    if (this.transform) {
        var res;
        try {
            res = this.transform(item, this.count++);
        }
        catch (err) {
            this.dest.error(err);
            return;
        }
        Promise.resolve(res).then(this.then);
    }
    else this.dest.next(item);
};

mergeSubscriber.init = function _init(subscriber, observables, transform) {
    this.transform = transform;
    observables.forEach(function _subscribeToEach(observable) {
        observable.subscribe(this);
    }, this);
    this.initialize(subscriber);
    return this;
};

var timeBufferSubscriber = Object.create(subscriber, {
    id: {
        get: function _getId() {
            return this._id || 0;
        },
        set: function _setId(val) {
            this._id = val;
        }
    }
});
timeBufferSubscriber.next = function _next(val) {
    this.buffer[this.buffer.length] = val;
};
timeBufferSubscriber.init = function _init(subscriber, interval) {
    this.initialize(subscriber);
    this.buffer = [];
    this.now = Date.now;

    function _interval() {
        if (this.buffer.length) {
            this.dest.next(this.buffer.map(function _mapBuffer(item) { return item; }));
            this.buffer.length = 0;
        }
    }

    this.id = setInterval((_interval).bind(this), interval);
    return this;
};
timeBufferSubscriber.unsubscribe = function _unsubscribe() {
    clearInterval(this.id);
};

var itemBufferSubscriber = Object.create(subscriber);
itemBufferSubscriber.next = function _next(val) {
    this.buffer[this.buffer.length] = val;
    if (this.buffer.length >= this.count) {
        this.dest.next(this.buffer.map(function _mapBuffer(item) { return item; }));
        this.buffer.length = 0;
    }
};
itemBufferSubscriber.init = function _init(subscriber, count) {
    this.initialize(subscriber);
    this.buffer = [];
    this.count = count;
    return this;
};



function functionBinder(context, funcs) {
    if ('function' === typeof funcs)
        return funcs.bind(context);
    else {
        funcs.map(function bindFuncs(fn) {
            return fn.bind(context);
        });
    }
}

function cloneData(data) {
    if (null == data || 'object' !== typeof data)
        return data;

    if (Array.isArray(data))
        return cloneArray(data);

    var temp = {};
    /*
     var fields = Object.keys(data).concat(climbPrototypeChain(obj));
     Object.keys(data).forEach(function _cloneGridData(field) {
     temp[field] = cloneData(data[field]);
     });
     */

    Object.keys(data)
        .concat(climbPrototypeChain(data))
        .forEach(function _cloneGridData(field) {
            temp[field] = cloneData(data[field]);
        });
    return temp;
}

function cloneArray(arr) {
    var length = arr.length,
        newArr = new arr.constructor(length),
        index = -1;
    while (++index < length) {
        newArr[index] = cloneData(arr[index]);
    }
    return newArr;
}

function climbPrototypeChain(obj) {
    var fields = [];
    obj = Object.getPrototypeOf(obj);
    while (obj !== Object.prototype) {
        fields = fields.concat(Object.keys(obj));
        obj = Object.getPrototypeOf(obj);
    }
    return fields;
}




//Functors
var baseFunctor = {
    _value: null
};

baseFunctor.of = function _of(a) {
    var b = Object.create(this);
    b._value = a;
    return b;
};

var container = Object.create(baseFunctor);
container.map = function _map(fn) {
    return container.of(fn(this._value));
};

var maybe = Object.create(baseFunctor);
maybe.map = function _map(fn) {
    return this.isNothing() ? maybe.of(null) : maybe.of(fn(this._value));
};
maybe.isNothing = function _isNothing() {
    return null == this._value;
};

var left = Object.create(baseFunctor);
left.map = function _map(fn) {
    return this;
};

var right = Object.create(baseFunctor);
right.map = function _map(fn) {
    return right.of(fn(this._value));
};

var io = {
    _value: null
};
io.of = function _of(a) {
    var i = Object.create(io);
    i._value = function _val() {
        return a;
    };
    return i;
};
io.map = function _map(fn) {
    return compose(Object.create(io), fn, this._value);
};

var kestrel = curry(function _k(val) {
    return function _val() {
        return val;
    };
});

var fork = curry(function(lastly, f, g, x) {
    return lastly(f(x), g(x));
});

var map = curry(function _map(f, a) {
    return a.map(f);
});

var unfold = curry(function _unfold(fn, seed) {
    var items = fn(seed),
        res = [];
    while (items && items.length) {
        res[res.length] = items[0];
        items = fn(items[1]);
    }
    return res;
});


var unless = curry(function _unless(pred, fn, a) {
    return pred(a) ? a : fn(a);
});

function compose(...args) {
    var item = args[args.length - 1];
    return args.slice(0, args.length - 1).reduce(function _reducer(fn) {
        return fn(item);
    }, item);
}

function pipe(...args) {
    return compose(args.reverse());
}

var join = curry(function _join(ma) {
    return ma.join();
});

var flatMap = curry(function _flatMap(fn, ma) {
    return ma.map(fn).join();
});


function alterFunctionLength(fn, len) {
    return Object.defineProperty(
        fn,
        'length', {
            value: len
        }
    );
}

function not(fn) {
    return curry(alterFunctionLength(function _not(...rest) {
        return !fn(...rest);
    }, fn.length));
}

function _notTest(arg1, arg2, arg3, arg4) {
    console.log(arg1, arg2, arg3, arg4);
    return arg1 + arg2 + arg3 + arg4;
}

var testNot = not(_notTest);
var b = testNot(1);
var c = b(2);
var p = c(3)(4);
console.log(p);