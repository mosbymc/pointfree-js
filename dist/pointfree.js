(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('babel-polyfill');

window.pjs = {
    monads: require('./src/dataStructures/dataStructures'),
    groups: require('./src/dataStructures/groups'),
    stream: require('./src/streams/observable'),
    combinators: require('./src/combinators'),
    decorators: require('./src/decorators'),
    transducers: require('./src/transducers'),
    lenses: require('./src/lenses'),
    functionalHelpers: require('./src/functionalHelpers')
};
},{"./src/combinators":330,"./src/dataStructures/dataStructures":332,"./src/dataStructures/groups":336,"./src/decorators":344,"./src/functionalHelpers":345,"./src/lenses":347,"./src/streams/observable":349,"./src/transducers":369,"babel-polyfill":2}],2:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"core-js/fn/regexp/escape":4,"core-js/shim":329,"regenerator-runtime/runtime":3}],3:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;

},{"../../modules/_core":25,"../../modules/core.regexp.escape":132}],5:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],6:[function(require,module,exports){
var cof = require('./_cof');
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

},{"./_cof":20}],7:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":44,"./_wks":130}],8:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],9:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":53}],10:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"./_to-absolute-index":116,"./_to-length":120,"./_to-object":121}],11:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-absolute-index":116,"./_to-length":120,"./_to-object":121}],12:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":41}],13:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":116,"./_to-iobject":119,"./_to-length":120}],14:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":17,"./_ctx":27,"./_iobject":49,"./_to-length":120,"./_to-object":121}],15:[function(require,module,exports){
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var toLength = require('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

},{"./_a-function":5,"./_iobject":49,"./_to-length":120,"./_to-object":121}],16:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":51,"./_is-object":53,"./_wks":130}],17:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":16}],18:[function(require,module,exports){
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":5,"./_invoke":48,"./_is-object":53}],19:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":20,"./_wks":130}],20:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],21:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":8,"./_ctx":27,"./_descriptors":31,"./_for-of":41,"./_iter-define":57,"./_iter-step":59,"./_meta":68,"./_object-create":73,"./_object-dp":74,"./_redefine-all":95,"./_set-species":102,"./_validate-collection":127}],22:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof');
var from = require('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_array-from-iterable":12,"./_classof":19}],23:[function(require,module,exports){
'use strict';
var redefineAll = require('./_redefine-all');
var getWeak = require('./_meta').getWeak;
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var createArrayMethod = require('./_array-methods');
var $has = require('./_has');
var validate = require('./_validate-collection');
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

},{"./_an-instance":8,"./_an-object":9,"./_array-methods":14,"./_for-of":41,"./_has":43,"./_is-object":53,"./_meta":68,"./_redefine-all":95,"./_validate-collection":127}],24:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":8,"./_export":35,"./_fails":37,"./_for-of":41,"./_global":42,"./_inherit-if-required":47,"./_is-object":53,"./_iter-detect":58,"./_meta":68,"./_redefine":96,"./_redefine-all":95,"./_set-to-string-tag":103}],25:[function(require,module,exports){
var core = module.exports = { version: '2.5.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],26:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":74,"./_property-desc":94}],27:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":5}],28:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = require('./_fails');
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;

},{"./_fails":37}],29:[function(require,module,exports){
'use strict';
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

},{"./_an-object":9,"./_to-primitive":122}],30:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],31:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":37}],32:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":42,"./_is-object":53}],33:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],34:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":80,"./_object-keys":83,"./_object-pie":84}],35:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":25,"./_ctx":27,"./_global":42,"./_hide":44,"./_redefine":96}],36:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":130}],37:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],38:[function(require,module,exports){
'use strict';
var hide = require('./_hide');
var redefine = require('./_redefine');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":30,"./_fails":37,"./_hide":44,"./_redefine":96,"./_wks":130}],39:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":9}],40:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = require('./_is-array');
var isObject = require('./_is-object');
var toLength = require('./_to-length');
var ctx = require('./_ctx');
var IS_CONCAT_SPREADABLE = require('./_wks')('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;

},{"./_ctx":27,"./_is-array":51,"./_is-object":53,"./_to-length":120,"./_wks":130}],41:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":9,"./_ctx":27,"./_is-array-iter":50,"./_iter-call":55,"./_to-length":120,"./core.get-iterator-method":131}],42:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],43:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],44:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":31,"./_object-dp":74,"./_property-desc":94}],45:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":42}],46:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":31,"./_dom-create":32,"./_fails":37}],47:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":53,"./_set-proto":101}],48:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],49:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":20}],50:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":60,"./_wks":130}],51:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":20}],52:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":53}],53:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],54:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":20,"./_is-object":53,"./_wks":130}],55:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":9}],56:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":44,"./_object-create":73,"./_property-desc":94,"./_set-to-string-tag":103,"./_wks":130}],57:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var has = require('./_has');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":35,"./_has":43,"./_hide":44,"./_iter-create":56,"./_iterators":60,"./_library":62,"./_object-gpo":81,"./_redefine":96,"./_set-to-string-tag":103,"./_wks":130}],58:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":130}],59:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],60:[function(require,module,exports){
module.exports = {};

},{}],61:[function(require,module,exports){
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
module.exports = function (object, el) {
  var O = toIObject(object);
  var keys = getKeys(O);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) if (O[key = keys[index++]] === el) return key;
};

},{"./_object-keys":83,"./_to-iobject":119}],62:[function(require,module,exports){
module.exports = false;

},{}],63:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

},{}],64:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var sign = require('./_math-sign');
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"./_math-sign":67}],65:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

},{}],66:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  if (
    arguments.length === 0
      // eslint-disable-next-line no-self-compare
      || x != x
      // eslint-disable-next-line no-self-compare
      || inLow != inLow
      // eslint-disable-next-line no-self-compare
      || inHigh != inHigh
      // eslint-disable-next-line no-self-compare
      || outLow != outLow
      // eslint-disable-next-line no-self-compare
      || outHigh != outHigh
  ) return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
};

},{}],67:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],68:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":37,"./_has":43,"./_is-object":53,"./_object-dp":74,"./_uid":126}],69:[function(require,module,exports){
var Map = require('./es6.map');
var $export = require('./_export');
var shared = require('./_shared')('metadata');
var store = shared.store || (shared.store = new (require('./es6.weak-map'))());

var getOrCreateMetadataMap = function (target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { keys.push(key); });
  return keys;
};
var toMetaKey = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function (O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

},{"./_export":35,"./_shared":105,"./es6.map":162,"./es6.weak-map":268}],70:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":20,"./_global":42,"./_task":115}],71:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":5}],72:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":37,"./_iobject":49,"./_object-gops":80,"./_object-keys":83,"./_object-pie":84,"./_to-object":121}],73:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":9,"./_dom-create":32,"./_enum-bug-keys":33,"./_html":45,"./_object-dps":75,"./_shared-key":104}],74:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":9,"./_descriptors":31,"./_ie8-dom-define":46,"./_to-primitive":122}],75:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":9,"./_descriptors":31,"./_object-dp":74,"./_object-keys":83}],76:[function(require,module,exports){
'use strict';
// Forced replacement prototype accessors methods
module.exports = require('./_library') || !require('./_fails')(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () { /* empty */ });
  delete require('./_global')[K];
});

},{"./_fails":37,"./_global":42,"./_library":62}],77:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":31,"./_has":43,"./_ie8-dom-define":46,"./_object-pie":84,"./_property-desc":94,"./_to-iobject":119,"./_to-primitive":122}],78:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":79,"./_to-iobject":119}],79:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":33,"./_object-keys-internal":82}],80:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],81:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":43,"./_shared-key":104,"./_to-object":121}],82:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":13,"./_has":43,"./_shared-key":104,"./_to-iobject":119}],83:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":33,"./_object-keys-internal":82}],84:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],85:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":25,"./_export":35,"./_fails":37}],86:[function(require,module,exports){
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":83,"./_object-pie":84,"./_to-iobject":119}],87:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn');
var gOPS = require('./_object-gops');
var anObject = require('./_an-object');
var Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

},{"./_an-object":9,"./_global":42,"./_object-gopn":79,"./_object-gops":80}],88:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat;
var $trim = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

},{"./_global":42,"./_string-trim":113,"./_string-ws":114}],89:[function(require,module,exports){
var $parseInt = require('./_global').parseInt;
var $trim = require('./_string-trim').trim;
var ws = require('./_string-ws');
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

},{"./_global":42,"./_string-trim":113,"./_string-ws":114}],90:[function(require,module,exports){
'use strict';
var path = require('./_path');
var invoke = require('./_invoke');
var aFunction = require('./_a-function');
module.exports = function (/* ...pargs */) {
  var fn = aFunction(this);
  var length = arguments.length;
  var pargs = Array(length);
  var i = 0;
  var _ = path._;
  var holder = false;
  while (length > i) if ((pargs[i] = arguments[i++]) === _) holder = true;
  return function (/* ...args */) {
    var that = this;
    var aLen = arguments.length;
    var j = 0;
    var k = 0;
    var args;
    if (!holder && !aLen) return invoke(fn, pargs, that);
    args = pargs.slice();
    if (holder) for (;length > j; j++) if (args[j] === _) args[j] = arguments[k++];
    while (aLen > k) args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};

},{"./_a-function":5,"./_invoke":48,"./_path":91}],91:[function(require,module,exports){
module.exports = require('./_global');

},{"./_global":42}],92:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],93:[function(require,module,exports){
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_new-promise-capability":71}],94:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],95:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":96}],96:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":25,"./_global":42,"./_has":43,"./_hide":44,"./_uid":126}],97:[function(require,module,exports){
module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};

},{}],98:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],99:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');
var aFunction = require('./_a-function');
var ctx = require('./_ctx');
var forOf = require('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_a-function":5,"./_ctx":27,"./_export":35,"./_for-of":41}],100:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":35}],101:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":9,"./_ctx":27,"./_is-object":53,"./_object-gopd":77}],102:[function(require,module,exports){
'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":31,"./_global":42,"./_object-dp":74,"./_wks":130}],103:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":43,"./_object-dp":74,"./_wks":130}],104:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":105,"./_uid":126}],105:[function(require,module,exports){
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":42}],106:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":5,"./_an-object":9,"./_wks":130}],107:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":37}],108:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":30,"./_to-integer":118}],109:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":30,"./_is-regexp":54}],110:[function(require,module,exports){
var $export = require('./_export');
var fails = require('./_fails');
var defined = require('./_defined');
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

},{"./_defined":30,"./_export":35,"./_fails":37}],111:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length');
var repeat = require('./_string-repeat');
var defined = require('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":30,"./_string-repeat":112,"./_to-length":120}],112:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer');
var defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

},{"./_defined":30,"./_to-integer":118}],113:[function(require,module,exports){
var $export = require('./_export');
var defined = require('./_defined');
var fails = require('./_fails');
var spaces = require('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_defined":30,"./_export":35,"./_fails":37,"./_string-ws":114}],114:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],115:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":20,"./_ctx":27,"./_dom-create":32,"./_global":42,"./_html":45,"./_invoke":48}],116:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":118}],117:[function(require,module,exports){
// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

},{"./_to-integer":118,"./_to-length":120}],118:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],119:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":30,"./_iobject":49}],120:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":118}],121:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":30}],122:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":53}],123:[function(require,module,exports){
'use strict';
if (require('./_descriptors')) {
  var LIBRARY = require('./_library');
  var global = require('./_global');
  var fails = require('./_fails');
  var $export = require('./_export');
  var $typed = require('./_typed');
  var $buffer = require('./_typed-buffer');
  var ctx = require('./_ctx');
  var anInstance = require('./_an-instance');
  var propertyDesc = require('./_property-desc');
  var hide = require('./_hide');
  var redefineAll = require('./_redefine-all');
  var toInteger = require('./_to-integer');
  var toLength = require('./_to-length');
  var toIndex = require('./_to-index');
  var toAbsoluteIndex = require('./_to-absolute-index');
  var toPrimitive = require('./_to-primitive');
  var has = require('./_has');
  var classof = require('./_classof');
  var isObject = require('./_is-object');
  var toObject = require('./_to-object');
  var isArrayIter = require('./_is-array-iter');
  var create = require('./_object-create');
  var getPrototypeOf = require('./_object-gpo');
  var gOPN = require('./_object-gopn').f;
  var getIterFn = require('./core.get-iterator-method');
  var uid = require('./_uid');
  var wks = require('./_wks');
  var createArrayMethod = require('./_array-methods');
  var createArrayIncludes = require('./_array-includes');
  var speciesConstructor = require('./_species-constructor');
  var ArrayIterators = require('./es6.array.iterator');
  var Iterators = require('./_iterators');
  var $iterDetect = require('./_iter-detect');
  var setSpecies = require('./_set-species');
  var arrayFill = require('./_array-fill');
  var arrayCopyWithin = require('./_array-copy-within');
  var $DP = require('./_object-dp');
  var $GOPD = require('./_object-gopd');
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };

},{"./_an-instance":8,"./_array-copy-within":10,"./_array-fill":11,"./_array-includes":13,"./_array-methods":14,"./_classof":19,"./_ctx":27,"./_descriptors":31,"./_export":35,"./_fails":37,"./_global":42,"./_has":43,"./_hide":44,"./_is-array-iter":50,"./_is-object":53,"./_iter-detect":58,"./_iterators":60,"./_library":62,"./_object-create":73,"./_object-dp":74,"./_object-gopd":77,"./_object-gopn":79,"./_object-gpo":81,"./_property-desc":94,"./_redefine-all":95,"./_set-species":102,"./_species-constructor":106,"./_to-absolute-index":116,"./_to-index":117,"./_to-integer":118,"./_to-length":120,"./_to-object":121,"./_to-primitive":122,"./_typed":125,"./_typed-buffer":124,"./_uid":126,"./_wks":130,"./core.get-iterator-method":131,"./es6.array.iterator":143}],124:[function(require,module,exports){
'use strict';
var global = require('./_global');
var DESCRIPTORS = require('./_descriptors');
var LIBRARY = require('./_library');
var $typed = require('./_typed');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var fails = require('./_fails');
var anInstance = require('./_an-instance');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var toIndex = require('./_to-index');
var gOPN = require('./_object-gopn').f;
var dP = require('./_object-dp').f;
var arrayFill = require('./_array-fill');
var setToStringTag = require('./_set-to-string-tag');
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"./_an-instance":8,"./_array-fill":11,"./_descriptors":31,"./_fails":37,"./_global":42,"./_hide":44,"./_library":62,"./_object-dp":74,"./_object-gopn":79,"./_redefine-all":95,"./_set-to-string-tag":103,"./_to-index":117,"./_to-integer":118,"./_to-length":120,"./_typed":125}],125:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var uid = require('./_uid');
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

},{"./_global":42,"./_hide":44,"./_uid":126}],126:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],127:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":53}],128:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":25,"./_global":42,"./_library":62,"./_object-dp":74,"./_wks-ext":129}],129:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":130}],130:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":42,"./_shared":105,"./_uid":126}],131:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":19,"./_core":25,"./_iterators":60,"./_wks":130}],132:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export');
var $re = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });

},{"./_export":35,"./_replacer":97}],133:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { copyWithin: require('./_array-copy-within') });

require('./_add-to-unscopables')('copyWithin');

},{"./_add-to-unscopables":7,"./_array-copy-within":10,"./_export":35}],134:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $every = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":14,"./_export":35,"./_strict-method":107}],135:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":7,"./_array-fill":11,"./_export":35}],136:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":14,"./_export":35,"./_strict-method":107}],137:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":7,"./_array-methods":14,"./_export":35}],138:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":7,"./_array-methods":14,"./_export":35}],139:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $forEach = require('./_array-methods')(0);
var STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":14,"./_export":35,"./_strict-method":107}],140:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":26,"./_ctx":27,"./_export":35,"./_is-array-iter":50,"./_iter-call":55,"./_iter-detect":58,"./_to-length":120,"./_to-object":121,"./core.get-iterator-method":131}],141:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $indexOf = require('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_array-includes":13,"./_export":35,"./_strict-method":107}],142:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":35,"./_is-array":51}],143:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":7,"./_iter-define":57,"./_iter-step":59,"./_iterators":60,"./_to-iobject":119}],144:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

},{"./_export":35,"./_iobject":49,"./_strict-method":107,"./_to-iobject":119}],145:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});

},{"./_export":35,"./_strict-method":107,"./_to-integer":118,"./_to-iobject":119,"./_to-length":120}],146:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":14,"./_export":35,"./_strict-method":107}],147:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

},{"./_create-property":26,"./_export":35,"./_fails":37}],148:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

},{"./_array-reduce":15,"./_export":35,"./_strict-method":107}],149:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

},{"./_array-reduce":15,"./_export":35,"./_strict-method":107}],150:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var html = require('./_html');
var cof = require('./_cof');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

},{"./_cof":20,"./_export":35,"./_fails":37,"./_html":45,"./_to-absolute-index":116,"./_to-length":120}],151:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $some = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":14,"./_export":35,"./_strict-method":107}],152:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":5,"./_export":35,"./_fails":37,"./_strict-method":107,"./_to-object":121}],153:[function(require,module,exports){
require('./_set-species')('Array');

},{"./_set-species":102}],154:[function(require,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });

},{"./_export":35}],155:[function(require,module,exports){
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export');
var toISOString = require('./_date-to-iso-string');

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});

},{"./_date-to-iso-string":28,"./_export":35}],156:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"./_export":35,"./_fails":37,"./_to-object":121,"./_to-primitive":122}],157:[function(require,module,exports){
var TO_PRIMITIVE = require('./_wks')('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));

},{"./_date-to-primitive":29,"./_hide":44,"./_wks":130}],158:[function(require,module,exports){
var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  require('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

},{"./_redefine":96}],159:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":18,"./_export":35}],160:[function(require,module,exports){
'use strict';
var isObject = require('./_is-object');
var getPrototypeOf = require('./_object-gpo');
var HAS_INSTANCE = require('./_wks')('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) require('./_object-dp').f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });

},{"./_is-object":53,"./_object-dp":74,"./_object-gpo":81,"./_wks":130}],161:[function(require,module,exports){
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":31,"./_object-dp":74}],162:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":24,"./_collection-strong":21,"./_validate-collection":127}],163:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export');
var log1p = require('./_math-log1p');
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"./_export":35,"./_math-log1p":65}],164:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export');
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

},{"./_export":35}],165:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export');
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

},{"./_export":35}],166:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export');
var sign = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

},{"./_export":35,"./_math-sign":67}],167:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

},{"./_export":35}],168:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export');
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

},{"./_export":35}],169:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export');
var $expm1 = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

},{"./_export":35,"./_math-expm1":63}],170:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export = require('./_export');

$export($export.S, 'Math', { fround: require('./_math-fround') });

},{"./_export":35,"./_math-fround":64}],171:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export');
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

},{"./_export":35}],172:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export');
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"./_export":35,"./_fails":37}],173:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

},{"./_export":35}],174:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', { log1p: require('./_math-log1p') });

},{"./_export":35,"./_math-log1p":65}],175:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

},{"./_export":35}],176:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', { sign: require('./_math-sign') });

},{"./_export":35,"./_math-sign":67}],177:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

},{"./_export":35,"./_fails":37,"./_math-expm1":63}],178:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"./_export":35,"./_math-expm1":63}],179:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

},{"./_export":35}],180:[function(require,module,exports){
'use strict';
var global = require('./_global');
var has = require('./_has');
var cof = require('./_cof');
var inheritIfRequired = require('./_inherit-if-required');
var toPrimitive = require('./_to-primitive');
var fails = require('./_fails');
var gOPN = require('./_object-gopn').f;
var gOPD = require('./_object-gopd').f;
var dP = require('./_object-dp').f;
var $trim = require('./_string-trim').trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}

},{"./_cof":20,"./_descriptors":31,"./_fails":37,"./_global":42,"./_has":43,"./_inherit-if-required":47,"./_object-create":73,"./_object-dp":74,"./_object-gopd":77,"./_object-gopn":79,"./_redefine":96,"./_string-trim":113,"./_to-primitive":122}],181:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

},{"./_export":35}],182:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export');
var _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":35,"./_global":42}],183:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":35,"./_is-integer":52}],184:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

},{"./_export":35}],185:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export = require('./_export');
var isInteger = require('./_is-integer');
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

},{"./_export":35,"./_is-integer":52}],186:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

},{"./_export":35}],187:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

},{"./_export":35}],188:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });

},{"./_export":35,"./_parse-float":88}],189:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });

},{"./_export":35,"./_parse-int":89}],190:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toInteger = require('./_to-integer');
var aNumberValue = require('./_a-number-value');
var repeat = require('./_string-repeat');
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

},{"./_a-number-value":6,"./_export":35,"./_fails":37,"./_string-repeat":112,"./_to-integer":118}],191:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $fails = require('./_fails');
var aNumberValue = require('./_a-number-value');
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

},{"./_a-number-value":6,"./_export":35,"./_fails":37}],192:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":35,"./_object-assign":72}],193:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":35,"./_object-create":73}],194:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperties: require('./_object-dps') });

},{"./_descriptors":31,"./_export":35,"./_object-dps":75}],195:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":31,"./_export":35,"./_object-dp":74}],196:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

},{"./_is-object":53,"./_meta":68,"./_object-sap":85}],197:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":77,"./_object-sap":85,"./_to-iobject":119}],198:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function () {
  return require('./_object-gopn-ext').f;
});

},{"./_object-gopn-ext":78,"./_object-sap":85}],199:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":81,"./_object-sap":85,"./_to-object":121}],200:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

},{"./_is-object":53,"./_object-sap":85}],201:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

},{"./_is-object":53,"./_object-sap":85}],202:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

},{"./_is-object":53,"./_object-sap":85}],203:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

},{"./_export":35,"./_same-value":98}],204:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":83,"./_object-sap":85,"./_to-object":121}],205:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

},{"./_is-object":53,"./_meta":68,"./_object-sap":85}],206:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

},{"./_is-object":53,"./_meta":68,"./_object-sap":85}],207:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":35,"./_set-proto":101}],208:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof');
var test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":19,"./_redefine":96,"./_wks":130}],209:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

},{"./_export":35,"./_parse-float":88}],210:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

},{"./_export":35,"./_parse-int":89}],211:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var sameConstructor = LIBRARY ? function (a, b) {
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
} : function (a, b) {
  return a === b;
};
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return sameConstructor($Promise, C)
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
    return promiseResolve(this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":5,"./_an-instance":8,"./_classof":19,"./_core":25,"./_ctx":27,"./_export":35,"./_for-of":41,"./_global":42,"./_is-object":53,"./_iter-detect":58,"./_library":62,"./_microtask":70,"./_new-promise-capability":71,"./_perform":92,"./_promise-resolve":93,"./_redefine-all":95,"./_set-species":102,"./_set-to-string-tag":103,"./_species-constructor":106,"./_task":115,"./_wks":130}],212:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var rApply = (require('./_global').Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

},{"./_a-function":5,"./_an-object":9,"./_export":35,"./_fails":37,"./_global":42}],213:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = require('./_export');
var create = require('./_object-create');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var fails = require('./_fails');
var bind = require('./_bind');
var rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"./_a-function":5,"./_an-object":9,"./_bind":18,"./_export":35,"./_fails":37,"./_global":42,"./_is-object":53,"./_object-create":73}],214:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp');
var $export = require('./_export');
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":9,"./_export":35,"./_fails":37,"./_object-dp":74,"./_to-primitive":122}],215:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = require('./_export');
var gOPD = require('./_object-gopd').f;
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

},{"./_an-object":9,"./_export":35,"./_object-gopd":77}],216:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});

},{"./_an-object":9,"./_export":35,"./_iter-create":56}],217:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = require('./_object-gopd');
var $export = require('./_export');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

},{"./_an-object":9,"./_export":35,"./_object-gopd":77}],218:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export = require('./_export');
var getProto = require('./_object-gpo');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

},{"./_an-object":9,"./_export":35,"./_object-gpo":81}],219:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var isObject = require('./_is-object');
var anObject = require('./_an-object');

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

},{"./_an-object":9,"./_export":35,"./_has":43,"./_is-object":53,"./_object-gopd":77,"./_object-gpo":81}],220:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"./_export":35}],221:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

},{"./_an-object":9,"./_export":35}],222:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', { ownKeys: require('./_own-keys') });

},{"./_export":35,"./_own-keys":87}],223:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":9,"./_export":35}],224:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = require('./_export');
var setProto = require('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":35,"./_set-proto":101}],225:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = require('./_object-dp');
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var createDesc = require('./_property-desc');
var anObject = require('./_an-object');
var isObject = require('./_is-object');

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

},{"./_an-object":9,"./_export":35,"./_has":43,"./_is-object":53,"./_object-dp":74,"./_object-gopd":77,"./_object-gpo":81,"./_property-desc":94}],226:[function(require,module,exports){
var global = require('./_global');
var inheritIfRequired = require('./_inherit-if-required');
var dP = require('./_object-dp').f;
var gOPN = require('./_object-gopn').f;
var isRegExp = require('./_is-regexp');
var $flags = require('./_flags');
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function () {
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');

},{"./_descriptors":31,"./_fails":37,"./_flags":39,"./_global":42,"./_inherit-if-required":47,"./_is-regexp":54,"./_object-dp":74,"./_object-gopn":79,"./_redefine":96,"./_set-species":102,"./_wks":130}],227:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":31,"./_flags":39,"./_object-dp":74}],228:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

},{"./_fix-re-wks":38}],229:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

},{"./_fix-re-wks":38}],230:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search) {
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp) {
    'use strict';
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

},{"./_fix-re-wks":38}],231:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = require('./_is-regexp');
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

},{"./_fix-re-wks":38,"./_is-regexp":54}],232:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject = require('./_an-object');
var $flags = require('./_flags');
var DESCRIPTORS = require('./_descriptors');
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./_an-object":9,"./_descriptors":31,"./_fails":37,"./_flags":39,"./_redefine":96,"./es6.regexp.flags":227}],233:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":24,"./_collection-strong":21,"./_validate-collection":127}],234:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});

},{"./_string-html":110}],235:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});

},{"./_string-html":110}],236:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});

},{"./_string-html":110}],237:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});

},{"./_string-html":110}],238:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $at = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

},{"./_export":35,"./_string-at":108}],239:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

},{"./_export":35,"./_fails-is-regexp":36,"./_string-context":109,"./_to-length":120}],240:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});

},{"./_string-html":110}],241:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});

},{"./_string-html":110}],242:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});

},{"./_string-html":110}],243:[function(require,module,exports){
var $export = require('./_export');
var toAbsoluteIndex = require('./_to-absolute-index');
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

},{"./_export":35,"./_to-absolute-index":116}],244:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export = require('./_export');
var context = require('./_string-context');
var INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":35,"./_fails-is-regexp":36,"./_string-context":109}],245:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});

},{"./_string-html":110}],246:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":57,"./_string-at":108}],247:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":110}],248:[function(require,module,exports){
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});

},{"./_export":35,"./_to-iobject":119,"./_to-length":120}],249:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});

},{"./_export":35,"./_string-repeat":112}],250:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});

},{"./_string-html":110}],251:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":35,"./_fails-is-regexp":36,"./_string-context":109,"./_to-length":120}],252:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});

},{"./_string-html":110}],253:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});

},{"./_string-html":110}],254:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});

},{"./_string-html":110}],255:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

},{"./_string-trim":113}],256:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var keyOf = require('./_keyof');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key) {
    if (isSymbol(key)) return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":9,"./_descriptors":31,"./_enum-keys":34,"./_export":35,"./_fails":37,"./_global":42,"./_has":43,"./_hide":44,"./_is-array":51,"./_keyof":61,"./_library":62,"./_meta":68,"./_object-create":73,"./_object-dp":74,"./_object-gopd":77,"./_object-gopn":79,"./_object-gopn-ext":78,"./_object-gops":80,"./_object-keys":83,"./_object-pie":84,"./_property-desc":94,"./_redefine":96,"./_set-to-string-tag":103,"./_shared":105,"./_to-iobject":119,"./_to-primitive":122,"./_uid":126,"./_wks":130,"./_wks-define":128,"./_wks-ext":129}],257:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $typed = require('./_typed');
var buffer = require('./_typed-buffer');
var anObject = require('./_an-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var isObject = require('./_is-object');
var ArrayBuffer = require('./_global').ArrayBuffer;
var speciesConstructor = require('./_species-constructor');
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var final = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);

},{"./_an-object":9,"./_export":35,"./_fails":37,"./_global":42,"./_is-object":53,"./_set-species":102,"./_species-constructor":106,"./_to-absolute-index":116,"./_to-length":120,"./_typed":125,"./_typed-buffer":124}],258:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});

},{"./_export":35,"./_typed":125,"./_typed-buffer":124}],259:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],260:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],261:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],262:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],263:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],264:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],265:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],266:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":123}],267:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"./_typed-array":123}],268:[function(require,module,exports){
'use strict';
var each = require('./_array-methods')(0);
var redefine = require('./_redefine');
var meta = require('./_meta');
var assign = require('./_object-assign');
var weak = require('./_collection-weak');
var isObject = require('./_is-object');
var fails = require('./_fails');
var validate = require('./_validate-collection');
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

},{"./_array-methods":14,"./_collection":24,"./_collection-weak":23,"./_fails":37,"./_is-object":53,"./_meta":68,"./_object-assign":72,"./_redefine":96,"./_validate-collection":127}],269:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');
var validate = require('./_validate-collection');
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
require('./_collection')(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

},{"./_collection":24,"./_collection-weak":23,"./_validate-collection":127}],270:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var aFunction = require('./_a-function');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

require('./_add-to-unscopables')('flatMap');

},{"./_a-function":5,"./_add-to-unscopables":7,"./_array-species-create":17,"./_export":35,"./_flatten-into-array":40,"./_to-length":120,"./_to-object":121}],271:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatten: function flatten(/* depthArg = 1 */) {
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

require('./_add-to-unscopables')('flatten');

},{"./_add-to-unscopables":7,"./_array-species-create":17,"./_export":35,"./_flatten-into-array":40,"./_to-integer":118,"./_to-length":120,"./_to-object":121}],272:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export = require('./_export');
var $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');

},{"./_add-to-unscopables":7,"./_array-includes":13,"./_export":35}],273:[function(require,module,exports){
// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = require('./_export');
var microtask = require('./_microtask')();
var process = require('./_global').process;
var isNode = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

},{"./_cof":20,"./_export":35,"./_global":42,"./_microtask":70}],274:[function(require,module,exports){
// https://github.com/ljharb/proposal-is-error
var $export = require('./_export');
var cof = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});

},{"./_cof":20,"./_export":35}],275:[function(require,module,exports){
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.G, { global: require('./_global') });

},{"./_export":35,"./_global":42}],276:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
require('./_set-collection-from')('Map');

},{"./_set-collection-from":99}],277:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
require('./_set-collection-of')('Map');

},{"./_set-collection-of":100}],278:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Map', { toJSON: require('./_collection-to-json')('Map') });

},{"./_collection-to-json":22,"./_export":35}],279:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', {
  clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }
});

},{"./_export":35}],280:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });

},{"./_export":35}],281:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var RAD_PER_DEG = 180 / Math.PI;

$export($export.S, 'Math', {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});

},{"./_export":35}],282:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var scale = require('./_math-scale');
var fround = require('./_math-fround');

$export($export.S, 'Math', {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});

},{"./_export":35,"./_math-fround":64,"./_math-scale":66}],283:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

},{"./_export":35}],284:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

},{"./_export":35}],285:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

},{"./_export":35}],286:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });

},{"./_export":35}],287:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var DEG_PER_RAD = Math.PI / 180;

$export($export.S, 'Math', {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});

},{"./_export":35}],288:[function(require,module,exports){
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { scale: require('./_math-scale') });

},{"./_export":35,"./_math-scale":66}],289:[function(require,module,exports){
// http://jfbastien.github.io/papers/Math.signbit.html
var $export = require('./_export');

$export($export.S, 'Math', { signbit: function signbit(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
} });

},{"./_export":35}],290:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

},{"./_export":35}],291:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":5,"./_descriptors":31,"./_export":35,"./_object-dp":74,"./_object-forced-pam":76,"./_to-object":121}],292:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});

},{"./_a-function":5,"./_descriptors":31,"./_export":35,"./_object-dp":74,"./_object-forced-pam":76,"./_to-object":121}],293:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":35,"./_object-to-array":86}],294:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = require('./_export');
var ownKeys = require('./_own-keys');
var toIObject = require('./_to-iobject');
var gOPD = require('./_object-gopd');
var createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});

},{"./_create-property":26,"./_export":35,"./_object-gopd":77,"./_own-keys":87,"./_to-iobject":119}],295:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');
var getPrototypeOf = require('./_object-gpo');
var getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":31,"./_export":35,"./_object-forced-pam":76,"./_object-gopd":77,"./_object-gpo":81,"./_to-object":121,"./_to-primitive":122}],296:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');
var getPrototypeOf = require('./_object-gpo');
var getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_descriptors":31,"./_export":35,"./_object-forced-pam":76,"./_object-gopd":77,"./_object-gpo":81,"./_to-object":121,"./_to-primitive":122}],297:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":35,"./_object-to-array":86}],298:[function(require,module,exports){
'use strict';
// https://github.com/zenparsing/es-observable
var $export = require('./_export');
var global = require('./_global');
var core = require('./_core');
var microtask = require('./_microtask')();
var OBSERVABLE = require('./_wks')('observable');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var anInstance = require('./_an-instance');
var redefineAll = require('./_redefine-all');
var hide = require('./_hide');
var forOf = require('./_for-of');
var RETURN = forOf.RETURN;

var getMethod = function (fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function (subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function (subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function (subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function (observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer);
    var subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function () { subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  } if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() { closeSubscription(this); }
});

var SubscriptionObserver = function (subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function (value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = Array(l); i < l;) items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var j = 0; j < items.length; ++j) {
            observer.next(items[j]);
            if (done) return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () { return this; });

$export($export.G, { Observable: $Observable });

require('./_set-species')('Observable');

},{"./_a-function":5,"./_an-instance":8,"./_an-object":9,"./_core":25,"./_export":35,"./_for-of":41,"./_global":42,"./_hide":44,"./_microtask":70,"./_redefine-all":95,"./_set-species":102,"./_wks":130}],299:[function(require,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":25,"./_export":35,"./_global":42,"./_promise-resolve":93,"./_species-constructor":106}],300:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":35,"./_new-promise-capability":71,"./_perform":92}],301:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var toMetaKey = metadata.key;
var ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
} });

},{"./_an-object":9,"./_metadata":69}],302:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var toMetaKey = metadata.key;
var getOrCreateMetadataMap = metadata.map;
var store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
  var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
  var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
  if (metadataMap.size) return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
} });

},{"./_an-object":9,"./_metadata":69}],303:[function(require,module,exports){
var Set = require('./es6.set');
var from = require('./_array-from-iterable');
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_an-object":9,"./_array-from-iterable":12,"./_metadata":69,"./_object-gpo":81,"./es6.set":233}],304:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":9,"./_metadata":69,"./_object-gpo":81}],305:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_an-object":9,"./_metadata":69}],306:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":9,"./_metadata":69}],307:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":9,"./_metadata":69,"./_object-gpo":81}],308:[function(require,module,exports){
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_an-object":9,"./_metadata":69}],309:[function(require,module,exports){
var $metadata = require('./_metadata');
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var toMetaKey = $metadata.key;
var ordinaryDefineOwnMetadata = $metadata.set;

$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
  return function decorator(target, targetKey) {
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
} });

},{"./_a-function":5,"./_an-object":9,"./_metadata":69}],310:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
require('./_set-collection-from')('Set');

},{"./_set-collection-from":99}],311:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
require('./_set-collection-of')('Set');

},{"./_set-collection-of":100}],312:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Set', { toJSON: require('./_collection-to-json')('Set') });

},{"./_collection-to-json":22,"./_export":35}],313:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export');
var $at = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});

},{"./_export":35,"./_string-at":108}],314:[function(require,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export = require('./_export');
var defined = require('./_defined');
var toLength = require('./_to-length');
var isRegExp = require('./_is-regexp');
var getFlags = require('./_flags');
var RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function (regexp, string) {
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this);
    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

},{"./_defined":30,"./_export":35,"./_flags":39,"./_is-regexp":54,"./_iter-create":56,"./_to-length":120}],315:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

},{"./_export":35,"./_string-pad":111}],316:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

},{"./_export":35,"./_string-pad":111}],317:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');

},{"./_string-trim":113}],318:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');

},{"./_string-trim":113}],319:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":128}],320:[function(require,module,exports){
require('./_wks-define')('observable');

},{"./_wks-define":128}],321:[function(require,module,exports){
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.S, 'System', { global: require('./_global') });

},{"./_export":35,"./_global":42}],322:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
require('./_set-collection-from')('WeakMap');

},{"./_set-collection-from":99}],323:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
require('./_set-collection-of')('WeakMap');

},{"./_set-collection-of":100}],324:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
require('./_set-collection-from')('WeakSet');

},{"./_set-collection-from":99}],325:[function(require,module,exports){
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
require('./_set-collection-of')('WeakSet');

},{"./_set-collection-of":100}],326:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":42,"./_hide":44,"./_iterators":60,"./_object-keys":83,"./_redefine":96,"./_wks":130,"./es6.array.iterator":143}],327:[function(require,module,exports){
var $export = require('./_export');
var $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":35,"./_task":115}],328:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global');
var $export = require('./_export');
var invoke = require('./_invoke');
var partial = require('./_partial');
var navigator = global.navigator;
var MSIE = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return MSIE ? function (fn, time /* , ...args */) {
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      // eslint-disable-next-line no-new-func
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_export":35,"./_global":42,"./_invoke":48,"./_partial":90}],329:[function(require,module,exports){
require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.array.flat-map');
require('./modules/es7.array.flatten');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.symbol.async-iterator');
require('./modules/es7.symbol.observable');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.map.of');
require('./modules/es7.set.of');
require('./modules/es7.weak-map.of');
require('./modules/es7.weak-set.of');
require('./modules/es7.map.from');
require('./modules/es7.set.from');
require('./modules/es7.weak-map.from');
require('./modules/es7.weak-set.from');
require('./modules/es7.global');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.clamp');
require('./modules/es7.math.deg-per-rad');
require('./modules/es7.math.degrees');
require('./modules/es7.math.fscale');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.rad-per-deg');
require('./modules/es7.math.radians');
require('./modules/es7.math.scale');
require('./modules/es7.math.umulh');
require('./modules/es7.math.signbit');
require('./modules/es7.promise.finally');
require('./modules/es7.promise.try');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/es7.asap');
require('./modules/es7.observable');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');

},{"./modules/_core":25,"./modules/es6.array.copy-within":133,"./modules/es6.array.every":134,"./modules/es6.array.fill":135,"./modules/es6.array.filter":136,"./modules/es6.array.find":138,"./modules/es6.array.find-index":137,"./modules/es6.array.for-each":139,"./modules/es6.array.from":140,"./modules/es6.array.index-of":141,"./modules/es6.array.is-array":142,"./modules/es6.array.iterator":143,"./modules/es6.array.join":144,"./modules/es6.array.last-index-of":145,"./modules/es6.array.map":146,"./modules/es6.array.of":147,"./modules/es6.array.reduce":149,"./modules/es6.array.reduce-right":148,"./modules/es6.array.slice":150,"./modules/es6.array.some":151,"./modules/es6.array.sort":152,"./modules/es6.array.species":153,"./modules/es6.date.now":154,"./modules/es6.date.to-iso-string":155,"./modules/es6.date.to-json":156,"./modules/es6.date.to-primitive":157,"./modules/es6.date.to-string":158,"./modules/es6.function.bind":159,"./modules/es6.function.has-instance":160,"./modules/es6.function.name":161,"./modules/es6.map":162,"./modules/es6.math.acosh":163,"./modules/es6.math.asinh":164,"./modules/es6.math.atanh":165,"./modules/es6.math.cbrt":166,"./modules/es6.math.clz32":167,"./modules/es6.math.cosh":168,"./modules/es6.math.expm1":169,"./modules/es6.math.fround":170,"./modules/es6.math.hypot":171,"./modules/es6.math.imul":172,"./modules/es6.math.log10":173,"./modules/es6.math.log1p":174,"./modules/es6.math.log2":175,"./modules/es6.math.sign":176,"./modules/es6.math.sinh":177,"./modules/es6.math.tanh":178,"./modules/es6.math.trunc":179,"./modules/es6.number.constructor":180,"./modules/es6.number.epsilon":181,"./modules/es6.number.is-finite":182,"./modules/es6.number.is-integer":183,"./modules/es6.number.is-nan":184,"./modules/es6.number.is-safe-integer":185,"./modules/es6.number.max-safe-integer":186,"./modules/es6.number.min-safe-integer":187,"./modules/es6.number.parse-float":188,"./modules/es6.number.parse-int":189,"./modules/es6.number.to-fixed":190,"./modules/es6.number.to-precision":191,"./modules/es6.object.assign":192,"./modules/es6.object.create":193,"./modules/es6.object.define-properties":194,"./modules/es6.object.define-property":195,"./modules/es6.object.freeze":196,"./modules/es6.object.get-own-property-descriptor":197,"./modules/es6.object.get-own-property-names":198,"./modules/es6.object.get-prototype-of":199,"./modules/es6.object.is":203,"./modules/es6.object.is-extensible":200,"./modules/es6.object.is-frozen":201,"./modules/es6.object.is-sealed":202,"./modules/es6.object.keys":204,"./modules/es6.object.prevent-extensions":205,"./modules/es6.object.seal":206,"./modules/es6.object.set-prototype-of":207,"./modules/es6.object.to-string":208,"./modules/es6.parse-float":209,"./modules/es6.parse-int":210,"./modules/es6.promise":211,"./modules/es6.reflect.apply":212,"./modules/es6.reflect.construct":213,"./modules/es6.reflect.define-property":214,"./modules/es6.reflect.delete-property":215,"./modules/es6.reflect.enumerate":216,"./modules/es6.reflect.get":219,"./modules/es6.reflect.get-own-property-descriptor":217,"./modules/es6.reflect.get-prototype-of":218,"./modules/es6.reflect.has":220,"./modules/es6.reflect.is-extensible":221,"./modules/es6.reflect.own-keys":222,"./modules/es6.reflect.prevent-extensions":223,"./modules/es6.reflect.set":225,"./modules/es6.reflect.set-prototype-of":224,"./modules/es6.regexp.constructor":226,"./modules/es6.regexp.flags":227,"./modules/es6.regexp.match":228,"./modules/es6.regexp.replace":229,"./modules/es6.regexp.search":230,"./modules/es6.regexp.split":231,"./modules/es6.regexp.to-string":232,"./modules/es6.set":233,"./modules/es6.string.anchor":234,"./modules/es6.string.big":235,"./modules/es6.string.blink":236,"./modules/es6.string.bold":237,"./modules/es6.string.code-point-at":238,"./modules/es6.string.ends-with":239,"./modules/es6.string.fixed":240,"./modules/es6.string.fontcolor":241,"./modules/es6.string.fontsize":242,"./modules/es6.string.from-code-point":243,"./modules/es6.string.includes":244,"./modules/es6.string.italics":245,"./modules/es6.string.iterator":246,"./modules/es6.string.link":247,"./modules/es6.string.raw":248,"./modules/es6.string.repeat":249,"./modules/es6.string.small":250,"./modules/es6.string.starts-with":251,"./modules/es6.string.strike":252,"./modules/es6.string.sub":253,"./modules/es6.string.sup":254,"./modules/es6.string.trim":255,"./modules/es6.symbol":256,"./modules/es6.typed.array-buffer":257,"./modules/es6.typed.data-view":258,"./modules/es6.typed.float32-array":259,"./modules/es6.typed.float64-array":260,"./modules/es6.typed.int16-array":261,"./modules/es6.typed.int32-array":262,"./modules/es6.typed.int8-array":263,"./modules/es6.typed.uint16-array":264,"./modules/es6.typed.uint32-array":265,"./modules/es6.typed.uint8-array":266,"./modules/es6.typed.uint8-clamped-array":267,"./modules/es6.weak-map":268,"./modules/es6.weak-set":269,"./modules/es7.array.flat-map":270,"./modules/es7.array.flatten":271,"./modules/es7.array.includes":272,"./modules/es7.asap":273,"./modules/es7.error.is-error":274,"./modules/es7.global":275,"./modules/es7.map.from":276,"./modules/es7.map.of":277,"./modules/es7.map.to-json":278,"./modules/es7.math.clamp":279,"./modules/es7.math.deg-per-rad":280,"./modules/es7.math.degrees":281,"./modules/es7.math.fscale":282,"./modules/es7.math.iaddh":283,"./modules/es7.math.imulh":284,"./modules/es7.math.isubh":285,"./modules/es7.math.rad-per-deg":286,"./modules/es7.math.radians":287,"./modules/es7.math.scale":288,"./modules/es7.math.signbit":289,"./modules/es7.math.umulh":290,"./modules/es7.object.define-getter":291,"./modules/es7.object.define-setter":292,"./modules/es7.object.entries":293,"./modules/es7.object.get-own-property-descriptors":294,"./modules/es7.object.lookup-getter":295,"./modules/es7.object.lookup-setter":296,"./modules/es7.object.values":297,"./modules/es7.observable":298,"./modules/es7.promise.finally":299,"./modules/es7.promise.try":300,"./modules/es7.reflect.define-metadata":301,"./modules/es7.reflect.delete-metadata":302,"./modules/es7.reflect.get-metadata":304,"./modules/es7.reflect.get-metadata-keys":303,"./modules/es7.reflect.get-own-metadata":306,"./modules/es7.reflect.get-own-metadata-keys":305,"./modules/es7.reflect.has-metadata":307,"./modules/es7.reflect.has-own-metadata":308,"./modules/es7.reflect.metadata":309,"./modules/es7.set.from":310,"./modules/es7.set.of":311,"./modules/es7.set.to-json":312,"./modules/es7.string.at":313,"./modules/es7.string.match-all":314,"./modules/es7.string.pad-end":315,"./modules/es7.string.pad-start":316,"./modules/es7.string.trim-left":317,"./modules/es7.string.trim-right":318,"./modules/es7.symbol.async-iterator":319,"./modules/es7.symbol.observable":320,"./modules/es7.system.global":321,"./modules/es7.weak-map.from":322,"./modules/es7.weak-map.of":323,"./modules/es7.weak-set.from":324,"./modules/es7.weak-set.of":325,"./modules/web.dom.iterable":326,"./modules/web.immediate":327,"./modules/web.timers":328}],330:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** @module combinators */

/**
 * @signature (* -> *) -> [*] -> boolean
 * @description Partially applied function that takes one or more functions followed
 * by zero or more arguments and applies each function to the arguments in the order
 * they were passed. If every function returns a truthy value when applied to the arguments,
 * 'true' is returned, 'false' other wise.
 * @note: This function is partially applied, not curried.
 * @kind function
 * @function all
 * @param {function} fns - One or more comma separated function arguments
 * @return {function} - a
 */
var all = applyAll(function (fns, args) {
  return fns.every(function (fn) {
    return fn.apply(undefined, _toConsumableArray(args));
  });
});

/**
 * @signature (* -> *) -> [*] -> boolean
 * @description Partially applied function that takes one or more functions followed
 * by zero or more arguments and applies each function to the arguments in the order
 * they were passed. If a single function returns a truthy value when applied to the
 * arguments, 'true' is returned, 'false' other wise.
 * @note: This function is partially applied, not curried.
 * @kind function
 * @function any
 * @param {Array} fns - One or more comma separated function arguments
 * @return {function} - a
 */
var any = applyAll(function (fns, args) {
  return fns.some(function (fn) {
    return fn.apply(undefined, _toConsumableArray(args));
  });
});

/**
 * @signature
 * @description d
 * @kind function
 * @function c
 * @param {function} x
 * @param {*} y - a
 * @param {*} z - b
 * @return {*} - c
 */
var c = curry(function _c(x, y, z) {
  return x(y)(z);
});

/**
 * @description Takes any number of arguments, collects them, and then returns them
 * in an array in reverse order.
 * @param {*} args The arguments that are to be grouped and reversed.
 * @return {Array} Returns an array of values.
 */
var rev = function rev() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.reverse();
};

/**
 * @signature compose :: (b -> c) -> (a -> b) -> (a -> c)
 * @description Takes one or more functions and feeds the result of each
 * into the following function. The return value of the last function is
 * the return value of this function. Note that the functions are invoked
 * in reverse order of how they are received. Use {@link pipe} if you want
 * the functions invoked in the same order they are received.
 * @note: This function is partially applied, not curried.
 * @see pipe
 * @param {function} fns - Two or more functions that should be composed
 * @return {*} - b
 *
 * @example
 *      var list = 6,
 *          mapFilter = compose(x => x > 5, x => x * 2);
 *
 *      mapFilter(list);    //10
*/
function compose() {
  for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  fns = fns.reverse();
  return pipe.apply(undefined, _toConsumableArray(fns));
}

/**
 * @signature
 * @description d
 * @kind function
 * @function condition
 * @param {function} exp1 - a
 * @param {function} exp2 - b
 * @param {function} cond - c
 * @return {*} - d
 */
var condition = curry(function (exp1, exp2, cond) {
  return cond(exp1, exp2);
});

var notFn = condition(constant(function (x) {
  return x;
}), function (x) {
  return x;
});

var n = function _n(x, y, z) {
  return function _n_() {
    x ? y.apply(undefined, arguments) : z.apply(undefined, arguments);
  };
};

/**
 * @signature constant :: a -> () -> a
 * @description A function that creates a constant function. When invoked
 * with any value, the constant function will return a new function. When
 * the new function is invoked, with or without values, it will always return
 * the value that was given to the initial function.
 * @param {*} item - Any value
 * @return {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
function constant(item) {
  return function _constant() {
    return item;
  };
}

/**
 * @signature curry :: (* -> a) -> (* -> a)
 * @description d
 * @note This function is partially applied, not curried.
 * @param {function} fn - a
 * @return {function|*} - b
 *
 * @example
 *      var c = curry((a, b, c, d) => a + b + c + d);
 *      c(1)(2, 3)(4)   //10
 */
function curry(fn) {
  if (1 >= fn.length) return fn;
  return _curry.call(this, fn.length, fn);
}

/**
 * @signature
 * @description d
 * @private
 * @param {number} arity - a
 * @param {function} fn - b
 * @param {Array} received - c
 * @return {*} - d
 */
function _curry(arity, fn) {
  var received = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (fn.orig && fn.orig !== fn) return _curry.call(this, arity, fn.orig, received);
  function _curry_() {
    for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      rest[_key3] = arguments[_key3];
    }

    var combined = received.concat(rest);
    if (arity > combined.length) return _curry.call(this, arity, fn, combined);
    return fn.call.apply(fn, [this].concat(_toConsumableArray(combined)));
  }

  _curry_.orig = fn;
  _curry_.toString = function () {
    return fn.toString() + '(' + received.join(', ') + ')';
  };
  Object.defineProperties(_curry_, { length: { value: arity - received.length } });
  return _curry_;
}

/**
 * @signature curryN :: (* -> a) -> (* -> a)
 * @description Curries a function to a specified arity
 * @param {number} arity - The number of arguments to curry the function for
 * @param {function} fn - The function to be curried
 * @param {Array} [received] - An optional array of the arguments to be applied to the
 * function.
 * @return {function | *} - Returns either a function waiting for more arguments to
 * be applied before invocation, or will return the result of the function applied
 * to the supplied arguments if the specified number of arguments have been received.
 *
 * @example
 *      var c = curryN(this, 5, (a, b, c) => a + b + c);
 *      c(1, 2)(3)(4, 5)    //6
 */
function curryN(arity, fn) {
  var received = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (fn.orig && fn.orig !== fn) return curryN.call(this, arity, fn.orig, received);
  function _curryN() {
    for (var _len4 = arguments.length, rest = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      rest[_key4] = arguments[_key4];
    }

    var combined = received.concat(rest);
    if (arity > combined.length) return curryN.call(this, arity, fn, combined);
    return fn.call.apply(fn, [this].concat(_toConsumableArray(combined.slice(0, arity))));
  }

  _curryN.orig = fn;
  _curryN.toString = function () {
    return fn.toString() + '(' + received.join(', ') + ')';
  };

  //Although Object.defineProperty works just fine to change a function's length, mocha freaks
  //out for no apparent reason, so it won't do for testing purposes.
  Object.defineProperties(_curryN, { length: { value: arity - received.length } });

  return _curryN;
}

/**
 * @signature
 * @description Behaves like curry, but executes the given function with the arguments
 * in reverse order from that in which they were received.
 * @note This function is partially applied, not curried.
 * @see curry
 * @param {function} fn - A function that should be curried and eventually invoked with
 * the arguments in reverse order.
 * @return {Function|*} - Returns a function waiting for arguments.
 *
 * @example
 *      var c = curryRight((a, b, c, d) => a + b * c / d);
 *      c(1)(2, 3, 4)   //1
 */
function curryRight(fn) {
  /**
   * @description Function returned both by {@link curryRight} and itself unless and
   * until it has received the appropriate number of arguments to invoked the curried
   * function.
   * @function _wrapper
   * @param {*} args One or more arguments that the function should be applied to.
   * @return {function|*} Returns either a function if not enough arguments have been
   * received yet, other wise it returns whatever the return value of the last function
   * in the pipeline returned.
   */
  return curryN.call(this, fn.length, function _wrapper() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return fn.call.apply(fn, [this].concat(_toConsumableArray(args.reverse())));
  });
}

/**
 * @signature
 * @description d
 * @see constant
 * @kind function
 * @function first
 * @param {*} - a
 * @return {function} - b
 */
var first = constant;

/**
 * @signature
 * @description d
 * @note This function is partially applied, not curried.
 * @param {function} fn - a
 * @return {*} - b
 */
function fixedPoint(fn) {
  function _fixedPoint(x) {
    return fn(function _y_(v) {
      x(x)(v);
    });
  }
  return _fixedPoint(_fixedPoint);
}

/**
 * @signature
 * @description d
 * @kind function
 * @function fork
 * @param {function} join - a
 * @param {function} fn1 - b
 * @param {function} fn2 - c
 * @return {function} - d
 */
var fork = curry(function (join, fn1, fn2) {
  return function () {
    return join(fn1.apply(undefined, arguments), fn2.apply(undefined, arguments));
  };
});

/**
 * @signature Identity :: a -> a
 * @description Identity function; takes any item and returns same item when invoked
 * @param {*} item - Any value of any type
 * @return {*} - returns item
 */
var identity = function identity(item) {
  return item;
};

/**
 * @signature ifElse :: Function -> ( Function -> ( Function -> (a -> b) ) )
 * @description Takes a predicate function that is applied to the data; If a truthy value
 * is returned from the application, the provided ifFunc argument will be
 * invoked, passing the data as an argument, otherwise the elseFunc is
 * invoked with the data as an argument.
 * @kind function
 * @function ifElse
 * @param {function} predicate - a
 * @param {function} ifFunc - b
 * @param {function} elseFunc - c
 * @param {*} data - d
 * @return {*} - returns the result of invoking the ifFunc or elseFunc
 * on the data
 */
var ifElse = curry(function (predicate, ifFunc, elseFunc, data) {
  return predicate(data) ? ifFunc(data) : elseFunc(data);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function ifThisThenThat
 * @param {function} predicate - a
 * @param {function} ifFunc - b
 * @param {*} ifArg - c
 * @param {*} thatArg - d
 * @return {*} - e
 */
var ifThisThenThat = curry(function (predicate, ifFunc, ifArg, thatArg) {
  return predicate(ifArg) ? ifFunc(thatArg) : thatArg;
});

/**
 * @signature kestrel :: a -> () -> a
 * @description d
 * @kind function
 * @function kestrel
 * @see constant
 * @param {*} item - a
 * @return {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
var kestrel = constant;

/**
 * @signature
 * @description d
 * @param {function} a - a
 * @return {*} - b
 */
var m = function m(a) {
  return a(a);
};

/**
 * @signature
 * @description d
 * @kind function
 * @function o
 * @param {function} a - a
 * @param {function} b - b
 * @return {*} - c
 */
var o = curry(function (a, b) {
  return b(a(b));
});

/**
 * @signature pipe :: [a] -> (b -> c)
 * @description -  Takes a List of functions as arguments and returns
 * a function waiting to be invoked with a single item. Once the returned
 * function is invoked, it will reduce the List of functions over the item,
 * starting with the first function in the List and working through
 * sequentially. Performs a similar functionality to compose, but applies
 * the functions in reverse order to that of compose.
 * @refer {compose}
 * @see compose
 * @param {function} fn - The function to run initially; may be any arity.
 * @param {Array} fns - The remaining functions in the pipeline. Each receives
 * its input from the output of the previous function. Therefore each of these
 * functions must be unary.
 * @return {function} - Returns a function waiting for the item over which
 * to reduce the functions.
 *
 * @example
 *      var p = pipe(x => x % 2, x => x * x);
 *
 *      p(10)  //0
 */
function pipe(fn) {
  for (var _len6 = arguments.length, fns = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    fns[_key6 - 1] = arguments[_key6];
  }

  function _pipe() {
    return fns.reduce(function pipeReduce(item, f) {
      return f(item);
    }, fn.apply(undefined, arguments));
  }

  _pipe.toString = function () {
    return [fn].concat(fns).reduce(function (str, f, idx) {
      return str + ('' + f.toString() + (idx < fns.length ? '(' : ''));
    }, '') + ')'.repeat(fns.length);
  };
  //only curry the pipe if the leading function is not already curried - otherwise, leave as is
  return fn.orig ? _pipe : _curry(fn.length, _pipe);
}

/**
 * @signature
 * @description d
 * @kind function
 * @function q
 * @param {function} a - a
 * @param {function} b - b
 * @param {*} c - c
 * @return {*} - d
 */
var q = curry(function (a, b, c) {
  return b(a(c));
});

//const reduce = (accFn, start, xs) => xs.reduce(accFn, start);
/**
 * @signature
 * @description d
 * @kind function
 * @function reduce
 * @param {function} accFunc - a
 * @param {*} start - b
 * @param {Array} xs - c
 * @return {Array} - d
 */
var reduce = curry(function _reduce(accFunc, start, xs) {
  /*
   for (let item of xs) {
   start = accFunc(start, item);
   }
   return start;
   */

  /*
   for (let item of xs) {
   let next = txf(acc, item);//we could also pass an index or xs, but K.I.S.S.
   acc = next && next[reduce.stopper] || next;// {[reduce.stopper]:value} or just a value
   if (next[reduce.stopper]) {
   break;
   }
   }
   return acc;
     //goes outside reduce definition; or side by side with declaration:
   //set reduce.stopper be a Symbol that only is only ever = to reduce.stopper itself
   Object.defineProperty(reduce, 'stopper', {
   enumerable: false,
   configurable: false,
   writable: false,
   value: Symbol('stop reducing')//no possible computation could come up with this by accident
   });
   */
  return xs.reduce(accFunc, start);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function second
 * @return {*} - a
 */
var second = constant(identity);

/**
 * @signature
 * @description d
 * @note This function is partially applied, not curried.
 * @kind function
 * @function sequence
 * @param {Array} fns - a
 * @return {function} - b
 */
var sequence = applyAll(function (fns, args) {
  return fns.forEach(function (fn) {
    return fn.apply(undefined, _toConsumableArray(args));
  });
});

/**
 * @signature
 * @description d
 * @kind function
 * @function t
 * @param {*} x - a
 * @param {function} f = b
 * @return {*} - c
 */
var t = curry(function (x, f) {
  return f(x);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function thrush
 * @refer {t}
 * @see t
 */
var thrush = t;

/**
* @signature
* @description d
* @kind function
* @function u
* @param {function} a - a
* @param {function} b - b
* @return {*} - c
*/
var u = curry(function (a, b) {
  return b(a(a)(b));
});

/**
 * @signature
 * @description Takes any function curried by this library and uncurries it.
 * @param {function} fn - a
 * @return {function} - b
 *
 * @example
 *      var c = curry((a, b, c, d) => a + b + c + d),
 *      d = uncurry(c);
 *
 *      c(1)(2, 3, 4)   //10
 *      d(1)            //NaN
 */
function uncurry(fn) {
  if (fn && fn.orig) return fn.orig;
  return fn;
}

/**
 * @signature
 * @description d
 * @kind function
 * @function uncurryN
 * @param {number} depth - a
 * @param {function} fn - b
 * @return {function|*} - c
 *
 * @example
 *      var c = curry((a, b, c) => a + b + c),
 *          d = uncurryN(1, c);
 *
 *      c(1, 2)     //NaN
 */
var uncurryN = curry(function uncurryN(depth, fn) {
  return curryN.call(this, depth, function _uncurryN() {
    var currentDepth = 1,
        value = fn,
        idx = 0,
        endIdx;

    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    while (currentDepth <= depth && 'function' === typeof value) {
      endIdx = currentDepth === depth ? args.length : idx + value.length;
      value = value.apply(this, args.slice(idx, endIdx));
      currentDepth += 1;
      idx = endIdx;
    }
    return value;
  });
});

/**
 * @signature
 * @description d
 * @kind function
 * @function w
 * @param {function} a - a
 * @param {*} b - b
 * @return {*} - c
 */
var w = curry(function (a, b) {
  return a(b)(b);
});

/**
 * @signature when :: Function -> (Function -> (a -> b))
 * @description Similar to ifElse, but no 'elseFunc' argument. Instead, if the application
 * of the predicate to the data returns truthy, the transform is applied to
 * the data. Otherwise, the data is returned without invoking the transform.
 * @kind function
 * @function when
 * @param {function} predicate - a
 * @param {function} transform - b
 * @param {*} data - c
 * @return {*} - d
 */
var when = curry(function (predicate, transform, data) {
  return predicate(data) ? transform(data) : data;
});

/**
 * @signature whenNot :: () -> () -> * -> *
 * @description d
 * @kind function
 * @function whenNot
 * @param {function} predicate - a
 * @param {function} transform - b
 * @param {*} data - c
 * @return {*} - d
 */
var whenNot = curry(function (predicate, transform, data) {
  return !predicate(data) ? transform(data) : data;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function y
 */
var y = fixedPoint;

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function applyWhenReady(fn) {
  var values = [];

  /**
   * @signature (*...) -> (*...) -> *
   * @description Takes any function and will allow any number of arguments to
   * be passed as parameters until _applyWhenReady#apply, _applyWhenReady#leftApply,
   * or _applyWhenReady#rightApply are invoked.
   * @namespace _applyWhenReady
   * @param {*} args - Zero or more arguments to be applied to the given function.
   * @return {_applyWhenReady} Returns a function that will wait and gather arguments
   * to be applied to the given function.
   * @private
   * @property {function} apply
   * @property {function} leftApply
   * @property {function} rightApply
   * @property {function} args
   */
  function _applyWhenReady() {
    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    values = values.concat(args);
    return _applyWhenReady;
  }

  /**
   * @signature () -> *
   * @description Invokes the given function using all of the provided
   * arguments.
   * @memberOf _applyWhenReady
   * @function apply
   * @return {*} Returns the value that the given function returns
   */
  _applyWhenReady.apply = function () {
    return fn.apply(undefined, _toConsumableArray(values));
  };

  /**
   * @signature () -> *
   * @description Invokes the given function using all of the provided
   * arguments.
   * @memberOf _applyWhenReady
   * @function leftApply
   * @return {*} Returns the value that the given function returns
   */
  _applyWhenReady.leftApply = _applyWhenReady.apply;

  /**
   * @signature () -> *
   * @description Invokes the given function using all of the provided
   * arguments in reverse order.
   * @memberOf _applyWhenReady
   * @function rightApply
   * @return {*} Returns the value that the given function returns
   */
  _applyWhenReady.rightApply = function () {
    return fn.apply(undefined, _toConsumableArray(values.reverse()));
  };

  /**
   * @signature () -> [*]
   * @description Returns an array of the arguments received thus far.
   * @function args
   * @return {Array} Returns an array of values.
   */
  _applyWhenReady.args = function () {
    return values;
  };

  return _applyWhenReady;
}

/**
 * @signature () -> () -> * -> *
 * @description Takes two or more functions and zero or more
 * arguments and invokes the function with the arguments.
 * @note This function is partially applied, not curried.
 * @param {function} fn - The first function in a pipeline that
 * should have all of the provided arguments applied to first.
 * @return {function} Returns a function waiting for more functions.
 */
function applyAll(fn) {
  return function _applyAll() {
    for (var _len9 = arguments.length, fns = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      fns[_key9] = arguments[_key9];
    }

    return function __applyAll() {
      for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      return fn(fns, args);
    };
  };
}

exports.all = all;
exports.any = any;
exports.applyWhenReady = applyWhenReady;
exports.c = c;
exports.compose = compose;
exports.constant = constant;
exports.curry = curry;
exports.curryN = curryN;
exports.curryRight = curryRight;
exports.first = first;
exports.fixedPoint = fixedPoint;
exports.fork = fork;
exports.identity = identity;
exports.ifElse = ifElse;
exports.ifThisThenThat = ifThisThenThat;
exports.kestrel = kestrel;
exports.m = m;
exports.pipe = pipe;
exports.o = o;
exports.q = q;
exports.reduce = reduce;
exports.rev = rev;
exports.second = second;
exports.sequence = sequence;
exports.t = t;
exports.thrush = thrush;
exports.u = u;
exports.uncurry = uncurry;
exports.uncurryN = uncurryN;
exports.w = w;
exports.when = when;
exports.whenNot = whenNot;
exports.y = y;

},{}],331:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constant = exports.Constant = undefined;

var _Symbol$toStringTag, _constant, _mutatorMap;

var _data_structure_util = require('./data_structure_util');

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function returnMe() {
  return this;
}

/**
 * @signature - :: * -> {@link dataStructures.constant}
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.constant} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.constant}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Constant
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.constant}.
 * @return {dataStructures.constant} - Returns a new object that delegates to the
 * {@link dataStructures.constant}.
 */
function Constant(val) {
  return Object.create(constant, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @signature * -> {@link dataStructures.constant}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.constant} object delegator instance.
 * Because the constant functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Constant}
 * @memberOf dataStructures.Constant
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.constant}.
 * @return {dataStructures.constant} - Returns a new object that delegates to the
 * {@link dataStructures.constant}.
 */
Constant.of = function (x) {
  return Constant(x);
};

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.constant} delegate or not. Available on the
 * identity_functor's factory function as Identity.is.
 * @memberOf dataStructures.Constant
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.constant} delegate.
 */
Constant.is = function (f) {
  return constant.isPrototypeOf(f);
};

/**
 * @typedef {Object} constant
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} extract
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the constant factory function
 * @property {function} [Symbol.Iterator] - Iterator for the constant
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace constant
 * @description This is the delegate object that specifies the behavior of the identity functor. All
 * operations that may be performed on an identity functor 'instance' delegate to this object. Constant
 * functor 'instances' are created by the {@link dataStructures.Constant} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var constant = (_constant = {
  /**
   * @signature () -> *
   * @description Returns the underlying value of an constant delegator. This
   * getter is not expected to be used directly by consumers - it is meant as an internal
   * access only. To manipulate the underlying value of an identity_functor delegator,
   * see {@link dataStructures.constant#map} and {@link dataStructures.constant#bimap}.
   * To retrieve the underlying value of an identity_functor delegator, see {@link dataStructures.constant#get},
   * {@link dataStructures.constant#orElse}, {@link dataStructures.constant#getOrElse},
   * and {@link dataStructures.constant#valueOf}.
   * @memberOf dataStructures.constant
   * @instance
   * @protected
   * @function
   * @return {*} Returns the underlying value of the delegator. May be any value.
   */
  get value() {
    return this._value;
  },
  get extract() {
    return this.value;
  },
  /**
   * @signature () -> {@link dataStructures.constant}
   * @description Takes a function that is applied to the underlying value of the
   * functor, the result of which is used to create a new {@link dataStructures.constant}
   * delegator instance.
   * @memberOf dataStructures.constant
   * @instance
   * @param {function} fn - A mapping function that can operate on the underlying
   * value of the {@link dataStructures.constant}.
   * @return {dataStructures.constant} Returns a new {@link dataStructures.constant}
   * delegator whose underlying value is the result of the mapping operation
   * just performed.
   */
  map: returnMe,
  chain: returnMe,
  /**
   * @signature
   * @description d
   * @param {dataStructures.constant} con - Another constant data structure
   * @return {dataStructures.constant} Returns itself
   */
  concat: returnMe,
  fold: function _fold(f) {
    return f(this.value);
  },
  sequence: function _sequence(p) {
    return this.factory.of(this.value);
  },
  traverse: function _traverse(a, f) {
    return this.factory.of(this.value);
  },
  apply: returnMe,
  /**
   * @signature * -> boolean
   * @description Determines if 'this' identity functor is equal to another functor. Equality
   * is defined as:
   * 1) The other functor shares the same delegate object as 'this' identity functor
   * 2) Both underlying values are strictly equal to each other
   * @memberOf dataStructures.constant
   * @instance
   * @function
   * @param {Object} ma - The other functor to check for equality with 'this' functor.
   * @return {boolean} - Returns a boolean indicating equality
   */
  equals: _data_structure_util.equals,
  /**
   * @signature () -> *
   * @description Returns the underlying value of the current functor 'instance'. This
   * function property is not meant for explicit use. Rather, the JavaScript engine uses
   * this property during implicit coercion like addition and concatenation.
   * @memberOf dataStructures.constant
   * @instance
   * @function
   * @return {*} Returns the underlying value of the current functor 'instance'.
   */
  valueOf: _data_structure_util.valueOf,
  /**
   * @signature () -> string
   * @description Returns a string representation of the functor and its
   * underlying value
   * @memberOf dataStructures.constant
   * @instance
   * @function
   * @return {string} Returns a string representation of the constant
   * and its underlying value.
   */
  toString: (0, _data_structure_util.stringMaker)('Constant')
}, _Symbol$toStringTag = Symbol.toStringTag, _mutatorMap = {}, _mutatorMap[_Symbol$toStringTag] = _mutatorMap[_Symbol$toStringTag] || {}, _mutatorMap[_Symbol$toStringTag].get = function () {
  return 'Constant';
}, _defineProperty(_constant, 'factory', Constant), _defineEnumerableProperties(_constant, _mutatorMap), _constant);

/**
 * @signature (* -> *) -> (* -> *) -> dataStructures.constant<T>
 * @description Since the constant functor does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out monads/monads does not break an application that is
 * relying on its existence.
 * @memberOf dataStructures.constant
 * @instance
 * @function
 * @param {function} f - A function that will be used to map over the underlying data of the
 * {@link dataStructures.constant} delegator.
 * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.constant}
 * since there is no disjunction present.
 * @return {dataStructures.constant} - Returns a new {@link dataStructures.constant} delegator after applying
 * the mapping function to the underlying data.
 */
constant.bimap = constant.map;

constant.mjoin = _data_structure_util.join;

constant.ap = constant.apply;
constant.fmap = constant.chain;
constant.flapMap = constant.chain;
constant.bind = constant.chain;
constant.reduce = constant.fold;
constant.constructor = constant.factory;

exports.Constant = Constant;
exports.constant = constant;

},{"./data_structure_util":333}],332:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Validation = exports.Right = exports.Nothing = exports.Maybe = exports.List = exports.Left = exports.Just = exports.Io = exports.Identity = exports.Future = exports.Either = exports.Constant = undefined;

var _constant = require('./constant');

var _either = require('./either');

var _future = require('./future');

var _identity = require('./identity');

var _io = require('./io');

var _list = require('./list');

var _maybe = require('./maybe');

var _validation = require('./validation');

var _data_structure_util = require('./data_structure_util');

/**
 * @namespace dataStructures
 */

/*
    - Semigroup:
        > a.concat(b).concat(c) is equivalent to a.concat(b.concat(c)) (associativity)

    - Monoid:
        > A value that implements the Monoid specification must also implement the Semigroup specification.
        > m.concat(M.empty()) is equivalent to m (right identity)
        > M.empty().concat(m) is equivalent to m (left identity)

    - Functor:
        > u.map(a => a) is equivalent to u (identity)
        > u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)

    - Apply:
        > A value that implements the Apply specification must also implement the Functor specification.
        > v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)

    - Applicative:
        > A value that implements the Applicative specification must also implement the Apply specification.
        > v.ap(A.of(x => x)) is equivalent to v (identity)
        > A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
        > A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)

    - Foldable:
        > u.reduce is equivalent to u.reduce((acc, x) => acc.concat([x]), []).reduce

    - Traversable:
        > A value that implements the Traversable specification must also implement the Functor and Foldable specifications.
        > t(u.traverse(F, x => x)) is equivalent to u.traverse(G, t) for any t such that t(a).map(f) is equivalent to t(a.map(f)) (naturality)
        > u.traverse(F, F.of) is equivalent to F.of(u) for any Applicative F (identity)
        > u.traverse(Compose, x => new Compose(x)) === new Compose(u.traverse(F, x => x).map(x => x.traverse(G, x => x)))
                for Compose defined below and any Applicatives F and G (composition)

    - Chain:
        > A value that implements the Chain specification must also implement the Apply specification.
        > m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g)) (associativity)

    - ChainRec:
        > A value that implements the ChainRec specification must also implement the Chain specification.
        > M.chainRec((next, done, v) => p(v) ? d(v).map(done) : n(v).map(next), i) is equivalent to (function step(v) { return p(v) ? d(v) : n(v).chain(step); }(i)) (equivalence)
        > Stack usage of M.chainRec(f, i) must be at most a constant multiple of the stack usage of f itself.

    - Monad:
        > A value that implements the Monad specification must also implement the Applicative and Chain specifications.
        > M.of(a).chain(f) is equivalent to f(a) (left identity)
        > m.chain(M.of) is equivalent to m (right identity)

    - Extend:
        > A value that implements the Extend specification must also implement the Functor specification.
        > w.extend(g).extend(f) is equivalent to w.extend(_w => f(_w.extend(g)))

    - Comonad:
        > A value that implements the Comonad specification must also implement the Extend specification.
        > w.extend(_w => _w.extract()) is equivalent to w (left identity)
        > w.extend(f).extract() is equivalent to f(w) (right identity)

    - Bifunctor:
        > A value that implements the Bifunctor specification must also implement the Functor specification.
        > p.bimap(a => a, b => b) is equivalent to p (identity)
        > p.bimap(a => f(g(a)), b => h(i(b)) is equivalent to p.bimap(g, i).bimap(f, h) (composition)

    - Profunctor:
        > A value that implements the Profunctor specification must also implement the Functor specification.
        > p.promap(a => a, b => b) is equivalent to p (identity)
        > p.promap(a => f(g(a)), b => h(i(b))) is equivalent to p.promap(f, i).promap(g, h) (composition)
 */

var monads = [{ factory: _constant.Constant, delegate: _constant.constant }, { factory: _future.Future, delegate: _future.future }, { factory: _identity.Identity, delegate: _identity.identity }, { factory: _io.Io, delegate: _io.io }, { factory: _maybe.Just, delegate: _maybe.just }, { factory: _either.Left, delegate: _either.left }, { factory: _list.List, delegate: _list.list_core }, { factory: _maybe.Maybe }, { factory: _maybe.Nothing, delegate: _maybe.nothing }, { factory: _either.Right, delegate: _either.right }, { factory: _validation.Validation, delegate: _validation.validation }];

(0, _data_structure_util.applyFantasyLandSynonyms)((0, _data_structure_util.applyTransforms)((0, _data_structure_util.applyAliases)((0, _data_structure_util.setIteratorAndLift)(monads))));

exports.Constant = _constant.Constant;
exports.Either = _either.Either;
exports.Future = _future.Future;
exports.Identity = _identity.Identity;
exports.Io = _io.Io;
exports.Just = _maybe.Just;
exports.Left = _either.Left;
exports.List = _list.List;
exports.Maybe = _maybe.Maybe;
exports.Nothing = _maybe.Nothing;
exports.Right = _either.Right;
exports.Validation = _validation.Validation;

},{"./constant":331,"./data_structure_util":333,"./either":334,"./future":335,"./identity":337,"./io":338,"./list":339,"./maybe":341,"./validation":343}],333:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setIteratorAndLift = exports.extendMaker = exports.chainRec = exports.applyAliases = exports.applyFantasyLandSynonyms = exports.sharedEitherFns = exports.sharedMaybeFns = exports.valueOf = exports.stringMaker = exports.join = exports.lifter = exports.equals = exports.disjunctionEqualMaker = exports.dimap = exports.monadIterator = exports.contramap = exports.chain = exports.applyTransforms = exports.apply = undefined;

var _combinators = require('../combinators');

/** @module data_structure_util */

/**
 * @signature contramap :: (b -> a) -> Ma
 * @description Contramap accepts a single function as an argument and returns a
 * new instance of the same data structure with an underlying function that is
 * the result of the composition of the original underlying function and the
 * function argument.
 * @param {function} fn - A function that should be composed with the data structure's
 * underlying function.
 * @return {*} Returns a data structure of the same type.
 */
function contramap(fn) {
    var _this = this;

    return this.factory.of(function () {
        return _this.value(fn.apply(undefined, arguments));
    });
}

function dimap(f, g) {
    var _this2 = this;

    return this.factory.of(function () {
        return g(_this2.value(f.apply(undefined, arguments)));
    });
}

/**
 * @signature
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
function transformer(type) {
    return function toType() {
        var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _combinators.identity;

        return type.of(fn(this.value));
    };
}

/**
 * @signature
 * @description Applies mapping transformers from each monad to each monad
 * @param {Array} types - An array containing each monad type factory function and associated delegate object
 * @return {*} Returns the array of monad 'types' that it received as an argument.
 */
function applyTransforms(types) {
    var fns = types.map(function (type) {
        return { name: 'mapTo' + type.factory.name, fn: transformer(type.factory) };
    });
    return types.map(function _applyTransforms(type) {
        if (type.delegate) {
            var regex = new RegExp(type.factory.name, 'i');
            fns.filter(function (fn) {
                return !regex.test(fn.name);
            }).forEach(function (fn) {
                return type.delegate[fn.name] = fn.fn;
            });
        }
        return type;
    });
}

/**
 * @signature
 * @description Accepts a list of monad delegates and applies the associated fantasy-land
 * synonyms where applicable.
 * @param {Array} monads - An array containing each monad type factory function and associated delegate object
 * @return {*} Returns the array of monad 'types' that it received as an argument.
 */
function applyFantasyLandSynonyms(monads) {
    return monads.map(function _applyFantasyLandSynonyms(monad) {
        if (monad.delegate) {
            Object.keys(monad.delegate).forEach(function _forEachKey(key) {
                if (key in fl) monad.delegate[fl[key]] = monad.delegate[key];
            });
        }
        return monad;
    });
}

/**
 * @signature
 * @description d
 * @return {Object} - a
 */
function monadIterator() {
    var first = true,
        val = this.value;
    return {
        next: function _next() {
            if (first) {
                first = false;
                return { done: false, value: val };
            }
            return { done: true };
        }
    };
}

function _toPrimitive(hint) {
    //if the underlying is a function, an object, or we didn't receive a hint, let JS determine how
    //to turn the underlying value into a primitive if it is not already...
    if (!Array.isArray(this.value) && null != hint) {
        //..if the hint is a number or default, coerce the underlying to a number and return...
        if ('number' === hint || 'number' === typeof this.value) return +this.value;
        //...else the hint was 'string', so coerce to a string a return
        return '' + this.value;
    }

    if ('string' === hint) return this.value.join('');
    if ('number' === hint || 'default' === hint) return this.value.reduce(function (curr, acc) {
        return curr + acc;
    }, 0);
}

/**
 * @signature
 * @description A factory function that takes a monad factory of any type
 * and returns a function that acts as an extend for that monad.
 * @param {function} typeFactory - A reference to a specific monad's factory function.
 * @return {_extend} Returns a function that acts as an extend for a monad.
 */
function extendMaker(typeFactory) {
    return function _extend(fn) {
        return typeFactory(fn(this));
    };
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} b
 */
function apply(ma) {
    return Object.getPrototypeOf(this).isPrototypeOf(ma) ? this.map(ma.value) : this;
}

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function chain(fn) {
    var val = fn(this.value);
    return Object.getPrototypeOf(this).isPrototypeOf(val) ? val : this.factory.of(val);
}

/**
 * @signature
 * @description Chain recursive
 * @param {function} fn - A function that should be called recursively
 * @return {Object} Returns a monad that wraps the final value 'yielded' out
 * of the recursive function.
 */
function chainRec(fn) {
    var next = function next(x) {
        return { done: false, value: x };
    },
        done = function done(x) {
        return { done: true, value: x };
    },
        state = { done: false, value: this.value };

    while (!state.done) {
        state = fn(next, done, state.value);
    }
    return this.factory.of(state.value);
}

/**
 * @signature
 * @description d
 * @param {string} prop - b
 * @return {function} - c
 */
function disjunctionEqualMaker(prop) {
    return function _disjunctionEquals(a) {
        return this.value && this.value.equals === _disjunctionEquals ? this.value.equals(a) : a.value && a.value.equals === _disjunctionEquals ? a.value.equals(this) : Object.getPrototypeOf(this).isPrototypeOf(a) && a[prop] && this.value === a.value;
    };
}

/**
 * @signature
 * @description d
 * @param {Object} a - a
 * @return {boolean} - b
 */
function equals(a) {
    return this.value && this.value.equals === equals ? this.value.equals(a) : a.value && a.value.equals === equals ? a.value.equals(this) : Object.getPrototypeOf(this).isPrototypeOf(a) && this.value === a.value;
}

/**
 * @signature
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var lifter = function lifter(type) {
    return function (fn) {
        return function () {
            return type.of(fn.apply(undefined, arguments));
        };
    };
};

/**
 * @signature
 * @description d
 * @return {Object} Returns a data structure flattened by one level if capable.
 */
function join() {
    return Object.getPrototypeOf(this).isPrototypeOf(this.value) ? this.value : this;
}

/**
 * @signature
 * @description d
 * @param {string} factory - a
 * @return {function} - b
 */
function stringMaker(factory) {
    return function _toString() {
        return factory + '(' + (null == this.value ? this.value : this.value.toString()) + ')';
    };
}

/**
 * @signature
 * @description d
 * @return {*} - a
 */
function valueOf() {
    return this.value;
}

//==========================================================================================================//
//==========================================================================================================//
//================================        Shared Maybe Functionality        ================================//
//==========================================================================================================//
//==========================================================================================================//
function justMap(fn) {
    return this.factory.of(fn(this.value));
}

function justBimap(f, g) {
    return this.factory.of(f(this.value));
}

var sharedMaybeFns = {
    justMap: justMap,
    justBimap: justBimap
};

//==========================================================================================================//
//==========================================================================================================//
//================================        Shared Either Functionality        ===============================//
//==========================================================================================================//
//==========================================================================================================//
/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function rightMap(fn) {
    return this.factory.of(fn(this.value));
}

/**
 * @signature
 * @description d
 * @param {function} factory - a
 * @return {function} - b
 */
function leftMapMaker(factory) {
    return function leftMap(fn) {
        return factory(this.value);
    };
}

/**
 * @signature
 * @description d
 * @param {function} f - a
 * @param {function} g - b
 * @return {*} - c
 */
function rightBiMap(f, g) {
    return this.factory.of(f(this.value));
}

/**
 * @signature
 * @description d
 * @param {function} factory - a
 * @return {function} - b
 */
function leftBimapMaker(factory) {
    return function leftBimap(f, g) {
        return factory(g(this.value));
    };
}

var sharedEitherFns = {
    rightMap: rightMap,
    leftMapMaker: leftMapMaker,
    rightBiMap: rightBiMap,
    leftBimapMaker: leftBimapMaker
};

var delegate_aliases = {
    chain: ['bind', 'fmap', 'flatMap'],
    apply: ['ap'],
    factory: ['constructor']
};

var factory_aliases = {
    of: ['pure', 'point', 'return']
};

function setIteratorAndLift(dataStructures) {
    return dataStructures.map(function _forEachStructure(dataStructure) {
        dataStructure.factory.lift = lifter(dataStructure.factory);
        if (dataStructure.delegate) {
            //TODO: for now, don't apply the toPrimitive symbol function - it's messing with operations I
            //TODO: would not expect it to mess with.
            dataStructure.delegate[Symbol.toPrimitive] = _toPrimitive;
            if (!dataStructure.delegate[Symbol.iterator]) dataStructure.delegate[Symbol.iterator] = monadIterator;
        }
        return dataStructure;
    });
}

function applyAliases(monads) {
    return monads.map(function _applyAliases(monad) {
        Object.keys(factory_aliases).forEach(function _applyFactoryAliases(fn) {
            factory_aliases[fn].forEach(function _setAliases(alias) {
                monad.factory[alias] = monad.factory[fn];
            });
        });

        if (monad.delegate) {
            Object.keys(delegate_aliases).forEach(function _applyDelegateAliases(fn) {
                delegate_aliases[fn].forEach(function _setAliases(alias) {
                    monad.delegate[alias] = monad.delegate[fn];
                });
            });
        }
        return monad;
    });
}

var fl = {
    equals: 'fantasy-land/equals',
    lte: 'fantasy-land/lte',
    compose: 'fantasy-land/compose',
    id: 'fantasy-land/id',
    concat: 'fantasy-land/concat',
    empty: 'fantasy-land/empty',
    map: 'fantasy-land/map',
    contramap: 'fantasy-land/contramap',
    ap: 'fantasy-land/ap',
    of: 'fantasy-land/of',
    alt: 'fantasy-land/alt',
    zero: 'fantasy-land/zero',
    reduce: 'fantasy-land/reduce',
    traverse: 'fantasy-land/traverse',
    chain: 'fantasy-land/chain',
    chainRec: 'fantasy-land/chainRec',
    extend: 'fantasy-land/extend',

    //extract: 'fantasy-land/extract',
    bimap: 'fantasy-land/bimap',
    promap: 'fantasy-land/promap'
};

exports.apply = apply;
exports.applyTransforms = applyTransforms;
exports.chain = chain;
exports.contramap = contramap;
exports.monadIterator = monadIterator;
exports.dimap = dimap;
exports.disjunctionEqualMaker = disjunctionEqualMaker;
exports.equals = equals;
exports.lifter = lifter;
exports.join = join;
exports.stringMaker = stringMaker;
exports.valueOf = valueOf;
exports.sharedMaybeFns = sharedMaybeFns;
exports.sharedEitherFns = sharedEitherFns;
exports.applyFantasyLandSynonyms = applyFantasyLandSynonyms;
exports.applyAliases = applyAliases;
exports.chainRec = chainRec;
exports.extendMaker = extendMaker;
exports.setIteratorAndLift = setIteratorAndLift;

},{"../combinators":330}],334:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.left = exports.right = exports.Right = exports.Left = exports.Either = undefined;

var _Symbol$toStringTag, _right, _mutatorMap, _Symbol$toStringTag2, _left, _mutatorMap2;

var _data_structure_util = require('./data_structure_util');

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @signature
 * @description Returns an either functor based on a loose equals null comparison. If
 * the argument passed to the function loose equals null, a left is returned; other wise,
 * a right.
 * @private
 * @param {*} x - Any value that should be placed inside an either functor.
 * @return {dataStructures.left|dataStructures.right} - Either a left or a right functor
 */
function fromNullable(x) {
  return null != x ? Right(x) : Left(x);
}

/**
 * @signature - :: * -> dataStructures.left|dataStructures.right
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.left|dataStructures.right} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.left|dataStructures.right}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Either
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} isRight
 * @property {function} isLeft
 * @property {function} Right
 * @property {function} Left
 * @property {function} fromNullable
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.left|dataStructures.right}.
 * @param {string} [fork] - Specifies if the either should be a left or a right. If no value
 * is provided, the result is created as a left.
 * @return {dataStructures.left|dataStructures.right} - Returns a new object that delegates to the
 * {@link dataStructures.left|dataStructures.right}.
 */
function Either(val, fork) {
  return 'right' === fork ? Object.create(right, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    }
  }) : Object.create(left, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @signature * -> {@link dataStructures.right}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.right} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Right}
 * @memberOf dataStructures.Either
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.right}.
 * @return {dataStructures.right} - Returns a new object that delegates to the
 * {@link dataStructures.right}.
 */
Either.of = function (x) {
  return Either(x, 'right');
};

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.left|dataStructures.right} delegate or not. Available on the
 * {@link left|dataStructures.right}'s factory function as dataStructures.Either#is
 * @memberOf dataStructures.Either
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.left|dataStructures.right} delegate.
 */
Either.is = function (f) {
  return Left.is(f) || Right.is(f);
};

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'right' monad.
 * @memberOf dataStructures.Either
 * @function is
 * @param {Object} [f] - a
 * @return {boolean} - b
 */
Either.isRight = function (f) {
  return f.isRight;
};

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'left' monad.
 * @memberOf dataStructures.Either
 * @function is
 * @param {Object} [f] - a
 * @return {boolean} - b
 */
Either.isLeft = function (f) {
  return f.isLeft;
};

/**
 * @signature * -> dataStructures.right
 * @description Takes any value and creates a 'right' functor. Shorthand function
 * for Either(*, right)
 * @memberOf dataStructures.Either
 * @function is
 * @param {*} x - a
 * @return {dataStructures.right} - b
 */
Either.Right = function (x) {
  return Either(x, 'right');
};

/**
 * @signature * -> dataStructures.left
 * @description Takes any value and creates a 'left' functor. Shorthand function
 * for Either(*, 'left')
 * @memberOf dataStructures.Either
 * @function is
 * @param {*} [x] - a
 * @return {dataStructures.left} - b
 */
Either.Left = function (x) {
  return Either(x);
};

/**
 * @signature * -> dataStructures.left|dataStructures.right
 * @description Takes any value and returns a 'left' monad is the value
 * loose equals null; other wise returns a 'right' monad.
 * @memberOf dataStructures.Either
 * @function is
 * @param {*} [x] - a
 * @return {dataStructures.left|dataStructures.right} - b
 */
Either.fromNullable = fromNullable;

/**
 * @signature - :: * -> dataStructures.left
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.left} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.left}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Left
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.left}.
 * @return {dataStructures.left} - Returns a new object that delegates to the
 * {@link dataStructures.left}.
 */
function Left(val) {
  return Object.create(left, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @signature * -> {@link dataStructures.left}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.left} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Left}
 * @memberOf dataStructures.Left
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.left}.
 * @return {dataStructures.left} - Returns a new object that delegates to the
 * {@link dataStructures.left}.
 */
Left.of = function (x) {
  return Left(x);
};

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.left} delegate or not. Available on the
 * {@link left}'s factory function as dataStructures.Left#is
 * @memberOf dataStructures.Left
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.left} delegate.
 */
Left.is = function (f) {
  return left.isPrototypeOf(f);
};

/**
 * @signature - :: * -> dataStructures.right
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.right} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.right}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Right
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.right}.
 * @return {dataStructures.right} - Returns a new object that delegates to the
 * {@link dataStructures.right}.
 */
function Right(val) {
  return Object.create(right, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.right} delegate or not. Available on the
 * {@link dataStructures.right}'s factory function as dataStructures.Right#is
 * @memberOf dataStructures.Right
 * @function is
 * @param {*} [x] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.right} delegate.
 */
Right.is = function (x) {
  return right.isPrototypeOf(x);
};

/**
 * @signature * -> {@link dataStructures.right}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.right} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Right}
 * @memberOf dataStructures.Right
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.right}.
 * @return {dataStructures.right} - Returns a new object that delegates to the
 * {@link dataStructures.right}.
 */
Right.of = function (x) {
  return Right(x);
};

/**
 * @typedef {Object} right
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} extract
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the right factory function
 * @property {function} [Symbol.Iterator] - Iterator for the right
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace right
 * @description This is the delegate object that specifies the behavior of the right functor. All
 * operations that may be performed on an right functor 'instance' delegate to this object. Right
 * functor 'instances' are created by the {@link dataStructures.Either|dataStructures.Right} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an right functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var right = (_right = {
  /**
   * @signature () -> *
   * @description Returns the underlying value of an right delegator. This
   * getter is not expected to be used directly by consumers - it is meant as an internal
   * access only. To manipulate the underlying value of a right delegator,
   * see {@link dataStructures.right#map} and {@link dataStructures.right#bimap}. To
   * retrieve the underlying value of a right delegator, see {@link dataStructures.right#get},
   * {@link dataStructures.right#orElse}, {@link dataStructures.right#getOrElse},
   * and {@link dataStructures.right#valueOf}.
   * @memberOf dataStructures.right
   * @instance
   * @protected
   * @function
   * @return {*} Returns the underlying value of the delegator. May be any value.
   */
  get value() {
    return this._value;
  },
  get extract() {
    return this.value;
  },
  isRight: true,
  isLeft: false,
  /**
   * @signature () -> {@link dataStructures.right}
   * @description Takes a function that is applied to the underlying value of the
   * functor, the result of which is used to create a new {@link dataStructures.right}
   * delegator instance.
   * @memberOf dataStructures.right
   * @instance
   * @param {function} fn - A mapping function that can operate on the underlying
   * value of the {@link dataStructures.right}.
   * @return {dataStructures.right} Returns a new {@link dataStructures.right}
   * delegator whose underlying value is the result of the mapping operation
   * just performed.
   */
  map: _data_structure_util.sharedEitherFns.rightMap,
  /**
   * @signature (* -> *) -> (* -> *) -> dataStructures.right<T>
   * @description Since the constant functor does not represent a disjunction, the Identity's
   * bimap function property behaves just as its map function property. It is merely here as a
   * convenience so that swapping out monads/monads does not break an application that is
   * relying on its existence.
   * @memberOf dataStructures.right
   * @instance
   * @function
   * @param {function} f - A function that will be used to map over the underlying data of the
   * {@link dataStructures.right} delegator.
   * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.right}
   * since there is no disjunction present.
   * @return {dataStructures.right} - Returns a new {@link dataStructures.right} delegator after applying
   * the mapping function to the underlying data.
   */
  bimap: _data_structure_util.sharedEitherFns.rightBiMap,
  /**
   * @signature () -> *
   * @description Accepts a function that is used to map over the identity's underlying value
   * and returns the returns value of the function without 're-wrapping' it in a new identity
   * monad instance.
   * @memberOf dataStructures.right
   * @instance
   * @function fold
   * @param {function} fn - Any mapping function that should be applied to the underlying value
   * of the identity monad.
   * @param {*} acc - An JavaScript value that should be used as an accumulator.
   * @return {*} Returns the return value of the mapping function provided as an argument.
   */
  fold: function _fold(fn, acc) {
    return fn(acc, this.value);
  },
  /**
   * @signature monad -> monad<monad<T>>
   * @description Returns a monad of the type passed as an argument that 'wraps'
   * and identity monad that 'wraps' the current identity monad's underlying value.
   * @memberOf dataStructures.right
   * @instance
   * @function sequence
   * @param {Object} p - Any pointed monad with a '#of' function property
   * @return {Object} Returns a monad of the type passed as an argument that 'wraps'
   * and identity monad that 'wraps' the current identity monad's underlying value.
   */
  sequence: function _sequence(p) {
    return this.traverse(p, p.of);
  },
  /**
   * @signature Object -> () -> Object
   * @description Accepts a pointed monad with a '#of' function property and a mapping function. The mapping
   * function is applied to the identity monad's underlying value. The mapping function should return a monad
   * of any type. Then the {@link dataStructures.Identity.of} function is used to map over the returned monad. Essentially
   * creating a new object of type: monad<Identity<T>>, where 'monad' is the type of monad the mapping
   * function returns.
   * @memberOf dataStructures.right
   * @instance
   * @function traverse
   * @param {Object} a - A pointed monad with a '#of' function property. Used only in cases
   * where the mapping function cannot be run.
   * @param {function} f - A mapping function that should be applied to the identity's underlying value.
   * @return {Object} Returns a new identity monad that wraps the mapping function's returned monad type.
   */
  traverse: function _traverse(a, f) {
    return f(this.value).map(this.factory.of);
  },
  apply: _data_structure_util.apply,
  /**
   * @signature * -> boolean
   * @description Determines if 'this' right functor is equal to another functor. Equality
   * is defined as:
   * 1) The other functor shares the same delegate object as 'this' identity functor
   * 2) Both underlying values are strictly equal to each other
   * @memberOf dataStructures.right
   * @instance
   * @function
   * @param {Object} ma - The other functor to check for equality with 'this' functor.
   * @return {boolean} - Returns a boolean indicating equality
   */
  equals: (0, _data_structure_util.disjunctionEqualMaker)('isRight'),
  /**
   * @signature () -> *
   * @description Returns the underlying value of the current functor 'instance'. This
   * function property is not meant for explicit use. Rather, the JavaScript engine uses
   * this property during implicit coercion like addition and concatenation.
   * @memberOf dataStructures.right
   * @instance
   * @function
   * @return {*} Returns the underlying value of the current functor 'instance'.
   */
  valueOf: _data_structure_util.valueOf,
  /**
   * @signature () -> string
   * @description Returns a string representation of the functor and its
   * underlying value
   * @memberOf dataStructures.right
   * @instance
   * @function
   * @return {string} Returns a string representation of the right
   * and its underlying value.
   */
  toString: (0, _data_structure_util.stringMaker)('Right')
}, _Symbol$toStringTag = Symbol.toStringTag, _mutatorMap = {}, _mutatorMap[_Symbol$toStringTag] = _mutatorMap[_Symbol$toStringTag] || {}, _mutatorMap[_Symbol$toStringTag].get = function () {
  return 'Right';
}, _defineProperty(_right, 'factory', Either), _defineEnumerableProperties(_right, _mutatorMap), _right);

/**
 * @typedef {Object} left
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} get - returns the underlying value of the functor
 * @property {function} orElse - returns the underlying value of the functor
 * @property {function} getOrElse - returns the underlying value of the functor
 * @property {function} of - creates a new left delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the left factory function
 * @property {function} [Symbol.Iterator] - Iterator for the left
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace left
 * @description This is the delegate object that specifies the behavior of the left functor. All
 * operations that may be performed on an left functor 'instance' delegate to this object. Left
 * functor 'instances' are created by the {@link dataStructures.Either|dataStructures.Left} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var left = (_left = {
  /**
   * @signature () -> *
   * @description Returns the underlying value of an identity_functor delegator. This
   * getter is not expected to be used directly by consumers - it is meant as an internal
   * access only. To manipulate the underlying value of an identity_functor delegator,
   * see {@link dataStructures.left#map} and {@link dataStructures.left#bimap}.
   * To retrieve the underlying value of an identity_functor delegator, see {@link dataStructures.left#get},
   * {@link dataStructures.left#orElse}, {@link dataStructures.left#getOrElse},
   * and {@link dataStructures.left#valueOf}.
   * @memberOf dataStructures.left
   * @instance
   * @protected
   * @function
   * @return {*} Returns the underlying value of the delegator. May be any value.
   */
  get value() {
    return this._value;
  },
  get extract() {
    return this.value;
  },
  isRight: false,
  isLeft: true,
  /**
   * @signature () -> {@link dataStructures.left}
   * @description Takes a function that is applied to the underlying value of the
   * functor, the result of which is used to create a new {@link dataStructures.left}
   * delegator instance.
   * @memberOf dataStructures.left
   * @instance
   * @param {function} fn - A mapping function that can operate on the underlying
   * value of the {@link dataStructures.left}.
   * @return {dataStructures.left} Returns a new {@link dataStructures.left}
   * delegator whose underlying value is the result of the mapping operation
   * just performed.
   */
  map: _data_structure_util.sharedEitherFns.leftMapMaker(Left),
  /**
   * @signature (* -> *) -> (* -> *) -> dataStructures.left<T>
   * @description Since the constant functor does not represent a disjunction, the Identity's
   * bimap function property behaves just as its map function property. It is merely here as a
   * convenience so that swapping out monads/monads does not break an application that is
   * relying on its existence.
   * @memberOf dataStructures.left
   * @instance
   * @function
   * @param {function} f - A function that will be used to map over the underlying data of the
   * {@link dataStructures.left} delegator.
   * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.left}
   * since there is no disjunction present.
   * @return {dataStructures.left} - Returns a new {@link dataStructures.left} delegator after applying
   * the mapping function to the underlying data.
   */
  bimap: _data_structure_util.sharedEitherFns.leftBimapMaker(Left),
  /**
   * @signature () -> *
   * @description Accepts a function that is used to map over the identity's underlying value
   * and returns the returns value of the function without 're-wrapping' it in a new identity
   * monad instance.
   * @memberOf dataStructures.left
   * @instance
   * @function fold
   * @param {function} fn - Any mapping function that should be applied to the underlying value
   * of the identity monad.
   * @param {*} acc - An JavaScript value that should be used as an accumulator.
   * @return {*} Returns the return value of the mapping function provided as an argument.
   */
  fold: function _fold(fn, acc) {
    return fn(acc, this.value);
  },
  /**
   * @signature monad -> monad<monad<T>>
   * @description Returns a monad of the type passed as an argument that 'wraps'
   * and identity monad that 'wraps' the current identity monad's underlying value.
   * @memberOf dataStructures.left
   * @instance
   * @function sequence
   * @param {Object} p - Any pointed monad with a '#of' function property
   * @return {Object} Returns a monad of the type passed as an argument that 'wraps'
   * and identity monad that 'wraps' the current identity monad's underlying value.
   */
  sequence: function _sequence(p) {
    return this.traverse(p, p.of);
  },
  /**
   * @signature Object -> () -> Object
   * @description Accepts a pointed monad with a '#of' function property and a mapping function. The mapping
   * function is applied to the identity monad's underlying value. The mapping function should return a monad
   * of any type. Then the {@link dataStructures.Identity.of} function is used to map over the returned monad. Essentially
   * creating a new object of type: monad<Identity<T>>, where 'monad' is the type of monad the mapping
   * function returns.
   * @memberOf dataStructures.left
   * @instance
   * @function traverse
   * @param {Object} a - A pointed monad with a '#of' function property. Used only in cases
   * where the mapping function cannot be run.
   * @param {function} f - A mapping function that should be applied to the identity's underlying value.
   * @return {Object} Returns a new identity monad that wraps the mapping function's returned monad type.
   */
  traverse: function _traverse(a, f) {
    return f(this.value).map(Left);
  },
  apply: function _apply(m) {
    return this;
  },
  /**
   * @signature * -> boolean
   * @description Determines if 'this' left functor is equal to another functor. Equality
   * is defined as:
   * 1) The other functor shares the same delegate object as 'this' identity functor
   * 2) Both underlying values are strictly equal to each other
   * @memberOf dataStructures.left
   * @instance
   * @function
   * @param {Object} ma - The other functor to check for equality with 'this' functor.
   * @return {boolean} - Returns a boolean indicating equality
   */
  equals: (0, _data_structure_util.disjunctionEqualMaker)('isLeft'),
  /**
   * @signature () -> *
   * @description Returns the underlying value of the current functor 'instance'. This
   * function property is not meant for explicit use. Rather, the JavaScript engine uses
   * this property during implicit coercion like addition and concatenation.
   * @memberOf dataStructures.left
   * @instance
   * @function
   * @return {*} Returns the underlying value of the current functor 'instance'.
   */
  valueOf: _data_structure_util.valueOf,
  /**
   * @signature () -> string
   * @description Returns a string representation of the functor and its
   * underlying value
   * @memberOf dataStructures.left
   * @instance
   * @function
   * @return {string} Returns a string representation of the left
   * and its underlying value.
   */
  toString: (0, _data_structure_util.stringMaker)('Left')
}, _Symbol$toStringTag2 = Symbol.toStringTag, _mutatorMap2 = {}, _mutatorMap2[_Symbol$toStringTag2] = _mutatorMap2[_Symbol$toStringTag2] || {}, _mutatorMap2[_Symbol$toStringTag2].get = function () {
  return 'Left';
}, _defineProperty(_left, 'factory', Either), _defineEnumerableProperties(_left, _mutatorMap2), _left);

right.chain = _data_structure_util.chain;
right.mjoin = _data_structure_util.join;

left.chain = _data_structure_util.chain;
left.mjoin = _data_structure_util.join;

right.ap = right.apply;
left.ap = left.apply;
right.flatMap = right.chain;
left.flatMap = left.chain;
right.bind = right.chain;
left.bind = left.chain;
right.reduce = right.fold;
left.reduce = left.fold;

right.constructor = right.factory;
left.constructor = left.factory;

exports.Either = Either;
exports.Left = Left;
exports.Right = Right;
exports.right = right;
exports.left = left;

},{"./data_structure_util":333}],335:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.future = exports.Future = undefined;

var _Symbol$toStringTag, _future, _mutatorMap;

var _functionalHelpers = require('../functionalHelpers');

var _combinators = require('../combinators');

var _data_structure_util = require('./data_structure_util');

var _helpers = require('../helpers');

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @signature
 * @description d
 * @private
 * @param {function} reject - a
 * @param {function} resolve - b
 * @return {function} - c
 */
function safeFork(reject, resolve) {
    return function _safeFork(val) {
        try {
            var res = resolve(val);
            //this._value = res;
            return res;
        } catch (ex) {
            reject(ex);
        }
    };
}

/**
 * @signature - :: * -> {@link dataStructures.future}
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.future} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.future}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Future
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} fn - The value that should be set as the underlying
 * value of the {@link dataStructures.future}.
 * @return {dataStructures.future} - Returns a new object that delegates to the
 * {@link dataStructures.future}.
 */
function Future(fn) {
    return Object.create(future, {
        _source: {
            value: fn,
            writable: false,
            configurable: false
        },
        _fork: {
            value: fn,
            writable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Future.is = function (f) {
    return future.isPrototypeOf(f);
};

/**
 * @signature * -> {@link dataStructures.future}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.future} object delegator instance.
 * Because the future monad 'runs' off of functions, if the value passed to
 * {@link dataStructures.future#of} is a function, it is not wrapped in a function. If it
 * is any other type, it is wrapped in a function that will be invoked on fork.
 * @memberOf dataStructures.Future
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.future}.
 * @return {dataStructures.future} - Returns a new object that delegates to the
 * {@link dataStructures.future}.
 */
/*Future.of = function _of(val) {
    if ('function' !== typeof val) return Future((_, resolve) => safeFork(noop, resolve(val)));
    return Future(val);
};*/
Future.of = function (val) {
    return (0, _combinators.ifElse)((0, _combinators.constant)((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(val))), Future, futureFunctionize, val);
};

var futureFunctionize = function futureFunctionize(val) {
    return Future(function (_, resolve) {
        return safeFork(_combinators.identity, resolve(val));
    });
};

/**
 * @description Similar to {@link dataStructures.future#of} except it will wrap any value
 * passed as the argument, regardless if it is a function or not.
 * @memberOf dataStructures.future
 * @static
 * @function wrap
 * @param {*} val - The value that should be wrapped in a function and set as the
 * underlying value of the {@link dataStructures.future}
 * @return {dataStructures.future} Returns a new object that delegates to the {@link dataStructures.future}
 */
Future.wrap = function (val) {
    return futureFunctionize(val);
};

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Future
 * @static
 * @function reject
 * @param {*} val - a
 * @return {future} - b
 */
Future.reject = function (val) {
    return Future(function (reject, resolve) {
        return reject(val);
    });
};

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Future
 * @static
 * @function unit
 * @param {function} val - a
 * @return {future} - b
 */
Future.unit = function (val) {
    return Future(val).complete();
};

/**
 * @signature
 * @description Takes any value (function or otherwise) and a delay time in
 * milliseconds, and returns a new {@link dataStructures.future} that will fork in the amount
 * of time given as the delay.
 * @param {*} val - Any JavaScript value; {@link dataStructures.Future#of} is called under the
 * covers, so it need not be a function.
 * @param {number} delay - The amount of time in milliseconds the forking operation
 * should be delayed
 * @return {dataStructures.future} Returns a new future
 */
Future.delay = function _delay(val, delay) {
    var f = Future.of(fn);
    setTimeout(function _timeout() {
        f.fork();
    }, delay);
    return f;
};

/**
 * @signature () -> {@link dataStructures.future}
 * @description Creates and returns an 'empty' identity monad.
 * @return {dataStructures.future} - Returns a new identity monad.
 */
Future.empty = function () {
    return Future(_combinators.identity);
};

/**
 * @typedef {Object} future
 * @property {function} value - returns the underlying value of the the monad
 * @property {function} map - maps a single function over the underlying value of the monad
 * @property {function} bimap
 * @property {function} extract
 * @property {function} valueOf - returns the underlying value of the monad; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the future monad and its underlying value
 * @property {function} factory - a reference to the future factory function
 * @property {function} [Symbol.Iterator] - Iterator for the future monad
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace future
 * @description This is the delegate object that specifies the behavior of the identity functor. All
 * operations that may be performed on an future monad 'instance' delegate to this object. Future
 * functor 'instances' are created by the {@link dataStructures.Future} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var future = (_future = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an future delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an future delegator,
     * see {@link dataStructures.future#map} and {@link dataStructures.future#bimap}.
     * To retrieve the underlying value of an future delegator, see {@link dataStructures.future#get},
     * {@link dataStructures.future#orElse}, {@link dataStructures.future#getOrElse},
     * and {@link dataStructures.future#valueOf}.
     * @memberOf dataStructures.future
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    get source() {
        return this._source;
    },
    /**
     * @signature
     * @description d
     * @memberOf dataStructures.future
     * @instance
     * @function
     * @return {*} - a
     */
    get extract() {
        return this._source;
        /*
        if (!this.isComplete) {
            this.fork(x => x, x => x);
            return this.value;
        }
        return this.source();
        */
    },
    /**
     * @signature () -> {@link dataStructures.future}
     * @description Takes a function that is applied to the underlying value of the
     * monad, the result of which is used to create a new {@link dataStructures.future}
     * delegator instance.
     * @memberOf dataStructures.future
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.future}.
     * @return {dataStructures.future} Returns a new {@link dataStructures.future}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: function _map(fn) {
        var _this = this;

        return this.factory.of(function (reject, resolve) {
            return _this.fork(function (err) {
                return reject(err);
            }, function (res) {
                return resolve(fn(res));
            });
        });
    },
    //TODO: probably need to compose here, not actually map over the value; this is a temporary fill-in until
    //TODO: I have time to finish working on the Future
    chain: function _chain(fn) {
        var _this2 = this;

        return this.factory.of(function (reject, resolve) {
            return _this2.fork(function (err) {
                return reject(err);
            }, function (res) {
                return fn(res).fork(reject, resolve);
            });
        });
        /*
        return this.of((reject, resolve) =>
        {
            let cancel,
                outerFork = this._fork(a => reject(a), b => {
                    cancel = fn(b).fork(reject, resolve);
                });
            return cancel ? cancel : (cancel = outerFork, x => cancel());
        });
        */
    },
    mjoin: function _mjoin() {
        return this.chain(function (x) {
            return x;
        });
    },
    apply: function _apply(ma) {
        var _this3 = this;

        return this.factory.of(function (reject, resolve) {
            var rej = (0, _functionalHelpers.once)(reject),
                val = void 0,
                mapper = void 0,
                rejected = false;

            var cur = _this3.fork(rej, guardResolve(function _gr(x) {
                mapper = x;
            }));

            var other = ma.fork(rej, guardResolve(function _gr(x) {
                val = x;
            }));

            function guardResolve(setter) {
                return function _guardResolve(x) {
                    if (rejected) return;

                    setter(x);
                    if (mapper && val) {
                        return resolve(mapper(val));
                    }
                    return x;
                };
            }

            return [cur, other];
        });
    },
    fold: function _fold(f, g) {
        var _this4 = this;

        return this.factory.of(function (reject, resolve) {
            return _this4.fork(function (err) {
                return resolve(f(err));
            }, function (res) {
                return resolve(g(res));
            });
        });
    },
    traverse: function _traverse(fa, fn) {
        return this.fold(function _reductioAdAbsurdum(xs, x) {
            fn(x).map(function _map(x) {
                return function _map_(y) {
                    return y.concat([x]);
                };
            }).ap(xs);
            return fa(this.empty);
        });
    },
    bimap: function _bimap(f, g) {
        var _this5 = this;

        return this.factory.of(function (reject, resolve) {
            return _this5._fork(safeFork(reject, function (err) {
                return reject(g(err));
            }), safeFork(reject, function (res) {
                return resolve(f(res));
            }));
        });
    },
    isEmpty: function _isEmpty() {
        return this._fork === _combinators.identity;
    },
    fork: function _fork(reject, resolve) {
        return this._fork(reject, safeFork.call(this, reject, resolve));
    },
    /**
     * @signature * -> boolean
     * @description Determines if 'this' future monad is equal to another monad. Equality
     * is defined as:
     * 1) The other monad shares the same delegate object as 'this' future monad
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.future
     * @instance
     * @function
     * @param {Object} ma - The other monad to check for equality with 'this' monad.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && ma.source === this.source;
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.future
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: _data_structure_util.valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf dataStructures.future
     * @instance
     * @function
     * @return {string} Returns a string representation of the future
     * and its underlying value.
     */
    toString: function _toString() {
        return 'Future(' + this.source.name + ')';
    }
}, _Symbol$toStringTag = Symbol.toStringTag, _mutatorMap = {}, _mutatorMap[_Symbol$toStringTag] = _mutatorMap[_Symbol$toStringTag] || {}, _mutatorMap[_Symbol$toStringTag].get = function () {
    return 'Future';
}, _defineProperty(_future, 'factory', Future), _defineEnumerableProperties(_future, _mutatorMap), _future);

future.mjoin = _data_structure_util.join;
future.ap = future.apply;
future.fmap = future.chain;
future.flapMap = future.chain;
future.bind = future.chain;
future.reduce = future.fold;
future.constructor = future.factory;

exports.Future = Future;
exports.future = future;

},{"../combinators":330,"../functionalHelpers":345,"../helpers":346,"./data_structure_util":333}],336:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.divisionSemigroupFactory = exports.functionMonoidFactory = exports.xorMonoidFactory = exports.subtractionMonoidFactory = exports.stringMonoidFactory = exports.orGroupFactory = exports.andGroupFactory = exports.multiplicationGroupFactory = exports.additionGroupFactory = exports.groupFactoryCreator = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _combinators = require('../combinators');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @namespace group
 */

//TODO: Abelian Groups:
//TODO: - addition
//TODO: - multiplication
//TODO: - AND
//TODO: - OR
//TODO:
//TODO:
//TODO: Groups:
//TODO:
//TODO:
//TODO: Monoids:
//TODO: - string
//TODO: - subtraction
//TODO: - XOR
//TODO:
//TODO:
//TODO: Semigroups:
//TODO: - division

/**
 * @description d
 * @namespace baseGroupObject
 * @memberOf group
 * @typedef {Object}
 * @property {function} extract
 * @property {function} valueOf
 */
var baseGroupObject = _defineProperty({
    /**
     * @description d
     * @return {*} Returns whatever the underlying value of the current monoid is.
     */
    get value() {
        return this._value;
    },
    extract: function _extract() {
        return this.value;
    },
    /**
     * @signature valueOf :: () -> *
     * @description Returns the underlying value of the current monoid. Used natively in
     * javascript during operations such as addition.
     * @return {*} Returns the underlying value of the monoid.
     */
    valueOf: function _valueOf() {
        return this.value;
    }
}, Symbol.iterator, function _iterator() {
    var first = true,
        val = this.value;
    return {
        next: function _next() {
            if (first) {
                first = false;
                return { done: false, value: val };
            }
            return { done: true };
        }
    };
});

/**
 * @signature
 * @description d
 * @memberOf group
 * @param {function} concatFn - A
 * @param {*} [identity] - B
 * @param {function} [inverseFn] - C
 * @param {String} [type] - D
 * @return {function} - E
 */
function groupFactoryCreator(concatFn, identity, inverseFn, type) {
    //console.log(createBitMask('function' === typeof concatFn, null != identity, 'function' === typeof inverseFn));

    switch (createBitMask('function' === typeof concatFn, null != identity, 'function' === typeof inverseFn)) {
        case 1:
            return semigroupFactory(concatFn, type);
        case 3:
            return monoidFactory(concatFn, identity, type);
        case 7:
            return groupFactory(concatFn, identity, inverseFn, type);
    }

    /**
     * @signature [...a] -> Number
     * @description creates a bit mask value based on truthy/falsey arguments passed to the function
     * @param {boolean} args - Zero or more arguments. All arguments are treated as booleans, so truthy,
     * and falsey values will work.
     * @return {number} Returns an integer that represents the bit mask value of the boolean arguments.
     */
    function createBitMask() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return args.reduce(function _reduce(curr, next, idx) {
            return curr |= next << idx;
        }, args[0]);
    }
}

function semigroupFactory(concatFn, type) {
    function semigroupFactory(val) {
        return Object.create(baseGroupObject, {
            _value: {
                value: val
            },
            concat: {
                value: function _concat(g) {
                    return Object.getPrototypeOf(this) === Object.getPrototypeOf(g) ? this.factory(concatFn(this.value, g.value)) : this;
                }
            },
            concatAll: {
                value: function _concatAll() {
                    for (var _len2 = arguments.length, g = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        g[_key2] = arguments[_key2];
                    }

                    return this.factory(g.reduce(function _reduce(curr, next) {
                        return curr.concat(next);
                    }, this));
                }
            },
            factory: {
                value: semigroupFactory
            },
            /**
             * @signature toString :: () -> String
             * @description Returns a string representation of the current monoid and its
             * underlying value. If the 'type' param was set upon creation of this specific
             * monoid factory, the type name will be included in the returned string. Otherwise,
             * simply 'Monoid' will be used.
             * @memberOf group
             * @return {string} Returns a string
             */
            toString: {
                value: function _toString() {
                    return type + '(' + this.value + ')';
                }
            }
        });
    }

    return semigroupFactory;
}

function monoidFactory(concatFn, identity, type) {
    var sgFactory = semigroupFactory(concatFn, type),
        base = Object.create(sgFactory()),
        objectProto = Object.getPrototypeOf({});
    function monoidFactory(val) {
        val = typeValidator(val);
        return Object.create(base, {
            _value: {
                value: val
            },
            isEmpty: {
                value: val === identity
            },
            factory: {
                value: monoidFactory
            }
        });

        function typeValidator(val) {
            return 'object' !== (typeof identity === 'undefined' ? 'undefined' : _typeof(identity)) ? (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === (typeof identity === 'undefined' ? 'undefined' : _typeof(identity)) ? val : identity : objectProto !== Object.getPrototypeOf(val) && Object.getPrototypeOf(identity).isPrototypeOf(val) || Object.keys(identity).every(function (key) {
                return key in val;
            }) && Object.keys(val).every(function (key) {
                return key in val;
            }) ? val : identity;
        }
    }

    monoidFactory.empty = monoidFactory(identity);
    return monoidFactory;
}

function groupFactory(concatFn, identity, inverseFn, type) {
    var mFactory = monoidFactory(concatFn, identity, type),
        base = Object.create(mFactory());
    function groupFactory(val) {
        return Object.create(base, {
            _value: {
                value: val
            },
            inverseConcat: {
                value: function _concat(g) {
                    return Object.getPrototypeOf(this) === Object.getPrototypeOf(g) ? this.factory(concatFn(this.value, inverseFn(g.value))) : this;
                }
            },
            factory: {
                value: groupFactory
            }
        });
    }

    groupFactory.empty = groupFactory(identity);
    return groupFactory;
}

function _compose(x, y) {
    return (0, _combinators.compose)(x, y);
}

var additionGroupFactory = groupFactoryCreator(function (x, y) {
    return x + y;
}, 0, function (x) {
    return -x;
}, 'Add'),
    multiplicationGroupFactory = groupFactoryCreator(function (x, y) {
    return x * y;
}, 1, function (x) {
    return 1 / x;
}, 'Multiplication'),
    andGroupFactory = groupFactoryCreator(function (x, y) {
    return x && y;
}, true, function (x) {
    return !x;
}, 'AND'),
    orGroupFactory = groupFactoryCreator(function (x, y) {
    return x || y;
}, false, function (x) {
    return !x;
}, 'OR');

var stringMonoidFactory = groupFactoryCreator(function (x, y) {
    return x.concat(y);
}, '', null, 'String'),
    subtractionMonoidFactory = groupFactoryCreator(function (x, y) {
    return x - y;
}, 0, null, 'Subtraction'),
    xorMonoidFactory = groupFactoryCreator(function (x, y) {
    return x !== y;
}, false, null, 'XOR'),
    functionMonoidFactory = groupFactoryCreator(_compose, function (x) {
    return x;
}, null, 'Function');

var divisionSemigroupFactory = groupFactoryCreator(function (x, y) {
    return x / y;
}, null, null, 'Division');

exports.groupFactoryCreator = groupFactoryCreator;
exports.additionGroupFactory = additionGroupFactory;
exports.multiplicationGroupFactory = multiplicationGroupFactory;
exports.andGroupFactory = andGroupFactory;
exports.orGroupFactory = orGroupFactory;
exports.stringMonoidFactory = stringMonoidFactory;
exports.subtractionMonoidFactory = subtractionMonoidFactory;
exports.xorMonoidFactory = xorMonoidFactory;
exports.functionMonoidFactory = functionMonoidFactory;
exports.divisionSemigroupFactory = divisionSemigroupFactory;

},{"../combinators":330}],337:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = exports.Identity = undefined;

var _Symbol$toStringTag, _identity, _mutatorMap;

var _data_structure_util = require('./data_structure_util');

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @signature - :: * -> {@link dataStructures.identity}
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.identity} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.identity}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Identity
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.identity}.
 * @return {dataStructures.identity} - Returns a new object that delegates to the
 * {@link dataStructures.identity}.
 */
function Identity(val) {
  return Object.create(identity, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @signature * -> {@link dataStructures.identity}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.identity} object delegator instance.
 * Because the identity data structure does not require any specific context for
 * its value, this can be viewed as an alias for {@link Identity}
 * @memberOf dataStructures.Identity
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.identity}.
 * @return {dataStructures.identity} - Returns a new object that delegates to the
 * {@link dataStructures.identity}.
 */
Identity.of = function (x) {
  return Identity(x);
};

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.identity} delegate or not. Available on the
 * identity's factory function as Identity.is.
 * @memberOf dataStructures.Identity
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.identity} delegate.
 */
Identity.is = function (f) {
  return identity.isPrototypeOf(f);
};

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Creates and returns an 'empty' identity data structure.
 * @return {dataStructures.identity} - Returns a new identity.
 */
Identity.empty = function () {
  return Identity();
};

/**
 * @typedef {Object} identity
 * @property {function} extract - returns the underlying value of the identity
 * @property {function} map - maps a single function over the underlying value of the identity
 * @property {function} chain - returns a new identity data structure
 * @property {function} join - returns a new identity data structure
 * @property {function} apply - returns a new instance of whatever data structure type's underlying value this
 * identity's underlying function value should be mapped over.
 * @property {function} bimap - returns a new identity data structure
 * @property {function} contramap - maps over the input of a contravariant identity
 * @property {function} dimap - maps over the input and output of a contravariant identity
 * @property {function} fold - Applies a function to the identity's underlying value and returns the result
 * @property {function} sequence - returns a new identity data structure
 * @property {function} traverse - returns a new identity data structure
 * @property {function} isEmpty - Returns a boolean indicating if the identity is 'empty'
 * @property {function} mapToConstant - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.constant}
 * @property {function} mapToEither - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.Either}
 * @property {function} mapToLeft - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.left}
 * @property {function} mapToRight - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.right}
 * @property {function} mapToFuture - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.future}
 * @property {function} mapToIo - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.io}
 * @property {function} mapToList - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.list}
 * @property {function} mapToMaybe - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.Maybe}
 * @property {function} mapToJust - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.just}
 * @property {function} mapToNothing - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.nothing}
 * @property {function} mapToValidation - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.validation}
 * @property {function} valueOf - returns the underlying value of the identity; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity data structure and its underlying value
 * @property {function} factory - a reference to the identity factory function
 * @property {function} [Symbol.Iterator] - Iterator for the identity
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace identity
 * @description This is the delegate object that specifies the behavior of the identity data structure. All
 * operations that may be performed on an identity 'instance' delegate to this object. Identity
 * monad 'instances' are created by the {@link dataStructures.Identity} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var identity = (_identity = {
  /**
   * @signature () -> *
   * @description Returns the underlying value of an identity delegator. This
   * getter is not expected to be used directly by consumers - it is meant as an internal
   * access only. To manipulate the underlying value of an identity delegator,
   * see {@link dataStructures.identity#map} and {@link dataStructures.identity#bimap}.
   * To retrieve the underlying value of an identity delegator, see {@link dataStructures.identity#extract}
   * and {@link dataStructures.identity#valueOf}.
   * @memberOf dataStructures.identity
   * @instance
   * @private
   * @function
   * @return {*} Returns the underlying value of the delegator. May be any value.
   */
  get value() {
    return this._value;
  },
  /**
   * @signature () -> *
   * @description Returns the underlying value of an identity delegator. This is a getter function
   * and thus works differently than the fantasy-land specification; rather than invoking identity#extract
   * as a function, you merely need to reference as a non-function property. This makes infinitely more
   * sense to me, especially if the underlying is a function... who wants to do this: identity.extract()(x, y, z)
   * when they could do this: identity.extract(x, y, z)?
   * @example Identity(10).extract // => 10
   * @memberOf dataStructures.identity
   * @instance
   * @private
   * @function
   * @return {*} Returns the underlying value of the delegator. May be any value.
   */
  get extract() {
    return this.value;
  },
  /**
   * @signature () -> {@link dataStructures.identity}
   * @description Takes a function as an argument and applies that function to the underlying value
   * of the identity. A new identity instance that holds the result of the application as its underlying
   * value is created and returned.
   * @memberOf dataStructures.identity
   * @instance
   * @param {function} fn - A mapping function that can operate on the underlying
   * value of the {@link dataStructures.identity}.
   * @return {dataStructures.identity} Returns a new {@link dataStructures.identity}
   * delegator whose underlying value is the result of the mapping operation
   * just performed.
   *
   * @example Identity(10).map(x => x * x)    // => Identity(100)
   */
  map: function _map(fn) {
    return Identity.of(fn(this.value));
  },
  /**
   * @signature () -> {@link dataStructures.identity}
   * @description Accepts a mapping function as an argument, applies the function to the
   * underlying value. If the mapping function returns an identity data structure, chain will 'flatten'
   * the nested identities by one level. If the mapping function does not return an identity,
   * chain will just return an identity data structure that 'wraps' whatever the return value
   * of the mapping function is. However, if the mapping function does not return a data structure  of
   * the same type, then chain is probably not the functionality you should use. See
   * {@link dataStructures.identity#map} instead.
   *
   * Alias: bind, flatMap
   * @memberOf dataStructures.identity
   * @instance
   * @function chain
   * @param {function} fn - A mapping function that returns a data structure of the same type
   * @return {Object} Returns a new identity data structure that 'wraps' the return value of the
   * mapping function after flattening it by one level.
   *
   * @example
   * Identity(10).chain(x => Identity(x * x))    // => Identity(100)
   * Identity(10).chain(x => x * x)              // => Identity(100)
   * Identity(10).chain(x => Just(x * x))        // => Identity(Just(100))
   */
  chain: _data_structure_util.chain,
  /**
   * @signature () -> {@link dataStructures.identity}
   * @description Returns a new identity data structure. If the current identity is nested, join
   * will flatten it by one level. Very similar to {@link dataStructures.identity#chain} except no
   * mapping function is accepted or run.
   * @memberOf dataStructures.identity
   * @instance
   * @function mjoin
   * @return {Object} Returns a new identity after flattening the nested data structures by one level.
   *
   * @example
   * Identity(Identity(10)).join()   // => Identity(10)
   * Identity(Just(10)).join()       // => Identity(Just(10))
   * Identity(10).join()             // => Identity(10)
   */
  join: _data_structure_util.join,
  /**
   * @signature Object -> Object
   * @description Accepts any applicative object with a mapping function and invokes that object's mapping
   * function on the identity's underlying value. In order for this function to execute properly and
   * not throw, the identity's underlying value must be a function that can be used as a mapping function
   * on the data structure supplied as the argument.
   *
   * Alias: ap
   * @memberOf dataStructures.identity
   * @instance
   * @function apply
   * @param {Object} ma - Any data structure with a map function - i.e. a functor.
   * @return {Object} Returns an instance of the data structure object provide as an argument.
   *
   * @example Identity(10).apply(Identity(x => x + 10))  // => Identity(20)
   */
  apply: _data_structure_util.apply,
  /**
   * @signature () -> *
   * @description Accepts a function that is used to map over the identity's underlying value
   * and returns the value of the function without 're-wrapping' it in a new identity
   * instance.
   *
   * Alias: reduce
   * @memberOf dataStructures.identity
   * @instance
   * @function fold
   * @param {function} fn - Any mapping function that should be applied to the underlying value
   * of the identity.
   * @param {*} acc - An JavaScript value that should be used as an accumulator.
   * @return {*} Returns the return value of the mapping function provided as an argument.
   *
   * @example Identity(10).fold((acc, x) => x + acc, 5)   // => 15
   */
  fold: function _fold(fn, acc) {
    return fn(acc, this.value);
  },
  /**
   * @signature identity -> M<identity<T>>
   * @description Returns a data structure of the type passed as an argument that 'wraps'
   * and identity object that 'wraps' the current identity's underlying value.
   * @memberOf dataStructures.identity
   * @instance
   * @function sequence
   * @param {Object} p - Any pointed data structure with a '#of' function property
   * @return {Object} Returns a data structure of the type passed as an argument that 'wraps'
   * an identity that 'wraps' the current identity's underlying value.
   */
  sequence: function _sequence(p) {
    return this.traverse(p, p.of);
  },
  /**
   * @signature Object -> () -> Object
   * @description Accepts a pointed data structure with a '#of' function property and a mapping function. The mapping
   * function is applied to the identity's underlying value. The mapping function should return a data structure
   * of any type. Then the {@link dataStructures.Identity.of} function is used to map over the returned data structure. Essentially
   * creating a new object of type: M<Identity<T>>, where 'M' is the type of data structure the mapping
   * function returns.
   * @memberOf dataStructures.identity
   * @instance
   * @function traverse
   * @param {Object} a - A pointed data structure with a '#of' function property. Used only in cases
   * where the mapping function cannot be run.
   * @param {function} f - A mapping function that should be applied to the identity's underlying value.
   * @return {Object} Returns a new identity that wraps the mapping function's returned data structure type.
   *
   * @example Identity(10).traverse(Just, x => Just(x * x))   // => Just(Identity(100))
   */
  traverse: function _traverse(a, f) {
    return f(this.value).map(this.factory.of);
  },
  /**
   * @signature (b -> a) -> dataStructures.Identity
   * @description This property is for contravariant identity data structures and will not function
   * correctly if the underlying value is anything other than a function. Contramap accepts a
   * function argument and returns a new identity with the composition of the function argument and
   * the underlying function value as the new underlying. The supplied function argument is executed
   * first in the composition, so its signature must be (b -> a) so that the value it passes as an
   * argument to the previous underlying function will be of the expected type.
   * @memberOf dataStructures.identity
   * @instance
   * @function contramap
   * @param {function} fn - A function that should be composed with the current identity's
   * underlying function.
   * @return {dataStructures.identity} Returns a new identity data structure.
   *
   * @example Identity(x => x * x).contramap(x => x + 10).apply(Identity(5))  // => Identity(225)
   */
  contramap: _data_structure_util.contramap,

  /**
   * @signature dimap :: (b -> a) -> (d -> c) -> identity<c>
   * @description Like {@link dataStructures.identity#contramap}, dimap is for use on contravariant
   * identity instances, and thus, requires that the identity instance dimap is invoked on has an
   * underlying function value. Dimap accepts two arguments, both of them functions. The first argument
   * is used to map over the input the current contravariant identity, while the second argument maps
   * over the output. Dimap is like contramap, but with an additional mapping thrown in after it has run.
   * Thus, dimap can be derived from contramap and map: i.dimap(f, g) === i.contramap(f).map(g)
   * @memberOf dataStructures.identity
   * @instance
   * @function dimap
   * @param {function} f - f
   * @param {function} g - g
   * @return {dataStructures.identity} l
   *
   * @example Identity(x => x * x).dimap(x => x + 10, x => x / 5).apply(Identity(5))  // => Identity(45)
   */
  dimap: _data_structure_util.dimap,
  /**
   * @signature () -> boolean
   * @description Returns a boolean indicating if the identity is 'empty'. Because there is
   * no innate 'empty' value for an identity data structure, isEmpty will always return false.
   * @memberOf dataStructures.identity
   * @instance
   * @function isEmpty
   * @return {boolean} Returns a boolean indicating if the identity instance is 'empty'.
   *
   * @example
   * Identity(10).isEmpty()  // => false
   * Identity().isEmpty()    // => false
   */
  isEmpty: function _isEmpty() {
    return false;
  },
  /**
   * @signature (identity<A> -> B) -> identity<B>
   * @description Takes a function that operates on the current identity and returns
   * any value, invokes that function, passing the current identity as the only argument,
   * and then returns a new identity that wraps the return value of the provided function.
   * @param {function} fn - A function that can operate on an identity data structure
   * @return {Identity<T>} Returns a new identity that wraps the return value of the
   * function that was provided as an argument.
   */
  extend: (0, _data_structure_util.extendMaker)(Identity),
  /**
   * @signature * -> boolean
   * @description Determines if 'this' identity is equal to another data structure. Equality
   * is defined as:
   * 1) The other data structure shares the same delegate object as 'this' identity
   * 2) Both underlying values are strictly equal to each other
   * @memberOf dataStructures.identity
   * @instance
   * @function
   * @param {Object} ma - The other data structure to check for equality with 'this' identity.
   * @return {boolean} - Returns a boolean indicating equality
   *
   * @example
   * Identity(10).equals(Identity(10))    // => true
   * Identity(10).equals(Identity(1))     // => false
   * Identity(10).equals(Just(10))        // => false
   */
  equals: _data_structure_util.equals,
  /**
   * @signature () -> *
   * @description Returns the underlying value of the current identity 'instance'. This
   * function property is not meant for explicit use. Rather, the JavaScript engine uses
   * this property during implicit coercion like addition and concatenation.
   * @memberOf dataStructures.identity
   * @instance
   * @function
   * @return {*} Returns the underlying value of the current monad 'instance'.
   *
   * @example
   * 5 + Identity(10)     // => 15
   * 'Hello my name is: ' + Identity('Identity')  // => 'Hello my name is : Identity'
   */
  valueOf: _data_structure_util.valueOf,
  /**
   * @signature () -> string
   * @description Returns a string representation of the identity and its
   * underlying value
   * @memberOf dataStructures.identity
   * @instance
   * @function
   * @return {string} Returns a string representation of the identity
   * and its underlying value.
   *
   * @example
   * Identity(10).toString()      // => 'Identity(10)'
   * Identity(Identity(true))     // => 'Identity(Identity(true))'
   */
  toString: (0, _data_structure_util.stringMaker)('Identity')
}, _Symbol$toStringTag = Symbol.toStringTag, _mutatorMap = {}, _mutatorMap[_Symbol$toStringTag] = _mutatorMap[_Symbol$toStringTag] || {}, _mutatorMap[_Symbol$toStringTag].get = function () {
  return 'Identity';
}, _defineProperty(_identity, 'factory', Identity), _defineEnumerableProperties(_identity, _mutatorMap), _identity);

/**
 * @signature (* -> *) -> (* -> *) -> dataStructures.identity<T>
 * @description Since the identity data structure does not represent a disjunction, the identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out data structure does not break an application that is
 * relying on its existence.
 * @memberOf dataStructures.identity
 * @instance
 * @function bimap
 * @param {function} f - A function that will be used to map over the underlying data of the
 * {@link dataStructures.identity} delegator.
 * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.identity}
 * since there is no disjunction present.
 * @return {dataStructures.identity<T>} - Returns a new {@link dataStructures.identity} delegator after applying
 * the mapping function to the underlying data.
 *
 * @example Identity(10).bimap(x => x + 10, x => x - 10)    // => Identity(20)
 */
identity.bimap = identity.map;

/**
 * @signature Object -> Object
 * @description Alias for {@link dataStructures.identity#apply}
 * @memberOf dataStructures.identity
 * @instance
 * @function ap
 * @ignore
 * @see dataStructures.identity#apply
 * @param {Object} ma - Any object with a map function - i.e. a monad.
 * @return {Object} Returns an instance of the data structure object provide as an argument.
 */
identity.ap = identity.apply;

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Alias for {@link dataStructures.identity#chain}
 * @memberOf dataStructures.identity
 * @instance
 * @function fmap
 * @ignore
 * @see dataStructures.identity#chain
 * @param {function} fn - A mapping function that returns a data structure of the same type
 * @return {Object} Returns a new identity that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.fmap = identity.chain;

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Alias for {@link dataStructures.identity#chain}
 * @memberOf dataStructures.identity
 * @instance
 * @function flatMap
 * @ignore
 * @see dataStructures.identity#chain
 * @param {function} fn - A mapping function that returns a data structure of the same type
 * @return {Object} Returns a new identity that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.flapMap = identity.chain;

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Alias for {@link dataStructures.identity#chain}
 * @memberOf dataStructures.identity
 * @instance
 * @function bind
 * @ignore
 * @see dataStructures.identity#chain
 * @param {function} fn - A mapping function that returns a data structure of the same type
 * @return {Object} Returns a new identity that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.bind = identity.chain;

/**
 * @signature () -> *
 * @description Alias for {@link dataStructures.identity#fold}
 * @memberOf dataStructures.identity
 * @instance
 * @function reduce
 * @ignore
 * @see dataStructures.identity#fold
 * @param {function} fn - Any mapping function that should be applied to the underlying value
 * of the identity data structure.
 * @return {*} Returns the return value of the mapping function provided as an argument.
 */
identity.reduce = identity.fold;

identity.constructor = identity.factory;

exports.Identity = Identity;
exports.identity = identity;

},{"./data_structure_util":333}],338:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.io = exports.Io = undefined;

var _Symbol$toStringTag, _io, _mutatorMap;

var _combinators = require('../combinators');

var _functionalHelpers = require('../functionalHelpers');

var _data_structure_util = require('./data_structure_util');

var _helpers = require('../helpers');

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @signature
 * @description d
 * @namespace Io
 * @memberOf dataStructures
 * @param {function} item - a
 * @return {dataStructures.io} - b
 */
function Io(item) {
    return Object.create(io, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
        run: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Io
 * @static
 * @function
 * @param {function|*} item - a
 * @return {io} - b
 */
Io.of = function (item) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(item)) ? Io(item) : Io((0, _combinators.constant)(item));
};

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Io
 * @static
 * @function
 * @param {Object} f - a
 * @return {boolean} - b
 */
Io.is = function (f) {
    return io.isPrototypeOf(f);
};

/**
 * @description d
 * @namespace io
 * @memberOf dataStructures
 * @typedef {Object}
 */
var io = (_io = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.chain(function (a) {
            return Io.of(fn(a));
        });
    },
    fold: function _fold(fn, x) {
        return fn(this.value, x);
    },
    traverse: function _traverse(fa, fn) {
        return this.fold(function _reductioAdAbsurdum(xs, x) {
            fn(x).map(function _map(x) {
                return function _map_(y) {
                    return y.concat([x]);
                };
            }).ap(xs);
            return fa(this.empty);
        });
    },
    runIo: function _runIo() {
        return this.run.apply(this, arguments);
    },
    apply: _data_structure_util.apply,
    equals: _data_structure_util.equals,
    valueOf: _data_structure_util.valueOf,
    toString: (0, _data_structure_util.stringMaker)('Io')
}, _Symbol$toStringTag = Symbol.toStringTag, _mutatorMap = {}, _mutatorMap[_Symbol$toStringTag] = _mutatorMap[_Symbol$toStringTag] || {}, _mutatorMap[_Symbol$toStringTag].get = function () {
    return 'Io';
}, _defineProperty(_io, 'factory', Io), _defineEnumerableProperties(_io, _mutatorMap), _io);

/**
 * @description: Since the constant functor does not represent a disjunction, the Io's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @memberOf dataStructures.io
 * @type: {{function}}
 * @param: {function} f
 * @param: {function} g
 * @return: {@see io}
 */
io.bimap = io.map;

io.chain = _data_structure_util.chain;
io.mjoin = _data_structure_util.join;

io.ap = io.apply;
io.fmap = io.chain;
io.flapMap = io.chain;
io.bind = io.chain;
io.reduce = io.fold;

io.constructor = io.factory;

exports.Io = Io;
exports.io = io;

},{"../combinators":330,"../functionalHelpers":345,"../helpers":346,"./data_structure_util":333}],339:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createList = exports.ordered_list = exports.list = exports.list_core = exports.List = undefined;

var _Symbol$toStringTag, _list_core, _mutatorMap;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _list_iterators = require('./list_iterators');

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

var _combinators = require('../combinators');

var _decorators = require('../decorators');

var _sort_util = require('./sort_util');

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var listProxyHandler = {
    get: function get(target, prop) {
        if (Reflect.has(target, prop)) return target[prop];
        if ('symbol' !== (typeof prop === 'undefined' ? 'undefined' : _typeof(prop))) {
            var num = Number(prop);
            if (Number.isInteger(num)) return target.toArray()[num];
        }
    }
},
    bitMaskMaxListValue = createBitMask(true, true, false);

/**
 * @description: Object that contains the core functionality of a List; both the list and ordered_list
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @typedef {Object}
 * @property {function} value
 * @property {function} extract
 * @property {function} apply
 * @property {function} append
 * @property {function} appendAll
 * @property {function} bimap
 * @property {function} chain
 * @property {function} concat
 * @property {function} concatAll
 * @property {function} copyWithin
 * @property {function} distinct
 * @property {function} except
 * @property {function} fill
 * @property {function} filter
 * @property {function} groupBy
 * @property {function} groupByDescending
 * @property {function} groupJoin
 * @property {function} intersect
 * @property {function} intersperse
 * @property {function} listJoin
 * @property {function} map
 * @property {function} join
 * @property {function} ofType
 * @property {function} prepend
 * @property {function} prependAll
 * @property {function} reverse
 * @property {function} sequence
 * @property {function} skip
 * @property {function} skipWhile
 * @property {function} take
 * @property {function} takeWhile
 * @property {function} union
 * @property {function} zip
 * @property {function} all
 * @property {function} any
 * @property {function} count
 * @property {function} equals
 * @property {function} data
 * @property {function} extract
 * @property {function} findIndex
 * @property {function} findLastIndex
 * @property {function} first
 * @property {function} foldl
 * @property {function} foldr
 * @property {function} isEmpty
 * @property {function} last
 * @property {function} reduceRight
 * @property {function} toArray
 * @property {function} toEvaluatedList
 * @property {function} toMap
 * @property {function} toSet
 * @property {function} toString
 * @property {function} valueOf
 * @property {function} factory
 * @property {function} of
 * @property {function} sequence
 * @property {function} traverse
 * @property {Symbol.iterator}
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace list_core
 * @description This is the delegate object that specifies the behavior of the list functor. Most
 * operations that may be performed on an list functor 'instance' delegate to this object. List
 * functor 'instances' are created by the {@link List} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an list functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var list_core = (_list_core = {
    //Using getters for these properties because there's a chance the setting and/or getting
    //functionality could change; this will allow for a consistent interface while the
    //logic beneath changes
    /**
     * @signature () -> *
     * @description Returns the underlying value of a list delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of a list delegator,
     * see {@link dataStructures.list_core#map} and {@link dataStructures.list_core#bimap}.
     * To retrieve the underlying value of an identity_functor delegator, see {@link dataStructures.list_core#get},
     * {@link dataStructures.list_core#orElse}, {@link dataStructures.list_core#getOrElse},
     * and {@link dataStructures.list_core#valueOf}.
     * @memberOf dataStructures.list_core
     * @instance
     * @protected
     * @function value
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    get extract() {
        return this.data;
    },
    /**
     * @signature dataStructures.list_core -> dataStructures.list_core
     * @description Applies a function contained in another functor to the source
     * of this List object instance's underlying source. A new List object instance
     * is returned.
     * @memberOf dataStructures.list_core
     * @instance
     * @function apply
     * @this dataStructures.list_core
     * @param {dataStructures.list_core} l - a
     * @return {*} - b
     */
    apply: function _apply(l) {
        return createList(this, _iteratorWrapper((0, _list_iterators.apply)(this, l)));
    },

    /**
     * @signature () -> dataStructures.list_core
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function chain
     * @this dataStructures.list_core
     * @param {function} fn - a
     * @return {list} - b
     */
    chain: function _chain(fn) {
        return createList(this, _iteratorWrapper((0, _list_iterators.chain)(this, fn)));
    },

    /**
     * @signature [...iterable] -> dataStructures.list_core
     * @description Concatenates two or more lists by appending the "method's" List argument(s) to the
     * List's value. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @memberOf dataStructures.list_core
     * @instance
     * @function concat
     * @this dataStructures.list_core
     * @param {Array | *} ys - a
     * @return {list} - b
     */
    concat: function _concat(ys) {
        return createList(this, _iteratorWrapper((0, _list_iterators.concat)(this, List.of(ys))));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function concatAll
     * @this list
     * @param {list|ordered_list} ys - One or more lists to concatenate with this list
     * @return {list} Returns a new list
     */
    concatAll: function _concatAll() {
        for (var _len = arguments.length, ys = Array(_len), _key = 0; _key < _len; _key++) {
            ys[_key] = arguments[_key];
        }

        return createList(this, _iteratorWrapper((0, _list_iterators.concatAll)(this, ys.map(function (y) {
            return List.of(y);
        }))));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function copyWithin
     * @this list
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin}
     * @param {number} index - a
     * @param {number} start - b
     * @param {number} end - c
     * @return {list} - d
     */
    copyWithin: function _copyWithin(index, start, end) {
        return createList(this, _iteratorWrapper((0, _list_iterators.copyWithin)(index, start, end, this)));
    },

    /**
     * @signature (a -> boolean) -> List<b>
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function distinct
     * @this dataStructures.list_core
     * @param {function} comparer - a
     * @return {list} - b
     */
    distinct: function _distinct(comparer) {
        return createList(this, _iteratorWrapper((0, _list_iterators.distinct)(this, comparer)));
    },

    /**
     * @signature
     * @description Produces a List that contains the objectSet difference between the queryable object
     * and the List that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * equality comparer.
     * @memberOf dataStructures.list_core
     * @instance
     * @function except
     * @this list
     * @param {Array|generator} xs - a
     * @param {function} [comparer] - b
     * @return {list} - c
     */
    except: function _except(xs, comparer) {
        return createList(this, _iteratorWrapper((0, _list_iterators.except)(this, xs, comparer)));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function fill
     * @this list
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill}
     * @param {number} value - a
     * @param {number} start - b
     * @param {number} end - c
     * @return {list} - d
     */
    fill: function _fill(value, start, end) {
        return createList(this, _iteratorWrapper((0, _list_iterators.fill)(value, start, end, this)));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function filter
     * @this dataStructures.list_core
     * @param {function} predicate - a
     * @return {dataStructures.list_core} - b
     */
    filter: function _filter(predicate) {
        return createList(this, _iteratorWrapper((0, _list_iterators.filter)(this, predicate)));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function groupBy
     * @this dataStructures.list_core
     * @param {function} keySelector - a
     * @param {function} [comparer] - b
     * @return {dataStructures.list_core} - c
     */
    groupBy: function _groupBy(keySelector, comparer) {
        return createList(this, _iteratorWrapper((0, _list_iterators.groupBy)(this, [(0, _sort_util.createSortObject)(keySelector, comparer, _helpers.sortDirection.ascending)], createGroupedListDelegate)));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function groupByDescending
     * @this dataStructures.list_core
     * @param {function} keySelector - a
     * @param {function} [comparer] - b
     * @return {dataStructures.list_core} - c
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        return createList(this, _iteratorWrapper((0, _list_iterators.groupBy)(this, [(0, _sort_util.createSortObject)(keySelector, comparer, _helpers.sortDirection.descending)], createGroupedListDelegate)));
    },

    /**
     * @signature
     * @description Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @memberOf dataStructures.list_core
     * @instance
     * @function groupJoin
     * @this dataStructures.list_core
     * @param {dataStructures.list_core | Array} ys - a
     * @param {function} xSelector - b
     * @param {function} ySelector - c
     * @param {function} projector - d
     * @param {function} [comparer] - e
     * @return {dataStructures.list_core} - f
     */
    groupJoin: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
        return createList(this, _iteratorWrapper((0, _list_iterators.groupJoin)(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer)));
    },

    head: function _head() {
        return this.take(1);
    },

    /**
     * @signature
     * @description Produces the objectSet intersection of the List object's value and the List
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @memberOf dataStructures.list_core
     * @instance
     * @function intersect
     * @this dataStructures.list_core
     * @param {Array|generator} xs - a
     * @param {function} [comparer] - b
     * @return {dataStructures.list_core} - c
     */
    intersect: function _intersect(xs, comparer) {
        return createList(this, _iteratorWrapper((0, _list_iterators.intersect)(this, xs, comparer)));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function intersperse
     * @this dataStructures.list_core
     * @param {*} val - a
     * @return {dataStructures.list_core} - b
     */
    intersperse: function _intersperse(val) {
        return createList(this, _iteratorWrapper((0, _list_iterators.intersperse)(this, val)));
    },

    /**
     * @signature
     * @description Correlates the items in two lists based on the equality of items in each
     * List. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @memberOf dataStructures.list_core
     * @instance
     * @function listJoin
     * @this dataStructures.list_core
     * @param {Array|List} ys - a
     * @param {function} xSelector - b
     * @param {function} ySelector - c
     * @param {function} projector - d
     * @param {function} [comparer] - e
     * @return {dataStructures.list_core} - f
     */
    listJoin: function _join(ys, xSelector, ySelector, projector, comparer) {
        return createList(this, _iteratorWrapper((0, _list_iterators.join)(this, ys, xSelector, ySelector, projector, comparer)));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function map
     * @this dataStructures.list_core
     * @param {function} mapFunc - a
     * @return {dataStructures.list_core} - b
     */
    map: function _map(mapFunc) {
        return createList(this, _iteratorWrapper((0, _list_iterators.map)(this, mapFunc)));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function mjoin
     * @return {list} - a
     */
    mjoin: function _mjoin() {
        return this.chain(function (x) {
            return x;
        });
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function ofType
     * @this dataStructures.list_core
     * @param {string|Object} type - a
     * @returns {dataStructures.list_core} - b
     */
    ofType: function _ofType(type) {
        return createList(this, _iteratorWrapper((0, _list_iterators.ofType)(this, type)));
    },

    /**
     * @signature
     * @description d
     * @return {dataStructures.list_core} a
     */
    pop: function _pop() {
        return createList(this, _iteratorWrapper((0, _list_iterators.pop)(this)));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function prepend
     * @this dataStructures.list_core
     * @param {Array|generator} xs - a
     * @return {dataStructures.list_core} - b
     */
    prepend: function _prepend(xs) {
        return createList(this, _iteratorWrapper((0, _list_iterators.prepend)(this, List.of(xs))));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function prependAll
     * @this list
     * @param {Array|list|ordered_list} xs - A list
     * @return {list|ordered_list} Returns a new list
     */
    prependAll: function _prependAll() {
        for (var _len2 = arguments.length, xs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            xs[_key2] = arguments[_key2];
        }

        return createList(this, _iteratorWrapper((0, _list_iterators.prependAll)(this, xs.map(function (x) {
            return List.of(x);
        }))));
    },

    push: function _push() {
        for (var _len3 = arguments.length, items = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            items[_key3] = arguments[_key3];
        }

        return this.concat(items);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function reverse
     * @this dataStructures.list_core
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse}
     * @return {dataStructures.list_core} - a
     */
    reverse: function _reverse() {
        return createList(this, _iteratorWrapper((0, _list_iterators.reverse)(this)));
    },

    shift: function _shift() {
        return this.skip(1);
    },

    /**
     * @signature
     * @description Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty list is returned;
     * Otherwise, a list containing the items collected from the source is
     * returned.
     * @memberOf dataStructures.list_core
     * @instance
     * @function skip
     * @this dataStructures.list_core
     * @param {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @return {dataStructures.list_core} - a
     */
    skip: function _skip(amt) {
        if (!amt) return this;
        var count = 0 < amt ? -1 : 1;
        return 0 < amt ? this.skipWhile(function (idx) {
            return ++count < amt;
        }) : this.reverse().skipWhile(function (idx) {
            return --count > amt;
        }).reverse();
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function skipWhile
     * @this dataStructures.list_core
     * @param {function} [predicate] - a
     * @return {dataStructures.list_core} - b
     */
    skipWhile: function _skipWhile() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return createList(this, _iteratorWrapper((0, _list_iterators.skipWhile)(this, predicate)));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function slice
     * @this dataStructures.list_core
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice}
     * @param {number} [start] - An optional integer value that indicates where the slice of the current
     * list should begin. If no value is provided, the first index is used. If a negative value is provided,
     * the index is counted from the end of the list.
     * @param {number} [end] - An optional integer value that indicates where the slice of the current
     * list should end. If no value is provided, it will continue taking values until it reaches the end
     * of the list.
     * @return {dataStructures.list_core} Returns a new list
     */
    slice: function _slice(start, end) {
        return createList(this, _iteratorWrapper((0, _list_iterators.slice)(this, start, end)));
    },

    splice: function _splice(start, end) {
        return createList(this, _iteratorWrapper((0, _list_iterators.slice)(this, start, end)));
    },

    tail: function _tail() {
        return this.skip(1);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function take
     * @this dataStructures.list_core
     * @param {number} amt - a
     * @return {dataStructures.list_core} - b
     */
    take: function _take(amt) {
        if (!amt) return List.empty;
        var count = 0 < amt ? -1 : 1;
        return 0 < amt ? this.takeWhile(function (idx) {
            return ++count < amt;
        }) : this.reverse().takeWhile(function (idx) {
            return --count > amt;
        }).reverse();
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function takeWhile
     * @this dataStructures.list_core
     * @param {function} [predicate] - a
     * @return {dataStructures.list_core} - b
     */
    takeWhile: function _takeWhile() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return createList(this, _iteratorWrapper((0, _list_iterators.takeWhile)(this, predicate)));
    },

    /**
     * @signature
     * @description Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @memberOf dataStructures.list_core
     * @instance
     * @function union
     * @this dataStructures.list_core
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {dataStructures.list_core} - c
     */
    union: function _union(xs, comparer) {
        return createList(this, _iteratorWrapper((0, _list_iterators.union)(this, xs, comparer)));
    },

    unshift: function _unshift() {
        for (var _len4 = arguments.length, items = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            items[_key4] = arguments[_key4];
        }

        return this.prepend(items);
    },

    /**
     * @signature
     * @description Produces a List of the items in the queryable object and the List passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @memberOf dataStructures.list_core
     * @instance
     * @function zip
     * @this dataStructures.list_core
     * @param {function} selector - a
     * @param {Array|generator} xs - b
     * @return {dataStructures.list_core} - c
     */
    zip: function _zip(selector, xs) {
        return createList(this, _iteratorWrapper((0, _list_iterators.zip)(this, xs, selector)));
    },

    /**
     * @signature (a -> Boolean) -> [a] -> Boolean
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function all
     * @this dataStructures.list_core
     * @param {function} [predicate] - a
     * @return {boolean} - b
     */
    all: function _all() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.all)(this, predicate);
    },

    /**
     * @signature: (a -> Boolean) -> [a] -> Boolean
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function any
     * @this dataStructures.list_core
     * @param {function} [predicate] - a
     * @return {boolean} - b
     */
    any: function _any() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.any)(this, predicate);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function count
     * @this dataStructures.list_core
     * @param {function} [predicate] - a
     * @return {Number} -  b
     */
    count: function _count(predicate) {
        return (0, _list_iterators.count)(this, predicate);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @this dataStructures.list_core
     * @return {Array} Returns an array after evaluating the entire pipeline by running
     * the initial underlying data through each function.
     */
    get data() {
        if (this.evaluatedData) return this.evaluatedData;
        return Array.from(this);
    },

    /**
     * @description Returns the _evaluatedData property if it has been set, or null otherwise.
     * @return {Array|null} Returns either an array of values or null if there are none
     */
    get evaluatedData() {
        return this._evaluatedData || null;
    },

    /**
     * @description Sets the _evaluatedData property on a list object. This is only used
     * internally to prevent multiple enumerations and the underlying data won't change
     * and so can be cached after evaluation.
     * @param {Array} val - An array of values
     */
    set evaluatedData(val) {
        this._evaluatedData = val;
    },

    /**
     * @signature
     * @description d
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries}
     * @return {Iterator.<*>} Returns an iterator that contains the kvp's for
     * each value in the list.
     */
    entries: function _entries() {
        return this.data.entries();
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function equals
     * @this dataStructures.list_core
     * @param {dataStructures.list_core} f - a
     * @param {function} [comparer] - b
     * @return {boolean} - c
     */
    equals: function _equals(f, comparer) {
        return Object.getPrototypeOf(this).isPrototypeOf(f) && (0, _list_iterators.equals)(this, f, comparer);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function findIndex
     * @this dataStructures.list_core
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex}
     * @param {function} [comparer] - a
     * @return {Number} - b
     */
    findIndex: function _findIndex(comparer) {
        return (0, _list_iterators.findIndex)(this, comparer);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function findLastIndex
     * @this dataStructures.list_core
     * @param {function} [comparer] - a
     * @return {Number} - b
     */
    findLastIndex: function _findLastIndex(comparer) {
        return (0, _list_iterators.findLastIndex)(this, comparer);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function first
     * @this dataStructures.list_core
     * @param {function} [predicate] - a
     * @return {*} - b
     */
    first: function _first() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.first)(this, predicate);
    },

    /**
     * @signature (a -> b -> c) -> a -> [b] -> a
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function foldl
     * @this dataStructures.list_core
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    foldl: function _foldl(fn, acc) {
        return (0, _list_iterators.foldLeft)(this, fn, acc);
    },

    /**
     * @signature (a -> a -> a) -> [a] -> a
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function foldr
     * @this dataStructures.list_core
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    foldr: function _foldr(fn, acc) {
        return (0, _list_iterators.foldRight)(this, fn, acc);
    },

    /**
     * @signature
     * @description This function property is basically just a proxy for the normal javascript
     * array#forEach. However, unlike the array#forEach function property, this function will
     * return the same list that forEach was invoked on, so composition may continue. This is
     * implemented on the list data structure because it exists on the array. However, this
     * functionality should not be used to modify the list - rather it is for impure operations
     * performed outside of the list. To alter the data contained within, see any of the deferred
     * execution function properties.
     * @memberOf dataStructures.list_core
     * @instance
     * @function forEach
     * @this dataStructures.list_core
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
     * @param {function} fn - A function that should be applied to each value held in the list
     * @return {dataStructures.list_core} Returns a list
     */
    forEach: function _forEach(fn) {
        this.data.forEach(fn);
        return this;
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function indexOf
     * @this dataStructures.list_core
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf}
     * @param {*} val - Any javascript type/value that should be searched for in the list
     * @return {number} - Returns an integer representing the index of the first appearance
     * the value in the list. -1 indicates the value does not exist within the list.
     */
    indexOf: function _indexOf(val) {
        return this.data.indexOf(val);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function isEmpty
     * @this dataStructures.list_core
     * @return {boolean} - a
     */
    isEmpty: function _isEmpty() {
        return 0 === this.data.length;
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function join
     * @this dataStructures.list_core
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join}
     * @param {*} [delimiter] - Any javascript type/value that should be used as a delimiter
     * between value.
     * @return {string} Returns a string of each element in the list, optionally separated by
     * the provided delimiter.
     */
    join: function _join(delimiter) {
        return this.data.join(delimiter);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function keys
     * @this dataStructures.list_core
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys}
     * @return {Iterator.<number>} Returns an iterator that contains the keys for each index in the list.
     */
    keys: function _keys() {
        return this.data.keys();
    },

    /**
     * @signature
     * @description d
     * @memberOf  dataStructures.list_core
     * @instance
     * @function last
     * @this dataStructures.list_core
     * @param {function} [predicate] - a
     * @return {*} - b
     */
    last: function _last() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.last)(this, predicate);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function reduceRight
     * @this dataStructures.list_core
     * @external Array
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight}
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    reduceRight: function _reduceRight(fn, acc) {
        return (0, _list_iterators.reduceRight)(this, fn, acc);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function toArray
     * @return {Array} - a
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     * @signature
     * @description Evaluates the current List instance and returns a new List
     * instance with the evaluated data as its source. This is used when the
     * initial List's data must be iterated more than once as it will cause
     * the evaluation to happen each item it is iterated. Rather the pulling the
     * initial data through the List's 'pipeline' every time, this property will
     * allow you to evaluate the List's data and store it in a new List that can
     * be iterated many times without needing to re-evaluate. It is effectively
     * a syntactical shortcut for: List.from(listInstance.data)
     * @memberOf dataStructures.list_core
     * @instance
     * @function toEvaluatedList
     * @return {list} - a
     */
    toEvaluatedList: function _toEvaluatedList() {
        return List.from(this.data /* the .data property is a getter function that forces evaluation */);
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function toMap
     * @return {Map} - a
     */
    toMap: function _toMap() {
        return new Map(this.data.map(function _map(val, idx) {
            return [idx, val];
        }));
    },

    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list_core
     * @instance
     * @function toSet
     * @return {Set} - a
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     * @signature
     * @description Returns a string representation of an instance of a List
     * delegator object. This function does not cause evaluation of the source,
     * but this also means the returned value only reflects the underlying
     * data, not the evaluated data. In order to see a string representation of
     * the evaluated data, an evaluation must occur before .toString in invoked.
     * The most direct way of doing this is via the {@link dataStructures.list_core#toEvaluatedList}
     * function property.
     * @example
     * var list = List([1, 2, 3, 4, 5])
     *              .map(x => x * x);
     *
     * console.log(list.toString()); // => List(List(1, 2, 3, 4, 5)
     *
     * var evaledList = list.toEvaluatedList();
     *
     * console.log(evaledList.toString()); // => List(1, 4, 9, 16, 25);
     * @memberOf dataStructures.list_core
     * @instance
     * @function toString
     * @return {string} Returns a string representation of the list. NOTE: This functionality
     * currently forces an evaluation of the pipelined operations.
     */
    toString: function _toString() {
        //console.log(this.value);
        //console.log(list_core.isPrototypeOf(this.value), this.value.toString(), this.value);

        /*if (list_core.isPrototypeOf(this.value) || (Array.isArray(this.value) && this.value.length === 5)) {
            console.log(list_core.isPrototypeOf(this.value));
            console.log(this);
            console.log(this.value);
              if (list_core.isPrototypeOf(this.value)) {
                console.log(this.value.toString());
            }
        }*/
        //return list_core.isPrototypeOf(this.value) ? this.value.toString() : `List(${this.value})`;
        //var val = list_core.isPrototypeOf(this.value) ? this.value.toString() : this.value;
        return 'List(' + this.value + ')';
    },

    toLocaleString: function _toLocaleString() {
        return this.toArray().toLocaleString();
    },

    toJSON: function _toJSON() {
        return this.data;
    }
}, _Symbol$toStringTag = Symbol.toStringTag, _mutatorMap = {}, _mutatorMap[_Symbol$toStringTag] = _mutatorMap[_Symbol$toStringTag] || {}, _mutatorMap[_Symbol$toStringTag].get = function () {
    return 'List';
}, _defineProperty(_list_core, 'valueOf', function _valueOf() {
    return this.data.value;
}), _defineProperty(_list_core, 'factory', List), _defineProperty(_list_core, 'sequence', function _sequence(p) {
    return this.traverse(p, p.of);
    /*
    return this.foldr((m, ma) => {
        return m.chain(x => {
            if (0 === ma.value.length) return List.of(x);
            return ma.chain(xs => List.of(List.of(x).concat(xs)));
        });
    }, List.empty());
    */
}), _defineProperty(_list_core, 'traverse', function _traverse(f, g) {
    return this.foldl(function (ys, x) {
        return ys.apply(g(x).map(function (x) {
            return function (y) {
                return y.concat([x]);
            };
        }));
    }, f(List.empty));
}), _defineProperty(_list_core, Symbol.iterator, /*#__PURE__*/regeneratorRuntime.mark(function _iterator() {
    var data, res, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator2, _step, item;

    return regeneratorRuntime.wrap(function _iterator$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    data = this.evaluatedData ? this.evaluatedData : Array.from(this.value), res = [];
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 4;
                    _iterator2 = data[Symbol.iterator]();

                case 6:
                    if (_iteratorNormalCompletion = (_step = _iterator2.next()).done) {
                        _context.next = 14;
                        break;
                    }

                    item = _step.value;
                    _context.next = 10;
                    return item;

                case 10:
                    res[res.length] = item;

                case 11:
                    _iteratorNormalCompletion = true;
                    _context.next = 6;
                    break;

                case 14:
                    _context.next = 20;
                    break;

                case 16:
                    _context.prev = 16;
                    _context.t0 = _context['catch'](4);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                case 20:
                    _context.prev = 20;
                    _context.prev = 21;

                    if (!_iteratorNormalCompletion && _iterator2.return) {
                        _iterator2.return();
                    }

                case 23:
                    _context.prev = 23;

                    if (!_didIteratorError) {
                        _context.next = 26;
                        break;
                    }

                    throw _iteratorError;

                case 26:
                    return _context.finish(23);

                case 27:
                    return _context.finish(20);

                case 28:
                    this.evaluatedData = res;

                case 29:
                case 'end':
                    return _context.stop();
            }
        }
    }, _iterator, this, [[4, 16, 20, 28], [21,, 23, 27]]);
})), _defineEnumerableProperties(_list_core, _mutatorMap), _list_core);

list_core.set = function _set(idx, val) {
    var len = this.count();
    var normalizedIdx = 0 > idx ? len + idx : idx;
    if (0 <= normalizedIdx) {
        return createList(this, _iteratorWrapper((0, _list_iterators.set)(this, normalizedIdx, val)));
    }
    return this;
};

list_core.get = function _get(idx) {
    var len = this.count(),
        normalizedIdx = 0 > idx ? len + idx : idx;
    return this.toArray()[normalizedIdx];
};

/**
 * @signature
 * @description Alias for {@link dataStructures.list_core#concat}
 * @memberOf dataStructures.list_core
 * @instance
 * @function append
 * @see dataStructures.list_core#concat
 * @param {Array | *} ys - a
 * @return {dataStructures.list_core} - b
 */
list_core.append = list_core.concat;

/**
 * @signature Object -> Object
 * @description Alias for {@link dataStructures.list_core#apply}
 * @memberOf dataStructures.list_core
 * @instance
 * @function ap
 * @see dataStructures.list_core#apply
 * @param {Object} ma - Any object with a map function - i.e. a monad.
 * @return {Object} Returns an instance of the monad object provide as an argument.
 */
list_core.ap = list_core.apply;

/**
 * @signature
 * @description Alias for {@link dataStructures.list_core#chain}
 * @memberOf dataStructures.list_core
 * @instance
 * @function fmap
 * @param {function} fn - a
 * @return {list} - b
 */
list_core.fmap = list_core.chain;

/**
 * @signature
 * @description Alias for {@link dataStructures.list_core#chain}
 * @memberOf dataStructures.list_core
 * @instance
 * @function fmap
 * @param {function} fn - a
 * @return {list} - b
 */
list_core.flapMap = list_core.chain;

/**
 * @signature
 * @description Alias for {@link dataStructures.list_core#chain}
 * @memberOf dataStructures.list_core
 * @instance
 * @function bind
 * @property {function} fn
 * @return {dataStructures.list_core} - Returns a new list monad
 */
list_core.bind = list_core.chain;

/**
 * @signature
 * @description Alias for {@link dataStructures.list_core#all}
 * @memberOf dataStructures.list_core
 * @instance
 * @function every
 * @type {dataStructures.list_core.all}
 * @this dataStructures.list_core
 * @param {function} predicate - a
 * @return {boolean} - b
 */
list_core.every = list_core.all;

/**
 * @signature
 * @description Alias for {@link dataStructures.list_core#any}
 * @memberOf dataStructures.list_core
 * @instance
 * @function every
 * @type {dataStructures.list_core.any}
 * @this dataStructures.list_core
 * @param {function} predicate - a
 * @return {boolean} - b
 */
list_core.some = list_core.any;

/**
 * @signature
 * @description Alias for {@link dataStructures.list_core#isEmpty}
 * @memberOf dataStructures.list_core
 * @instance
 * @function isIdentity
 * @type {dataStructures.list_core#isEmpty}
 * @this dataStructures.list_core
 * @return {boolean} - b
 */
list_core.isIdentity = list_core.isEmpty;

/**
 * @delegate
 * @delegator {@link dataStructures.list_core}
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the list_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a List's data by
 * a given key.
 * @typedef {Object}
 * @property {function} sortBy
 * @property {function} sortByDescending
 * @property {function} contains
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace list
 */
var list = Object.create(list_core, /** @lends list_core */{
    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list
     * @instance
     * @function sortBy
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {dataStructures.ordered_list} - c
     */
    sortBy: {
        value: function _orderBy() {
            var keySelector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _combinators.identity;
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = [(0, _sort_util.createSortObject)(keySelector, comparer, _helpers.sortDirection.ascending)];
            return createList(this, _iteratorWrapper((0, _list_iterators.sortBy)(this, sortObj)), sortObj);
        }
    },
    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list
     * @instance
     * @function sortByDescending
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {dataStructures.ordered_list} - c
     */
    sortByDescending: {
        value: function _orderByDescending(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = [(0, _sort_util.createSortObject)(keySelector, comparer, _helpers.sortDirection.descending)];
            return createList(this, _iteratorWrapper((0, _list_iterators.sortBy)(this, sortObj)), sortObj);
        }
    },
    /**
     * @signature
     * @description d
     * @memberOf dataStructures.list
     * @instance
     * @function contains
     * @param {*} val - a
     * @param {function} comparer - b
     * @return {boolean} - c
     */
    contains: {
        value: function _contains(val, comparer) {
            return (0, _list_iterators.contains)(this, val, comparer);
        }
    }
});

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .thenBy and .thenByDescending
 * functions. These functions allow a consumer to sort more on than a single column.
 * @typedef {Object}
 * @property {function} sortBy
 * @property {function} sortByDescending
 * @property {function} contains
 * @memberOf dataStructures
 * @namespace ordered_list
 */
var ordered_list = Object.create(list_core, /** @lends list_core */{
    _appliedSorts: {
        value: []
    },
    //In these two functions, feeding the call to "orderBy" with the .value property of the List delegate
    //rather than the delegate itself, effectively excludes the previous call to the orderBy/orderByDescending
    //since the iterator exists on the delegate, not on its value. Each subsequent call to thenBy/thenByDescending
    //will continue to exclude the previous call's iterator... effectively what we're doing is ignoring all the
    //prior calls made to orderBy/orderByDescending/thenBy/thenByDescending and calling it once but with an array
    //of the the requested sorts.
    /**
     * @signature
     * @description d
     * @memberOf dataStructures.ordered_list
     * @instance
     * @function thenBy
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {dataStructures.ordered_list} - c
     */
    thenBy: {
        value: function _thenBy(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = this._appliedSorts.concat((0, _sort_util.createSortObject)(keySelector, comparer, _helpers.sortDirection.ascending));
            return createList(this.value, _iteratorWrapper((0, _list_iterators.sortBy)(this, sortObj)), sortObj);
        }
    },
    /**
     * @signature
     * @description d
     * @memberOf dataStructures.ordered_list
     * @instance
     * @function thenByDescending
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {dataStructures.ordered_list} - c
     */
    thenByDescending: {
        value: function thenByDescending(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = this._appliedSorts.concat((0, _sort_util.createSortObject)(keySelector, comparer, _helpers.sortDirection.descending));
            return createList(this.value, _iteratorWrapper((0, _list_iterators.sortBy)(this, sortObj)), sortObj);
        }
    },
    /**
     * @signature
     * @description Performs the same functionality as dataStructures.list_core#contains, but utilizes
     * a binary searching algorithm rather than a sequential search. If this function is called
     * an a non-ordered List, it will internally delegate to dataStructures.list_core#contains instead. This
     * function should not be called on a sorted List for look for a value that is not the
     * primary field on which the List's data is sorted on as an incorrect result will likely
     * be returned.
     * @memberOf dataStructures.ordered_list
     * @instance
     * @function contains
     * @param {*} val - The value that should be searched for
     * @param {function} comparer - The function used to compare values in the List to
     * the 'val' parameter
     * @return {boolean} - Returns true if the List contains the searched for value, false
     * otherwise.
     */
    contains: {
        value: function _contains(val, comparer) {
            return (0, _list_iterators.binarySearch)((0, _combinators.when)((0, _decorators.not)(_functionalHelpers.isArray), Array.from, this.value), val, comparer);
        }
    }
});

/**
 * @signature
 * @description d
 * @private
 * @param {*} [source] - a
 * @return {list} - b
 */
var listFromNonGen = function listFromNonGen(source) {
    return createList(source && source[Symbol.iterator] && 'string' !== typeof source ? source : (0, _functionalHelpers.wrap)(source));
};

/**
 * @signature
 * @description d
 * @private
 * @param {generator} source - a
 * @return {list} - b
 */
var listFromGen = function listFromGen(source) {
    return createList((0, _functionalHelpers.invoke)(source));
};

/**
 * @signature
 * @factory List
 * @description Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @namespace List
 * @memberOf dataStructures
 * @property {function} from {@link List#from}
 * @property {function} of {@link List#of}
 * @property {function} ordered {@link List#ordered}
 * @property {Object} empty {@link List#empty}
 * @property {function} just {@link List#just}
 * @property {function} unfold {@link List#unfold}
 * @property {function} is {@link List#is}
 * @property {function} repeat {@link List#repeat}
 * @property {function} extend {@link List#extend}
 * @param {*} [source] - Any type, any value; used as the underlying source of the List
 * @return {list} - A new List instance with the value provided as the underlying source.
 */
function List(source) {
    return (0, _combinators.ifElse)(isList, _combinators.identity, (0, _combinators.ifElse)((0, _functionalHelpers.delegatesFrom)(_helpers.generatorProto), listFromGen, listFromNonGen), source);
}

var isOneArg = function isOneArg(args) {
    return 1 === args.length;
};
var isList = function isList(val) {
    return (0, _functionalHelpers.delegatesFrom)(list_core, val);
};
var isOneArgAndAList = function isOneArgAndAList(args) {
    return !!(isOneArg(args) && isList(args[0]));
};
var createListFromArgs = function createListFromArgs(args) {
    return 1 !== args.length ? List(args) : Array.isArray(args[0]) || (0, _functionalHelpers.delegatesFrom)(_helpers.generatorProto, args[0]) ? List(args[0]) : List(args);
};

/**
 * @signature
 * @description Convenience function for listCreate a new List instance; internally calls List.
 * @memberOf List
 * @static
 * @function from
 * @see List
 * @param {*} [source] - Any type, any value; used as the underlying source of the List
 * @return {list} - A new List instance with the value provided as the underlying source.
 */
List.from = function () {
    for (var _len5 = arguments.length, source = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        source[_key5] = arguments[_key5];
    }

    return (0, _combinators.ifElse)(isOneArgAndAList, _combinators.constant.apply(undefined, source), createListFromArgs, source);
};

/**
 * @signature
 * @description Alias for List.from
 * @memberOf List
 * @static
 * @function of
 * @see List.from
 * @param {*}
 * @return {list} - a
 */
List.of = List.from;

//TODO: implement this so that a consumer can initiate a List as ordered
/**
 * @signature
 * @description Creates a new {@link ordered_list} for the source provided. An optional
 * source selector and comparer functions may be provided.
 * @memberOf List
 * @static
 * @function ordered
 * @param {*} [source] - Any JavaScript value
 * @param {function} [selector] - A function that selects either a subset of each value in the list, or can
 * act as the 'identity' function and just return the entire value.
 * @param {function} [comparer] - A function that knows how to compare the type of values the selector function
 * 'pulls' out of the list.
 * @return {ordered_list} Returns a new list monad
 */
List.ordered = function (source, selector) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.defaultPredicate;
    return createList(source, null, [(0, _sort_util.createSortObject)(selector, comparer, _helpers.sortDirection.ascending)]);
};

/**
 * @description Holds a reference to an empty, ordered list.
 * @memberOf List
 * @property {Object} empty
 * @see ordered_list
 * @kind {Object}
 */
List.empty = createList([], null, [(0, _sort_util.createSortObject)(_combinators.identity, _functionalHelpers.defaultPredicate, _helpers.sortDirection.ascending)]);

List.identity = List.empty;

/**
 * @signature
 * @description Creates and returns a new {@link ordered_list} since a list with a single
 * item is trivially ordered.
 * @memberOf List
 * @static
 * @function just
 * @see List
 * @param {*} val - a
 * @return {ordered_list} - b
 */
List.just = function (val) {
    return createList([val], null, [(0, _sort_util.createSortObject)(_combinators.identity, _functionalHelpers.defaultPredicate, _helpers.sortDirection.ascending)]);
};

/**
 * @signature
 * @description Takes a function and a seed value. The function is used to 'unfold' the seed value
 * into an array which is used as the source of a new List monad.
 * @memberOf List
 * @static
 * @function unfold
 * @see List
 * @param {function|generator} fn - a
 * @param {*} seed - b
 * @return {list} - c
 */
List.unfold = function (fn, seed) {
    return createList((0, _list_iterators.unfold)(fn)(seed));
};

/**
 * @signature
 * @description Takes any value as an argument and returns a boolean indicating if
 * the value is a list.
 * @memberOf List
 * @static
 * @function is
 * @see List
 * @param {*} f - Any JavaScript value
 * @return {boolean} - Returns a boolean indicating of the value is a list.
 */
List.is = isList;

/**
 * @signature
 * @description Generates a new list with the specified item repeated the specified number of times. Because
 * this generates a list with the same item repeated n times, the resulting List is trivially
 * sorted. Thus, a sorted List is returned rather than an unsorted list.
 * @memberOf List
 * @static
 * @function repeat
 * @see List
 * @param {*} item - Any JavaScript value that should be used to build a new list monad.
 * @param {number} count - The number of times the value should be repeated to build the list.
 * @return {Proxy} - Returns a new ordered list monad.
 */
List.repeat = function _repeat(item, count) {
    return createList([], (0, _list_iterators.repeat)(item, count), [(0, _sort_util.createSortObject)(_combinators.identity, _functionalHelpers.noop, _helpers.sortDirection.descending)]);
};

/**
 * @signature
 * @summary Extension function that allows new functionality to be applied to
 * the queryable object
 * @memberOf List
 * @static
 * @function extend
 * @see List
 * @param {string} prop - The name of the new property that should exist on the List; must be unique
 * @param {function} fn - A function that defines the new List functionality and
 * will be called when this new List property is invoked.
 * @return {List} - a
 *
 * @description The fn parameter must be a non-generator function that takes one or more
 * arguments. If this new List function should be an immediately evaluated
 * function (like: foldl, any, reverse, etc.), it merely needs the accept one or more
 * arguments and know how to iterate the source. In the case of an immediately evaluated
 * function, the return type can be any javascript type. The first argument is always the
 * previous List instance that must be iterated. Additional arguments may be specified
 * if desired.
 *
 * If the function's evaluation should be deferred it needs to work a bit differently.
 * In this case, the function should accept one or more arguments, the first and only
 * required argument being the underlying source of the List object. This underlying
 * source can be anything with an iterator (generator, array, map, set, another list, etc.).
 * Any additional arguments that the function needs should be specified in the signature.
 * The return value of the function should be a generator that knows how to iterate the
 * underlying source. If the generator should operate like most List functions, i.e.
 * take a single item, process it, and then yield it out before asking for the next, a
 * for-of loop is the preferred method for employment. However, if the generator needs
 * all of the underlying data upfront (like orderBy and groupBy), Array.from is the
 * preferred method. Array.from will 'force' all the underlying List instances
 * to evaluate their data before it is handed over in full to the generator. The generator
 * can then act with full knowledge of the data and perform whatever operation is needed
 * before ultimately yielding out a single item at a time. If your extension function
 * needs to yield out all items at once, then that function is not a lazy evaluation
 * function and should be constructed like the immediately evaluated functions described
 * above.
 */
List.extend = function _extend(prop, fn) {
    if (![list, ordered_list].some(function (type) {
        return prop in type;
    })) {
        list_core[prop] = function _extension() {
            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                args[_key6] = arguments[_key6];
            }

            return createList(this, fn.apply(undefined, [this].concat(args)));
        };
    }
    return List;
};

function createGroupedListDelegate(source, key) {
    return createList(source, undefined, undefined, key);
}

/**
 * @description Creates a new list object delegate instance; list type is determined by
 * the parameters passed to the function. If only the 'source' parameter is provided, a
 * 'basic' list delegate object instance is created. If the source and iterator parameters
 * are passed as arguments, a 'basic' list delegate object instance is created and the
 * iterator provided is used as the new instance object's iterator rather than the default
 * list iterator. If the source, iterator, and sortObj parameters are passed as arguments,
 * an ordered_list delegate object instance is created. The provided iterator is set on
 * the instance object to be used in lieu of the default iterator and the ._appliedSorts
 * field is set as the 'sortObj' parameter. If all four of the function's arguments are
 * provided (source, iterator, sortObj, and key), then a list delegate object instance
 * is created, setting the iterator for the object instance as the provided iterator, the
 * ._appliedSorts field as the sortObj argument, and the ._key field as the 'key' parameter's
 * value.
 *
 * The switch case inside the function only handles a subset of the possible bit flag values.
 * Technically there could be as many as eight different scenarios to check, not including the
 * default case. However, in practice, the only values received from the 'createBitMask' function
 * will be odd. Thus, only odd values (plus the default case which covers a value of zero) need
 * to be handled. A case of zero arises when only the 'source' argument is provided.
 *
 * @private
 * @param {*} source - The value to be used as the underlying source of the list functor; may be
 * anything javascript object that has an iterator.
 * @param {generator|null} [iterator] - A generator function that is to be used on the new list delegate
 * object instance's iterator.
 * @param {Array|undefined} [sortObject] - An array of the sort(s) (field and direction} to be used when the
 * instance is evaluated.
 * @param {string} [key] - A string that denotes what value the new list delegate object instance
 * was grouped on.
 * @return {Proxy<dataStructure.list_core>|list_core|list|ordered_list} Returns either a {@link list} delegator object
 * or an {@link ordered_list} delegator object based on the values passed as arguments.
 */
function createList(source, iterator, sortObject, key) {
    var bm = createBitMask((0, _functionalHelpers.delegatesTo)(iterator, _helpers.generatorProto), (0, _functionalHelpers.isString)(key), (0, _functionalHelpers.isArray)(sortObject));
    var proxiedList = bitMaskMaxListValue > bm ? new Proxy(Object.create(list, {
        _value: { value: source, writable: false, configurable: false }
    }), listProxyHandler) : new Proxy(Object.create(ordered_list, {
        _value: { value: source, writable: false, configurable: false },
        _appliedSorts: { value: sortObject, writable: false, configurable: false }
    }), listProxyHandler);

    switch (bm) {
        /**
         * @description: case 1 = An iterator has been passed, but nothing else. Create a
         * basic list type object instance and set the iterator as the version provided.
         */
        case 1:
            proxiedList[Symbol.iterator] = iterator;
            return proxiedList;
        case 2:
            /**
             * @description: case 2 = A key was passed as the only argument. Create a list
             * object and set the ._key field as the key string argument.
             */
            return Object.defineProperties(proxiedList, {
                '_key': { value: key, writable: false, configurable: false },
                'key': { get: function _getKey() {
                        return this._key;
                    } }
            });
        /**
         * @description: case 5 = Both an iterator and a sort object were passed in. The consumer
         * invoked the sortBy/sortByDescending or thenBy/thenByDescending function properties. Create
         * an ordered list type object instance, setting the iterator to the version provided (if any) and
         * the _appliedSorts field as the sortObject param.
         */
        case 5:
            proxiedList[Symbol.iterator] = iterator;
            return proxiedList;
        /**
         * @description: default = Nothing beyond the 'source' param was passed to this
         * function; results in a bitwise value of 00. Create a 'basic' list object type
         * instance.
         */
        default:
            return proxiedList;
    }
}

/**
 * @signature [...a] -> Number
 * @description creates a bit mask value based on truthy/falsey arguments passed to the function
 * @private
 * @param {boolean} args - Zero or more arguments. All arguments are treated as booleans, so truthy,
 * and falsey values will work.
 * @return {number} Returns an integer that represents the bit mask value of the boolean arguments.
 */
function createBitMask() {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
    }

    return args.reduce(function _reduce(curr, next, idx) {
        return curr |= next << idx;
    }, args[0]);
}

function _iteratorWrapper(it) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function iterator() {
            var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator3, _step2, item, res, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator4, _step3, _item;

            return regeneratorRuntime.wrap(function iterator$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!this.evaluatedData) {
                                _context2.next = 29;
                                break;
                            }

                            _iteratorNormalCompletion2 = true;
                            _didIteratorError2 = false;
                            _iteratorError2 = undefined;
                            _context2.prev = 4;
                            _iterator3 = this.evaluatedData[Symbol.iterator]();

                        case 6:
                            if (_iteratorNormalCompletion2 = (_step2 = _iterator3.next()).done) {
                                _context2.next = 13;
                                break;
                            }

                            item = _step2.value;
                            _context2.next = 10;
                            return item;

                        case 10:
                            _iteratorNormalCompletion2 = true;
                            _context2.next = 6;
                            break;

                        case 13:
                            _context2.next = 19;
                            break;

                        case 15:
                            _context2.prev = 15;
                            _context2.t0 = _context2['catch'](4);
                            _didIteratorError2 = true;
                            _iteratorError2 = _context2.t0;

                        case 19:
                            _context2.prev = 19;
                            _context2.prev = 20;

                            if (!_iteratorNormalCompletion2 && _iterator3.return) {
                                _iterator3.return();
                            }

                        case 22:
                            _context2.prev = 22;

                            if (!_didIteratorError2) {
                                _context2.next = 25;
                                break;
                            }

                            throw _iteratorError2;

                        case 25:
                            return _context2.finish(22);

                        case 26:
                            return _context2.finish(19);

                        case 27:
                            _context2.next = 58;
                            break;

                        case 29:
                            res = [];
                            _iteratorNormalCompletion3 = true;
                            _didIteratorError3 = false;
                            _iteratorError3 = undefined;
                            _context2.prev = 33;
                            _iterator4 = it()[Symbol.iterator]();

                        case 35:
                            if (_iteratorNormalCompletion3 = (_step3 = _iterator4.next()).done) {
                                _context2.next = 43;
                                break;
                            }

                            _item = _step3.value;

                            res[res.length] = _item;
                            _context2.next = 40;
                            return _item;

                        case 40:
                            _iteratorNormalCompletion3 = true;
                            _context2.next = 35;
                            break;

                        case 43:
                            _context2.next = 49;
                            break;

                        case 45:
                            _context2.prev = 45;
                            _context2.t1 = _context2['catch'](33);
                            _didIteratorError3 = true;
                            _iteratorError3 = _context2.t1;

                        case 49:
                            _context2.prev = 49;
                            _context2.prev = 50;

                            if (!_iteratorNormalCompletion3 && _iterator4.return) {
                                _iterator4.return();
                            }

                        case 52:
                            _context2.prev = 52;

                            if (!_didIteratorError3) {
                                _context2.next = 55;
                                break;
                            }

                            throw _iteratorError3;

                        case 55:
                            return _context2.finish(52);

                        case 56:
                            return _context2.finish(49);

                        case 57:
                            this.evaluatedData = res;

                        case 58:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, iterator, this, [[4, 15, 19, 27], [20,, 22, 26], [33, 45, 49, 57], [50,, 52, 56]]);
        })
    );
}

list_core.constructor = list_core.factory;
list_core.fold = list_core.foldl;
list_core.reduce = list_core.foldl;

/**
 * @signature
 * @description Since the constant functor does not represent a disjunction, the List's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out monads/monads does not break an application that is
 * relying on its existence.
 * @memberOf dataStructures.list_core
 * @instance
 * @function bimap
 * @param {function} f - a
 * @param {function} g - b
 * @return {list} - c
 */
list_core.bimap = list_core.map;

exports.List = List;
exports.list_core = list_core;
exports.list = list;
exports.ordered_list = ordered_list;
exports.createList = createList;

},{"../combinators":330,"../decorators":344,"../functionalHelpers":345,"../helpers":346,"./list_iterators":340,"./sort_util":342}],340:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.zip = exports.union = exports.unfold = exports.takeWhile = exports.sortBy = exports.slice = exports.skipWhile = exports.set = exports.reverse = exports.repeat = exports.reduceRight = exports.prependAll = exports.prepend = exports.pop = exports.ofType = exports.map = exports.last = exports.join = exports.intersperse = exports.intersect = exports.groupJoin = exports.groupBy = exports.foldRight = exports.foldLeft = exports.first = exports.findLastIndex = exports.findIndex = exports.filter = exports.fill = exports.except = exports.equals = exports.distinct = exports.count = exports.copyWithin = exports.contains = exports.concatAll = exports.concat = exports.chain = exports.binarySearch = exports.apply = exports.any = exports.all = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _functionalHelpers = require('../functionalHelpers');

var _decorators = require('../decorators');

var _combinators = require('../combinators');

var _helpers = require('../helpers');

var _sort_util = require('./sort_util');

/** @module dataStructures/list_iterators */

//TODO: see about adding an 'evaluatedData' property to a list once the generator is done yielding out
//TODO: values. It would be nice to wrap each returned iterator in a generic iterator that just forwards
//TODO: the values it receives from the primary, but also remember each value. Once there are no more value
//TODO: to yield out, it can set the 'evaluatedData' property on the list object and from then on, the
//TODO: list won't need to be iterated as it has already been evaluated.

var asArray = (0, _combinators.when)((0, _decorators.not)(_functionalHelpers.isArray), Array.from);
var arrayFromGenerator = function arrayFromGenerator(val) {
    return Array.from((0, _functionalHelpers.invoke)(val));
};
var toArray = (0, _combinators.ifElse)((0, _functionalHelpers.delegatesFrom)(_helpers.generatorProto), arrayFromGenerator, asArray);

//var getIterator = iterable => delegatesFrom(generatorProto, iterable) ? invoke(iterable) : iterable;

/*function *_iterate(iterable, fn) {
    for (let item of getIterator(iterable)) yield fn(item);
}*/

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [predicate] - b
 * @return {boolean} - c
 */
function all(xs, predicate) {
    xs = asArray(xs);
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate)) && toArray(xs).every(predicate);
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [predicate] - b
 * @return {boolean} - c
 */
function any(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate)) ? asArray(xs).some(predicate) : 0 < asArray(xs).length;
}

/**
 * @signature
 * @description d
 * @param {dataStructures.list_core} xs - a
 * @param {dataStructures.list_core} ys - b
 * @return {generator} - c
 */
function apply(xs, ys) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function _applyIterator() {
            var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, y, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, x;

            return regeneratorRuntime.wrap(function _applyIterator$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context.prev = 3;
                            _iterator = ys[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                _context.next = 36;
                                break;
                            }

                            y = _step.value;
                            _iteratorNormalCompletion2 = true;
                            _didIteratorError2 = false;
                            _iteratorError2 = undefined;
                            _context.prev = 10;
                            _iterator2 = xs[Symbol.iterator]();

                        case 12:
                            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                _context.next = 19;
                                break;
                            }

                            x = _step2.value;
                            _context.next = 16;
                            return y(x);

                        case 16:
                            _iteratorNormalCompletion2 = true;
                            _context.next = 12;
                            break;

                        case 19:
                            _context.next = 25;
                            break;

                        case 21:
                            _context.prev = 21;
                            _context.t0 = _context['catch'](10);
                            _didIteratorError2 = true;
                            _iteratorError2 = _context.t0;

                        case 25:
                            _context.prev = 25;
                            _context.prev = 26;

                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }

                        case 28:
                            _context.prev = 28;

                            if (!_didIteratorError2) {
                                _context.next = 31;
                                break;
                            }

                            throw _iteratorError2;

                        case 31:
                            return _context.finish(28);

                        case 32:
                            return _context.finish(25);

                        case 33:
                            _iteratorNormalCompletion = true;
                            _context.next = 5;
                            break;

                        case 36:
                            _context.next = 42;
                            break;

                        case 38:
                            _context.prev = 38;
                            _context.t1 = _context['catch'](3);
                            _didIteratorError = true;
                            _iteratorError = _context.t1;

                        case 42:
                            _context.prev = 42;
                            _context.prev = 43;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }

                        case 45:
                            _context.prev = 45;

                            if (!_didIteratorError) {
                                _context.next = 48;
                                break;
                            }

                            throw _iteratorError;

                        case 48:
                            return _context.finish(45);

                        case 49:
                            return _context.finish(42);

                        case 50:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _applyIterator, this, [[3, 38, 42, 50], [10, 21, 25, 33], [26,, 28, 32], [43,, 45, 49]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {*} val - b
 * @param {function} comparer - c
 * @return {boolean} - d
 */
function binarySearch(xs, val, comparer) {
    return binarySearchRec(xs, 0, xs.length - 1, val, comparer);
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {number} left - b
 * @param {number} right - c
 * @param {*} val - d
 * @param {function} comparer - e
 * @return {boolean} - f
 */
function binarySearchRec(xs, left, right, val, comparer) {
    if (left > right) return false;
    var mid = Math.floor((left + right) / 2),
        res = comparer(val, xs[mid]);
    if (0 === res) return true;
    if (0 < res) return binarySearchRec(xs, mid + 1, right, val, comparer);
    return binarySearchRec(xs, left, mid - 1, val, comparer);
}

/**
 * @signature
 * @description Performs the chain operation for the list data structure. Upon invocation,
 * a generator is returned that knows how to iterate a list and return the appropriate value(s).
 * Like the chain operation for the other data structures, this is a 'safe' chain, meaning that
 * if the provided function argument returns a list for an item, then the item is pulled from the
 * list and yielded out. However, if a non-list value is returned, then that value will be yielded
 * out 'as is'. There is no way to perform a chain operation and get back anything other than a list.
 * @param {*} xs - a
 * @param {function} fn - b
 * @return {generator} - c
 */
function chain(xs, fn) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function _chainIterator() {
            var res, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, x, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, item;

            return regeneratorRuntime.wrap(function _chainIterator$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _iteratorNormalCompletion3 = true;
                            _didIteratorError3 = false;
                            _iteratorError3 = undefined;
                            _context2.prev = 3;
                            _iterator3 = xs[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                _context2.next = 42;
                                break;
                            }

                            x = _step3.value;

                            res = fn(x);
                            //We have to travel up the prototype chain twice here because we could be dealing with an
                            //ordered list, in which case, we need to check if list_core is in the prototype chain,
                            //not list or ordered_list

                            if (!Object.getPrototypeOf(Object.getPrototypeOf(xs)).isPrototypeOf(res)) {
                                _context2.next = 37;
                                break;
                            }

                            //If the result is a list, then we need to unwrap the values contained within and yield
                            //each one of them individually...
                            _iteratorNormalCompletion4 = true;
                            _didIteratorError4 = false;
                            _iteratorError4 = undefined;
                            _context2.prev = 12;
                            _iterator4 = res[Symbol.iterator]();

                        case 14:
                            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                                _context2.next = 21;
                                break;
                            }

                            item = _step4.value;
                            _context2.next = 18;
                            return item;

                        case 18:
                            _iteratorNormalCompletion4 = true;
                            _context2.next = 14;
                            break;

                        case 21:
                            _context2.next = 27;
                            break;

                        case 23:
                            _context2.prev = 23;
                            _context2.t0 = _context2['catch'](12);
                            _didIteratorError4 = true;
                            _iteratorError4 = _context2.t0;

                        case 27:
                            _context2.prev = 27;
                            _context2.prev = 28;

                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }

                        case 30:
                            _context2.prev = 30;

                            if (!_didIteratorError4) {
                                _context2.next = 33;
                                break;
                            }

                            throw _iteratorError4;

                        case 33:
                            return _context2.finish(30);

                        case 34:
                            return _context2.finish(27);

                        case 35:
                            _context2.next = 39;
                            break;

                        case 37:
                            _context2.next = 39;
                            return res;

                        case 39:
                            _iteratorNormalCompletion3 = true;
                            _context2.next = 5;
                            break;

                        case 42:
                            _context2.next = 48;
                            break;

                        case 44:
                            _context2.prev = 44;
                            _context2.t1 = _context2['catch'](3);
                            _didIteratorError3 = true;
                            _iteratorError3 = _context2.t1;

                        case 48:
                            _context2.prev = 48;
                            _context2.prev = 49;

                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }

                        case 51:
                            _context2.prev = 51;

                            if (!_didIteratorError3) {
                                _context2.next = 54;
                                break;
                            }

                            throw _iteratorError3;

                        case 54:
                            return _context2.finish(51);

                        case 55:
                            return _context2.finish(48);

                        case 56:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _chainIterator, this, [[3, 44, 48, 56], [12, 23, 27, 35], [28,, 30, 34], [49,, 51, 55]]);
        })
    );
}

/**
 * @signature:
 * @description description
 * @param {Array|generator|dataStructures.list_core} xs - x
 * @param {Array|generator|dataStructures.list_core} ys - y
 * @return {generator} - a
 */
function concat(xs, ys) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function concatIterator() {
            var _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, x, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, y;

            return regeneratorRuntime.wrap(function concatIterator$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _iteratorNormalCompletion5 = true;
                            _didIteratorError5 = false;
                            _iteratorError5 = undefined;
                            _context3.prev = 3;
                            _iterator5 = xs[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                                _context3.next = 12;
                                break;
                            }

                            x = _step5.value;
                            _context3.next = 9;
                            return x;

                        case 9:
                            _iteratorNormalCompletion5 = true;
                            _context3.next = 5;
                            break;

                        case 12:
                            _context3.next = 18;
                            break;

                        case 14:
                            _context3.prev = 14;
                            _context3.t0 = _context3['catch'](3);
                            _didIteratorError5 = true;
                            _iteratorError5 = _context3.t0;

                        case 18:
                            _context3.prev = 18;
                            _context3.prev = 19;

                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }

                        case 21:
                            _context3.prev = 21;

                            if (!_didIteratorError5) {
                                _context3.next = 24;
                                break;
                            }

                            throw _iteratorError5;

                        case 24:
                            return _context3.finish(21);

                        case 25:
                            return _context3.finish(18);

                        case 26:
                            _iteratorNormalCompletion6 = true;
                            _didIteratorError6 = false;
                            _iteratorError6 = undefined;
                            _context3.prev = 29;
                            _iterator6 = ys[Symbol.iterator]();

                        case 31:
                            if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                                _context3.next = 38;
                                break;
                            }

                            y = _step6.value;
                            _context3.next = 35;
                            return y;

                        case 35:
                            _iteratorNormalCompletion6 = true;
                            _context3.next = 31;
                            break;

                        case 38:
                            _context3.next = 44;
                            break;

                        case 40:
                            _context3.prev = 40;
                            _context3.t1 = _context3['catch'](29);
                            _didIteratorError6 = true;
                            _iteratorError6 = _context3.t1;

                        case 44:
                            _context3.prev = 44;
                            _context3.prev = 45;

                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                _iterator6.return();
                            }

                        case 47:
                            _context3.prev = 47;

                            if (!_didIteratorError6) {
                                _context3.next = 50;
                                break;
                            }

                            throw _iteratorError6;

                        case 50:
                            return _context3.finish(47);

                        case 51:
                            return _context3.finish(44);

                        case 52:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, concatIterator, this, [[3, 14, 18, 26], [19,, 21, 25], [29, 40, 44, 52], [45,, 47, 51]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {dataStructures.list_core|dataStructures.list|dataStructures.ordered_list|Array} xs - A list
 * @param {Array} yss - An array of one or more lists
 * @return {generator} Returns a generator to be used as an
 * iterator when the list is evaluated.
 */
function concatAll(xs, yss) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function _concatAllIterator() {
            var _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, x, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, ys, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, y;

            return regeneratorRuntime.wrap(function _concatAllIterator$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _iteratorNormalCompletion7 = true;
                            _didIteratorError7 = false;
                            _iteratorError7 = undefined;
                            _context4.prev = 3;
                            _iterator7 = xs[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                                _context4.next = 12;
                                break;
                            }

                            x = _step7.value;
                            _context4.next = 9;
                            return x;

                        case 9:
                            _iteratorNormalCompletion7 = true;
                            _context4.next = 5;
                            break;

                        case 12:
                            _context4.next = 18;
                            break;

                        case 14:
                            _context4.prev = 14;
                            _context4.t0 = _context4['catch'](3);
                            _didIteratorError7 = true;
                            _iteratorError7 = _context4.t0;

                        case 18:
                            _context4.prev = 18;
                            _context4.prev = 19;

                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }

                        case 21:
                            _context4.prev = 21;

                            if (!_didIteratorError7) {
                                _context4.next = 24;
                                break;
                            }

                            throw _iteratorError7;

                        case 24:
                            return _context4.finish(21);

                        case 25:
                            return _context4.finish(18);

                        case 26:
                            _iteratorNormalCompletion8 = true;
                            _didIteratorError8 = false;
                            _iteratorError8 = undefined;
                            _context4.prev = 29;
                            _iterator8 = yss[Symbol.iterator]();

                        case 31:
                            if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
                                _context4.next = 62;
                                break;
                            }

                            ys = _step8.value;
                            _iteratorNormalCompletion9 = true;
                            _didIteratorError9 = false;
                            _iteratorError9 = undefined;
                            _context4.prev = 36;
                            _iterator9 = toArray(ys)[Symbol.iterator]();

                        case 38:
                            if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
                                _context4.next = 45;
                                break;
                            }

                            y = _step9.value;
                            _context4.next = 42;
                            return y;

                        case 42:
                            _iteratorNormalCompletion9 = true;
                            _context4.next = 38;
                            break;

                        case 45:
                            _context4.next = 51;
                            break;

                        case 47:
                            _context4.prev = 47;
                            _context4.t1 = _context4['catch'](36);
                            _didIteratorError9 = true;
                            _iteratorError9 = _context4.t1;

                        case 51:
                            _context4.prev = 51;
                            _context4.prev = 52;

                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                _iterator9.return();
                            }

                        case 54:
                            _context4.prev = 54;

                            if (!_didIteratorError9) {
                                _context4.next = 57;
                                break;
                            }

                            throw _iteratorError9;

                        case 57:
                            return _context4.finish(54);

                        case 58:
                            return _context4.finish(51);

                        case 59:
                            _iteratorNormalCompletion8 = true;
                            _context4.next = 31;
                            break;

                        case 62:
                            _context4.next = 68;
                            break;

                        case 64:
                            _context4.prev = 64;
                            _context4.t2 = _context4['catch'](29);
                            _didIteratorError8 = true;
                            _iteratorError8 = _context4.t2;

                        case 68:
                            _context4.prev = 68;
                            _context4.prev = 69;

                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }

                        case 71:
                            _context4.prev = 71;

                            if (!_didIteratorError8) {
                                _context4.next = 74;
                                break;
                            }

                            throw _iteratorError8;

                        case 74:
                            return _context4.finish(71);

                        case 75:
                            return _context4.finish(68);

                        case 76:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _concatAllIterator, this, [[3, 14, 18, 26], [19,, 21, 25], [29, 64, 68, 76], [36, 47, 51, 59], [52,, 54, 58], [69,, 71, 75]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {*} val - b
 * @param {function} [comparer] - c
 * @return {*} - d
 */
function contains(xs, val, comparer) {
    //TODO: see if there is any real performance increase by just using .includes when a comparer hasn't been passed
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, (0, _functionalHelpers.type)(comparer)) ? asArray(xs).includes(val) : asArray(xs).some(function (x) {
        return comparer(x, val);
    });
}

/**
 * @signature
 * @description d
 * @param {number} idx - a
 * @param {number} start - b
 * @param {number} end - c
 * @param {dataStructures.list_core|dataStructures.list|dataStructures.ordered_list} xs - d
 * @returns {generator} - e
 */
function copyWithin(idx, start, end, xs) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function copyWithinIterator() {
            var _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, x;

            return regeneratorRuntime.wrap(function copyWithinIterator$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _iteratorNormalCompletion10 = true;
                            _didIteratorError10 = false;
                            _iteratorError10 = undefined;
                            _context5.prev = 3;
                            _iterator10 = asArray(xs).copyWithin(idx, start, end)[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                                _context5.next = 12;
                                break;
                            }

                            x = _step10.value;
                            _context5.next = 9;
                            return x;

                        case 9:
                            _iteratorNormalCompletion10 = true;
                            _context5.next = 5;
                            break;

                        case 12:
                            _context5.next = 18;
                            break;

                        case 14:
                            _context5.prev = 14;
                            _context5.t0 = _context5['catch'](3);
                            _didIteratorError10 = true;
                            _iteratorError10 = _context5.t0;

                        case 18:
                            _context5.prev = 18;
                            _context5.prev = 19;

                            if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                _iterator10.return();
                            }

                        case 21:
                            _context5.prev = 21;

                            if (!_didIteratorError10) {
                                _context5.next = 24;
                                break;
                            }

                            throw _iteratorError10;

                        case 24:
                            return _context5.finish(21);

                        case 25:
                            return _context5.finish(18);

                        case 26:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, copyWithinIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [predicate] - b
 * @return {Number} - c
 */
function count(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, (0, _functionalHelpers.type)(predicate)) ? asArray(xs).length : asArray(xs).filter(predicate).length;
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [comparer] - b
 * @return {generator} - c
 */
function distinct(xs) {
    var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.strictEquals;

    var cached = (0, _helpers.cacher)(comparer);

    return (/*#__PURE__*/regeneratorRuntime.mark(function distinctIterator() {
            var _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, x;

            return regeneratorRuntime.wrap(function distinctIterator$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _iteratorNormalCompletion11 = true;
                            _didIteratorError11 = false;
                            _iteratorError11 = undefined;
                            _context6.prev = 3;
                            _iterator11 = xs[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
                                _context6.next = 13;
                                break;
                            }

                            x = _step11.value;

                            if (cached(x)) {
                                _context6.next = 10;
                                break;
                            }

                            _context6.next = 10;
                            return x;

                        case 10:
                            _iteratorNormalCompletion11 = true;
                            _context6.next = 5;
                            break;

                        case 13:
                            _context6.next = 19;
                            break;

                        case 15:
                            _context6.prev = 15;
                            _context6.t0 = _context6['catch'](3);
                            _didIteratorError11 = true;
                            _iteratorError11 = _context6.t0;

                        case 19:
                            _context6.prev = 19;
                            _context6.prev = 20;

                            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                _iterator11.return();
                            }

                        case 22:
                            _context6.prev = 22;

                            if (!_didIteratorError11) {
                                _context6.next = 25;
                                break;
                            }

                            throw _iteratorError11;

                        case 25:
                            return _context6.finish(22);

                        case 26:
                            return _context6.finish(19);

                        case 27:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, distinctIterator, this, [[3, 15, 19, 27], [20,, 22, 26]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {dataStructures.list_core} xs - a
 * @param {dataStructures.list_core} ys - b
 * @param {function} [comparer] - c
 * @return {boolean} - d
 */
function equals(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    var x_s = xs.data,
        y_s = ys.data;

    return x_s.length === y_s.length && x_s.every(function _checkEquality(x, idx) {
        return comparer(x, y_s[idx]);
    });
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core|dataStructures.list|dataStructures.ordered_list} xs - x
 * @param {Array|generator|dataStructures.list_core|dataStructures.list|dataStructures.ordered_list} ys - y
 * @param {function} [comparer] - z
 * @return {generator} - a
 */
function except(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    ys = toArray(ys);
    return (/*#__PURE__*/regeneratorRuntime.mark(function exceptIterator() {
            var _this = this;

            var _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _loop, _iterator12, _step12;

            return regeneratorRuntime.wrap(function exceptIterator$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _iteratorNormalCompletion12 = true;
                            _didIteratorError12 = false;
                            _iteratorError12 = undefined;
                            _context8.prev = 3;
                            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
                                var x;
                                return regeneratorRuntime.wrap(function _loop$(_context7) {
                                    while (1) {
                                        switch (_context7.prev = _context7.next) {
                                            case 0:
                                                x = _step12.value;

                                                if (ys.some(function _comparer(y) {
                                                    return comparer(x, y);
                                                })) {
                                                    _context7.next = 4;
                                                    break;
                                                }

                                                _context7.next = 4;
                                                return x;

                                            case 4:
                                            case 'end':
                                                return _context7.stop();
                                        }
                                    }
                                }, _loop, _this);
                            });
                            _iterator12 = xs[Symbol.iterator]();

                        case 6:
                            if (_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done) {
                                _context8.next = 11;
                                break;
                            }

                            return _context8.delegateYield(_loop(), 't0', 8);

                        case 8:
                            _iteratorNormalCompletion12 = true;
                            _context8.next = 6;
                            break;

                        case 11:
                            _context8.next = 17;
                            break;

                        case 13:
                            _context8.prev = 13;
                            _context8.t1 = _context8['catch'](3);
                            _didIteratorError12 = true;
                            _iteratorError12 = _context8.t1;

                        case 17:
                            _context8.prev = 17;
                            _context8.prev = 18;

                            if (!_iteratorNormalCompletion12 && _iterator12.return) {
                                _iterator12.return();
                            }

                        case 20:
                            _context8.prev = 20;

                            if (!_didIteratorError12) {
                                _context8.next = 23;
                                break;
                            }

                            throw _iteratorError12;

                        case 23:
                            return _context8.finish(20);

                        case 24:
                            return _context8.finish(17);

                        case 25:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, exceptIterator, this, [[3, 13, 17, 25], [18,, 20, 24]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {*} val - a
 * @param {number} start - b
 * @param {number} end - c
 * @param {Array|dataStructures.list_core|dataStructures.list|dataStructures.ordered_list} xs - d
 * @return {generator} - e
 */
function fill(val, start, end, xs) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function fillIterator() {
            var _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, _x4;

            return regeneratorRuntime.wrap(function fillIterator$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _iteratorNormalCompletion13 = true;
                            _didIteratorError13 = false;
                            _iteratorError13 = undefined;
                            _context9.prev = 3;
                            _iterator13 = asArray(xs).fill(val, start, end)[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done) {
                                _context9.next = 12;
                                break;
                            }

                            _x4 = _step13.value;
                            _context9.next = 9;
                            return _x4;

                        case 9:
                            _iteratorNormalCompletion13 = true;
                            _context9.next = 5;
                            break;

                        case 12:
                            _context9.next = 18;
                            break;

                        case 14:
                            _context9.prev = 14;
                            _context9.t0 = _context9['catch'](3);
                            _didIteratorError13 = true;
                            _iteratorError13 = _context9.t0;

                        case 18:
                            _context9.prev = 18;
                            _context9.prev = 19;

                            if (!_iteratorNormalCompletion13 && _iterator13.return) {
                                _iterator13.return();
                            }

                        case 21:
                            _context9.prev = 21;

                            if (!_didIteratorError13) {
                                _context9.next = 24;
                                break;
                            }

                            throw _iteratorError13;

                        case 24:
                            return _context9.finish(21);

                        case 25:
                            return _context9.finish(18);

                        case 26:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, fillIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function filter(xs, predicate) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function filterIterator() {
            var _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, _x5;

            return regeneratorRuntime.wrap(function filterIterator$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            _iteratorNormalCompletion14 = true;
                            _didIteratorError14 = false;
                            _iteratorError14 = undefined;
                            _context10.prev = 3;
                            _iterator14 = xs[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done) {
                                _context10.next = 13;
                                break;
                            }

                            _x5 = _step14.value;

                            if (!(false !== predicate(_x5))) {
                                _context10.next = 10;
                                break;
                            }

                            _context10.next = 10;
                            return _x5;

                        case 10:
                            _iteratorNormalCompletion14 = true;
                            _context10.next = 5;
                            break;

                        case 13:
                            _context10.next = 19;
                            break;

                        case 15:
                            _context10.prev = 15;
                            _context10.t0 = _context10['catch'](3);
                            _didIteratorError14 = true;
                            _iteratorError14 = _context10.t0;

                        case 19:
                            _context10.prev = 19;
                            _context10.prev = 20;

                            if (!_iteratorNormalCompletion14 && _iterator14.return) {
                                _iterator14.return();
                            }

                        case 22:
                            _context10.prev = 22;

                            if (!_didIteratorError14) {
                                _context10.next = 25;
                                break;
                            }

                            throw _iteratorError14;

                        case 25:
                            return _context10.finish(22);

                        case 26:
                            return _context10.finish(19);

                        case 27:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, filterIterator, this, [[3, 15, 19, 27], [20,, 22, 26]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [comparer] - b
 * @return {Number} - c
 */
function findIndex(xs) {
    var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.strictEquals;

    return asArray(xs).findIndex(comparer);
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [comparer] - b
 * @return {Number} - c
 */
function findLastIndex(xs) {
    var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.strictEquals;

    return asArray(xs).length - asArray(xs).reverse().findIndex(comparer);
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [predicate] - b
 * @return {*} - c
 */
function first(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate)) ? asArray(xs).find(predicate) : asArray(xs)[0];
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} fn - b
 * @param {*} [initial] - c
 * @return {*} - d
 */
function foldLeft(xs, fn) {
    var initial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    return asArray(xs).reduce(fn, initial);
}

/**
 * @signature
 * @description d
 * @param {Array|dataStructures.list_core} arr - a
 * @param {function} op - b
 * @param {*} acc - c
 * @return {*} - d
 */
function foldRight(arr, op, acc) {
    var list = asArray(arr),
        len = list.length,
        res = acc || list[--len];
    while (0 < len) {
        res = op(list[--len], res, len, list);
    }
    return res;
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array} groupObject - b
 * @param {function} queryableConstructor - c
 * @return {generator} - d
 */
function groupBy(xs, groupObject, queryableConstructor) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function groupByIterator() {
            var groupedData, _iteratorNormalCompletion15, _didIteratorError15, _iteratorError15, _iterator15, _step15, _x9;

            return regeneratorRuntime.wrap(function groupByIterator$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            //gather all data from the iterable before grouping
                            groupedData = nestLists(groupData(asArray(xs), groupObject), 0, null, queryableConstructor);
                            _iteratorNormalCompletion15 = true;
                            _didIteratorError15 = false;
                            _iteratorError15 = undefined;
                            _context11.prev = 4;
                            _iterator15 = groupedData[Symbol.iterator]();

                        case 6:
                            if (_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done) {
                                _context11.next = 13;
                                break;
                            }

                            _x9 = _step15.value;
                            _context11.next = 10;
                            return _x9;

                        case 10:
                            _iteratorNormalCompletion15 = true;
                            _context11.next = 6;
                            break;

                        case 13:
                            _context11.next = 19;
                            break;

                        case 15:
                            _context11.prev = 15;
                            _context11.t0 = _context11['catch'](4);
                            _didIteratorError15 = true;
                            _iteratorError15 = _context11.t0;

                        case 19:
                            _context11.prev = 19;
                            _context11.prev = 20;

                            if (!_iteratorNormalCompletion15 && _iterator15.return) {
                                _iterator15.return();
                            }

                        case 22:
                            _context11.prev = 22;

                            if (!_didIteratorError15) {
                                _context11.next = 25;
                                break;
                            }

                            throw _iteratorError15;

                        case 25:
                            return _context11.finish(22);

                        case 26:
                            return _context11.finish(19);

                        case 27:
                        case 'end':
                            return _context11.stop();
                    }
                }
            }, groupByIterator, this, [[4, 15, 19, 27], [20,, 22, 26]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {*} data - a
 * @param {number} depth - b
 * @param {string|null} key - c
 * @param {function} queryableConstructor - d
 * @return {Array} - e
 */
function nestLists(data, depth, key, queryableConstructor) {
    if ((0, _functionalHelpers.isArray)(data)) {
        data = data.map(function _createLists(item) {
            if (null != item.key) return nestLists(item, depth + 1, item.key, queryableConstructor);
            return item;
        });
    }
    if (0 !== depth) {
        data = queryableConstructor(data, null, null, key);
    }
    return data;
}

/**
 * @signature
 * @description d
 * @param {*} xs - a
 * @param {Array} groupObject - b
 * @return {Array} - c
 */
function groupData(xs, groupObject) {
    var sortedData = (0, _sort_util.sortData)(xs, groupObject),
        retData = [];
    sortedData.forEach(function _groupSortedData(item) {
        var grp = retData;
        groupObject.forEach(function _createGroupsByFields(group) {
            grp = findGroup(grp, group.keySelector(item));
        });
        grp.push(item);
    });

    return retData;
}

/**
 * @signature
 * @description d
 * @param {Array} arr - a
 * @param {string} field - b
 * @return {Array} - c
 */
function findGroup(arr, field) {
    var grp;
    if (arr.some(function _findGroup(group) {
        if (group.key === field) {
            grp = group;
            return true;
        }
    })) return grp;else {
        grp = [];
        grp.key = field;
        //objectSet(field, 'key', grp);
        arr.push(grp);
        return grp;
    }
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array|generator|dataStructures.list_core} ys - b
 * @param {function} xSelector - c
 * @param {function} ySelector - d
 * @param {function} projector - e
 * @param {function} listFactory - f
 * @param {function} [comparer] - g
 * @return {generator} - h
 */
function groupJoin(xs, ys, xSelector, ySelector, projector, listFactory) {
    var comparer = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _functionalHelpers.strictEquals;

    return (/*#__PURE__*/regeneratorRuntime.mark(function groupJoinIterator() {
            var groupObj, groupedY, _iteratorNormalCompletion16, _didIteratorError16, _iteratorError16, _iterator16, _step16, _x11, grp, _iteratorNormalCompletion17, _didIteratorError17, _iteratorError17, _iterator17, _step17, yGroup;

            return regeneratorRuntime.wrap(function groupJoinIterator$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            groupObj = [{ keySelector: ySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
                            groupedY = nestLists(groupData(asArray(ys), groupObj), 0, null, listFactory);
                            _iteratorNormalCompletion16 = true;
                            _didIteratorError16 = false;
                            _iteratorError16 = undefined;
                            _context12.prev = 5;
                            _iterator16 = xs[Symbol.iterator]();

                        case 7:
                            if (_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done) {
                                _context12.next = 42;
                                break;
                            }

                            _x11 = _step16.value;
                            grp = void 0;
                            _iteratorNormalCompletion17 = true;
                            _didIteratorError17 = false;
                            _iteratorError17 = undefined;
                            _context12.prev = 13;
                            _iterator17 = groupedY[Symbol.iterator]();

                        case 15:
                            if (_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done) {
                                _context12.next = 23;
                                break;
                            }

                            yGroup = _step17.value;

                            if (!comparer(xSelector(_x11), yGroup.key)) {
                                _context12.next = 20;
                                break;
                            }

                            grp = yGroup;
                            return _context12.abrupt('break', 23);

                        case 20:
                            _iteratorNormalCompletion17 = true;
                            _context12.next = 15;
                            break;

                        case 23:
                            _context12.next = 29;
                            break;

                        case 25:
                            _context12.prev = 25;
                            _context12.t0 = _context12['catch'](13);
                            _didIteratorError17 = true;
                            _iteratorError17 = _context12.t0;

                        case 29:
                            _context12.prev = 29;
                            _context12.prev = 30;

                            if (!_iteratorNormalCompletion17 && _iterator17.return) {
                                _iterator17.return();
                            }

                        case 32:
                            _context12.prev = 32;

                            if (!_didIteratorError17) {
                                _context12.next = 35;
                                break;
                            }

                            throw _iteratorError17;

                        case 35:
                            return _context12.finish(32);

                        case 36:
                            return _context12.finish(29);

                        case 37:
                            _context12.next = 39;
                            return projector(_x11, grp || listFactory([]));

                        case 39:
                            _iteratorNormalCompletion16 = true;
                            _context12.next = 7;
                            break;

                        case 42:
                            _context12.next = 48;
                            break;

                        case 44:
                            _context12.prev = 44;
                            _context12.t1 = _context12['catch'](5);
                            _didIteratorError16 = true;
                            _iteratorError16 = _context12.t1;

                        case 48:
                            _context12.prev = 48;
                            _context12.prev = 49;

                            if (!_iteratorNormalCompletion16 && _iterator16.return) {
                                _iterator16.return();
                            }

                        case 51:
                            _context12.prev = 51;

                            if (!_didIteratorError16) {
                                _context12.next = 54;
                                break;
                            }

                            throw _iteratorError16;

                        case 54:
                            return _context12.finish(51);

                        case 55:
                            return _context12.finish(48);

                        case 56:
                        case 'end':
                            return _context12.stop();
                    }
                }
            }, groupJoinIterator, this, [[5, 44, 48, 56], [13, 25, 29, 37], [30,, 32, 36], [49,, 51, 55]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array|generator|dataStructures.list_core} ys - b
 * @param {function} [comparer] - c
 * @return {generator} - d
 */
function intersect(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    return (/*#__PURE__*/regeneratorRuntime.mark(function intersectIterator() {
            var _this2 = this;

            var _iteratorNormalCompletion18, _didIteratorError18, _iteratorError18, _loop2, _iterator18, _step18;

            return regeneratorRuntime.wrap(function intersectIterator$(_context14) {
                while (1) {
                    switch (_context14.prev = _context14.next) {
                        case 0:
                            ys = toArray(ys);
                            _iteratorNormalCompletion18 = true;
                            _didIteratorError18 = false;
                            _iteratorError18 = undefined;
                            _context14.prev = 4;
                            _loop2 = /*#__PURE__*/regeneratorRuntime.mark(function _loop2() {
                                var x;
                                return regeneratorRuntime.wrap(function _loop2$(_context13) {
                                    while (1) {
                                        switch (_context13.prev = _context13.next) {
                                            case 0:
                                                x = _step18.value;

                                                if (!(!(0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, x) && ys.some(function _checkEquivalency(it) {
                                                    return comparer(x, it);
                                                }))) {
                                                    _context13.next = 4;
                                                    break;
                                                }

                                                _context13.next = 4;
                                                return x;

                                            case 4:
                                            case 'end':
                                                return _context13.stop();
                                        }
                                    }
                                }, _loop2, _this2);
                            });
                            _iterator18 = xs[Symbol.iterator]();

                        case 7:
                            if (_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done) {
                                _context14.next = 12;
                                break;
                            }

                            return _context14.delegateYield(_loop2(), 't0', 9);

                        case 9:
                            _iteratorNormalCompletion18 = true;
                            _context14.next = 7;
                            break;

                        case 12:
                            _context14.next = 18;
                            break;

                        case 14:
                            _context14.prev = 14;
                            _context14.t1 = _context14['catch'](4);
                            _didIteratorError18 = true;
                            _iteratorError18 = _context14.t1;

                        case 18:
                            _context14.prev = 18;
                            _context14.prev = 19;

                            if (!_iteratorNormalCompletion18 && _iterator18.return) {
                                _iterator18.return();
                            }

                        case 21:
                            _context14.prev = 21;

                            if (!_didIteratorError18) {
                                _context14.next = 24;
                                break;
                            }

                            throw _iteratorError18;

                        case 24:
                            return _context14.finish(21);

                        case 25:
                            return _context14.finish(18);

                        case 26:
                        case 'end':
                            return _context14.stop();
                    }
                }
            }, intersectIterator, this, [[4, 14, 18, 26], [19,, 21, 25]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {*} val - b
 * @return {generator} - c
 */
function intersperse(xs, val) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function intersperseIterator() {
            var it, next;
            return regeneratorRuntime.wrap(function intersperseIterator$(_context15) {
                while (1) {
                    switch (_context15.prev = _context15.next) {
                        case 0:
                            it = xs[Symbol.iterator](), next = it.next();

                        case 1:
                            if (next.done) {
                                _context15.next = 10;
                                break;
                            }

                            _context15.next = 4;
                            return next.value;

                        case 4:
                            next = it.next();

                            if (next.done) {
                                _context15.next = 8;
                                break;
                            }

                            _context15.next = 8;
                            return val;

                        case 8:
                            _context15.next = 1;
                            break;

                        case 10:
                        case 'end':
                            return _context15.stop();
                    }
                }
            }, intersperseIterator, this);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array|generator|dataStructures.list_core} ys - b
 * @param {function} xSelector - c
 * @param {function} ySelector - d
 * @param {function} projector - e
 * @param {function} [comparer] - f
 * @return {generator} - g
 */
function join(xs, ys, xSelector, ySelector, projector) {
    var comparer = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _functionalHelpers.strictEquals;

    return (/*#__PURE__*/regeneratorRuntime.mark(function joinIterator() {
            var _iteratorNormalCompletion19, _didIteratorError19, _iteratorError19, _iterator19, _step19, _x14, _iteratorNormalCompletion20, _didIteratorError20, _iteratorError20, _iterator20, _step20, y;

            return regeneratorRuntime.wrap(function joinIterator$(_context16) {
                while (1) {
                    switch (_context16.prev = _context16.next) {
                        case 0:
                            ys = toArray(ys);
                            _iteratorNormalCompletion19 = true;
                            _didIteratorError19 = false;
                            _iteratorError19 = undefined;
                            _context16.prev = 4;
                            _iterator19 = xs[Symbol.iterator]();

                        case 6:
                            if (_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done) {
                                _context16.next = 38;
                                break;
                            }

                            _x14 = _step19.value;
                            _iteratorNormalCompletion20 = true;
                            _didIteratorError20 = false;
                            _iteratorError20 = undefined;
                            _context16.prev = 11;
                            _iterator20 = ys[Symbol.iterator]();

                        case 13:
                            if (_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done) {
                                _context16.next = 21;
                                break;
                            }

                            y = _step20.value;

                            if (!comparer(xSelector(_x14), ySelector(y))) {
                                _context16.next = 18;
                                break;
                            }

                            _context16.next = 18;
                            return projector(_x14, y);

                        case 18:
                            _iteratorNormalCompletion20 = true;
                            _context16.next = 13;
                            break;

                        case 21:
                            _context16.next = 27;
                            break;

                        case 23:
                            _context16.prev = 23;
                            _context16.t0 = _context16['catch'](11);
                            _didIteratorError20 = true;
                            _iteratorError20 = _context16.t0;

                        case 27:
                            _context16.prev = 27;
                            _context16.prev = 28;

                            if (!_iteratorNormalCompletion20 && _iterator20.return) {
                                _iterator20.return();
                            }

                        case 30:
                            _context16.prev = 30;

                            if (!_didIteratorError20) {
                                _context16.next = 33;
                                break;
                            }

                            throw _iteratorError20;

                        case 33:
                            return _context16.finish(30);

                        case 34:
                            return _context16.finish(27);

                        case 35:
                            _iteratorNormalCompletion19 = true;
                            _context16.next = 6;
                            break;

                        case 38:
                            _context16.next = 44;
                            break;

                        case 40:
                            _context16.prev = 40;
                            _context16.t1 = _context16['catch'](4);
                            _didIteratorError19 = true;
                            _iteratorError19 = _context16.t1;

                        case 44:
                            _context16.prev = 44;
                            _context16.prev = 45;

                            if (!_iteratorNormalCompletion19 && _iterator19.return) {
                                _iterator19.return();
                            }

                        case 47:
                            _context16.prev = 47;

                            if (!_didIteratorError19) {
                                _context16.next = 50;
                                break;
                            }

                            throw _iteratorError19;

                        case 50:
                            return _context16.finish(47);

                        case 51:
                            return _context16.finish(44);

                        case 52:
                        case 'end':
                            return _context16.stop();
                    }
                }
            }, joinIterator, this, [[4, 40, 44, 52], [11, 23, 27, 35], [28,, 30, 34], [45,, 47, 51]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} [predicate] - b
 * @return {*} - c
 */
function last(xs, predicate) {
    if ((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate))) return asArray(xs).filter(predicate).slice(-1)[0];
    return asArray(xs).slice(-1)[0];
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} fn - b
 * @return {generator} - c
 */
function map(xs, fn) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function mapIterator() {
            var _iteratorNormalCompletion21, _didIteratorError21, _iteratorError21, _iterator21, _step21, _x15;

            return regeneratorRuntime.wrap(function mapIterator$(_context17) {
                while (1) {
                    switch (_context17.prev = _context17.next) {
                        case 0:
                            _iteratorNormalCompletion21 = true;
                            _didIteratorError21 = false;
                            _iteratorError21 = undefined;
                            _context17.prev = 3;
                            _iterator21 = xs[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done) {
                                _context17.next = 12;
                                break;
                            }

                            _x15 = _step21.value;
                            _context17.next = 9;
                            return fn(_x15);

                        case 9:
                            _iteratorNormalCompletion21 = true;
                            _context17.next = 5;
                            break;

                        case 12:
                            _context17.next = 18;
                            break;

                        case 14:
                            _context17.prev = 14;
                            _context17.t0 = _context17['catch'](3);
                            _didIteratorError21 = true;
                            _iteratorError21 = _context17.t0;

                        case 18:
                            _context17.prev = 18;
                            _context17.prev = 19;

                            if (!_iteratorNormalCompletion21 && _iterator21.return) {
                                _iterator21.return();
                            }

                        case 21:
                            _context17.prev = 21;

                            if (!_didIteratorError21) {
                                _context17.next = 24;
                                break;
                            }

                            throw _iteratorError21;

                        case 24:
                            return _context17.finish(21);

                        case 25:
                            return _context17.finish(18);

                        case 26:
                        case 'end':
                            return _context17.stop();
                    }
                }
            }, mapIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {string|Object|function|null|Array} dataType - b
 * @return {generator} - c
 */
function ofType(xs, dataType) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function ofTypeIterator() {
            var _checkTypeKeys, _checkItemKeys, _iteratorNormalCompletion22, _didIteratorError22, _iteratorError22, _iterator22, _step22, _x16, _iteratorNormalCompletion23, _didIteratorError23, _iteratorError23, _iterator23, _step23, _x17, _iteratorNormalCompletion24, _didIteratorError24, _iteratorError24, _iterator24, _step24, _x18, _iteratorNormalCompletion25, _didIteratorError25, _iteratorError25, _iterator25, _step25, objItem, _iteratorNormalCompletion26, _didIteratorError26, _iteratorError26, _iterator26, _step26, arr;

            return regeneratorRuntime.wrap(function ofTypeIterator$(_context18) {
                while (1) {
                    switch (_context18.prev = _context18.next) {
                        case 0:
                            _checkItemKeys = function _checkItemKeys(key) {
                                return key in dataType;
                            };

                            _checkTypeKeys = function _checkTypeKeys(key) {
                                return key in objItem;
                            };

                            if (!(dataType in _helpers.typeNames)) {
                                _context18.next = 32;
                                break;
                            }

                            _iteratorNormalCompletion22 = true;
                            _didIteratorError22 = false;
                            _iteratorError22 = undefined;
                            _context18.prev = 6;
                            _iterator22 = xs[Symbol.iterator]();

                        case 8:
                            if (_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done) {
                                _context18.next = 16;
                                break;
                            }

                            _x16 = _step22.value;

                            if (!(_helpers.typeNames[dataType] === (typeof _x16 === 'undefined' ? 'undefined' : _typeof(_x16)))) {
                                _context18.next = 13;
                                break;
                            }

                            _context18.next = 13;
                            return _x16;

                        case 13:
                            _iteratorNormalCompletion22 = true;
                            _context18.next = 8;
                            break;

                        case 16:
                            _context18.next = 22;
                            break;

                        case 18:
                            _context18.prev = 18;
                            _context18.t0 = _context18['catch'](6);
                            _didIteratorError22 = true;
                            _iteratorError22 = _context18.t0;

                        case 22:
                            _context18.prev = 22;
                            _context18.prev = 23;

                            if (!_iteratorNormalCompletion22 && _iterator22.return) {
                                _iterator22.return();
                            }

                        case 25:
                            _context18.prev = 25;

                            if (!_didIteratorError22) {
                                _context18.next = 28;
                                break;
                            }

                            throw _iteratorError22;

                        case 28:
                            return _context18.finish(25);

                        case 29:
                            return _context18.finish(22);

                        case 30:
                            _context18.next = 155;
                            break;

                        case 32:
                            if (!(0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(dataType))) {
                                _context18.next = 62;
                                break;
                            }

                            _iteratorNormalCompletion23 = true;
                            _didIteratorError23 = false;
                            _iteratorError23 = undefined;
                            _context18.prev = 36;
                            _iterator23 = xs[Symbol.iterator]();

                        case 38:
                            if (_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done) {
                                _context18.next = 46;
                                break;
                            }

                            _x17 = _step23.value;

                            if (!(_x17 === dataType)) {
                                _context18.next = 43;
                                break;
                            }

                            _context18.next = 43;
                            return _x17;

                        case 43:
                            _iteratorNormalCompletion23 = true;
                            _context18.next = 38;
                            break;

                        case 46:
                            _context18.next = 52;
                            break;

                        case 48:
                            _context18.prev = 48;
                            _context18.t1 = _context18['catch'](36);
                            _didIteratorError23 = true;
                            _iteratorError23 = _context18.t1;

                        case 52:
                            _context18.prev = 52;
                            _context18.prev = 53;

                            if (!_iteratorNormalCompletion23 && _iterator23.return) {
                                _iterator23.return();
                            }

                        case 55:
                            _context18.prev = 55;

                            if (!_didIteratorError23) {
                                _context18.next = 58;
                                break;
                            }

                            throw _iteratorError23;

                        case 58:
                            return _context18.finish(55);

                        case 59:
                            return _context18.finish(52);

                        case 60:
                            _context18.next = 155;
                            break;

                        case 62:
                            if (!(null === dataType)) {
                                _context18.next = 92;
                                break;
                            }

                            _iteratorNormalCompletion24 = true;
                            _didIteratorError24 = false;
                            _iteratorError24 = undefined;
                            _context18.prev = 66;
                            _iterator24 = xs[Symbol.iterator]();

                        case 68:
                            if (_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done) {
                                _context18.next = 76;
                                break;
                            }

                            _x18 = _step24.value;

                            if (!(dataType === _x18)) {
                                _context18.next = 73;
                                break;
                            }

                            _context18.next = 73;
                            return _x18;

                        case 73:
                            _iteratorNormalCompletion24 = true;
                            _context18.next = 68;
                            break;

                        case 76:
                            _context18.next = 82;
                            break;

                        case 78:
                            _context18.prev = 78;
                            _context18.t2 = _context18['catch'](66);
                            _didIteratorError24 = true;
                            _iteratorError24 = _context18.t2;

                        case 82:
                            _context18.prev = 82;
                            _context18.prev = 83;

                            if (!_iteratorNormalCompletion24 && _iterator24.return) {
                                _iterator24.return();
                            }

                        case 85:
                            _context18.prev = 85;

                            if (!_didIteratorError24) {
                                _context18.next = 88;
                                break;
                            }

                            throw _iteratorError24;

                        case 88:
                            return _context18.finish(85);

                        case 89:
                            return _context18.finish(82);

                        case 90:
                            _context18.next = 155;
                            break;

                        case 92:
                            if (!((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Object, (0, _functionalHelpers.type)(dataType)) && !(0, _functionalHelpers.isArray)(dataType))) {
                                _context18.next = 127;
                                break;
                            }

                            _iteratorNormalCompletion25 = true;
                            _didIteratorError25 = false;
                            _iteratorError25 = undefined;
                            _context18.prev = 96;
                            _iterator25 = xs[Symbol.iterator]();

                        case 98:
                            if (_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done) {
                                _context18.next = 111;
                                break;
                            }

                            objItem = _step25.value;

                            if (!dataType.isPrototypeOf(objItem)) {
                                _context18.next = 105;
                                break;
                            }

                            _context18.next = 103;
                            return objItem;

                        case 103:
                            _context18.next = 108;
                            break;

                        case 105:
                            if (!((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Object, (0, _functionalHelpers.type)(objItem)) && null !== objItem && Object.keys(dataType).every(_checkTypeKeys) && Object.keys(objItem).every(_checkItemKeys))) {
                                _context18.next = 108;
                                break;
                            }

                            _context18.next = 108;
                            return objItem;

                        case 108:
                            _iteratorNormalCompletion25 = true;
                            _context18.next = 98;
                            break;

                        case 111:
                            _context18.next = 117;
                            break;

                        case 113:
                            _context18.prev = 113;
                            _context18.t3 = _context18['catch'](96);
                            _didIteratorError25 = true;
                            _iteratorError25 = _context18.t3;

                        case 117:
                            _context18.prev = 117;
                            _context18.prev = 118;

                            if (!_iteratorNormalCompletion25 && _iterator25.return) {
                                _iterator25.return();
                            }

                        case 120:
                            _context18.prev = 120;

                            if (!_didIteratorError25) {
                                _context18.next = 123;
                                break;
                            }

                            throw _iteratorError25;

                        case 123:
                            return _context18.finish(120);

                        case 124:
                            return _context18.finish(117);

                        case 125:
                            _context18.next = 155;
                            break;

                        case 127:
                            if (!(0, _functionalHelpers.isArray)(dataType)) {
                                _context18.next = 155;
                                break;
                            }

                            _iteratorNormalCompletion26 = true;
                            _didIteratorError26 = false;
                            _iteratorError26 = undefined;
                            _context18.prev = 131;
                            _iterator26 = xs[Symbol.iterator]();

                        case 133:
                            if (_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done) {
                                _context18.next = 141;
                                break;
                            }

                            arr = _step26.value;

                            if (!(0, _functionalHelpers.isArray)(arr)) {
                                _context18.next = 138;
                                break;
                            }

                            _context18.next = 138;
                            return arr;

                        case 138:
                            _iteratorNormalCompletion26 = true;
                            _context18.next = 133;
                            break;

                        case 141:
                            _context18.next = 147;
                            break;

                        case 143:
                            _context18.prev = 143;
                            _context18.t4 = _context18['catch'](131);
                            _didIteratorError26 = true;
                            _iteratorError26 = _context18.t4;

                        case 147:
                            _context18.prev = 147;
                            _context18.prev = 148;

                            if (!_iteratorNormalCompletion26 && _iterator26.return) {
                                _iterator26.return();
                            }

                        case 150:
                            _context18.prev = 150;

                            if (!_didIteratorError26) {
                                _context18.next = 153;
                                break;
                            }

                            throw _iteratorError26;

                        case 153:
                            return _context18.finish(150);

                        case 154:
                            return _context18.finish(147);

                        case 155:
                        case 'end':
                            return _context18.stop();
                    }
                }
            }, ofTypeIterator, this, [[6, 18, 22, 30], [23,, 25, 29], [36, 48, 52, 60], [53,, 55, 59], [66, 78, 82, 90], [83,, 85, 89], [96, 113, 117, 125], [118,, 120, 124], [131, 143, 147, 155], [148,, 150, 154]]);
        })
    );
}

function pop(xs) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function _popIterator() {
            var it, next, last;
            return regeneratorRuntime.wrap(function _popIterator$(_context19) {
                while (1) {
                    switch (_context19.prev = _context19.next) {
                        case 0:
                            it = xs[Symbol.iterator](), next = it.next(), last = next.value;

                        case 1:
                            if ((next = it.next()).done) {
                                _context19.next = 7;
                                break;
                            }

                            _context19.next = 4;
                            return last;

                        case 4:
                            last = next.value;
                            _context19.next = 1;
                            break;

                        case 7:
                        case 'end':
                            return _context19.stop();
                    }
                }
            }, _popIterator, this);
        })
    );
}

/**
 * @signature 
 * @description -
 * @param {Array|generator|dataStructures.list_core} xs - some stuff
 * @param {Array|generator|dataStructures.list_core} ys - some other stuff
 * @return {generator} - some other other stuff
 */
function prepend(xs, ys) {
    return concat(ys, xs);
}

/**
 * @signature
 * @description d
 * @param {dataStructures.list|dataStructures.ordered_list|Array|generator} xs - A list
 * @param {Array} yss - An array of one or more lists
 * @return {generator} Returns a generator
 */
function prependAll(xs, yss) {
    return concatAll(toArray(yss[0]), yss.slice(1).concat([xs]));
}

/**
 * @signature
 * @description s
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} fn - b
 * @param {*} initial - c
 * @return {*} - d
 */
function reduceRight(xs, fn, initial) {
    return null == initial ? asArray(xs).reduceRight(fn) : asArray(xs).reduceRight(fn, initial);
}

/**
 * @signature
 * @description d
 * @param {*} item - a
 * @param {number} count - b
 * @return {generator} - c
 */
function repeat(item, count) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function repeatIterator() {
            var i;
            return regeneratorRuntime.wrap(function repeatIterator$(_context20) {
                while (1) {
                    switch (_context20.prev = _context20.next) {
                        case 0:
                            i = 0;

                        case 1:
                            if (!(i < count)) {
                                _context20.next = 7;
                                break;
                            }

                            _context20.next = 4;
                            return item;

                        case 4:
                            ++i;
                            _context20.next = 1;
                            break;

                        case 7:
                        case 'end':
                            return _context20.stop();
                    }
                }
            }, repeatIterator, this);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @return {generator} - b
 */
function reverse(xs) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function reverseIterator() {
            var _iteratorNormalCompletion27, _didIteratorError27, _iteratorError27, _iterator27, _step27, _x19;

            return regeneratorRuntime.wrap(function reverseIterator$(_context21) {
                while (1) {
                    switch (_context21.prev = _context21.next) {
                        case 0:
                            _iteratorNormalCompletion27 = true;
                            _didIteratorError27 = false;
                            _iteratorError27 = undefined;
                            _context21.prev = 3;
                            _iterator27 = asArray(xs).reverse()[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done) {
                                _context21.next = 12;
                                break;
                            }

                            _x19 = _step27.value;
                            _context21.next = 9;
                            return _x19;

                        case 9:
                            _iteratorNormalCompletion27 = true;
                            _context21.next = 5;
                            break;

                        case 12:
                            _context21.next = 18;
                            break;

                        case 14:
                            _context21.prev = 14;
                            _context21.t0 = _context21['catch'](3);
                            _didIteratorError27 = true;
                            _iteratorError27 = _context21.t0;

                        case 18:
                            _context21.prev = 18;
                            _context21.prev = 19;

                            if (!_iteratorNormalCompletion27 && _iterator27.return) {
                                _iterator27.return();
                            }

                        case 21:
                            _context21.prev = 21;

                            if (!_didIteratorError27) {
                                _context21.next = 24;
                                break;
                            }

                            throw _iteratorError27;

                        case 24:
                            return _context21.finish(21);

                        case 25:
                            return _context21.finish(18);

                        case 26:
                        case 'end':
                            return _context21.stop();
                    }
                }
            }, reverseIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {dataStructures.list_core} xs - a
 * @param {number} idx - b
 * @param {*} val - c
 * @return {generator} d
 */
function set(xs, idx, val) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function _setIterator() {
            var count, _iteratorNormalCompletion28, _didIteratorError28, _iteratorError28, _iterator28, _step28, item;

            return regeneratorRuntime.wrap(function _setIterator$(_context22) {
                while (1) {
                    switch (_context22.prev = _context22.next) {
                        case 0:
                            count = 0;
                            _iteratorNormalCompletion28 = true;
                            _didIteratorError28 = false;
                            _iteratorError28 = undefined;
                            _context22.prev = 4;
                            _iterator28 = xs[Symbol.iterator]();

                        case 6:
                            if (_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done) {
                                _context22.next = 19;
                                break;
                            }

                            item = _step28.value;

                            if (!(idx === count)) {
                                _context22.next = 13;
                                break;
                            }

                            _context22.next = 11;
                            return val;

                        case 11:
                            _context22.next = 15;
                            break;

                        case 13:
                            _context22.next = 15;
                            return item;

                        case 15:
                            ++count;

                        case 16:
                            _iteratorNormalCompletion28 = true;
                            _context22.next = 6;
                            break;

                        case 19:
                            _context22.next = 25;
                            break;

                        case 21:
                            _context22.prev = 21;
                            _context22.t0 = _context22['catch'](4);
                            _didIteratorError28 = true;
                            _iteratorError28 = _context22.t0;

                        case 25:
                            _context22.prev = 25;
                            _context22.prev = 26;

                            if (!_iteratorNormalCompletion28 && _iterator28.return) {
                                _iterator28.return();
                            }

                        case 28:
                            _context22.prev = 28;

                            if (!_didIteratorError28) {
                                _context22.next = 31;
                                break;
                            }

                            throw _iteratorError28;

                        case 31:
                            return _context22.finish(28);

                        case 32:
                            return _context22.finish(25);

                        case 33:
                            if (!(count < idx)) {
                                _context22.next = 45;
                                break;
                            }

                        case 34:
                            if (!(count <= idx)) {
                                _context22.next = 45;
                                break;
                            }

                            if (!(count !== idx)) {
                                _context22.next = 40;
                                break;
                            }

                            _context22.next = 38;
                            return undefined;

                        case 38:
                            _context22.next = 42;
                            break;

                        case 40:
                            _context22.next = 42;
                            return val;

                        case 42:
                            ++count;
                            _context22.next = 34;
                            break;

                        case 45:
                        case 'end':
                            return _context22.stop();
                    }
                }
            }, _setIterator, this, [[4, 21, 25, 33], [26,, 28, 32]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function skipWhile(xs, predicate) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function skipWhileIterator() {
            var hasFailed, _iteratorNormalCompletion29, _didIteratorError29, _iteratorError29, _iterator29, _step29, _x20;

            return regeneratorRuntime.wrap(function skipWhileIterator$(_context23) {
                while (1) {
                    switch (_context23.prev = _context23.next) {
                        case 0:
                            hasFailed = false;
                            _iteratorNormalCompletion29 = true;
                            _didIteratorError29 = false;
                            _iteratorError29 = undefined;
                            _context23.prev = 4;
                            _iterator29 = xs[Symbol.iterator]();

                        case 6:
                            if (_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done) {
                                _context23.next = 20;
                                break;
                            }

                            _x20 = _step29.value;

                            if (hasFailed) {
                                _context23.next = 15;
                                break;
                            }

                            if (predicate(_x20)) {
                                _context23.next = 13;
                                break;
                            }

                            hasFailed = true;
                            _context23.next = 13;
                            return _x20;

                        case 13:
                            _context23.next = 17;
                            break;

                        case 15:
                            _context23.next = 17;
                            return _x20;

                        case 17:
                            _iteratorNormalCompletion29 = true;
                            _context23.next = 6;
                            break;

                        case 20:
                            _context23.next = 26;
                            break;

                        case 22:
                            _context23.prev = 22;
                            _context23.t0 = _context23['catch'](4);
                            _didIteratorError29 = true;
                            _iteratorError29 = _context23.t0;

                        case 26:
                            _context23.prev = 26;
                            _context23.prev = 27;

                            if (!_iteratorNormalCompletion29 && _iterator29.return) {
                                _iterator29.return();
                            }

                        case 29:
                            _context23.prev = 29;

                            if (!_didIteratorError29) {
                                _context23.next = 32;
                                break;
                            }

                            throw _iteratorError29;

                        case 32:
                            return _context23.finish(29);

                        case 33:
                            return _context23.finish(26);

                        case 34:
                        case 'end':
                            return _context23.stop();
                    }
                }
            }, skipWhileIterator, this, [[4, 22, 26, 34], [27,, 29, 33]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|dataStructures.list_core} xs - Any iterable object that may be treated as an array
 * @param {number} [start] - A number representing the index of the array to being the slice
 * @param {number} [end] - A number representing the index of the array to end the slice
 * @return {generator} Returns a generator function that can be used to iterate the values
 * of the new sliced array one at a time.
 */
function slice(xs, start, end) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function _sliceIterator() {
            var _iteratorNormalCompletion30, _didIteratorError30, _iteratorError30, _iterator30, _step30, item;

            return regeneratorRuntime.wrap(function _sliceIterator$(_context24) {
                while (1) {
                    switch (_context24.prev = _context24.next) {
                        case 0:
                            _iteratorNormalCompletion30 = true;
                            _didIteratorError30 = false;
                            _iteratorError30 = undefined;
                            _context24.prev = 3;
                            _iterator30 = asArray(xs).slice(start, end)[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done) {
                                _context24.next = 12;
                                break;
                            }

                            item = _step30.value;
                            _context24.next = 9;
                            return item;

                        case 9:
                            _iteratorNormalCompletion30 = true;
                            _context24.next = 5;
                            break;

                        case 12:
                            _context24.next = 18;
                            break;

                        case 14:
                            _context24.prev = 14;
                            _context24.t0 = _context24['catch'](3);
                            _didIteratorError30 = true;
                            _iteratorError30 = _context24.t0;

                        case 18:
                            _context24.prev = 18;
                            _context24.prev = 19;

                            if (!_iteratorNormalCompletion30 && _iterator30.return) {
                                _iterator30.return();
                            }

                        case 21:
                            _context24.prev = 21;

                            if (!_didIteratorError30) {
                                _context24.next = 24;
                                break;
                            }

                            throw _iteratorError30;

                        case 24:
                            return _context24.finish(21);

                        case 25:
                            return _context24.finish(18);

                        case 26:
                        case 'end':
                            return _context24.stop();
                    }
                }
            }, _sliceIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array} orderObject - b
 * @return {generator} - d
 */
function sortBy(xs, orderObject) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function orderByIterator() {
            var x_s, _iteratorNormalCompletion31, _didIteratorError31, _iteratorError31, _iterator31, _step31, _x21;

            return regeneratorRuntime.wrap(function orderByIterator$(_context25) {
                while (1) {
                    switch (_context25.prev = _context25.next) {
                        case 0:
                            //gather all data from the xs before sorting
                            x_s = (0, _sort_util.sortData)(asArray(xs), orderObject);
                            _iteratorNormalCompletion31 = true;
                            _didIteratorError31 = false;
                            _iteratorError31 = undefined;
                            _context25.prev = 4;
                            _iterator31 = x_s[Symbol.iterator]();

                        case 6:
                            if (_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done) {
                                _context25.next = 13;
                                break;
                            }

                            _x21 = _step31.value;
                            _context25.next = 10;
                            return _x21;

                        case 10:
                            _iteratorNormalCompletion31 = true;
                            _context25.next = 6;
                            break;

                        case 13:
                            _context25.next = 19;
                            break;

                        case 15:
                            _context25.prev = 15;
                            _context25.t0 = _context25['catch'](4);
                            _didIteratorError31 = true;
                            _iteratorError31 = _context25.t0;

                        case 19:
                            _context25.prev = 19;
                            _context25.prev = 20;

                            if (!_iteratorNormalCompletion31 && _iterator31.return) {
                                _iterator31.return();
                            }

                        case 22:
                            _context25.prev = 22;

                            if (!_didIteratorError31) {
                                _context25.next = 25;
                                break;
                            }

                            throw _iteratorError31;

                        case 25:
                            return _context25.finish(22);

                        case 26:
                            return _context25.finish(19);

                        case 27:
                        case 'end':
                            return _context25.stop();
                    }
                }
            }, orderByIterator, this, [[4, 15, 19, 27], [20,, 22, 26]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function takeWhile(xs, predicate) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function takeWhileIterator() {
            var _iteratorNormalCompletion32, _didIteratorError32, _iteratorError32, _iterator32, _step32, _x22;

            return regeneratorRuntime.wrap(function takeWhileIterator$(_context26) {
                while (1) {
                    switch (_context26.prev = _context26.next) {
                        case 0:
                            _iteratorNormalCompletion32 = true;
                            _didIteratorError32 = false;
                            _iteratorError32 = undefined;
                            _context26.prev = 3;
                            _iterator32 = xs[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done) {
                                _context26.next = 16;
                                break;
                            }

                            _x22 = _step32.value;

                            if (!predicate(_x22)) {
                                _context26.next = 12;
                                break;
                            }

                            _context26.next = 10;
                            return _x22;

                        case 10:
                            _context26.next = 13;
                            break;

                        case 12:
                            return _context26.abrupt('break', 16);

                        case 13:
                            _iteratorNormalCompletion32 = true;
                            _context26.next = 5;
                            break;

                        case 16:
                            _context26.next = 22;
                            break;

                        case 18:
                            _context26.prev = 18;
                            _context26.t0 = _context26['catch'](3);
                            _didIteratorError32 = true;
                            _iteratorError32 = _context26.t0;

                        case 22:
                            _context26.prev = 22;
                            _context26.prev = 23;

                            if (!_iteratorNormalCompletion32 && _iterator32.return) {
                                _iterator32.return();
                            }

                        case 25:
                            _context26.prev = 25;

                            if (!_didIteratorError32) {
                                _context26.next = 28;
                                break;
                            }

                            throw _iteratorError32;

                        case 28:
                            return _context26.finish(25);

                        case 29:
                            return _context26.finish(22);

                        case 30:
                        case 'end':
                            return _context26.stop();
                    }
                }
            }, takeWhileIterator, this, [[3, 18, 22, 30], [23,, 25, 29]]);
        })
    );
}

var unfold = _decorators.unfoldWith;

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array|generator|dataStructures.list_core} ys - b
 * @param {function} comparer - c
 * @return {generator} - d
 */
function union(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    return (/*#__PURE__*/regeneratorRuntime.mark(function unionIterator() {
            var isInCache, _iteratorNormalCompletion33, _didIteratorError33, _iteratorError33, _iterator33, _step33, _x24, _iteratorNormalCompletion34, _didIteratorError34, _iteratorError34, _iterator34, _step34, y;

            return regeneratorRuntime.wrap(function unionIterator$(_context27) {
                while (1) {
                    switch (_context27.prev = _context27.next) {
                        case 0:
                            isInCache = (0, _helpers.cacher)(comparer);
                            _iteratorNormalCompletion33 = true;
                            _didIteratorError33 = false;
                            _iteratorError33 = undefined;
                            _context27.prev = 4;
                            _iterator33 = xs[Symbol.iterator]();

                        case 6:
                            if (_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done) {
                                _context27.next = 14;
                                break;
                            }

                            _x24 = _step33.value;

                            if (isInCache(_x24)) {
                                _context27.next = 11;
                                break;
                            }

                            _context27.next = 11;
                            return _x24;

                        case 11:
                            _iteratorNormalCompletion33 = true;
                            _context27.next = 6;
                            break;

                        case 14:
                            _context27.next = 20;
                            break;

                        case 16:
                            _context27.prev = 16;
                            _context27.t0 = _context27['catch'](4);
                            _didIteratorError33 = true;
                            _iteratorError33 = _context27.t0;

                        case 20:
                            _context27.prev = 20;
                            _context27.prev = 21;

                            if (!_iteratorNormalCompletion33 && _iterator33.return) {
                                _iterator33.return();
                            }

                        case 23:
                            _context27.prev = 23;

                            if (!_didIteratorError33) {
                                _context27.next = 26;
                                break;
                            }

                            throw _iteratorError33;

                        case 26:
                            return _context27.finish(23);

                        case 27:
                            return _context27.finish(20);

                        case 28:
                            _iteratorNormalCompletion34 = true;
                            _didIteratorError34 = false;
                            _iteratorError34 = undefined;
                            _context27.prev = 31;
                            _iterator34 = toArray(ys)[Symbol.iterator]();

                        case 33:
                            if (_iteratorNormalCompletion34 = (_step34 = _iterator34.next()).done) {
                                _context27.next = 41;
                                break;
                            }

                            y = _step34.value;

                            if (isInCache(y)) {
                                _context27.next = 38;
                                break;
                            }

                            _context27.next = 38;
                            return y;

                        case 38:
                            _iteratorNormalCompletion34 = true;
                            _context27.next = 33;
                            break;

                        case 41:
                            _context27.next = 47;
                            break;

                        case 43:
                            _context27.prev = 43;
                            _context27.t1 = _context27['catch'](31);
                            _didIteratorError34 = true;
                            _iteratorError34 = _context27.t1;

                        case 47:
                            _context27.prev = 47;
                            _context27.prev = 48;

                            if (!_iteratorNormalCompletion34 && _iterator34.return) {
                                _iterator34.return();
                            }

                        case 50:
                            _context27.prev = 50;

                            if (!_didIteratorError34) {
                                _context27.next = 53;
                                break;
                            }

                            throw _iteratorError34;

                        case 53:
                            return _context27.finish(50);

                        case 54:
                            return _context27.finish(47);

                        case 55:
                        case 'end':
                            return _context27.stop();
                    }
                }
            }, unionIterator, this, [[4, 16, 20, 28], [21,, 23, 27], [31, 43, 47, 55], [48,, 50, 54]]);
        })
    );
}

/**
 * @signature
 * @description d
 * @param {Array|generator|dataStructures.list_core} xs - a
 * @param {Array|generator|dataStructures.list_core} ys - b
 * @param {function} selector - c
 * @return {generator} - d
 */
function zip(xs, ys, selector) {
    return (/*#__PURE__*/regeneratorRuntime.mark(function zipIterator() {
            var idx, yArr, _iteratorNormalCompletion35, _didIteratorError35, _iteratorError35, _iterator35, _step35, _x25;

            return regeneratorRuntime.wrap(function zipIterator$(_context28) {
                while (1) {
                    switch (_context28.prev = _context28.next) {
                        case 0:
                            idx = 0;
                            yArr = toArray(ys);
                            _iteratorNormalCompletion35 = true;
                            _didIteratorError35 = false;
                            _iteratorError35 = undefined;
                            _context28.prev = 5;
                            _iterator35 = xs[Symbol.iterator]();

                        case 7:
                            if (_iteratorNormalCompletion35 = (_step35 = _iterator35.next()).done) {
                                _context28.next = 17;
                                break;
                            }

                            _x25 = _step35.value;

                            if (!(idx >= yArr.length || !yArr.length)) {
                                _context28.next = 11;
                                break;
                            }

                            return _context28.abrupt('return');

                        case 11:
                            _context28.next = 13;
                            return selector(_x25, yArr[idx]);

                        case 13:
                            ++idx;

                        case 14:
                            _iteratorNormalCompletion35 = true;
                            _context28.next = 7;
                            break;

                        case 17:
                            _context28.next = 23;
                            break;

                        case 19:
                            _context28.prev = 19;
                            _context28.t0 = _context28['catch'](5);
                            _didIteratorError35 = true;
                            _iteratorError35 = _context28.t0;

                        case 23:
                            _context28.prev = 23;
                            _context28.prev = 24;

                            if (!_iteratorNormalCompletion35 && _iterator35.return) {
                                _iterator35.return();
                            }

                        case 26:
                            _context28.prev = 26;

                            if (!_didIteratorError35) {
                                _context28.next = 29;
                                break;
                            }

                            throw _iteratorError35;

                        case 29:
                            return _context28.finish(26);

                        case 30:
                            return _context28.finish(23);

                        case 31:
                        case 'end':
                            return _context28.stop();
                    }
                }
            }, zipIterator, this, [[5, 19, 23, 31], [24,, 26, 30]]);
        })
    );
}

exports.all = all;
exports.any = any;
exports.apply = apply;
exports.binarySearch = binarySearch;
exports.chain = chain;
exports.concat = concat;
exports.concatAll = concatAll;
exports.contains = contains;
exports.copyWithin = copyWithin;
exports.count = count;
exports.distinct = distinct;
exports.equals = equals;
exports.except = except;
exports.fill = fill;
exports.filter = filter;
exports.findIndex = findIndex;
exports.findLastIndex = findLastIndex;
exports.first = first;
exports.foldLeft = foldLeft;
exports.foldRight = foldRight;
exports.groupBy = groupBy;
exports.groupJoin = groupJoin;
exports.intersect = intersect;
exports.intersperse = intersperse;
exports.join = join;
exports.last = last;
exports.map = map;
exports.ofType = ofType;
exports.pop = pop;
exports.prepend = prepend;
exports.prependAll = prependAll;
exports.reduceRight = reduceRight;
exports.repeat = repeat;
exports.reverse = reverse;
exports.set = set;
exports.skipWhile = skipWhile;
exports.slice = slice;
exports.sortBy = sortBy;
exports.takeWhile = takeWhile;
exports.unfold = unfold;
exports.union = union;
exports.zip = zip;

},{"../combinators":330,"../decorators":344,"../functionalHelpers":345,"../helpers":346,"./sort_util":342}],341:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nothing = exports.just = exports.Nothing = exports.Just = exports.Maybe = undefined;

var _Symbol$toStringTag, _just, _mutatorMap, _Symbol$toStringTag2, _nothing, _mutatorMap2;

var _combinators = require('../combinators');

var _data_structure_util = require('./data_structure_util');

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @signature
 * @description Returns a just or nothing data structure based on a loose equals null comparison. If
 * the argument passed to the function loose equals null, a nothing is returned; other wise,
 * a just.
 * @private
 * @param {*} x - Any value that should be placed inside a maybe type.
 * @return {dataStructures.just|dataStructures.nothing} - Either a just or a nothing
 */
function fromNullable(x) {
  return null != x ? Just(x) : Nothing();
}

var returnNothing = function returnNothing() {
  return nothing;
};

/**
 * @signature - :: * -> dataStructures.just|dataStructures.nothing
 * @description Factory function used to create a new object that delegates to either
 * the {@link dataStructures.just} object or the {@link dataStructures.nothing}. Any 
 * single value may be provided as an argument which will be used to set the underlying 
 * value of the new {@link dataStructures.just|dataStructures.nothing} delegator. If no 
 * argument is provided, the underlying value will be 'undefined'.
 * @namespace Maybe
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} isJust
 * @property {function} isNothing
 * @property {function} Just
 * @property {function} Nothing
 * @property {function} fromNullable
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.just|dataStructures.nothing}.
 * @return {dataStructures.just|dataStructures.nothing} - Returns a new object that delegates to the
 * {@link dataStructures.just|dataStructures.nothing}.
 */
function Maybe(val) {
  return null == val ? nothing : Object.create(just, {
    _value: { value: val }
  });
}

/**
 * @signature * -> {@link dataStructures.just}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.just} object delegator instance.
 * In the case of a Maybe, the 'correct' context simply means that a {@link dataStructures.just}
 * will be returned, even if null or undefined are given as the argument. This function can
 * be viewed as an alias for {@link dataStructures.Just}
 * @memberOf dataStructures.Maybe
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.just}.
 * @return {dataStructures.just} - Returns a new object that delegates to the
 * {@link dataStructures.just}.
 */
Maybe.of = function _of(val) {
  return Object.create(just, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    }
  });
};

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.just|dataStructures.just} delegate or not. Available on the
 * {@link dataStructures.just|dataStructures.nothing}'s factory function as dataStructures.Maybe#is
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.just|dataStructures.nothing} delegate.
 */
Maybe.is = function (f) {
  return just.isPrototypeOf(f) || nothing === f;
};

/**
 * @signature
 * @description Alias for {@link dataStructures.Maybe.of}
 * @memberOf dataStructures.Maybe
 * @function Just
 * @param {*} val - a
 * @return {just} - {@link dataStructures.just}
 */
Maybe.Just = Maybe.of;

/**
 * @signature
 * @description Creates and returns a new {@link dataStructures.nothing} data structure
 * @memberOf dataStructures.Maybe
 * @function Nothing
 * @return {dataStructures.nothing} A new {@link dataStructures.nothing}
 */
Maybe.Nothing = function () {
  return Maybe();
};

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'just' data structure
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
Maybe.isJust = function (m) {
  return just.isPrototypeOf(m);
};

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'nothing' data structure
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
Maybe.isNothing = function (m) {
  return nothing === m;
};

/**
 * @signature * -> dataStructures.left|dataStructures.right
 * @description Takes any value and returns a 'nothing' if the value
 * loose equals null; other wise returns a 'just'
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {*} [x] - a
 * @return {dataStructures.left|dataStructures.right} - b
 */
Maybe.fromNullable = fromNullable;

/**
 * @signature - :: * -> dataStructures.just
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.just} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.just}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Just
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.just}.
 * @return {dataStructures.just} - Returns a new object that delegates to the
 * {@link dataStructures.just}.
 */
function Just(val) {
  return Object.create(just, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @signature * -> {@link dataStructures.just}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.just} object delegator instance.
 * Because the just data structure does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Just}
 * @memberOf dataStructures.Just
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.just}.
 * @return {dataStructures.just} - Returns a new object that delegates to the
 * {@link dataStructures.just}.
 */
Just.of = function _of(val) {
  return Object.create(just, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    }
  });
};

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.just} delegate or not. Available on the
 * {@link dataStructures.just}'s factory function as dataStructures.Right#is
 * @memberOf dataStructures.Just
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.just} delegate.
 */
Just.is = function (f) {
  return just.isPrototypeOf(f);
};

/**
 * @signature - :: * -> dataStructures.nothing
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.nothing} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.nothing}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Nothing
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @return {dataStructures.nothing} - Returns a new object that delegates to the
 * {@link dataStructures.nothing}.
 */
function Nothing() {
  return nothing;
}

/**
 * @signature * -> {@link dataStructures.nothing}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.nothing} object delegator instance.
 * Because the nothing data structure does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Nothing}
 * @memberOf dataStructures.Nothing
 * @static
 * @function of
 * @return {dataStructures.nothing} - Returns a new object that delegates to the
 * {@link dataStructures.nothing}.
 */
Nothing.of = Nothing;

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is a {@link dataStructures.nothing}.
 * Available on the {@link left}'s factory function as dataStructures.Nothing#is
 * @memberOf dataStructures.Nothing
 * @function is
 * @param {*} [n] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.nothing} delegate.
 */
Nothing.is = function (n) {
  return nothing === n;
};

/**
 * @typedef {Object} just
 * @property {function} value - returns the underlying value of the just
 * @property {function} map - maps a single function over the underlying value of the just
 * @property {function} bimap
 * @property {function} extract
 * @property {function} valueOf - returns the underlying value of the just; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the just and its underlying value
 * @property {function} factory - a reference to the just factory function
 * @property {function} [Symbol.Iterator] - Iterator for the just
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace just
 * @description This is the delegate object that specifies the behavior of the just data structure. All
 * operations that may be performed on a just 'instance' delegate to this object. Just
 * 'instances' are created by the {@link dataStructures.Just|dataStructures.Nothing} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an just instance beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var just = (_just = {
  /**
   * @signature () -> *
   * @description Returns the underlying value of a just instance. This
   * getter is not expected to be used directly by consumers - it is meant as an internal
   * access only. To manipulate the underlying value of a just,
   * see {@link dataStructures.just#map} and {@link dataStructures.just#bimap}. To
   * retrieve the underlying value of a 'just', see {@link dataStructures.just#get},
   * {@link dataStructures.just#orElse}, {@link dataStructures.just#getOrElse},
   * and {@link dataStructures.just#valueOf}.
   * @memberOf dataStructures.just
   * @instance
   * @protected
   * @function
   * @return {*} Returns the underlying value of the delegator. May be any value.
   */
  get value() {
    return this._value;
  },
  get extract() {
    return this.value;
  },
  isJust: true,
  isNothing: false,
  /**
   * @signature () -> {@link dataStructures.just}
   * @description Takes a function that is applied to the underlying value of the
   * 'just' instance, the result of which is used to create a new {@link dataStructures.just}
   * instance.
   * @memberOf dataStructures.just
   * @instance
   * @param {function} fn - A mapping function that can operate on the underlying
   * value of the {@link dataStructures.just}.
   * @return {dataStructures.just} Returns a new {@link dataStructures.just}
   * delegator whose underlying value is the result of the mapping operation
   * just performed.
   *
   * @example Just(10).map(x => x * x)    // => Just(100)
   */
  map: _data_structure_util.sharedMaybeFns.justMap,
  /**
   * @signature () -> {@link dataStructures.just}
   * @description Accepts a mapping function as an argument, applies the function to the
   * underlying value. If the mapping function returns a just data structure, chain will 'flatten'
   * the nested justs by one level. If the mapping function does not return a just,
   * chain will return a just data structure that 'wraps' whatever the return value
   * of the mapping function is. However, if the mapping function does not return a data structure  of
   * the same type, then chain is probably not the functionality you should use. See
   * {@link dataStructures.just#map} instead.
   *
   * Alias: bind, flatMap
   * @memberOf dataStructures.just
   * @instance
   * @function chain
   * @param {function} fn - A mapping function that returns a data structure of the same type
   * @return {Object} Returns a new identity data structure that 'wraps' the return value of the
   * mapping function after flattening it by one level.
   *
   * @example
   * Just(10).chain(x => Just(x * x))         // => Just(100)
   * Just(10).chain(x => x * x)               // => Just(100)
   * Just(10).chain(x => Identity(x * x))     // => Just(Identity(100))
   */
  chain: _data_structure_util.chain,
  /**
   * @signature () -> {@link dataStructures.just}
   * @description Returns a new just data structure. If the current just is nested, join
   * will flatten it by one level. Very similar to {@link dataStructures.just#chain} except no
   * mapping function is accepted or run.
   * @memberOf dataStructures.just
   * @instance
   * @function mjoin
   * @return {Object} Returns a new identity after flattening the nested data structures by one level.
   *
   * @example
   * Just(Just(10)).join()        // => Just(10)
   * Just(Identity(10)).join()    // => Just(Identity(10))
   * Just(10).join()              // => Identity(10)
   */
  mjoin: _data_structure_util.join,
  /**
   * @signature Object -> Object
   * @description Accepts any applicative object with a mapping function and invokes that object's mapping
   * function on the just's underlying value. In order for this function to execute properly and
   * not throw, the just's underlying value must be a function that can be used as a mapping function
   * on the data structure supplied as the argument.
   *
   * Alias: ap
   * @memberOf dataStructures.just
   * @instance
   * @function apply
   * @param {Object} ma - Any data structure with a map function - i.e. a functor.
   * @return {Object} Returns an instance of the data structure object provide as an argument.
   *
   * @example Just(x => x + 10).apply(Identity(10))  // => Identity(20)
   */
  apply: _data_structure_util.apply,
  /**
   * @signature (* -> *) -> (* -> *) -> dataStructures.just<T>
   * @description Acts as a map for the disjunction between just and nothing data structures. If the
   * data structure that bimap was invoked on is a just, the first mapping function parameter is used 
   * to map over the underlying value and a new just is returned, 'wrapping' the return value of the 
   * function. If the data structure is a nothing, the second mapping function is invoked with a 'null' 
   * valued argument and 'nothing' is returned.
   * @memberOf dataStructures.just
   * @instance
   * @function
   * @param {function} f - A function that will be used to map over the underlying data of the
   * {@link dataStructures.just} delegator.
   * @param {function} g - A function that will be used to map over a null value if this is a
   * 'nothing' instance.
   * @return {dataStructures.just} - Returns a new {@link dataStructures.just} delegator after applying
   * the mapping function to the underlying data.
   */
  bimap: _data_structure_util.sharedMaybeFns.justBimap,
  /**
   * @signature () -> *
   * @description Accepts a function that is used to map over the just's underlying value
   * and returns the value of the function without 're-wrapping' it in a new just
   * instance.
   *
   * Alias: reduce
   * @memberOf dataStructures.just
   * @instance
   * @function fold
   * @param {function} fn - Any mapping function that should be applied to the underlying value
   * of the just.
   * @param {*} acc - An JavaScript value that should be used as an accumulator.
   * @return {*} Returns the return value of the mapping function provided as an argument.
   *
   * @example Just(10).fold((acc, x) => x + acc, 5)   // => 15
   */
  fold: function _fold(fn, acc) {
    return fn(acc, this.value);
  },
  /**
   * @signature just -> M<just<T>>
   * @description Returns a data structure of the type passed as an argument that 'wraps'
   * and identity object that 'wraps' the current just's underlying value.
   * @memberOf dataStructures.just
   * @instance
   * @function sequence
   * @param {Object} p - Any pointed data structure with a '#of' function property
   * @return {Object} Returns a data structure of the type passed as an argument that 'wraps'
   * a just that 'wraps' the current just's underlying value.
   */
  sequence: function _sequence(p) {
    return this.traverse(_combinators.identity, p);
  },
  /**
   * @signature Object -> () -> Object
   * @description Accepts a pointed data structure with a '#of' function property and a mapping function. The mapping
   * function is applied to the just's underlying value. The mapping function should return a data structure
   * of any type. Then the {@link dataStructures.Just.of} function is used to map over the returned data structure. Essentially
   * creating a new object of type: M<Just<T>>, where 'M' is the type of data structure the mapping
   * function returns.
   * @memberOf dataStructures.just
   * @instance
   * @function traverse
   * @param {Object} a - A pointed data structure with a '#of' function property. Used only in cases
   * where the mapping function cannot be run.
   * @param {function} f - A mapping function that should be applied to the just's underlying value.
   * @return {Object} Returns a new just that wraps the mapping function's returned data structure type.
   *
   * @example Just(10).traverse(Identity, x => Identity(x * x))   // => Identity(Just(100))
   */
  traverse: function _traverse(a, f) {
    return f(this.value).map(this.factory.of);
  },
  /**
   * @signature (b -> a) -> dataStructures.Just
   * @description This property is for contravariant just data structures and will not function
   * correctly if the underlying value is anything other than a function. Contramap accepts a
   * function argument and returns a new just with the composition of the function argument and
   * the underlying function value as the new underlying. The supplied function argument is executed
   * first in the composition, so its signature must be (b -> a) so that the value it passes as an
   * argument to the previous underlying function will be of the expected type.
   * @memberOf dataStructures.just
   * @instance
   * @function contramap
   * @param {function} fn - A function that should be composed with the current just's
   * underlying function.
   * @return {dataStructures.just} Returns a new just data structure.
   *
   * @example Just(x => x * x).contramap(x => x + 10).apply(Just(5))  // => Just(225)
   */
  contramap: _data_structure_util.contramap,
  /**
   * @signature dimap :: (b -> a) -> (d -> c) -> just<c>
   * @description Like {@link dataStructures.just#contramap}, dimap is for use on contravariant
   * identity instances, and thus, requires that the just instance dimap is invoked on has an
   * underlying function value. Dimap accepts two arguments, both of them functions. The first argument
   * is used to map over the input the current contravariant just, while the second argument maps
   * over the output. Dimap is like contramap, but with an additional mapping thrown in after it has run.
   * Thus, dimap can be derived from contramap and map: j.dimap(f, g) === i.contramap(f).map(g)
   * @memberOf dataStructures.just
   * @instance
   * @function dimap
   * @param {function} f - f
   * @param {function} g - g
   * @return {dataStructures.just} l
   *
   * @example Just(x => x * x).dimap(x => x + 10, x => x / 5).apply(Just(5))  // => Just(45)
   */
  dimap: _data_structure_util.dimap,
  /**
   * @signature * -> boolean
   * @description Determines if the current 'just' is equal to another data structure. Equality
   * is defined as:
   * 1) The other data structure shares the same delegate object as 'this'
   * 2) Both underlying values are strictly equal to each other
   * @memberOf dataStructures.just
   * @instance
   * @function
   * @param {Object} ma - The other data structure to check for equality with
   * @return {boolean} - Returns a boolean indicating equality
   */
  equals: (0, _data_structure_util.disjunctionEqualMaker)('isJust'),
  /**
   * @signature () -> *
   * @description Returns the underlying value of the current just 'instance'. This
   * function property is not meant for explicit use. Rather, the JavaScript engine uses
   * this property during implicit coercion like addition and concatenation.
   * @memberOf dataStructures.just
   * @instance
   * @function
   * @return {*} Returns the underlying value of the current 'just' 'instance'.
   */
  valueOf: _data_structure_util.valueOf,
  /**
   * @signature () -> string
   * @description Returns a string representation of the 'just' and its underlying value
   * @memberOf dataStructures.just
   * @instance
   * @function
   * @return {string} Returns a string representation of the just and its underlying value.
   */
  toString: (0, _data_structure_util.stringMaker)('Just')
}, _Symbol$toStringTag = Symbol.toStringTag, _mutatorMap = {}, _mutatorMap[_Symbol$toStringTag] = _mutatorMap[_Symbol$toStringTag] || {}, _mutatorMap[_Symbol$toStringTag].get = function () {
  return 'Just';
}, _defineProperty(_just, 'factory', Maybe), _defineEnumerableProperties(_just, _mutatorMap), _just);

/**
 * @typedef {Object} nothing
 * @property {function} value - returns the underlying value of the 'nothing' data structure (always null)
 * @property {function} map - maps a single function over the underlying value of the 'nothing'
 * @property {function} bimap
 * @property {function} extract
 * @property {function} valueOf - returns the underlying value of the 'nothing'; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the 'nothing' and its underlying value
 * @property {function} factory - a reference to the 'nothing' factory function
 * @property {function} [Symbol.Iterator] - Iterator for the 'nothing'
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace nothing
 * @description This is the delegate object that specifies the behavior of the 'nothing' data structure. All
 * operations that may be performed on a 'nothing' delegate to this object. Nothing 'instances' are created by 
 * the {@link dataStructures.Nothing|dataStructures.Maybe} factory function via Object.create, during which 
 * the underlying value is placed directly on the newly created object. No other properties exist directly on 
 * the 'nothing' data structure beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var nothing = (_nothing = {
  /**
   * @signature () -> *
   * @description Returns the underlying value of a 'nothing' data structure. This
   * getter is not expected to be used directly by consumers - it is meant as an internal
   * access only. To manipulate the underlying value of a 'nothing', see {@link dataStructures.nothing#map} 
   * and {@link dataStructures.nothing#bimap}. To retrieve the underlying value of a
   * 'nothing', see {@link dataStructures.nothing#get}, {@link dataStructures.nothing#orElse}, 
   * {@link dataStructures.nothing#getOrElse}, and {@link dataStructures.nothing#valueOf}.
   * @memberOf dataStructures.nothing
   * @instance
   * @protected
   * @function
   * @return {*} Returns the underlying value of the delegator. May be any value.
   */
  value: null,
  /**
   *
   */
  isJust: false,
  /**
   *
   */
  isNothing: true,
  /**
   * @signature () -> {@link dataStructures.nothing}
   * @description Takes a single function as an argument and returns 'nothing'. A 'nothing' cannot
   * be mapped over, so the result of the mapping operation is to return 'nothing' while ignoring
   * the provided function argument.
   * @memberOf dataStructures.nothing
   * @instance
   * @param {function} fn - A mapping function that can operate on the underlying
   * value of the {@link dataStructures.nothing}.
   * @return {dataStructures.nothing} Returns a new {@link dataStructures.nothing}
   * delegator whose underlying value is the result of the mapping operation
   * just performed.
   */
  map: returnNothing,
  /**
   * @signature (* -> *) -> (* -> *) -> dataStructures.nothing<T>
   * @description Acts as a map for the disjunction between just and nothing data structures. If the
   * data structure that bimap was invoked on is a just, the first mapping function parameter is used 
   * to map over the underlying value and a new just is returned, 'wrapping' the return value of the 
   * function. If the data structure is a nothing, the second mapping function is invoked with a 'null' 
   * valued argument and 'nothing' is returned.
   * @memberOf dataStructures.nothing
   * @instance
   * @function
   * @param {function} f - A function that will be used to map over the underlying data of the
   * {@link dataStructures.just} delegator.
   * @param {function} g - A function that will be used to map over a null value if this is a
   * 'nothing' instance.
   * @return {dataStructures.just} - Returns a new {@link dataStructures.just} delegator after applying
   * the mapping function to the underlying data.
   */
  bimap: returnNothing,
  chain: returnNothing,
  mjoin: returnNothing,
  apply: returnNothing,
  fold: function _fold(fn) {
    return Nothing();
  },
  sequence: function _sequence(p) {
    return this.traverse(p, p.of);
  },
  traverse: function _traverse(a, f) {
    return a.of(Maybe.Nothing());
  },
  nothing: returnNothing,
  /**
   * @signature * -> boolean
   * @description Determines if 'this' nothing is equal to another data structure. Equality
   * is defined as:
   * 1) The other monad shares the same delegate object as 'this' nothing monad
   * 2) Both underlying values are strictly equal to each other
   * Since 'nothing' is a singleton, the actual operation is a strict equality comparison
   * between the both data structures; if they both point to the same place in memory, they
   * are equal.
   * @memberOf dataStructures.nothing
   * @instance
   * @function
   * @param {Object} ma - The other data structure to check for equality.
   * @return {boolean} - Returns a boolean indicating equality
   */
  equals: Nothing.is,
  /**
   * @signature () -> *
   * @description Returns the underlying value of the current 'nothing' 'instance'. This
   * function property is not meant for explicit use. Rather, the JavaScript engine uses
   * this property during implicit coercion like addition and concatenation.
   * @memberOf dataStructures.nothing
   * @instance
   * @function
   * @return {*} Returns the underlying value of the 'nothing'
   */
  valueOf: _data_structure_util.valueOf,
  /**
   * @signature () -> string
   * @description Returns a string representation of the 'nothing' and its underlying value
   * @memberOf dataStructures.nothing
   * @instance
   * @function
   * @return {string} Returns a string representation of the 'nothing' and its underlying value.
   */
  toString: function _toString() {
    return 'Nothing()';
  }
}, _Symbol$toStringTag2 = Symbol.toStringTag, _mutatorMap2 = {}, _mutatorMap2[_Symbol$toStringTag2] = _mutatorMap2[_Symbol$toStringTag2] || {}, _mutatorMap2[_Symbol$toStringTag2].get = function () {
  return 'Nothing';
}, _defineProperty(_nothing, 'factory', Maybe), _defineEnumerableProperties(_nothing, _mutatorMap2), _nothing);

just.ap = just.apply;
just.fmap = just.chain;
just.flapMap = just.chain;
just.bind = just.chain;
just.reduce = just.fold;

nothing.ap = nothing.apply;
nothing.fmap = nothing.chain;
nothing.flapMap = nothing.chain;
nothing.bind = nothing.chain;
nothing.reduce = nothing.fold;

just.constructor = just.factory;
nothing.constructor = nothing.factory;

exports.Maybe = Maybe;
exports.Just = Just;
exports.Nothing = Nothing;
exports.just = just;
exports.nothing = nothing;

},{"../combinators":330,"./data_structure_util":333}],342:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createSortObject = exports.insertionSort = exports.mergeSort = exports.quickSort = exports.sortData = undefined;

var _helpers = require('../helpers');

/** @module sort_util */

var sort_obj = {};

function createSortObject(selector, comparer, direction) {
    return Object.create(sort_obj, {
        keySelector: {
            value: selector
        },
        comparer: {
            value: comparer
        },
        direction: {
            value: direction
        }
    });
}

/**
 * @signature
 * @description d
 * @param {Array} data - a
 * @param {Array} sortObject - b
 * @return {Array} - Returns an array sorted on 'n' fields in either ascending or descending
 * order for each field as specified in the 'sortObject' parameter
 */
function sortData(data, sortObject) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
        var comparer = 'function' === typeof sort.comparer ? sort.comparer : _helpers.sortComparer;
        if (0 === index) sortedData = 5001 > data.length ? insertionSort(data, sort.keySelector, comparer, sort.direction) : mergeSort(data, sort.keySelector, comparer, sort.direction);
        //if (index === 0) sortedData = quickSort(data, sort.direction, sort.keySelector, comparer);
        else {
                var sortedSubData = [],
                    itemsToSort = [],
                    prevKeySelector = sortObject[index - 1].keySelector;
                sortedData.forEach(function _sortData(item, idx) {
                    //TODO: re-examine this logic; I think it is in reverse order
                    if (!itemsToSort.length || 0 === comparer(prevKeySelector(itemsToSort[0]), prevKeySelector(item), sort.direction)) itemsToSort.push(item);else {
                        if (1 === itemsToSort.length) sortedSubData = sortedSubData.concat(itemsToSort);else {
                            sortedSubData = sortedSubData.concat(5001 > itemsToSort.length ? insertionSort(itemsToSort, sort.keySelector, comparer, sort.direction) : mergeSort(itemsToSort, sort.keySelector, comparer, sort.direction));
                            //sortedSubData = sortedSubData.concat(quickSort(itemsToSort, sort.direction, sort.keySelector, comparer));
                        }
                        itemsToSort.length = 0;
                        itemsToSort[0] = item;
                    }
                    if (idx === sortedData.length - 1) {
                        sortedSubData = sortedSubData.concat(5001 > itemsToSort.length ? insertionSort(itemsToSort, sort.keySelector, comparer, sort.direction) : mergeSort(itemsToSort, sort.keySelector, comparer, sort.direction));
                    }
                });
                sortedData = sortedSubData;
            }
    });
    return sortedData;
}

/**
 * @signature
 * @description d
 * @param {Array} data - a
 * @param {function} keySelector - b
 * @param {function} comparer - c
 * @param {number} direction - d
 * @return {Array} - e
 */
function mergeSort(data, keySelector, comparer, direction) {
    if (2 > data.length) return data;
    var middle = parseInt(data.length / 2);
    return merge(mergeSort(data.slice(0, middle), keySelector, comparer, direction), mergeSort(data.slice(middle), keySelector, comparer, direction), keySelector, comparer, direction);
}

/**
 * @signature
 * @description d
 * @param {Array} left - a
 * @param {Array} right - b
 * @param {function} keySelector - c
 * @param {function} comparer - d
 * @param {number} direction - e
 * @return {Array} - f
 */
function merge(left, right, keySelector, comparer, direction) {
    if (!left.length) return right;
    if (!right.length) return left;

    if (-1 < comparer(keySelector(left[0]), keySelector(right[0]), direction)) return [(0, _helpers.deepClone)(left[0])].concat(merge(left.slice(1, left.length), right, keySelector, comparer, direction));
    return [(0, _helpers.deepClone)(right[0])].concat(merge(left, right.slice(1, right.length), keySelector, comparer, direction));
}

/**
 * @signature
 * @description d
 * @param {Array} source - a
 * @param {number} dir - b
 * @param {function} keySelector - c
 * @param {function} keyComparer - d
 * @return {Array} - Returns a sort array
 */
function quickSort(source, dir, keySelector, keyComparer) {
    if (0 === source.length) return source;
    var i = 0,
        copy = [];

    while (i < source.length) {
        copy[i] = source[i];
        ++i;
    }
    _quickSort(copy, 0, source.length - 1, keySelector, keyComparer, dir);
    return copy;
}

/**
 * @signature
 * @description d
 * @param {Array} data - a
 * @param {number} left - b
 * @param {number} right - c
 * @param {function} selector - f
 * @param {function} comparer - g
 * @param {number} dir - d
 * @return {Array} - h
 */
function _quickSort(data, left, right, selector, comparer, dir) {
    do {
        var i = left;
        var j = right;
        var currIdx = i + (j - i >> 1),
            curr = selector(data[currIdx]);

        do {
            while (i < data.length && 0 < comparer(selector, currIdx, i, curr, data, dir)) {
                ++i;
            }while (0 <= j && 0 > comparer(selector, currIdx, j, curr, data, dir)) {
                --j;
            }if (i > j) break;
            if (i < j) {
                var temp = data[i];
                data[i] = data[j];
                data[j] = temp;
            }
            i++;
            j--;
        } while (i <= j);
        if (j - left <= right - i) {
            if (left < j) _quickSort(data, left, j, selector, comparer, dir);
            left = i;
        } else {
            if (i < right) _quickSort(data, i, right, selector, comparer, dir);
            right = j;
        }
    } while (left < right);
}

/**
 * @signature
 * @description d
 * @param {Array} source - a
 * @param {function} keySelector - b
 * @param {function} keyComparer - c
 * @param {string} direction - d
 * @return {Array} - e
 */
function insertionSort(source, keySelector, keyComparer, direction) {
    if (0 === source.length) return source;
    var i = 0,
        copy = [];

    while (i < source.length) {
        copy[i] = source[i];
        ++i;
    }
    return _insertionSort(copy, keySelector, keyComparer, direction);
}

/**
 * @signature
 * @description d
 * @param {Array} source - a
 * @param {function} keySelector - b
 * @param {function} keyComparer - c
 * @param {string} direction - d
 * @return {Array} e
 */
function _insertionSort(source, keySelector, keyComparer, direction) {
    var i, j, item, val;
    for (i = 1; i < source.length; ++i) {
        item = source[i];
        val = keySelector(source[i]);
        j = i - 1;
        while (0 <= j && 0 > keyComparer(keySelector(source[j]), val, direction)) {
            source[j + 1] = source[j];
            --j;
        }
        source[j + 1] = item;
    }
    return source;
}

exports.sortData = sortData;
exports.quickSort = quickSort;
exports.mergeSort = mergeSort;
exports.insertionSort = insertionSort;
exports.createSortObject = createSortObject;

},{"../helpers":346}],343:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validation = exports.Validation = undefined;

var _Symbol$toStringTag, _validation, _mutatorMap;

var _data_structure_util = require('./data_structure_util');

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @description d
 * @namespace Validation
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @param {*} val - a
 * @return {dataStructures.validation} - b
 */
function Validation(val) {
    return Object.create(validation, {
        _value: {
            value: val
        }
    });
}

/**
 * @description d
 * @memberOf dataStructures.Validation
 * @param {*} val - a
 * @return {dataStructures.validation} - b
 */
Validation.of = function _of(val) {
    return Validation(val);
};

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Validation
 * @param {Object} f - a
 * @return {boolean} - b
 */
Validation.is = function (f) {
    return validation.isPrototypeOf(f);
};

/**
 * @description d
 * @namespace validation
 * @memberOf dataStructures
 */
var validation = (_validation = {
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    valueOf: _data_structure_util.valueOf,
    equals: _data_structure_util.equals,
    toString: (0, _data_structure_util.stringMaker)('Validation')
}, _Symbol$toStringTag = Symbol.toStringTag, _mutatorMap = {}, _mutatorMap[_Symbol$toStringTag] = _mutatorMap[_Symbol$toStringTag] || {}, _mutatorMap[_Symbol$toStringTag].get = function () {
    return 'Validation';
}, _defineProperty(_validation, 'factory', Validation), _defineEnumerableProperties(_validation, _mutatorMap), _validation);

/**
 * @signature
 * @description Since the constant functor does not represent a disjunction, the Validation's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @memberOf dataStructures.validation
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {validation} - c
 */
validation.bimap = validation.map;

validation.chain = _data_structure_util.chain;
validation.mjoin = _data_structure_util.join;
validation.apply = _data_structure_util.monad_apply;
validation.constructor = validation.factory;

exports.Validation = Validation;
exports.validation = validation;

},{"./data_structure_util":333}],344:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.voidFn = exports.unfoldWith = exports.unfold = exports.unary = exports.tryCatch = exports.ternary = exports.tap = exports.safe = exports.rightApply = exports.repeat = exports.once = exports.not = exports.maybe = exports.leftApply = exports.lateApply = exports.hyloWith = exports.guard = exports.bindWith = exports.bindFunction = exports.binary = exports.before = exports.apply = exports.after = undefined;

var _combinators = require('./combinators');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** @module decorators */

/**
 * @signature ((*... -> a)) -> (*... -> a) -> [*] -> a
 * @description Used as a helper function, invoker takes any function that
 * requires a single function argument and one or more additional parameters
 * and partially applies that function.
 * @note This function is partially applied, not curried.
 * @see apply
 * @param {function} func - A non-curried, non-partially applied function
 * that expects at least two arguments
 * @return {function} - Returns a function that has turned the 'func' param
 * into a partially applied function.
 */
var invoker = function invoker(func) {
  return function (fn) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return func.apply(undefined, [fn].concat(args));
    };
  };
};

/**
 * @signature (*... -> a) -> (*... -> a) -> [*] -> a
 * @description A curried function that takes two functions and
 * n arguments to apply both functions to. The first function is
 * applied to the arguments, followed by the second. The return value
 * is equal to the return value of the first function's invocation.
 * @function after
 * @param {function} fn - A function that should be applied to the arguments. The return
 * value is equal to this function's return value.
 * @param {function} decoration - A function that should be applied to the arguments after
 * the first function; the return value is ignored.
 * @param {*} args - The arguments that each function should be invoked with.
 * @return {*} - The return value of the first function.
 */
var after = _combinators.curryN.call(undefined, 3, function _after(fn, decoration) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  var ret = fn.apply(undefined, args);
  decoration.apply(undefined, args);
  return ret;
});

/**
 * @signature (*... -> a) -> [*] -> a
 * @description A partially applied function that takes a function and any arguments
 * and returns the result of apply the function to the arguments.
 * @note This function is partially applied, not curried.
 * @function apply
 * @param {function} fn - The function that should be applied to the arguments.
 * @return {function} - The result of applying the function to the arguments.
 */
var apply = invoker(function (fn) {
  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return fn.apply(undefined, args);
});

/**
 * @signature (* -> *) -> (* -> *) -> [*] -> *
 * @description d
 * @function before
 * @param {function} fn - a
 * @param {function} decoration - b
 * @param {*} args - c
 * @return {*} - d
 */
var before = _combinators.curryN.call(undefined, 3, function _before(fn, decoration) {
  for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    args[_key4 - 2] = arguments[_key4];
  }

  decoration.apply(undefined, args);
  return fn.apply(undefined, args);
});

/**
 * @signature (*... -> a) -> (*...) -> a
 * @description Takes a non-curried function of any arity and turns it
 * into a binary, curried function.
 * @function binary
 * @param {function} fn - The function that should be made binary.
 * @param {*} args - The arguments that should be applied to the new
 * binary function.
 * @return {function} - A function waiting for both arguments to be applied.
 */
var binary = function binary(fn) {
  for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  return _combinators.curryN.call.apply(_combinators.curryN, [undefined, 2, fn].concat(args));
};

/**
 * @signature {*} -> (* -> *) -> (* -> *)
 * @description A curried function that takes an object context and
 * a function and returns the function bound to the context of the
 * object.
 * @function bindFunction
 * @param {object} context - The context the function should be
 * invoked with.
 * @param {function} fn - The function that should be bound to the
 * context of the object.
 * @return {function} - A function, bound to the provided context,
 * waiting to be invoked.
 */
var bindFunction = (0, _combinators.curry)(function _bindFunction(context, fn) {
  return fn.bind(context);
});

/**
 * @signature {*} -> (* -> *) -> (* -> *)
 * @description A curried function that takes an object context and
 * a function and returns the function bound to the context of the
 * object.
 * @function bindWith
 * @param {function} fn - The function that should be bound to the
 * context of the object.
 * @param {object} context - The context the function should be
 * invoked with.
 * @return {function} - A function, bound to the provided context,
 * waiting to be invoked.
 */
var bindWith = (0, _combinators.curry)(function _bindWith(fn, context) {
  return bindFunction(context, fn);
});

/*
function guardAfter(...fns) {
    return function waitForArgs(...args) {
        if (fns.reverse().slice(1).every(function _functionRunner(fn) {
                return fn(...args);
            })) return fns[fns.length - 1](...args);
    };
}
*/

/**
 * @signature (* -> *), (* -> *), ... (* -> *) -> [*] -> *
 * @description Accepts one or more functions to be executed with
 * zero or more arguments, and will only invoke the first function argument
 * if all the other functions return a truthy value. If all the functions
 * return truthy, the return value is the result of apply the first function
 * argument to the parameters provided; otherwise the result is 'undefined'.
 * @note This function is partially applied, not curried.
 * @param {function} fns - One or more functions that should be applied to the arguments.
 * @return {function} - A function waiting for the arguments to be provided.
 */
function guard() {
  for (var _len6 = arguments.length, fns = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    fns[_key6] = arguments[_key6];
  }

  return function waitForArgs() {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    if (1 === fns.length || fns.slice(1).every(function _functionRunner(fn) {
      return fn.apply(undefined, args);
    })) return fns[0].apply(fns, args);
  };
}

/**
 * @signature (* -> *) -> [*] -> () -> *
 * @description Partially applied function that takes a function as
 * its first parameter, followed by zero or more arguments that the
 * function should be applied to. Finally, a function that takes no
 * arguments is returned. Once invoked, the provided function will
 * be applied to the provided arguments. This is similar to {@see apply}
 * except after the arguments are provided, there is an intermediary
 * function returned that needs to be invoked before anything happens.
 * @note This function is partially applied, not curried.
 * @function lateApply
 * @param {function} fn - A function to be executed
 * @return {function} - The return value of the 'fn' function argument.
 */
var lateApply = invoker(function (fn) {
  for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
    args[_key8 - 1] = arguments[_key8];
  }

  return function () {
    return fn.apply(undefined, args);
  };
});

/**
 * @signature (*... -> a) -> [*] -> a
 * @alias apply
 * @description A partially applied function that takes a function and any arguments
 * and returns the result of apply the function to the arguments.
 * @function leftApply
 * @param {function} fn - The function that should be applied to the arguments.
 * @return {function} - The result of applying the function to the arguments.
 */
var leftApply = apply;

/**
 * @signature (* -> *) -> [*] -> null|*
 * @description A partially applied function that takes a function
 * and zero or more arguments. If no arguments are provided, or at
 * least of the the arguments is null or undefined, a value of null
 * is returned. Otherwise, the return value is the result of apply
 * the function to the arguments.
 * @note This function is partially applied, not curried.
 * @function maybe
 * @param {function} fn - The function that may run
 * @return {null|*} - Returns either null, or the result of the function.
 */
var maybe = invoker(function (fn) {
  for (var _len9 = arguments.length, args = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
    args[_key9 - 1] = arguments[_key9];
  }

  return 1 <= args.length && args.every(function _testNull(val) {
    return null != val;
  }) ? fn.call.apply(fn, [undefined].concat(args)) : null;
});

/**
 * @signature (* -> *) -> [*] -> boolean
 * @description - Takes a function and one or more parameters that the function
 * should be applied to. The result is the inverse coercion of the return
 * value of the function's application to the provided arguments to a
 * boolean.
 * @note This function is partially applied, not curried.
 * @function not
 * @param {function} fn - A function that should be applied to the arguments.
 * @return {*} - The inverted coercion of the return value of the function to
 * a boolean.
 */
var not = invoker(function (fn) {
  for (var _len10 = arguments.length, args = Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
    args[_key10 - 1] = arguments[_key10];
  }

  return !fn.apply(undefined, args);
});

/**
 * @signature (* -> *) -> [*] ->
 * @description - Takes a function and zero or more arguments that the
 * function should be applied to. When invoked the first time, the function
 * argument will be applied to the argument parameters and the result of
 * that application is returned. Subsequent invocations will not execute
 * the function, but will returned the cached results of the first invocation.
 * @note This function is partially applied, not curried.
 * @param {function} fn - The function that should be run a single time.
 * @returns {function} - The value of the application of the function
 * to the arguments.
 */
function once(fn) {
  var invoked = false,
      res;
  return function _once() {
    if (!invoked) {
      invoked = true;
      res = fn.apply(undefined, arguments);
    }
    return res;
  };
}

/**
 * @signature number -> (number -> *) -> *
 * @description d
 * @function repeat
 * @param {number} num - a
 * @param {function} fn - b
 * @return {*} - c
 */
var repeat = (0, _combinators.curry)(function _repeat(num, fn) {
  return 0 < num ? (_repeat(num - 1, fn), fn(num)) : undefined;
});

/**
 * @signature rightApply :: (*... -> a) -> [*] -> a
 * @description d
 * @note This function is partially applied, not curried.
 * @function rightApply
 * @param {function} fn - a
 * @return {function} - b
 */
var rightApply = invoker(function (fn) {
  for (var _len11 = arguments.length, args = Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
    args[_key11 - 1] = arguments[_key11];
  }

  return fn.apply(undefined, _toConsumableArray(args.reverse()));
});

//TODO: need to add a try/catch function here, and see about renaming the existing 'safe' function
//TODO: as that seems more along the lines of a try/catch function, rather than a 'maybe' function.
/**
 * @signature
 * @description d
 * @note This function is partially applied, not curried.
 * @function safe
 * @param {function} fn - a
 * @return {function} - b
 */
var safe = invoker(function (fn) {
  for (var _len12 = arguments.length, args = Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
    args[_key12 - 1] = arguments[_key12];
  }

  return !args.length || args.includes(null) || args.includes(undefined) ? undefined : fn.apply(undefined, args);
});

/**
 * @signature tap :: () -> * -> *
 * @description d
 * @function tap
 * @param {*} arg - a
 * @param {function} fn - b
 * @return {arg} - c
 */
var tap = (0, _combinators.curry)(function _tap(fn, arg) {
  fn(arg);
  return arg;
});

/**
 * @signature ternary :: (* -> *) -> [*] -> (*, *, * -> *)
 * @description Takes any function and turns it into a curried ternary function.
 * @param {function} fn - a
 * @param {*} [args] - Accepts zero or more optional arguments. If three or more arguments
 * and given, the function is invoked immediately with the first three values.
 * @return {function} - c
 */
var ternary = function ternary(fn) {
  for (var _len13 = arguments.length, args = Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
    args[_key13 - 1] = arguments[_key13];
  }

  return _combinators.curryN.call.apply(_combinators.curryN, [undefined, 3, fn].concat(args));
};

/**
 * @signature tryCatch :: () -> () -> *
 * @description d
 * @function tryCatch
 * @param {function} catcher - a
 * @param {function} tryer - b
 * @return {function} - c
 */
var tryCatch = (0, _combinators.curry)(function _tryCatch(catcher, tryer) {
  return _combinators.curryN.call(this, tryer.length, function _tryCatch_() {
    for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
      args[_key14] = arguments[_key14];
    }

    try {
      return tryer.apply(undefined, args);
    } catch (e) {
      return catcher.apply(undefined, [e].concat(args));
    }
  });
});

/**
 * @signature unary :: (*... -> *) -> * -> *
 * @description - Takes a single function of any arity and turns it into
 * a unary function. An optional argument may be provided. If it is, the
 * immediate result of the function's application to the argument is returned,
 * otherwise, a new function expecting a single argument is returned.
 * @param {function} fn - The function that should be turned into a unary function.
 * @param {*} [arg] - Optional argument that the unary function should be applied to.
 * @return {function|*} - Returns either a function waiting for a single argument
 * before invocation, or the result of applying the function to the provided
 * argument.
 */
var unary = function unary(fn, arg) {
  return undefined === arg ? _combinators.curryN.call(undefined, 1, fn) : fn(arg);
};

/**
 * @signature
 * @description d
 * @param {*} seed - a
 * @return {function} - b
 */
function unfold(seed) {
  return (/*#__PURE__*/regeneratorRuntime.mark(function _unfold(fn) {
      return regeneratorRuntime.wrap(function _unfold$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
            case 'end':
              return _context.stop();
          }
        }
      }, _unfold, this);
    })
  );
}

/**
 * @signature
 * @description d
 * @note This function is partially applied, not curried.
 * @param {function} fn - a
 * @return {function} - b
 */
function unfoldWith(fn) {
  return (/*#__PURE__*/regeneratorRuntime.mark(function _unfold(val) {
      var _fn, next, value, done, _fn2;

      return regeneratorRuntime.wrap(function _unfold$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _fn = fn(val), next = _fn.next, value = _fn.value, done = _fn.done;

            case 1:
              if (done) {
                _context2.next = 10;
                break;
              }

              _context2.next = 4;
              return value;

            case 4:
              _fn2 = fn(next);
              next = _fn2.next;
              value = _fn2.value;
              done = _fn2.done;
              _context2.next = 1;
              break;

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _unfold, this);
    })
  );
}

/**
 * @signature
 * @description d
 * @function hyloWith
 * @param cata - a
 * @param ana - b
 * @param seed - c
 * @return {*} - d
 */
var hyloWith = (0, _combinators.curry)(function _hylo(cata, ana, seed) {
  var _ana = ana(seed),
      n = _ana.next,
      acc = _ana.element,
      done = _ana.done;

  var _ana2 = ana(n),
      next = _ana2.next,
      element = _ana2.element; // not a monoid

  while (!done) {
    acc = cata(acc, element);

    var _ana3 = ana(next);

    next = _ana3.next;
    element = _ana3.element;
    done = _ana3.done;
  }
  return acc;
});

/**
 * @signature (* -> *) -> [*] -> undefined
 * @description This function works just like {@see apply} except that
 * 'undefined' is always returned, regardless of the result of the function.
 * @note This function is partially applied, not curried.
 * @function voidFn
 * @param {function} fn - The function that should be applied to the arguments
 * @return {function} -
 */
var voidFn = invoker(function (fn) {
  for (var _len15 = arguments.length, args = Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
    args[_key15 - 1] = arguments[_key15];
  }

  return void fn.apply(undefined, args);
});

/*
 var c = leftApply(leftApply, rightApply);

 var getWith = c(getWith);
 */

exports.after = after;
exports.apply = apply;
exports.before = before;
exports.binary = binary;
exports.bindFunction = bindFunction;
exports.bindWith = bindWith;
exports.guard = guard;
exports.hyloWith = hyloWith;
exports.lateApply = lateApply;
exports.leftApply = leftApply;
exports.maybe = maybe;
exports.not = not;
exports.once = once;
exports.repeat = repeat;
exports.rightApply = rightApply;
exports.safe = safe;
exports.tap = tap;
exports.ternary = ternary;
exports.tryCatch = tryCatch;
exports.unary = unary;
exports.unfold = unfold;
exports.unfoldWith = unfoldWith;
exports.voidFn = voidFn;

},{"./combinators":330}],345:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrap = exports.type = exports.truthy = exports.subtract = exports.strictNotEqual = exports.strictEquals = exports.setSet = exports.set = exports.reverse = exports.or = exports.once = exports.objectSet = exports.nth = exports.noop = exports.notEqual = exports.negate = exports.multiply = exports.modulus = exports.mapSet = exports.lessThanOrEqual = exports.lessThan = exports.isUndefined = exports.isSymbol = exports.isString = exports.isSomething = exports.isNumber = exports.isNull = exports.isNothing = exports.isPrimitive = exports.isObject = exports.isFunction = exports.isBoolean = exports.isArray = exports.invoke = exports.inObject = exports.has = exports.greaterThanOrEqual = exports.greaterThan = exports.getWith = exports.flip = exports.falsey = exports.equals = exports.either = exports.divide = exports.delegatesTo = exports.delegatesFrom = exports.defaultPredicate = exports.concat = exports.both = exports.arraySet = exports.and = exports.adjust = exports.add = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _helpers = require('./helpers');

var _combinators = require('./combinators');

/** @module functionalHelpers */

/**
 * @signature
 * @description Updates the value stored in a single specified index of an array. The function
 * argument should be some form of a unary projector. The 'projector' function will receive
 * the value stored in the existing array at the specified 'idx' argument location. A new array
 * is returned and the original array remains unchanged.
 * @kind function
 * @function adjust
 * @param {function} fn - A function that can operate on a single point of data from the array
 * and a value to be used as an update for the same index in the new array.
 * @param {number} idx - A number representing the zero-based offset of the array; idx determines
 * what value will be passed as the unary argument to the operator function and what index in the
 * newly created array will be altered. If the value is less than zero, the function will use the
 * 'idx' argument value as an offset from the last element in the array.
 * @param {Array} List - The List to update.
 * @return {Array} - Returns a new array identical to the original array except where the new,
 * computed value is inserted
 */
var adjust = (0, _combinators.curry)(function _adjust(fn, idx, list) {
  if (idx >= list.length || idx < -list.length) {
    return list;
  }
  var _idx = 0 > idx ? list.length + idx : idx,
      _list = list.map(_combinators.identity);
  _list[_idx] = fn(list[_idx]);
  return _list;
});

/**
 * @signature Number -> Number -> Number
 * @signature String -> String -> String
 * @description d
 * @kind function
 * @function add
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var add = (0, _combinators.curry)(function (x, y) {
  return x + y;
});

/**
 * @signature and :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @kind function
 * @function and
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var and = (0, _combinators.curry)(function (a, b) {
  return !!(a && b);
});

/**
 * @signature
 * @description Updates the value at a specified index of an array by first creating a shallow copy
 * of the array and then updating its value at the specified index.
 * @kind function
 * @function arraySet
 * @note @see {@link adjust}
 * @param {number} idx - The index of the array to which the alternate value will be set.
 * @param {*} x - The value to be used to update the array at the index specified.
 * @param {Array} List - The List on which to perform the update.
 * @returns {Array} - Returns a new array with the value at the specified index being
 * set to the value of the 'x' argument.
 */
var arraySet = (0, _combinators.curry)(function _arraySet(idx, x, list) {
  return adjust((0, _combinators.constant)(x), idx, list);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function both
 * @param {function} f - a
 * @param {function} g - b
 * @return {function} - c
 */
var both = (0, _combinators.curry)(function _both(f, g) {
  return function () {
    return !!(f.apply(undefined, arguments) && g.apply(undefined, arguments));
  };
});

/**
 * @signature
 * @description d
 * @param {Array} first - a
 * @return {function} - b
 */
var concat = function concat(first) {
  return function () {
    for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    return null == rest || !rest.length ? first : rest.reduce(function _concatStrings(cur, next) {
      return cur.concat(next);
    }, first);
  };
};

/**
 * @signature
 * @description d
 * @kind function
 * @function defaultPredicate
 * @return {boolean} - a
 */
var defaultPredicate = (0, _combinators.constant)(true);

/**
 * @signature
 * @description d
 * @kind function
 * @function delegatesFrom
 * @param {object} delegate - a
 * @param {object} delegator - b
 * @return {boolean} - c
 */
var delegatesFrom = (0, _combinators.curry)(function (delegate, delegator) {
  return delegate.isPrototypeOf(delegator);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function delegatesTo
 * @param {object} delegator - a
 * @param {object} delegate - b
 * @return {boolean} - c
 */
var delegatesTo = (0, _combinators.curry)(function (delegator, delegate) {
  return delegate.isPrototypeOf(delegator);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function divide
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var divide = (0, _combinators.curry)(function (x, y) {
  return x / y;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function either
 * @param {function} f - a
 * @param {function} g - b
 * @return {boolean} - c
 */
var either = (0, _combinators.curry)(function _either(f, g) {
  return !!(f() || g());
});

/**
 * @signature
 * @description d
 * @kind function
 * @function equals
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var equals = (0, _combinators.curry)(function (x, y) {
  return x == y;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function falsey
 * @see flip
 * @param {*} x - a
 * @return {boolean} - b
 */
var falsey = flip;

/**
 * @signature
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var flip = function flip(x) {
  return !x;
};

/**
 * @signature
 * @description d
 * @kind function
 * @function getWith
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {*} - c
 */
var getWith = (0, _combinators.curry)(function (prop, obj) {
  return obj[prop];
});

/**
 * @signature
 * @description d
 * @kind function
 * @function greaterThan
 * @param {number | string} x - a
 * @param {number | string} y - b
 * @return {boolean} - c
 */
var greaterThan = (0, _combinators.curry)(function (x, y) {
  return x > y;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function greaterThanOrEqual
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var greaterThanOrEqual = (0, _combinators.curry)(function (x, y) {
  return x >= y;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function has
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var has = (0, _combinators.curry)(function _has(prop, obj) {
  return obj.hasOwnProperty(prop);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function inObject
 * @param {string} key - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var inObject = (0, _combinators.curry)(function _inObject(prop, obj) {
  return prop in obj;
});

/**
 * @signature
 * @description d
 * @param {function|generator} fn - a
 * @return {*} - b
 */
var invoke = function invoke(fn) {
  return fn();
};

/**
 * @signature isArray :: a -> Boolean
 * @description d
 * @param {*} data - a
 * @return {boolean} - b
 */
var isArray = function isArray(data) {
  return Array.isArray(data);
};

/**
 * @signature
 * @description d
 * @param {boolean} bool - a
 * @return {boolean} - b
 */
var isBoolean = function isBoolean(bool) {
  return _helpers.javaScriptTypes.Boolean === type(bool);
};

/**
 * @signature isFunction :: a -> Boolean
 * @description d
 * @param {function} fn - a
 * @return {boolean} - b
 */
var isFunction = function isFunction(fn) {
  return _helpers.javaScriptTypes.Function === type(fn);
};

/**
 * @signature isObject :: a -> Boolean
 * @description d
 * @param {*} item - a
 * @return {boolean} - b
 */
var isObject = function isObject(item) {
  return _helpers.javaScriptTypes.Object === type(item) && null !== item;
};

/**
 * @signature
 * @description d
 * @param {*} item - a
 * @return {boolean} - b
 */
function isPrimitive(item) {
  var itemType = type(item);
  return itemType in _helpers.typeNames && (isNothing(item) || _helpers.javaScriptTypes.Object !== itemType && _helpers.javaScriptTypes.Function !== itemType);
}

/**
 * @signature
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var isNothing = function isNothing(x) {
  return null == x;
};

/**
 * @signature
 * @description d
 * @param {*} n - a
 * @return {string|boolean} - b
 */
var isNull = function isNull(n) {
  return null === n;
};

/**
 * @signature
 * @description d
 * @param {number} num - a
 * @return {boolean} - b
 */
var isNumber = function isNumber(num) {
  return _helpers.javaScriptTypes.Number == type(num);
};

/**
 * @signature
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var isSomething = function isSomething(x) {
  return null != x;
};

/**
 * @signature
 * @description d
 * @param {string} str - a
 * @return {boolean} - b
 */
var isString = function isString(str) {
  return _helpers.javaScriptTypes.String === type(str);
};

/**
 * @signature
 * @description d
 * @param {Symbol} sym - a
 * @return {boolean} - b
 */
var isSymbol = function isSymbol(sym) {
  return _helpers.javaScriptTypes.Symbol === type(sym);
};

/**
 * @signature
 * @description d
 * @param {*} u - a
 * @return {boolean} - b
 */
var isUndefined = function isUndefined(u) {
  return _helpers.javaScriptTypes.Undefined === type(u);
};

/**
 * @signature
 * @description d
 * @kind function
 * @function lessThan
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThan = (0, _combinators.curry)(function (x, y) {
  return x < y;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function lessThanOrEqual
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThanOrEqual = (0, _combinators.curry)(function (x, y) {
  return x <= y;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function mapSet
 * @param {*} key - a
 * @param {*} val - b
 * @param {Map} xs - c
 * @return {Map} - d
 */
var mapSet = (0, _combinators.curry)(function _mapSet(key, val, xs) {
  var ret = new Map();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = xs.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var k = _step.value;

      ret.set(k, xs.get(k));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return ret;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function modulus
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var modulus = (0, _combinators.curry)(function (x, y) {
  return x % y;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function multiply
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var multiply = (0, _combinators.curry)(function (x, y) {
  return x * y;
});

/**
 * @signature
 * @description d
 * @param {number} x - a
 * @return {number} - b
 */
var negate = function negate(x) {
  return -x;
};

/**
 * @signature
 * @description d
 * @kind function
 * @function notEqual
 * @param {*} - a
 * @param {*} - b
 * @return {boolean} - c
 */
var notEqual = (0, _combinators.curry)(function (x, y) {
  return x != y;
});

/**
 * @signature
 * @description No-op function; used as default function in some cases when argument is optional
 * and consumer does not provide.
 * @returns {undefined} - a
 */
function noop() {}

/**
 * @signature
 * @description d
 * @kind function
 * @function nth
 * @param {number} offset - a
 * @param {Array} List - b
 * @return {*} - c
 */
var nth = (0, _combinators.curry)(function nth(offset, list) {
  var idx = 0 > offset ? list.length + offset : offset;
  return 'string' === typeof list ? list.charAt(idx) : list[idx];
});

/**
 * @signature
 * @description d
 * @kind function
 * @function objectSet
 * @param {string} prop - a
 * @param {*} val - b
 * @param {object} obj - c
 * @return {object} - d
 */
var objectSet = (0, _combinators.curry)(function _objectSet(prop, val, obj) {
  var result = (0, _helpers.shallowClone)(obj);
  result[prop] = val;
  return result;
});

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function once(fn) {
  var invoked = false,
      res;
  return function _once() {
    if (!invoked) {
      invoked = true;
      res = fn.apply(undefined, arguments);
    }
    return res;
  };
}

/**
 * @signature or :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @kind function
 * @function or
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var or = (0, _combinators.curry)(function (a, b) {
  return !!(a || b);
});

/**
 * @signature
 * @description d
 * @param {Array|String} xs - a
 * @return {Array|String} - b
 */
var reverse = function reverse(xs) {
  return isArray(xs) ? xs.slice(0).reverse() : xs.split('').reverse().join('');
};

/**
 * @signature
 * @description d
 * @kind function
 * @function set
 * @param {string} prop - a
 * @param {*} val - b
 * @param {object} obj - c
 * @return {object} - d
 */
var set = (0, _combinators.curry)(function _set(prop, val, obj) {
  obj[prop] = val;
  return obj;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function setSet
 * @param {*} val - a
 * @param {Set} set - b
 * @return {Set} - c
 */
var setSet = (0, _combinators.curry)(function _setSet(val, set) {
  set.add(val);
  return set;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function strictEquals
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictEquals = (0, _combinators.curry)(function (x, y) {
  return x === y;
});

/**
 * @signature strictNotEquals :: * -> * -> boolean
 * @description d
 * @kind function
 * @function strictNotEqual
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictNotEqual = (0, _combinators.curry)(function (x, y) {
  return x !== y;
});

/**
 * @signature subtract :: number -> number -> number
 * @description d
 * @kind function
 * @function subtract
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var subtract = (0, _combinators.curry)(function (x, y) {
  return x - y;
});

/**
 * @signature truthy :: * -> boolean
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var truthy = function truthy(x) {
  return flip(falsey(x));
};

/**
 * @signature type :: * -> string
 * @description d
 * @param {*} a - a
 * @return {string} - b
 */
var type = function type(a) {
  return typeof a === 'undefined' ? 'undefined' : _typeof(a);
};

/**
 * @signature wrap :: a -> [a]
 * @description Takes any value of any type and returns an array containing
 * the value passed as its only item
 * @param {*} data - Any value, any type
 * @return {Array} - Returns an array of any value, any type
 */
var wrap = function wrap(data) {
  return [data];
};

function reverse2() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (1 === args.length) {
    if ('string' === typeof args[0]) return args[0].split('').reverse().join();
    return args;
  }
  return args.reverse();
}

exports.add = add;
exports.adjust = adjust;
exports.and = and;
exports.arraySet = arraySet;
exports.both = both;
exports.concat = concat;
exports.defaultPredicate = defaultPredicate;
exports.delegatesFrom = delegatesFrom;
exports.delegatesTo = delegatesTo;
exports.divide = divide;
exports.either = either;
exports.equals = equals;
exports.falsey = falsey;
exports.flip = flip;
exports.getWith = getWith;
exports.greaterThan = greaterThan;
exports.greaterThanOrEqual = greaterThanOrEqual;
exports.has = has;
exports.inObject = inObject;
exports.invoke = invoke;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isPrimitive = isPrimitive;
exports.isNothing = isNothing;
exports.isNull = isNull;
exports.isNumber = isNumber;
exports.isSomething = isSomething;
exports.isString = isString;
exports.isSymbol = isSymbol;
exports.isUndefined = isUndefined;
exports.lessThan = lessThan;
exports.lessThanOrEqual = lessThanOrEqual;
exports.mapSet = mapSet;
exports.modulus = modulus;
exports.multiply = multiply;
exports.negate = negate;
exports.notEqual = notEqual;
exports.noop = noop;
exports.nth = nth;
exports.objectSet = objectSet;
exports.once = once;
exports.or = or;
exports.reverse = reverse;
exports.set = set;
exports.setSet = setSet;
exports.strictEquals = strictEquals;
exports.strictNotEqual = strictNotEqual;
exports.subtract = subtract;
exports.truthy = truthy;
exports.type = type;
exports.wrap = wrap;

},{"./combinators":330,"./helpers":346}],346:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** @module helpers */

/** @modules helpers */

/**
 * @description - Prototype of a generator; used to detect if a function
 * argument is a generator or a regular function.
 * @typedef {Object}
 */
var generatorProto = Object.getPrototypeOf( /*#__PURE__*/regeneratorRuntime.mark(function _generator() {
    return regeneratorRuntime.wrap(function _generator$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                case 'end':
                    return _context.stop();
            }
        }
    }, _generator, this);
}));

/**
 * @description d
 * @enum {string}
 */
var javaScriptTypes = {
    /** function */
    Function: 'function',
    /** object */
    Object: 'object',
    /** boolean */
    Boolean: 'boolean',
    /** number */
    Number: 'number',
    /** symbol */
    Symbol: 'symbol',
    /** string */
    String: 'string',
    /** undefined */
    Undefined: 'undefined'
};

/**
 * @description Contains the list of all JavaScript types
 * @enum {string}
 */
var typeNames = {
    /** boolean */
    'boolean': _typeof(true),
    /** function */
    'function': typeof Function === 'undefined' ? 'undefined' : _typeof(Function),
    /** number */
    'number': _typeof(0),
    /** object */
    'object': _typeof({ a: 1 }),
    /** string */
    'string': _typeof(''),
    /** symbol */
    'symbol': _typeof(Symbol.iterator),
    /** undefined */
    'undefined': _typeof(void 0)
};

/**
 * @description Contains a list of built-in iterables
 * @enum {Array}
 */
var collectionTypes = {
    /** Generator */
    'Generator': [generatorProto],
    /** Array Family */
    'Array': [Array.prototype, Int16Array.prototype, Int8Array.prototype, Int32Array.prototype, Float32Array.prototype, Float64Array.prototype, Uint16Array.prototype, Uint32Array.prototype, Uint8Array.prototype, Uint8ClampedArray.prototype],
    /** ArrayBuffer */
    'ArrayBuffer': [ArrayBuffer.prototype],
    /** Map */
    'Map': [Map.prototype],
    /** WeakMap */
    'WeakMap': [WeakMap.prototype],
    /** Set */
    'Set': [Set.prototype],
    /** WeakSet */
    'WeakSet': [WeakSet.prototype]
};

/**
 * @description Contains the list of possible observable statuses
 * @enum {number}
 */
var observableStatus = {
    /** inactive */
    inactive: 0,
    /** active */
    active: 1,
    /** paused */
    paused: 2,
    /** complete */
    complete: 3
};

/**
 * @description Contains the list of possible sort directions
 * @enum {number}
 */
var sortDirection = {
    /** ascending */
    ascending: 1,
    /** descending */
    descending: 2
};

/**
 * @signature
 * @description d
 * @param {*} x - a
 * @param {*} y - b
 * @param {number} dir - c
 * @return {number} - d
 */
function sortComparer(x, y, dir) {
    var t = x > y ? 1 : x === y ? 0 : -1;
    return sortDirection.descending === dir ? t : -t;
}

/**
 * @signature
 * @description d
 * @param {function} comparer - a
 * @return {function} - b
 */
/*function cacheChecker(item) {
 console.log(((undefined !== item && items.some(function _checkEquality(it) {
 return comparer(it, item);
 }) && true) || !(items[items.length] = item)));

 return ((undefined !== item && items.some(function _checkEquality(it) {
 return comparer(it, item);
 }) && true) || !(items[items.length] = item));
 }*/

function cacher(comparer) {
    var items = [];
    function cacheChecker(item) {
        if (undefined === item || items.some(function _checkEquality(it) {
            return comparer(it, item);
        })) {
            return true;
        }
        items[items.length] = item;
        return false;
    }

    cacheChecker.contains = function _contains(item) {
        return items.some(function _checkEquality(it) {
            return comparer(it, item);
        });
    };

    return cacheChecker;
}

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @param {function} [keyMaker] - b
 * @return {function} - c
 */
function memoizer(fn, keyMaker) {
    var lookup = new Map();
    return function _memoized() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var key = javaScriptTypes.Function === (typeof keyMaker === 'undefined' ? 'undefined' : _typeof(keyMaker)) ? keyMaker.apply(undefined, args) : args;
        return lookup[key] || (lookup[key] = fn.apply(undefined, args));
    };
}

/**
 * @signature
 * @description d
 * @param {*} obj - a
 * @return {*} - b
 */
function deepClone(obj) {
    var uniqueObjects = new Set();

    return objectCloner(obj);

    /**
     * @signature
     * @description d
     * @param {*} obj - a
     * @return {*} - b
     */
    function objectCloner(obj) {
        //if the 'obj' parameter is a primitive type, just return it; there's no way/need to copy
        if (null == obj || 'object' !== (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) && 'function' !== typeof obj) return obj;

        //if we've already seen this 'object' before, we don't want to get caught
        //in an infinite loop; just return the 'object'. Otherwise, add it to the
        //set of viewed 'objects'
        if (uniqueObjects.has(obj)) return obj;
        uniqueObjects.add(obj);

        //if the obj parameter is a function, invoke the functionClone function and return its return...
        if ('function' === typeof obj) return functionClone(obj);

        var ret = Object.create(Object.getPrototypeOf(obj));
        //...else, reduce over the obj parameter's own keys after creating a new object that has its
        //prototype delegating to the same object that the obj's prototype delegating to. This functionality
        //will work for an array as well.
        Object.getOwnPropertyNames(obj).reduce(_reducePropNames.bind(ret), '');

        return ret;

        //this is the function used in the reduce and is bound to the context of the return (cloned) object
        function _reducePropNames(prev, curr) {
            return this[curr] = objectCloner(obj[curr]), this;
        }
    }
}

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @param {Object} cxt - b
 * @return {function} - c
 */
function functionClone(fn) {
    var cxt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var clone = function _clone() {
        return fn.apply(undefined, arguments);
    }.bind(cxt);

    Object.defineProperties(clone, {
        'length': {
            value: fn.length,
            enumerable: false
        },
        'prototype': {
            value: Object.create(fn.prototype)
        },
        'name': {
            writable: true
        }
    });

    Object.getOwnPropertyNames(fn).reduce(function _reducePropName(prev, curr) {
        if ('length' !== curr && 'prototype' !== curr) return clone[curr] = deepClone(fn[curr]), clone;
        return clone;
    }, '');

    return clone;
}

/**
 * @signature
 * @description d
 * @param {Array} arr - a
 * @return {Array} - b
 */
function deepCopy(arr) {
    var length = arr.length,
        newArr = new arr.constructor(length),
        index = -1;
    while (++index < length) {
        newArr[index] = deepClone(arr[index]);
    }
    return newArr;
}

/**
 * @signature
 * @description d
 * @param {object} obj - a
 * @return {object} - b
 */
function shallowClone(obj) {
    var clone = {};
    for (var item in obj) {
        clone[item] = obj[item];
    }
    return clone;
}

var emptyObject = {};

var nil = {};

/**
 * @signature
 * @description d
 * @param {number} len - a
 * @param {function} fn - b
 * @return {function} - c
 */
/*var alterFunctionLength = curry(function _alterFunctionLength(len, fn) {
    return Object.defineProperty(
        fn,
        'length', {
            value: len
        }
    );
});
*/

exports.javaScriptTypes = javaScriptTypes;
exports.sortDirection = sortDirection;
exports.observableStatus = observableStatus;
exports.sortComparer = sortComparer;
exports.cacher = cacher;
exports.memoizer = memoizer;
exports.deepClone = deepClone;
exports.deepCopy = deepCopy;
exports.shallowClone = shallowClone;
exports.generatorProto = generatorProto;
exports.emptyObject = emptyObject;
exports.typeNames = typeNames;
exports.nil = nil;

},{}],347:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unifiedLens = exports.lensPath = exports.makeLenses = exports.prismPath = exports.prism = exports.lens = exports.set = exports.put = exports.over = exports.view = exports.mapLens = exports.objectLens = exports.arrayLens = undefined;

var _functionalHelpers = require('./functionalHelpers');

var _decorators = require('./decorators');

var _combinators = require('./combinators');

var _helpers = require('./helpers');

var _maybe = require('./dataStructures/maybe');

var _identity = require('./dataStructures/identity');

var _constant = require('./dataStructures/constant');

var _pointless_data_structures = require('./pointless_data_structures');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** @module lenses */

/**
 * @signature
 * @description d
 * @kind function
 * @function lens
 * @param {function} getter - a
 * @param {function} setter - b
 * @param {String} key - c
 * @param {function} f - d
 * @param {Array} xs - e
 * @return {*} - f
 */
var lens = (0, _combinators.curry)(function _lens(getter, setter, key, f, xs) {
    return (0, _pointless_data_structures.mapWith)(function (replace) {
        return setter(key, replace, xs);
    }, f(getter(key, xs)));
});

/**
 * @signature
 * @description d
 * @kind function
 * @function prism
 * @param {function} getter - a
 * @param {function} setter - b
 * @param {String} key - c
 * @param {function} f - d
 * @param {Array} xs - e
 * @param {*} - f
 * @return {*} - g
 */
var prism = (0, _combinators.curry)(function _prism(getter, setter, key, f, xs) {
    return (0, _pointless_data_structures.mapWith)(function (replace) {
        return setter(key, replace, xs);
    }, (0, _maybe.Maybe)(f(getter(key, xs))));
});

/**
 * @signature
 * @description d
 * @kind function
 * @function arrayLens
 * @param {number} idx - a
 * @param {function} f - b
 * @param {Array} xs - c
 * @return {Array} - c
 */
var arrayLens = lens(function (idx, xs) {
    return xs[idx];
}, _functionalHelpers.arraySet);

/**
 * @signature
 * @description d
 * @kind function
 * @function objectLens
 * @param {string} prop - a
 * @param {function} f - b
 * @param {Object} xs - c
 * @return {Object} - c
 */
var objectLens = lens(function (prop, xs) {
    return xs[prop];
}, _functionalHelpers.objectSet);

/**
 * @signature
 * @description d
 * @kind function
 * @function mapLens
 * @param {*} key - a
 * @param {*} val - b
 * @param {Map} xs - c
 * @return {Map} d
 */
var mapLens = lens(function (key, xs) {
    return xs.get(key);
}, function _mapSet(key, val, xs) {
    var ret = new Map();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = xs.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var k = _step.value;

            if (k === key) {
                ret.set(k, val);
            } else ret.set(k, xs.get(k));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return ret;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function unifiedLens
 * @param {string} prop - a
 * @param {function} f - b
 * @param {Array|Object} xs - c
 * @return {*} - d
 */
var unifiedLens = (0, _combinators.curry)(function _unifiedLens(prop, f, xs) {
    return (0, _pointless_data_structures.mapWith)(function _mapWith(value) {
        if (Array.isArray(xs)) return (0, _functionalHelpers.arraySet)(prop, value, xs);else if (Map.prototype.isPrototypeOf(xs)) return (0, _functionalHelpers.mapSet)(prop, value, xs);
        return (0, _functionalHelpers.objectSet)(prop, value, xs);
    }, Map.prototype.isPrototypeOf(xs) ? f(xs.get(prop)) : f(xs[prop]));
});

/**
 * @signature
 * @description d
 * @kind function
 * @function view
 * @param {function} lens - a
 * @param {Object} target - b
 * @return {*} - c
 */
var view = (0, _combinators.curry)(function _view(lens, target) {
    return lens(_constant.Constant)(target).value;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function over
 * @param {function} lens - a
 * @param {function} mapFn - b
 * @param {Object} target - c
 * @return {*} - d
 */
var over = (0, _combinators.curry)(function _over(lens, mapFn, target) {
    return lens(function _lens(y) {
        return (0, _identity.Identity)(mapFn(y));
    })(target).value;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function put
 * @param {function} lens - a
 * @param {*} val - b
 * @param {*} target - c
 * @return {*} - d
 */
var put = (0, _combinators.curry)(function _put(lens, val, target) {
    return over(lens, (0, _combinators.kestrel)(val), target);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function set
 * @param {function} lens - a
 * @param {*} val - b
 * @param {Object} targetData - c
 * @return {*} - c
 */
var set = (0, _combinators.curry)(function (lens, val, targetData) {
    return over(lens, (0, _combinators.kestrel)(val), targetData);
});

/**
 * @signature
 * @description d
 * @param {string} paths - a
 * @return {*} - b
 */
function makeLenses() {
    for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
        paths[_key] = arguments[_key];
    }

    return paths.reduce(function _pathReduce(cur, next) {
        var ol = objectLens(next);
        return put(ol, ol, cur);
    }, { num: arrayLens });
}

/**
 * @signature
 * @description d
 * @param {string} paths - a
 * @return {function} - b
 */
function improvedLensPath() {
    var innerLensDef = (0, _combinators.curry)(function _innerLensDef(prop, fn, xs) {
        return (0, _pointless_data_structures.mapWith)(function _map(rep) {
            return (0, _functionalHelpers.objectSet)(prop, rep, xs);
        }, fn(xs[prop]));
    });

    for (var _len2 = arguments.length, paths = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        paths[_key2] = arguments[_key2];
    }

    return _combinators.compose.apply(undefined, _toConsumableArray(paths.map(function _pathsMap(p) {
        return innerLensDef(p);
    })));
}

/**
 * @signature
 * @description d
 * @param {string|Number} path - a
 * @return {*} - b
 */
function lensPath() {
    for (var _len3 = arguments.length, path = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        path[_key3] = arguments[_key3];
    }

    return _combinators.compose.apply(undefined, _toConsumableArray(path.map(function _pathMap(p) {
        return unifiedLens(p);
    })));
}

/**
 * @signature
 * @description d
 * @kind function
 * @function prismPath
 * @param {Array|String} path - a
 * @param {Object} obj - b
 * @return {*} - c
 */
var prismPath = (0, _combinators.curry)(function _prismPath(path, obj) {
    path = (0, _combinators.when)((0, _decorators.not)(_functionalHelpers.isArray), split('.'), path);
    console.log(path, obj);
    var val = obj,
        idx = 0;
    while (idx < path.length) {
        if (null == val) return _maybe.Maybe.Nothing();
        console.log(val[path[idx]]);
        val = val[path[idx]];
        ++idx;
    }
    return (0, _maybe.Maybe)(val);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function split
 * @param {String} delimiter - a
 * @param {String} string - b
 * @return {Array} - c
 */
var split = (0, _combinators.curry)(function _split(delimiter, string) {
    return string.split(delimiter);
});

var extract = function extract(i) {
    return i.extract;
};

var map = (0, _combinators.curry)(function (fn, f) {
    return f.map(fn);
});

var mapped = (0, _combinators.curry)(function (f, x) {
    return (0, _identity.Identity)(map((0, _combinators.compose)(extract, f), x));
});

//+ traversed :: Functor f => (a -> f a) -> Setter (f a) (f b) a b
var traversed = (0, _combinators.curry)(function (point, f, x) {
    return (0, _identity.Identity)(traverse((0, _combinators.compose)(extract, f), point, x));
});

var traverse = (0, _combinators.curry)(function (f, point, fctr) {
    return (0, _combinators.compose)(sequenceA(point), map(f))(fctr);
});

var sequenceA = (0, _combinators.curry)(function (point, fctr) {
    return fctr.traverse(id, point);
});

exports.arrayLens = arrayLens;
exports.objectLens = objectLens;
exports.mapLens = mapLens;
exports.view = view;
exports.over = over;
exports.put = put;
exports.set = set;
exports.lens = lens;
exports.prism = prism;
exports.prismPath = prismPath;
exports.makeLenses = makeLenses;
exports.lensPath = lensPath;
exports.unifiedLens = unifiedLens;

},{"./combinators":330,"./dataStructures/constant":331,"./dataStructures/identity":337,"./dataStructures/maybe":341,"./decorators":344,"./functionalHelpers":345,"./helpers":346,"./pointless_data_structures":348}],348:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toConstant = exports.toFuture = exports.toJust = exports.toNothing = exports.toMaybe = exports.toIdentity = exports.toEither = exports.toRight = exports.toLeft = exports.toList = exports.dimap = exports.bimap = exports.equals = exports.isEmpty = exports.contramap = exports.traverse = exports.sequence = exports.fold = exports.isValidation = exports.isRight = exports.isNothing = exports.isImmutableDataStructure = exports.isMaybe = exports.isList = exports.isLeft = exports.isJust = exports.isIo = exports.isIdentity = exports.isFuture = exports.isEither = exports.isConstant = exports.except = exports.intersect = exports.filter = exports.mcompose = exports.bind = exports.chain = exports.pluckWith = exports.mjoin = exports.liftN = exports.lift4 = exports.lift3 = exports.lift2 = exports.flatMap = exports.mapWith = exports.map = exports.fmap = exports.apply = exports.ap = undefined;

var _combinators = require('./combinators');

var _functionalHelpers = require('./functionalHelpers');

var _dataStructures = require('./dataStructures/dataStructures');

/** @module pointless_data_structures */

var factoryList = [_dataStructures.Constant, _dataStructures.Either, _dataStructures.Future, _dataStructures.Identity, _dataStructures.Io, _dataStructures.Just, _dataStructures.Left, _dataStructures.List, _dataStructures.Maybe, _dataStructures.Nothing, _dataStructures.Right, _dataStructures.Validation];

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isConstant = _dataStructures.Constant.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isEither = _dataStructures.Either.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isFuture = _dataStructures.Future.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isIdentity = _dataStructures.Identity.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIo(fa) {
  return fa.factory === _dataStructures.Io;
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isJust = _dataStructures.Just.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isLeft = _dataStructures.Left.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isList = _dataStructures.List.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isMaybe = _dataStructures.Maybe.is;

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
function isImmutableDataStructure(ma) {
  return !!(ma && ma.factory && factoryList.some(function (factory) {
    return ma.factory === factory;
  }));
}

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isNothing = _dataStructures.Nothing.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isRight = _dataStructures.Right.is;

/**
 * @signature
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
var isValidation = _dataStructures.Validation.is;

/**
 * @signature
 * @description d
 * @kind function
 * @function monad_apply
 * @param {Object} ma - a
 * @param {Object} mb - b
 * @return {Object} - c
 */
var apply = (0, _combinators.curry)(function _apply(ma, mb) {
  return mb.apply(ma);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function ap
 * @see apply
 * @param {Object} ma - a
 * @param {Object} mb - b
 * @return {Object} - c
 */
var ap = apply;

/**
 * @signature
 * @description d
 * @kind function
 * @function map
 * @param {Object} m - a
 * @param {function} fn :: (a) -> b
 * @return {Object} - b
 */
var map = (0, _combinators.curry)(function _map(m, fn) {
  return m.map(fn);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function mapWith
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {Object} - c
 */
var mapWith = (0, _combinators.curry)(function _map(fn, m) {
  return m.map(fn);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function pluckWith
 */
var pluckWith = (0, _combinators.compose)(mapWith, _functionalHelpers.getWith);

/**
 * @signature
 * @description d
 * @kind function
 * @function fmap
 * @see mapWith
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {*} c
 */
var fmap = mapWith;

/**
 * @signature
 * @description d
 * @kind function
 * @function fold
 * @param {function} fn - a
 * @param {*} acc - b
 * @param {Object} ma - c
 * @return {*} - d
 */
var fold = (0, _combinators.curry)(function _fold(fn, acc, ma) {
  return ma.fold(fn, acc);
});

/**
 * @signature
 * @description d
 * @param {Object} p - a
 * @param {Object} m - b
 * @return {*|monads.list|Object} - c
 */
var sequence = (0, _combinators.curry)(function _sequence(p, m) {
  return m.sequence(p);
});

/**
 * @signature
 * @description d
 * @param {Object} a - a
 * @param {function} f - b
 * @param {Object} ma - c
 * @return {Object} - d
 */
var traverse = (0, _combinators.curry)(function _traverse(a, f, ma) {
  return ma.traverse(a, f);
});

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @type {Function|*}
 */
var contramap = (0, _combinators.curry)(function _contramap(fn, ma) {
  return ma.contramap(fn);
});

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
function isEmpty(ma) {
  return ma.isEmpty;
}

/**
 * @signature
 * @description d
 * @kind function
 * @function equals
 * @param {Object} a - a
 * @param {Object} b - b
 * @return {boolean} - c
 */
var equals = (0, _combinators.curry)(function _equals(a, b) {
  return a.equals(b);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function bimap
 * @param {function} f - a
 * @param {function} g = b
 * @param {Object} ma - c
 * @return {Object} d
 */
var bimap = (0, _combinators.curry)(function _bimap(f, g, ma) {
  return ma.bimap(f, g);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function dimap
 * @param {function} f - a
 * @param {function} g - b
 * @param {Object} m - c
 * @return {Object} - d
 */
var dimap = (0, _combinators.curry)(function _dimap(f, g, m) {
  return m.dimap(f, g);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function chain
 * @param {function} f - a
 * @param {Object} m - b
 * @return {*} - c
 */
var chain = (0, _combinators.curry)(function _chain(f, m) {
  return m.chain(f); // or compose(join, mapWith(f))(m)
});

/**
 * @signature
 * @description d
 * @kind function
 * @function chainRec
 * @param {function} fn - a
 * @param {Object} ma - b
 * @return {Object} b
 */
var chainRec = (0, _combinators.curry)(function _chainRec(fn, ma) {
  return ma.chainRec(fn);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function bind
 */
var bind = chain,
    flatMap = chain;

/**
 * @signature
 * @description d
 * @param {function} f - a
 * @param {function} g - b
 * @return {function} - c
 */
var mcompose = function _mcompose(f, g) {
  return (0, _combinators.compose)(chain(f), g);
};

/**
 * @signature
 * @description d
 * @kind function
 * @function put
 * @param {*} val - a
 * @param {Object} fa - b
 * @return {Object} - c
 */
var put = (0, _combinators.curry)(function _put(val, fa) {
  return fa.put(val);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function lift2
 * @param {function} f - a
 * @param {Object} m1 - b
 * @param {Object} m2 - c
 * @return {Object} - c
 */
var lift2 = (0, _combinators.curry)(function _lift2(f, m1, m2) {
  return m1.map(f).apply(m2);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function lift3
 * @param {function} f - a
 * @param {Object} m1 - b
 * @param {Object} m2 - c
 * @param {Object} m3 - d
 * @return {Object} - e
 */
var lift3 = (0, _combinators.curry)(function _lift3(f, m1, m2, m3) {
  return lift2(f, m1, m2).apply(m3);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function lift4
 * @param {function} f - a
 * @param {Object} m1 - b
 * @param {Object} m2 - c
 * @param {Object} m3 - d
 * @param {Object} m4 - e
 * @return {Object} - f
 */
var lift4 = (0, _combinators.curry)(function _lift4(f, m1, m2, m3, m4) {
  return lift3(f, m1, m2, m3).apply(m4);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function liftN
 * @param {function} f - a
 * @param {Object} ...ms - b
 * @return {Object} - c
 */
var liftN = (0, _combinators.curry)(function _liftN(f) {
  for (var _len = arguments.length, ms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    ms[_key - 1] = arguments[_key];
  }

  return ms.slice(1).reduce(function _apply(curM, nextM) {
    return curM.apply(nextM);
  }, ms.shift().map(f));
});

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function mjoin(ma) {
  return ma.mjoin();
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toList(ma) {
  return _dataStructures.List.of(ma.value);
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toMaybe(ma) {
  return (0, _dataStructures.Maybe)(ma.value);
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toFuture(ma) {
  return _dataStructures.Future.of(ma.value);
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toIdentity(ma) {
  return (0, _dataStructures.Identity)(ma.value);
}

/**
 * @signature
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toJust(ma) {
  return (0, _dataStructures.Just)(ma.value);
}

function toConstant(ma) {
  return (0, _dataStructures.Constant)(ma.value);
}

function toNothing(ma) {
  return (0, _dataStructures.Nothing)();
}

function toEither(ma) {
  return (0, _dataStructures.Either)(ma);
}

function toRight(ma) {
  return (0, _dataStructures.Right)(ma);
}

function toLeft(ma) {
  return (0, _dataStructures.Left)(ma);
}

//===========================================================================================//
//===========================================================================================//
//============================           LIST HELPERS            ============================//
//===========================================================================================//
//===========================================================================================//

function count(xs, predicate) {
  return xs.count(predicate);
}

/**
 * @signature
 * @description d
 * @kind function
 * @function filter
 * @param {function} predicate - a
 * @param {Array} xs - b
 * @return {Array} - c
 */
var filter = (0, _combinators.curry)(function _filter(predicate, xs) {
  xs.filter(predicate);
});

function first(xs, predicate) {
  return xs.first(predicate);
}

/**
 * @signature
 * @description d
 * @kind function
 * @function intersect
 * @param {Array} xs - a
 * @param {function} comparer - b
 * @param {Array} ys - c
 * @return {Array} - d
 */
var intersect = (0, _combinators.curry)(function _intersect(xs, comparer, ys) {
  return ys.intersect(xs, comparer);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function except
 * @param {Array} xs - a
 * @param {function} comparer - b
 * @param {Array} - c
 * @return {*} - d
 */
var except = (0, _combinators.curry)(function _except(xs, comparer, ys) {
  return ys.except(xs, comparer);
});

function last(xs, predicate) {
  return xs.last(predicate);
}

var skip = (0, _combinators.curry)(function _skip(xs, amt) {
  return xs.skip(amt);
});

var skipWhile = (0, _combinators.curry)(function _skipWhile(xs, predicate) {
  return xs.skipWhile(predicate);
});

var take = (0, _combinators.curry)(function _take(xs, amt) {
  return xs.take(amt);
});

var takeWhile = (0, _combinators.curry)(function _takeWhile(xs, predicate) {
  return xs.takeWhile(predicate);
});

exports.ap = ap;
exports.apply = apply;
exports.fmap = fmap;
exports.map = map;
exports.mapWith = mapWith;
exports.flatMap = flatMap;
exports.lift2 = lift2;
exports.lift3 = lift3;
exports.lift4 = lift4;
exports.liftN = liftN;
exports.mjoin = mjoin;
exports.pluckWith = pluckWith;
exports.chain = chain;
exports.bind = bind;
exports.mcompose = mcompose;
exports.filter = filter;
exports.intersect = intersect;
exports.except = except;
exports.isConstant = isConstant;
exports.isEither = isEither;
exports.isFuture = isFuture;
exports.isIdentity = isIdentity;
exports.isIo = isIo;
exports.isJust = isJust;
exports.isLeft = isLeft;
exports.isList = isList;
exports.isMaybe = isMaybe;
exports.isImmutableDataStructure = isImmutableDataStructure;
exports.isNothing = isNothing;
exports.isRight = isRight;
exports.isValidation = isValidation;
exports.fold = fold;
exports.sequence = sequence;
exports.traverse = traverse;
exports.contramap = contramap;
exports.isEmpty = isEmpty;
exports.equals = equals;
exports.bimap = bimap;
exports.dimap = dimap;
exports.toList = toList;
exports.toLeft = toLeft;
exports.toRight = toRight;
exports.toEither = toEither;
exports.toIdentity = toIdentity;
exports.toMaybe = toMaybe;
exports.toNothing = toNothing;
exports.toJust = toJust;
exports.toFuture = toFuture;
exports.toConstant = toConstant;

},{"./combinators":330,"./dataStructures/dataStructures":332,"./functionalHelpers":345}],349:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.observable = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _helpers = require('../helpers');

var _subscriber = require('./subscribers/subscriber');

var _operators = require('./streamOperators/operators');

var _functionalHelpers = require('../functionalHelpers');

var _combinators = require('../combinators');

//TODO: I thinking about implementing an 'observable watcher' functionality. the concept would be
//TODO: that you have an observable that is registered to watch one or more other observables. When
//TODO: the complete or error, the watcher will be notified in its .next handler. To do this, I'd
//TODO: need to assign each observable a unique id, and allow an observable watching to register a
//TODO: unique handler per watched observable if so desired.
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
    setSource: function _setSource(src) {
        this.source = src;
        return this;
    },
    setOperator: function _setOperator(op) {
        this.operator = op;
        return this;
    },
    /**
     * @sig
     * @description d
     * @param {function} fn - a
     * @return {observable} - b
     */
    map: function _map(fn) {
        if ((0, _functionalHelpers.delegatesTo)(this.operator, _operators.mapOperator)) return this.lift.call(this.source, Object.create(_operators.mapOperator).init((0, _combinators.compose)(fn, this.operator.transform)));
        return op.call(this, _operators.mapOperator, fn);
    },
    /**
     * @sig
     * @description d
     * @param {function} fn - a
     * @return {observable} - b
     */
    chain: function _deepMap(fn) {
        return op.call(this, _operators.chainOperator, fn);
    },
    /**
     * @sig
     * @description d
     * @param {function} predicate - a
     * @return {observable} - b
     */
    filter: function _filter(predicate) {
        if ((0, _functionalHelpers.delegatesTo)(this.operator, _operators.filterOperator)) return this.lift.call(this.source, Object.create(_operators.filterOperator).init((0, _combinators.all)(predicate, this.operator.predicate)));
        return op.call(this, _operators.filterOperator, predicate);
    },
    /**
     * @sig
     * @description d
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @param {number} bufferAmt - c
     * @return {observable} - d
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var bufferAmt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        return this.lift(Object.create(_operators.groupByOperator).init(keySelector, comparer, bufferAmt));
    },
    /**
     * @sig
     * @description d
     * @param {Array} observables - a
     * @return {observable} - b
     */
    merge: function _merge() {
        for (var _len = arguments.length, observables = Array(_len), _key = 0; _key < _len; _key++) {
            observables[_key] = arguments[_key];
        }

        //TODO: fix merge operator - it doesn't appear to be working as intended
        return this.mergeMap.apply(this, [null].concat(observables));
    },
    /**
     * @sig
     * @description d
     * @param {function} fn - a
     * @param {observable} observables - b
     * @return {observable} - c
     */
    mergeMap: function _mergeMap(fn) {
        //TODO: fix merge operator - it doesn't appear to be working as intended
        fn = fn || _combinators.identity;

        for (var _len2 = arguments.length, observables = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            observables[_key2 - 1] = arguments[_key2];
        }

        if (_operators.mergeOperator.isPrototypeOf(this.operator)) return this.lift.call(this.source, Object.create(_operators.mergeOperator).init([this].concat(observables, this.operator.observables)));
        return this.lift(Object.create(_operators.mergeOperator).init([this].concat(observables), fn));

        /*
        if (delegatesTo(this.operator, mergeOperator))
            return this.lift.call(this.source, Object.create(mergeOperator).init(fn, [this].concat(observables, this.operator.observables)));
        return op.call(this, mergeOperator, fn, [this].concat(observables));
        */
    },
    /**
     * @sig
     * @description d
     * @param {Number} count - a
     * @return {observable} - b
     */
    itemBuffer: function _itemBuffer(count) {
        return op.call(this, _operators.itemBufferOperator, count);
    },
    /**
     * @sig
     * @description d
     * @param {Number} amt - a
     * @return {observable} - b
     */
    timeBuffer: function _timeBuffer(amt) {
        return op.call(this, _operators.timeBufferOperator, amt);
    },
    /**
     * @sig
     * @description d
     * @param {Number} amt - a
     * @return {*|observable} - b
     */
    debounce: function _debounce(amt) {
        return op.call(this, _operators.debounceOperator, amt);
    },
    /**
     * @sig
     * @description d
     * @param {function} operator - a
     * @return {observable} - b
     */
    lift: function lift(operator) {
        return Object.create(observable).setSource(this).setOperator(operator);
    },
    /**
     * @sig
     * @description d
     * @param {*} src - a
     * @param {string} evt - b
     * @return {observable} - c
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
                subscriber.status = _helpers.observableStatus.complete;
                return source.removeEventListener(event, eventHandler);
            }
            source.addEventListener(event, eventHandler);
            subscriber.unsubscribe = unSub;
            return subscriber;
        };
        return o;
    },
    //Not actual property, just naming it this temporarily until I figure out how to make this work
    //and determine a better name for it.
    fromInterval: function _fromInterval(fn) {
        var o = Object.create(observable);
        o.subscribe = function _subscribe(subscriber) {
            var res = fn(function _cb(val) {
                return subscriber.next(val);
            });

            subscriber.unsubscribe = function _unSub() {
                subscriber.status = _helpers.observableStatus.complete;
                clearInterval(res);
            };

            return subscriber;
        };

        return o;
    },
    /**
     * @sig
     * @description d
     * @param {Array} list - a
     * @param {Number} startingIdx - b
     * @return {observable} - c
     */
    fromList: function _fromList(list) {
        var startingIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var o = Object.create(observable);
        o.source = list;
        o.idx = startingIdx;
        o.subscribe = function _subscribe(subscriber) {
            function unSub() {
                this.status = _helpers.observableStatus.complete;
            }

            var runner = function _runner() {
                if (subscriber.status !== _helpers.observableStatus.paused && subscriber.status !== _helpers.observableStatus.complete && this.idx < this.source.length) {
                    Promise.resolve(this.source[this.idx++]).then(function _resolve(val) {
                        subscriber.next(val);
                        runner();
                    });
                } else {
                    var d = subscriber;
                    while (d.subscriber.subscriber) {
                        d = d.subscriber;
                    }d.unsubscribe();
                }
            }.bind(this);

            Promise.resolve().then(function _callRunner() {
                runner();
            });

            subscriber.unsubscribe = unSub;
            return subscriber;

            /*
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
            */

            /*
            Promise.resolve()
                .then(function _callRunner() {
                    ((function _runner() {
                        if (subscriber.status !== observableStatus.paused && subscriber.status !== observableStatus.complete &&
                            this.idx < this.source.length) {
                            for (let item of source) {
                                Promise.resolve(item)
                                    .then(function _resolve(val) {
                                        subscriber.next(val);
                                        _runner();
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
                    }).bind(this))();
                });
            */

            //subscriber.unsubscribe = unSub;
            //return subscriber;
        };
        return o;
    },
    fromArray: function _fromArray(arr) {
        var startingIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    },
    /**
     * @sig
     * @description Creates a new observable from a generator function
     * @param {*} src - a
     * @return {observable} - b
     */
    fromGenerator: function _fromGenerator(src) {
        var o = Object.create(observable);
        o.source = src;
        o.subscribe = function _subscribe(subscriber_next, error, complete) {
            var it = this.source();
            (function _runner() {
                if ('object' !== (typeof subscriber_next === 'undefined' ? 'undefined' : _typeof(subscriber_next)) || subscriber_next.status !== _helpers.observableStatus.paused && subscriber_next.status !== _helpers.observableStatus.complete) {
                    Promise.resolve(it.next()).then(function _then(val) {
                        if (!val.done) {
                            if ('function' === typeof subscriber_next) subscriber_next(val.value);else subscriber_next.next(val.value);
                            _runner();
                        }
                    });
                } else if ('function' !== typeof subscriber_next) {
                    this.unsubscribe();
                } else complete();
            }).bind(this)();
        };
        return o;
    },
    /**
     * @sig
     * @description d
     * @param {*} src - a
     * @return {observable} - Returns a new observable
     */
    from: function _from(src) {
        if (_helpers.generatorProto.isPrototypeOf(src)) return this.fromGenerator(src);
        return this.fromList(src[Symbol.iterator] ? src : (0, _functionalHelpers.wrap)(src));
    },
    /**
     * @sig
     * @description Creates a new subscriber for this observable. Takes three function handlers;
     * a 'next' handler that receives each item after having passed through the lower
     * level subscribers, an 'error' handler that is called if an exception is thrown
     * while the stream is active, and a complete handler that is called whenever the
     * stream is done.
     * @param {function} next - A function handler
     * @param {function} error - A function handler
     * @param {function} complete - A function handler
     * @return {subscriber} - a
     */
    subscribe: function _subscribe(next, error, complete) {
        var s = Object.create(_subscriber.subscriber).initialize(next, error, complete);
        if (this.operator) this.operator.subscribe(s, this.source);
        return s;
    },
    /**
     * @sig
     * @description d
     * @param {function} next - a
     * @return {*} - b
     */
    onValue: function _onValue(next) {
        var s = Object.create(_subscriber.subscriber).initialize(next, _functionalHelpers.noop, _functionalHelpers.noop);
        if (this.operator) this.operator.subscriber(s, this.source);
        return s;
    }
};

function op(operator) {
    var _Object$create;

    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
    }

    return this.lift((_Object$create = Object.create(operator)).init.apply(_Object$create, args));
}

exports.observable = observable;

},{"../combinators":330,"../functionalHelpers":345,"../helpers":346,"./streamOperators/operators":358,"./subscribers/subscriber":367}],350:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainOperator = undefined;

var _chainSubscriber = require('../subscribers/chainSubscriber');

var _operator_helpers = require('./operator_helpers');

var _functionalHelpers = require('../../functionalHelpers');

var chainOperator = {
    init: (0, _operator_helpers.initOperator)(['transform', _functionalHelpers.noop]),
    subscribe: function _subscribe(subscriber, source) {
        return _operator_helpers.subscribe.call(this, subscriber, source, _chainSubscriber.chainSubscriber);
    }
};

exports.chainOperator = chainOperator;

},{"../../functionalHelpers":345,"../subscribers/chainSubscriber":360,"./operator_helpers":357}],351:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounceOperator = undefined;

var _debounceSubscriber = require('../subscribers/debounceSubscriber');

var _operator_helpers = require('./operator_helpers');

var debounceOperator = {
    init: function _init(amt) {
        this.interval = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_debounceSubscriber.debounceSubscriber).init(subscriber, this.interval));
    }
};

exports.debounceOperator = debounceOperator;

},{"../subscribers/debounceSubscriber":361,"./operator_helpers":357}],352:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filterOperator = undefined;

var _filterSubscriber = require('../subscribers/filterSubscriber');

var _operator_helpers = require('./operator_helpers');

var _functionalHelpers = require('../../functionalHelpers');

var filterOperator = {
    init: (0, _operator_helpers.initOperator)(['predicate', _functionalHelpers.defaultPredicate]),
    subscribe: function _subscribe(subscriber, source) {
        return _operator_helpers.subscribe.call(this, subscriber, source, _filterSubscriber.filterSubscriber);
    }
};

exports.filterOperator = filterOperator;

},{"../../functionalHelpers":345,"../subscribers/filterSubscriber":362,"./operator_helpers":357}],353:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupByOperator = undefined;

var _groupBySubscriber = require('../subscribers/groupBySubscriber');

var _operator_helpers = require('./operator_helpers');

var groupByOperator = {
    init: (0, _operator_helpers.initOperator)('keySelector', 'comparer', 'bufferSize'),
    subscribe: function _subscribe(subscriber, source) {
        return _operator_helpers.subscribe.call(this, subscriber, source, _groupBySubscriber.groupBySubscriber);
    }
};

exports.groupByOperator = groupByOperator;

},{"../subscribers/groupBySubscriber":363,"./operator_helpers":357}],354:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.itemBufferOperator = undefined;

var _itemBufferSubscriber = require('../subscribers/itemBufferSubscriber');

var _operator_helpers = require('./operator_helpers');

var itemBufferOperator = {
    init: (0, _operator_helpers.initOperator)('count'),
    subscribe: function _subscribe(subscriber, source) {
        return _operator_helpers.subscribe.call(this, subscriber, source, _itemBufferSubscriber.itemBufferSubscriber);
    }
};

exports.itemBufferOperator = itemBufferOperator;

},{"../subscribers/itemBufferSubscriber":364,"./operator_helpers":357}],355:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapOperator = undefined;

var _mapSubscriber = require('../subscribers/mapSubscriber');

var _operator_helpers = require('./operator_helpers');

var _combinators = require('../../combinators');

var mapOperator = {
    init: (0, _operator_helpers.initOperator)(['transform', _combinators.identity]),
    subscribe: function _subscribe(subscriber, source) {
        return _operator_helpers.subscribe.call(this, subscriber, source, _mapSubscriber.mapSubscriber);
    }
};

exports.mapOperator = mapOperator;

},{"../../combinators":330,"../subscribers/mapSubscriber":365,"./operator_helpers":357}],356:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeOperator = undefined;

var _mergeSubscriber = require('../subscribers/mergeSubscriber');

var _operator_helpers = require('./operator_helpers');

var mergeOperator = {
    //TODO: update this to take an optional 'merge' function that defaults to an identity for each observable if not provided
    get observables() {
        return this._observables || [];
    },
    set observables(arr) {
        this._observables = arr;
    },
    init: function _init(observables, transform) {
        //TODO: fix merge operator - it doesn't appear to be working as intended
        this.observables = observables;
        this.transform = transform;
        return this;
    },
    //TODO: update this to take an optional 'merge' function that defaults to an identity for each observable if not provided
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_mergeSubscriber.mergeSubscriber).init(subscriber, this.observables, this.transform));
        //return subscribe.call(this, subscriber, source, mergeSubscriber);
    }
};

exports.mergeOperator = mergeOperator;

},{"../subscribers/mergeSubscriber":366,"./operator_helpers":357}],357:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createGettersAndSetters(obj) {
    for (var _len = arguments.length, props = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        props[_key - 1] = arguments[_key];
    }

    props.forEach(function _assignProps(prop) {
        var propName = void 0,
            defaultVal = void 0;
        if (Array.isArray(prop)) {
            propName = prop[0];
            defaultVal = prop[1];
        } else {
            propName = prop;
        }

        Object.defineProperty(obj, propName, {
            get: function _get() {
                return this["_" + propName] || defaultVal;
            },
            set: function _set(val) {
                this["_" + propName] = val;
            }
        });
    });
    return obj;
}

function subscribe(subscriber, source, operatorSubscriber) {
    var _Object$create,
        _this = this;

    if (this.observables) {
        //console.log(...getSetters(this).map(prop => this[prop]));
        //console.log(Object.getPrototypeOf(operatorSubscriber));
    }
    return source.subscribe((_Object$create = Object.create(operatorSubscriber)).init.apply(_Object$create, [subscriber].concat(_toConsumableArray(getSetters(this).map(function (prop) {
        return _this[prop];
    })))));
}

function initOperator() {
    for (var _len2 = arguments.length, props = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        props[_key2] = arguments[_key2];
    }

    return function _initOperator() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        return executeOnSetters(createGettersAndSetters.apply(undefined, [this].concat(props)), setDefaultValues(props.map(function (prop) {
            return !Array.isArray(prop) ? prop : prop[0];
        }), args));
    };
}

function setDefaultValues(props, args) {
    return function _cb(objectProp, idx) {
        if (props.includes(objectProp)) {
            this[objectProp] = args[idx];
        }
    };
}

function getSetters(obj) {
    return Object.getOwnPropertyNames(obj).filter(function (prop) {
        return Object.getOwnPropertyDescriptor(obj, prop).set;
    });
}

function executeOnSetters(obj, fn) {
    getSetters(obj).forEach(fn, obj);
    return obj;
}

exports.createGettersAndSetters = createGettersAndSetters;
exports.initOperator = initOperator;
exports.subscribe = subscribe;

},{}],358:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeBufferOperator = exports.mergeOperator = exports.mapOperator = exports.itemBufferOperator = exports.groupByOperator = exports.filterOperator = exports.chainOperator = exports.debounceOperator = undefined;

var _debounceOperator = require('./debounceOperator');

var _chainOperator = require('./chainOperator');

var _filterOperator = require('./filterOperator');

var _groupByOperator = require('./groupByOperator');

var _itemBufferOperator = require('./itemBufferOperator');

var _mapOperator = require('./mapOperator');

var _mergeOperator = require('./mergeOperator');

var _timeBufferOperator = require('./timeBufferOperator');

exports.debounceOperator = _debounceOperator.debounceOperator;
exports.chainOperator = _chainOperator.chainOperator;
exports.filterOperator = _filterOperator.filterOperator;
exports.groupByOperator = _groupByOperator.groupByOperator;
exports.itemBufferOperator = _itemBufferOperator.itemBufferOperator;
exports.mapOperator = _mapOperator.mapOperator;
exports.mergeOperator = _mergeOperator.mergeOperator;
exports.timeBufferOperator = _timeBufferOperator.timeBufferOperator;

},{"./chainOperator":350,"./debounceOperator":351,"./filterOperator":352,"./groupByOperator":353,"./itemBufferOperator":354,"./mapOperator":355,"./mergeOperator":356,"./timeBufferOperator":359}],359:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timeBufferOperator = undefined;

var _timeBufferSubscriber = require('../subscribers/timeBufferSubscriber');

var _operator_helpers = require('./operator_helpers');

var timeBufferOperator = {
    init: (0, _operator_helpers.initOperator)(['interval', 0]),
    subscribe: function _subscribe(subscriber, source) {
        return _operator_helpers.subscribe.call(this, subscriber, source, _timeBufferSubscriber.timeBufferSubscriber);
    }
};

exports.timeBufferOperator = timeBufferOperator;

},{"../subscribers/timeBufferSubscriber":368,"./operator_helpers":357}],360:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainSubscriber = undefined;

var _subscriber = require('./subscriber');

var _functionalHelpers = require('../../functionalHelpers');

var _observable = require('../observable');

var chainSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            var mappedResult;
            try {
                mappedResult = this.transform(item, this.count++);
                //TODO: figure out what needs to be done to pull the item out of the inner observable
                this.subscriber.next((0, _functionalHelpers.delegatesTo)(mappedResult, _observable.observable) ? mappedResult.source : mappedResult);
            } catch (err) {
                this.subscriber.error(err);
            }
            //Promise.resolve(mappedResult).then(this.then);
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, transform) {
            this.initialize(subscriber);
            this.transform = transform;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.chainSubscriber = chainSubscriber;

},{"../../functionalHelpers":345,"../observable":349,"./subscriber":367}],361:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounceSubscriber = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _subscriber = require('./subscriber');

var _helpers = require('../../helpers');

var debounceSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            if (null != this.id) this.tearDownTimeout();
            this.lastItem = item;
            this.lastTick = Date.now();
            this.id = setTimeout(this.getTimeoutFunc.bind(this), this.interval, item);
        }
    },
    init: {
        value: function _init(subscriber, interval) {
            this.initialize(subscriber);
            this.lastTick = null;
            this.lastItem = undefined;
            this.interval = interval;
            this.id = null;
            return this;
        }
    },
    getTimeoutFunc: {
        get: function _getTimeoutFunc() {
            return function timeoutFunc(item) {
                var thisTick = Date.now();
                if (this.lastTick <= thisTick - this.interval) {
                    var tmp = this.lastItem;
                    this.lastItem = undefined;
                    this.lastTick = thisTick;
                    this.subscriber.next(tmp);
                } else {
                    this.lastTick = thisTick;
                    this.lastItem = item;
                }
            };
        }
    },
    cleanUp: {
        value: function _cleanUp() {
            this.tearDownTimeout();
            this.lastTick = undefined;
            this.lastItem = undefined;
        }
    },
    tearDownTimeout: {
        value: function _tearDownTimeout() {
            if (this.id && _helpers.javaScriptTypes.Number === _typeof(this.id)) {
                clearTimeout(this.id);
                this.id = null;
            }
        }
    }
});

exports.debounceSubscriber = debounceSubscriber;

},{"../../helpers":346,"./subscriber":367}],362:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filterSubscriber = undefined;

var _subscriber = require('./subscriber');

var filterSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            try {
                if (this.predicate(item, this.count++)) this.subscriber.next(item);
                //Promise.resolve(item).then(this.then);
            } catch (err) {
                this.subscriber.error(err);
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, predicate) {
            this.initialize(subscriber);
            this.predicate = predicate;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.filterSubscriber = filterSubscriber;

},{"./subscriber":367}],363:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupBySubscriber = undefined;

var _subscriber = require('./subscriber');

var _sort_util = require('../../dataStructures/sort_util');

var groupBySubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            if (this.buffer.length + 1 >= this.bufferAmount) {
                try {
                    var res = groupData(this.buffer.concat(item), [{ keySelector: this.keySelector, comparer: this.comparer, direction: 2 }]);
                    this.subscriber.next(res);
                    this.buffer.length = 0;
                } catch (ex) {
                    this.subscriber.error(ex);
                }
            } else this.buffer[this.buffer.length] = item;
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, keySelector, comparer, bufferSize) {
            this.initialize(subscriber);
            this.keySelector = keySelector;
            this.comparer = comparer;
            this.bufferAmount = bufferSize;
            this.buffer = [];
            return this;
        },
        writable: false,
        configurable: false
    }
});

function groupData(data, groupObject) {
    var sortedData = (0, _sort_util.sortData)(data, groupObject),
        retData = [];

    sortedData.forEach(function _groupSortedData(item) {
        var grp = retData;
        groupObject.forEach(function _createGroupsByFields(group) {
            grp = findGroup(grp, group.keySelector(item));
        });
        grp[grp.length] = item;
    });

    return retData;
}

function findGroup(arr, field) {
    var grp;
    if (arr.some(function _findGroup(group) {
        if (group.key === field) {
            grp = group;
            return true;
        }
    })) return grp;else {
        grp = [];
        grp.key = field;
        arr.push(grp);
        return grp;
    }
}

exports.groupBySubscriber = groupBySubscriber;

},{"../../dataStructures/sort_util":342,"./subscriber":367}],364:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.itemBufferSubscriber = undefined;

var _subscriber = require('./subscriber');

var itemBufferSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(val) {
            this.buffer[this.buffer.length] = val;
            if (this.buffer.length >= this.count) {
                this.subscriber.next(this.buffer.map(function _mapBuffer(item) {
                    return item;
                }));
                this.buffer.length = 0;
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, count) {
            this.initialize(subscriber);
            this.buffer = [];
            this.count = count;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.itemBufferSubscriber = itemBufferSubscriber;

},{"./subscriber":367}],365:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapSubscriber = undefined;

var _subscriber = require('./subscriber');

var mapSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            var res;
            try {
                res = this.transform(item, this.count++);
            } catch (err) {
                this.subscriber.error(err);
                return;
            }
            this.subscriber.next(res);
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, transform) {
            this.initialize(subscriber);
            this.transform = transform;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.mapSubscriber = mapSubscriber;

},{"./subscriber":367}],366:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeSubscriber = undefined;

var _subscriber = require('./subscriber');

var mergeSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            if (this.transform) {
                var res;
                try {
                    res = this.transform(item, this.count++);
                } catch (err) {
                    this.subscriber.error(err);
                    return;
                }
                //Promise.resolve(res).then(this.then);
                this.subscriber.next(res);
            } else this.subscriber.next(item);
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, observables, transform) {
            this.transform = transform;
            observables.forEach(function _subscribeToEach(observable) {
                observable.subscribe(this);
            }, this);
            this.initialize(subscriber);
            return this;
        },
        writable: false,
        configurable: false
    }
});

/*
var mergeSubscriber = Object.create(subscriber, {
    next: {
        value: function _next(item) {
            if (this.transform) {
                var res;
                try {
                    res = this.transform(item, this.count++);
                }
                catch (err) {
                    this.subscriber.error(err);
                    return;
                }
                //Promise.resolve(res).then(this.then);
                this.subscriber.next(res);
            }
            else this.subscriber.next(item);
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, observables, transform) {
            console.log(Array.prototype.slice.call(arguments)[2]);
            this.transform = transform;
            observables.forEach(function _subscribeToEach(observable) {
                observable.subscribe(this);
            }, this);
            this.initialize(subscriber);
            return this;
        },
        writable: false,
        configurable: false
    }
});
*/

exports.mergeSubscriber = mergeSubscriber;

},{"./subscriber":367}],367:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subscriber = undefined;

var _helpers = require('../../helpers');

/**
 * @namespace stream
 */

/**
 * @typedef {Object}
 * @property {function} status
 * @property {function} count
 * @property {function} removeSubscriber
 * @property {function} removeSubscription
 * @property {function} removeSubscriptions
 * @property {function} next
 * @property {function} error
 * @property {function} complete
 * @property {function} initialize
 * @property {function} onNext
 * @property {function} onError
 * @property {function} onComplete
 * @memberOf stream
 * @description:
 */
var subscriber = {
    get status() {
        return this._status || _helpers.observableStatus.inactive;
    },
    set status(status) {
        this._status = Object.keys(_helpers.observableStatus).map(function _statusValues(status) {
            return _helpers.observableStatus[status];
        }).includes(status) ? status : _helpers.observableStatus.inactive;
    },
    get count() {
        return this._count || 0;
    },
    set count(cnt) {
        this._count = cnt || 0;
    },
    /**
     * @sig
     * @description d
     * @return {subscriber} - a
     */
    removeSubscriber: function _removeSubscriber() {
        this.subscriber = null;
        return this;
    },
    /**
     * @sig
     * @description d
     * @param {Object} subscription - a
     * @return {subscription} - b
     */
    removeSubscription: function _removeSubscription(subscription) {
        if (this.subscriptions.length) {
            this.subscriptions = this.subscriptions.filter(function _findSubscriber(sub) {
                return sub !== subscription;
            });
        }
    },
    /**
     * @sig
     * @description d
     * @return {subscriber} - a
     */
    removeSubscriptions: function _removeSubscriptions() {
        this.subscriptions.length = 0;
        return this;
    },
    /**
     * @sig
     * @description d
     * @param {*} item - a
     * @return {subscriber} - b
     */
    next: function _next(item) {
        this.subscriber.next(item);
        return this;
        //Promise.resolve(item).then(this.then);
    },
    error: function _error(err) {
        this.status = _helpers.observableStatus.complete;
        this.subscriber.error(err);
    },
    complete: function _complete() {
        this.status = _helpers.observableStatus.complete;
        if (this.subscriber && _helpers.observableStatus.complete !== this.subscriber.status) this.subscriber.complete();
    },
    initialize: function _initialize(next, error, complete) {
        this.status = _helpers.observableStatus.active;
        this.count = 0;
        this.subscriptions = [];
        this.then = function _then(val) {
            return this.subscriber.next(val);
        }.bind(this);

        if (subscriber.isPrototypeOf(next)) {
            this.subscriber = next;
            next.subscriptions = next.subscriptions ? next.subscriptions.concat(this) : [this];
            return this;
        }
        this.subscriber = {
            next: next,
            error: error,
            complete: complete
        };
        return this;
    },
    onError: function _onError(error) {
        this.subscriber.error = error;
        return this;
    },
    onComplete: function _onComplete(complete) {
        this.subscriber.complete = complete;
        return this;
    },
    unsubscribe: function _unsubscribe() {
        if (_helpers.observableStatus.complete === this.status) return;
        this.complete();
        if (this.subscriber && subscriber.isPrototypeOf(this.subscriber)) {
            var sub = this.subscriber;
            this.subscriber = null;
            sub.unsubscribe();
        }

        while (this.subscriptions.length) {
            var subscription = this.subscriptions.shift();
            if (subscription.cleanUp) subscription.cleanUp();
            subscription.unsubscribe();
        }
    }
};

exports.subscriber = subscriber;

},{"../../helpers":346}],368:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timeBufferSubscriber = undefined;

var _subscriber = require('./subscriber');

var timeBufferSubscriber = Object.create(_subscriber.subscriber, {
    id: {
        get: function _getId() {
            return this._id || 0;
        },
        set: function _setId(val) {
            this._id = val;
        }
    },
    next: {
        value: function _next(val) {
            this.buffer[this.buffer.length] = val;
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, interval) {
            this.initialize(subscriber);
            this.buffer = [];
            this.now = Date.now;

            function _interval() {
                if (this.buffer.length) {
                    //the map is needed here because, due to the asynchronous nature of subscribers and the subsequent
                    //clearing of the buffer, the subscriber#next argument would be nullified before it had a chance
                    //to act on it.
                    this.subscriber.next(this.buffer.map(function _mapBuffer(item) {
                        return item;
                    }));
                    this.buffer.length = 0;
                }
            }

            this.id = setInterval(_interval.bind(this), interval);
            return this;
        },
        writable: false,
        configurable: false
    },
    cleanUp: {
        value: function _cleanUp() {
            clearInterval(this.id);
            this.buffer.length = 0;
        },
        writable: false,
        configurable: false
    }
});

exports.timeBufferSubscriber = timeBufferSubscriber;

},{"./subscriber":367}],369:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.taking = exports.dropping = exports.reduce = exports.transduce = exports.mapped = exports.filterReducer = exports.mapReducer = exports.filtering = exports.mapping = undefined;

var _combinators = require('./combinators');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @module transducers */

/**
 * @signature
 * @description d
 * @kind function
 * @function mapping
 * @param {function} f - a
 * @return {*} - b
 */
var mapping = (0, _combinators.curry)(function _mapping(mapFn, reduceFn, result, input) {
    return reduceFn(result, mapFn(input));
});

/**
 * @signature
 * @description d
 * @kind function
 * @function filtering
 * @param {function} predicate - a
 * @param {function} reduceFn - b
 * @param {*} result - c
 * @param {Array} input - d
 * @return {*} - d
 */
var filtering = (0, _combinators.curry)(function _filtering2(predicate, reduceFn, result, input) {
    return predicate(input) ? reduceFn(result, input) : result;
});

/**
 * @signature
 * @description d
 * @param {function} mapFn - a
 * @return {function} - b
 */
function mapReducer(mapFn) {
    return function _mapReducer(result, input) {
        return result.concat(mapFn(input));
    };
}

/**
 * @signature
 * @description d
 * @param {function} predicate - a
 * @return {function} - b
 */
function filterReducer(predicate) {
    return function _filterReducer(result, input) {
        return predicate(input) ? result.concat(input) : result;
    };
}

/**
 * @signature
 * @description d
 * @kind function
 * @function mapped
 * @param {function} f - a
 * @param {*} x - b
 * @return {*} - c
 */
var mapped = (0, _combinators.curry)(function _mapped(f, x) {
    return (0, _combinators.identity)(map((0, _combinators.compose)(function _mCompose(x) {
        return x.value;
    }, f), x));
});

/**
 * @signature
 * @face
 * @description d
 * @param {function} xform - a
 * @param {function} reducing - b
 * @param {*} initial - c
 * @param {*} input - d
 * @return {*} - e
 */
var transduce = function transduce(xform, reducing, initial, input) {
    return input.reduce(xform(reducing), initial);
};

/**
 * @signature
 * @description d
 * @param {*} txf - a
 * @param {*} acc - b
 * @param {*} xs - c
 * @return {*} - d
 */
var reduce = function reduce(txf, acc, xs) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = xs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            var next = txf(acc, item); //we could also pass an index or xs, but K.I.S.S.
            acc = next && next[reduce.stopper] || next; // {[reduce.stopper]:value} or just a value
            if (next[reduce.stopper]) {
                break;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return acc;
};

Object.defineProperty(reduce, 'stopper', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Symbol('stop reducing') //no possible computation could come up with this by accident
});

/**
 * @signature
 * @description d
 * @param {number} skips - a
 * @return {function} - b
 */
function dropping(skips) {
    return function _dropping2(reducingFunc) {
        return function _dropping2_(acc, item) {
            return 0 <= --skips ? acc : reducingFunc(acc, item);
        };
    };
}

/*
var taking = allows => reducerFn => (acc, item) => {
    let result = reducerFn(acc, item);
    return 0 < --allows ? result : { [reduce.stopper]: result };
};
*/

/**
 * @signature
 * @description d
 * @param {*} allows - a
 * @return {function} - b
 */
var taking = function taking(allows) {
    return function (reducerFn) {
        var _allows = allows;
        return function (acc, item) {
            return 0 < --_allows ? reducerFn(acc, item) : _defineProperty({}, reduce.stopper, reducerFn(acc, item));
        };
    };
};

//var map = curry((mapFn, redFn) => (xs, x) => redFn(xs, mapFn(x)));
//var inc = reduce(map(add(1), concat), []);

//var filter = curry((predFn, redFn) => (xs, x) => predFn(x) ? redFn(xs, x) : xs);
//var greaterThanOne = reduce(filter(x => 1 < x, concat), []);

//var transduce2 = curry((xForm, f, init, coll) => reduce(xForm(f), init, coll));
//console.log(transduce2(map(add(1)), concat, [], [1, 2, 3, 4]));

exports.mapping = mapping;
exports.filtering = filtering;
exports.mapReducer = mapReducer;
exports.filterReducer = filterReducer;
exports.mapped = mapped;
exports.transduce = transduce;
exports.reduce = reduce;
exports.dropping = dropping;
exports.taking = taking;

},{"./combinators":330}]},{},[1]);
