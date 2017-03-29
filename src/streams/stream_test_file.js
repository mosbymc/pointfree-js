var eventObservable = {
    source: null,
    event: null,
    from: function _from(src, evt) {
        var o = Object.create(observable);
        o.source = src;
        o.event = evt;
        o.subscribe = this.subscribe;
        return o;
    },
    subscribe: function _subscribe(subscriber) {
        var source = this.source,
            event = this.event;

        function eventHandler(e) {
            return subscriber.next(e);
        }

        function unSub() {
            return source.removeEventListener(event, eventHandler);
        }
        source.addEventListener(event, eventHandler);
        subscriber.unsubscribe = unSub;
        return subscriber;
    }
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
    get count() {
        return this._count;
    },
    set count(cnt) {
        this._count = cnt;
    },
    map: function _map(fn) {
        return this.lift(Object.create(mapOperator).init(fn));
    },
    filter: function _filter(pred) {
        return this.lift(Object.create(filterOperator).init(pred));
    },
    lift: function lift(operator) {
        var o = Object.create(observable);
        o.source = this;
        o.operator = operator;
        return o;
    },
    subscribe: function _subscribe(next, error, complete) {
        var s = Object.create(subscriber).initialize(next, error, complete);
        if (this.operator) {
            this.operator.subscribe(s, this.source);
        }
        else {
            this.subscribe(s);
        }
        return s;
    }
};

//TODO: Rx is both lifting the operators into an observable as well as lifting the observable
//TODO: operators into a subscription. In effect, Rx creates a new observable object, and then sets
//TODO: the .operator property as the map/filter/group/etc. object as its object.
//TODO: During subscription, the top level observable will create a new subscriber based on the
//TODO: next/error/complete functions passed as arguments. It then passes this subscriber to the
//TODO: operator (as opposed to its source, which is the underlying observable), along with its
//TODO: source. The operator is lifted into a subscription, and is then passed to the underlying
//TODO: source object to continue the process.
var mapOperator = {
    transform: null,
    init: function _init(projectionFunc) {
        this.transform = projectionFunc;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(subscriber, this.transform);
    }
};

var filterOperator = {
    predicate: null,
    init: function _init(pred) {
        this.predicate = pred;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(filterSubscriber).init(subscriber, this.predicate));
    }
};

var subscriber = {
    dest: null,
    status: 0,
    next: function _next(item) {
        this.dest.next(item);
    },
    error: function _error(err) {
        this.status = 2;
        this.dest.error(err);
    },
    complete: function _complete() {
        this.status = 2;
        this.dest.complete();
    },
    unsubscribe: function _unsubscribe() {
        this.status = 2;
    },
    initialize: function _initialize(next, error, complete) {
        this.status = 1;
        if (subscriber.isPrototypeOf(next)) {
            this.dest = next;
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
mapSubscriber.transform = null;
mapSubscriber.count = 0;
mapSubscriber.next = function _next(item) {
    var res;
    try {
        res = this.transform(item, this.count++);
    }
    catch (err) {
        this.dest.error(err);
        return;
    }
    this.dest.next(res);
};
mapSubscriber.init = function _init(subscriber, transform) {
    this.initialize(subscriber);
    this.transform = transform;
    return this;
};

var filterSubscriber = Object.create(subscriber);
filterSubscriber.predicate = null;
filterSubscriber.count = 0;
filterSubscriber.next = function _next(item) {
    var res;
    try {
        res = this.predicate(item, this.count++);
    }
    catch (err) {
        this.dest.error(err);
        return;
    }
    this.dest.next(res);
};
filterSubscriber.init = function _init(subscriber, predicate) {
    this.initialize(subscriber);
    this.predicate = predicate;
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
    return this.isNothing() ? maybe.of(null) : maybe.of(f(this._value));
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
    return compose(Object.create(io), f, this._value);
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

//
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
    return ma.map(f).join();
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