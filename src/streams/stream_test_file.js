function noop() {}

function curry(fn) {
    if (!fn.length || 1 === fn.length) return fn;
    return _curry(fn.length, [], fn);
}

function _curry(length, received, fn) {
    return function _c(...rest) {
        var combined = received.concat(rest);
        if (length > combined.length)
            return _curry(length, combined, fn);
        return fn.call(this, ...combined);
    };
}



/*
 - JavaScript
 - js
 - Functional
 - Reactive
 - Programming
 - Functional Programming
 - FP
 - Functional Reactive Programming
 - FRP
 - Queryable
 - Observable

 QRP - Queryable Reactive Programming - Kerp
 */



//=====================================================================================//
//==========================          New Code          ===============================//
//=====================================================================================//
var rootObservable = {
    source: null,
    event: null,
    from: function _from(src, evt) {
        this.source = src;
        this.event = evt;
        //return Object.create(newObservable);
        return observer2Creator(this, identity);
    },
    subscribe: function _subscribe(next) {
        function handler(e) {
            return next(e);
        }

        function _unsub() {
            return this.source.removeEventListener(this.event, handler);
        }

        this.source.addEventListener(this.event, handler);
        var unSub = functionBinder(this, _unsub);
        return subscriber2Creator(unSub);
    }
};

var observer2 = {
    source: null,
    fn: null,
    map: function _map(fn) {
        return observer2Creator(this, fn);
    },
    subscribe: function _subscribe(next, error, complete, subs) {
        var transform = this.fn;
        subs = subs || sub2Creator(next, error, complete);

        function _next(item) {
            var res = transform(item);
            return subs.next(res);
        }
        function _error(err) {
            return subs.error(error(err));
        }
        function _complete() {
            return subs.complete(complete());
        }

        return this.source.subscribe(
            _next,
            _error,
            _complete,
            sub2Creator(_next, _error, _complete)
        );
    }
};

var sub2 = {
    next: null,
    error: null,
    complete: null
};

var subscriber2 = {
    status: 0,
    unsubscribe: null
};

function observer2Creator(source, fn) {
    var o = Object.create(observer2);
    o.source = source;
    o.fn = fn;
    return o;
}

function sub2Creator(onNext, onError, onComplete) {
    var s = Object.create(sub2);
    s.next = onNext;
    s.error = onError;
    s.complete = onComplete;
    return s;
}

function subscriber2Creator(fn) {
    var s2 = Object.create(subscriber2);
    s2.status = 1;
    s2.unsubscribe = fn;
    return s2;
}

var test = rootObservable.from(document, 'click'),
    test2 = test.map(function _evt(e) {
        return e.pageX + e.pageY;
    }),
    test3 = test2.subscribe(
        function onNext(item) {
            console.log(item);
        },
        function onError(err) {
            console.error(err);
        },
        function onComplete() {
            console.log('complete');
        }
    );

function identity(item) { return item; }

var newObservable = {
    source: null,
    operator: null,
    map: function _map(fn) {
        var o = Object.create(newObservable);
        o.source = this;
        o.operator = fn;
        //What if, rather than define the next, error, and complete function properties up front,
        //instead, their definition was deferred until a new observer is created from the current
        //observer? Then, the old observer's next, error, and complete properties would be able
        //to pass the data along to the newly created observer. The one issue I see with this that
        //might be a problem is that it would more difficult to have more than one observer created
        //from an existing observer. This is because, setting a second observer's properties would
        //effectively overwrite the previous observer's properties. This could be solved with lists,
        //meaning to pass items through to all subsequent observers, each function in the 'next' list
        //would have to be called.
        o.handlers = {
            complete: function _complete() {
                //Obviously both here, and in the 'error' function property, I don't want to create an
                //infinite loop by having these functions just repeatedly call themselves. This is just
                //temporary code to fill the void until I have the general structure and data flow
                //figured out. In essence, when the 'complete' function property is invoked, it should
                //call the underlying observer's 'complete' function property, thus continually forwarding
                //the operation until the root source is arrived at.
                return o.complete();
            },
            error: function _error(err) {
                return o.error();
            },
            next: function _next(item) {
                try {
                    return fn(item);
                }
                catch(ex) {
                    return this.error(ex);
                }
            }
        };
        return o;
    },
    where: function _where(filterFunc) {
        var o = Object.create(newObservable);
        o.source = this;
        o.operator = filterFunc;
    },
    concat: function _concat(_observer) {
        var o = Object.create(newObservable);
        o.source = this;
        var h = function _h(n, e, c) {
            return {
                complete: function _complete() {
                    return c();
                },
                error: function _error(err) {
                    return e(err);
                },
                next: function _next(item) {
                    return n(item);
                }
            }
        };
        o.handlers = {
            complete: function _complete() {
                //Obviously both here, and in the 'error' function property, I don't want to create an
                //infinite loop by having these functions just repeatedly call themselves. This is just
                //temporary code to fill the void until I have the general structure and data flow
                //figured out. In essence, when the 'complete' function property is invoked, it should
                //call the underlying observer's 'complete' function property, thus continually forwarding
                //the operation until the root source is arrived at.
                return o.complete();
            },
            error: function _error(err) {
                return o.error();
            },
            next: function _next(item) {
                try {
                    return fn(item);
                }
                catch(ex) {
                    return this.error(ex);
                }
            }
        };
        return o;
    },
    subscribe: function _subscribe(onNext, onError, onComplete) {
        var sub;
        if (rootObservable.isPrototypeOf(this.source)) {
            sub = this.source.subscribe(this.handlers);
        }
        else {
            sub = this.source.subscribe({
                next: this.handlers.next,
                error: this.handlers.error,
                complete: this.handlers.complete
            });
        }

        return Object.create(sub.unsubscribe);
    }
};

var internalObserver = {

};

var subscriber = {
    status: 0,
    unsubscribe: null
};

function createSubscriber(unsubscribe) {
    var s = Object.create(subscriber);
    this.status = 1;
    s.unsubscribe = function _unsubscribe() {
        this.status = 2;
        unsubscribe();
    };
    return s;
}


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