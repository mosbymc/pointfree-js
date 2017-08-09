(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('babel-polyfill');

window.pjs = {
    monads: require('./src/containers/monads/monads').monads,
    functors: require('./src/containers/functors/functors').functors,
    groups: require('./src/groups/groups'),
    stream: require('./src/streams/observable'),
    combinators: require('./src/combinators'),
    decorators: require('./src/decorators'),
    transducers: require('./src/transducers'),
    lenses: require('./src/lenses'),
    functionalHelpers: require('./src/functionalHelpers')
};

/*
module.exports = {
    monads: require('./src/containers/monads/monads'),
    functors: require('./src/containers/functors/functors'),
    groups: require('./src/groups/groups'),
    stream: require('./src/streams/observable'),
    combinators: require('./src/combinators'),
    decorators: require('./src/decorators'),
    transducers: require('./src/transducers'),
    lenses: require('./src/lenses'),
    functionalHelpers: require('./src/functionalHelpers')
};
*/

/*
import { observable } from 'src/streams/observable';
import { monads } from 'src/containers/monads/monads';
import { functors } from 'src/containers/functors/functors';
import * as groups from 'src/groups/groups';
import * as combinators from 'src/combinators';
import * as decorators from 'src/decorators';
import * as functionalHelpers from 'src/functionalHelpers';
import * as lenses from 'src/lenses';
import * as transducers from 'src/transducers';
import * as functionalContainerHelpers from 'src/functionalContainerHelpers';
import * as pointlessContainers from 'src/pointlessContainers';

window.observable = observable;
window.monads = monads;
window.functors = functors;
window.groups = groups;
window.combinators = combinators;
window.decorators = decorators;
window.functionalHelpers = functionalHelpers;
window.lenses = lenses;
window.transducers = transducers;
window.functionalContainerHelpers = functionalContainerHelpers;
window.pointlessContainer = pointlessContainers;
*/
},{"./src/combinators":298,"./src/containers/functors/functors":302,"./src/containers/monads/monads":318,"./src/decorators":321,"./src/functionalHelpers":322,"./src/groups/groups":324,"./src/lenses":326,"./src/streams/observable":328,"./src/transducers":347,"babel-polyfill":2}],2:[function(require,module,exports){
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
},{"core-js/fn/regexp/escape":3,"core-js/shim":296,"regenerator-runtime/runtime":297}],3:[function(require,module,exports){
require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;
},{"../../modules/_core":24,"../../modules/core.regexp.escape":120}],4:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],5:[function(require,module,exports){
var cof = require('./_cof');
module.exports = function(it, msg){
  if(typeof it != 'number' && cof(it) != 'Number')throw TypeError(msg);
  return +it;
};
},{"./_cof":19}],6:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./_hide":41,"./_wks":118}],7:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],8:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":50}],9:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments.length > 2 ? arguments[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./_to-index":106,"./_to-length":109,"./_to-object":110}],10:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object')
  , toIndex  = require('./_to-index')
  , toLength = require('./_to-length');
module.exports = function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , aLen   = arguments.length
    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
    , end    = aLen > 2 ? arguments[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./_to-index":106,"./_to-length":109,"./_to-object":110}],11:[function(require,module,exports){
var forOf = require('./_for-of');

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":38}],12:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":106,"./_to-iobject":108,"./_to-length":109}],13:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./_ctx')
  , IObject  = require('./_iobject')
  , toObject = require('./_to-object')
  , toLength = require('./_to-length')
  , asc      = require('./_array-species-create');
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./_array-species-create":16,"./_ctx":26,"./_iobject":46,"./_to-length":109,"./_to-object":110}],14:[function(require,module,exports){
var aFunction = require('./_a-function')
  , toObject  = require('./_to-object')
  , IObject   = require('./_iobject')
  , toLength  = require('./_to-length');

module.exports = function(that, callbackfn, aLen, memo, isRight){
  aFunction(callbackfn);
  var O      = toObject(that)
    , self   = IObject(O)
    , length = toLength(O.length)
    , index  = isRight ? length - 1 : 0
    , i      = isRight ? -1 : 1;
  if(aLen < 2)for(;;){
    if(index in self){
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if(isRight ? index < 0 : length <= index){
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for(;isRight ? index >= 0 : length > index; index += i)if(index in self){
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};
},{"./_a-function":4,"./_iobject":46,"./_to-length":109,"./_to-object":110}],15:[function(require,module,exports){
var isObject = require('./_is-object')
  , isArray  = require('./_is-array')
  , SPECIES  = require('./_wks')('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};
},{"./_is-array":48,"./_is-object":50,"./_wks":118}],16:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};
},{"./_array-species-constructor":15}],17:[function(require,module,exports){
'use strict';
var aFunction  = require('./_a-function')
  , isObject   = require('./_is-object')
  , invoke     = require('./_invoke')
  , arraySlice = [].slice
  , factories  = {};

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */){
  var fn       = aFunction(this)
    , partArgs = arraySlice.call(arguments, 1);
  var bound = function(/* args... */){
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if(isObject(fn.prototype))bound.prototype = fn.prototype;
  return bound;
};
},{"./_a-function":4,"./_invoke":45,"./_is-object":50}],18:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":19,"./_wks":118}],19:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],20:[function(require,module,exports){
'use strict';
var dP          = require('./_object-dp').f
  , create      = require('./_object-create')
  , redefineAll = require('./_redefine-all')
  , ctx         = require('./_ctx')
  , anInstance  = require('./_an-instance')
  , defined     = require('./_defined')
  , forOf       = require('./_for-of')
  , $iterDefine = require('./_iter-define')
  , step        = require('./_iter-step')
  , setSpecies  = require('./_set-species')
  , DESCRIPTORS = require('./_descriptors')
  , fastKey     = require('./_meta').fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
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
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./_an-instance":7,"./_ctx":26,"./_defined":28,"./_descriptors":29,"./_for-of":38,"./_iter-define":54,"./_iter-step":56,"./_meta":63,"./_object-create":67,"./_object-dp":68,"./_redefine-all":87,"./_set-species":92}],21:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof')
  , from    = require('./_array-from-iterable');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};
},{"./_array-from-iterable":11,"./_classof":18}],22:[function(require,module,exports){
'use strict';
var redefineAll       = require('./_redefine-all')
  , getWeak           = require('./_meta').getWeak
  , anObject          = require('./_an-object')
  , isObject          = require('./_is-object')
  , anInstance        = require('./_an-instance')
  , forOf             = require('./_for-of')
  , createArrayMethod = require('./_array-methods')
  , $has              = require('./_has')
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};
},{"./_an-instance":7,"./_an-object":8,"./_array-methods":13,"./_for-of":38,"./_has":40,"./_is-object":50,"./_meta":63,"./_redefine-all":87}],23:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , $export           = require('./_export')
  , redefine          = require('./_redefine')
  , redefineAll       = require('./_redefine-all')
  , meta              = require('./_meta')
  , forOf             = require('./_for-of')
  , anInstance        = require('./_an-instance')
  , isObject          = require('./_is-object')
  , fails             = require('./_fails')
  , $iterDetect       = require('./_iter-detect')
  , setToStringTag    = require('./_set-to-string-tag')
  , inheritIfRequired = require('./_inherit-if-required');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO = !IS_WEAK && fails(function(){
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C()
          , index     = 5;
        while(index--)$instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base, target, C);
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./_an-instance":7,"./_export":33,"./_fails":35,"./_for-of":38,"./_global":39,"./_inherit-if-required":44,"./_is-object":50,"./_iter-detect":55,"./_meta":63,"./_redefine":88,"./_redefine-all":87,"./_set-to-string-tag":93}],24:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],25:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp')
  , createDesc      = require('./_property-desc');

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};
},{"./_object-dp":68,"./_property-desc":86}],26:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":4}],27:[function(require,module,exports){
'use strict';
var anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive')
  , NUMBER      = 'number';

module.exports = function(hint){
  if(hint !== 'string' && hint !== NUMBER && hint !== 'default')throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};
},{"./_an-object":8,"./_to-primitive":111}],28:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],29:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":35}],30:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":39,"./_is-object":50}],31:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],32:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":74,"./_object-keys":77,"./_object-pie":78}],33:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , hide      = require('./_hide')
  , redefine  = require('./_redefine')
  , ctx       = require('./_ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
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
},{"./_core":24,"./_ctx":26,"./_global":39,"./_hide":41,"./_redefine":88}],34:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"./_wks":118}],35:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],36:[function(require,module,exports){
'use strict';
var hide     = require('./_hide')
  , redefine = require('./_redefine')
  , fails    = require('./_fails')
  , defined  = require('./_defined')
  , wks      = require('./_wks');

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , fns      = exec(defined, SYMBOL, ''[KEY])
    , strfn    = fns[0]
    , rxfn     = fns[1];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return rxfn.call(string, this); }
    );
  }
};
},{"./_defined":28,"./_fails":35,"./_hide":41,"./_redefine":88,"./_wks":118}],37:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"./_an-object":8}],38:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method')
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
},{"./_an-object":8,"./_ctx":26,"./_is-array-iter":47,"./_iter-call":52,"./_to-length":109,"./core.get-iterator-method":119}],39:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],40:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],41:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":29,"./_object-dp":68,"./_property-desc":86}],42:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":39}],43:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":29,"./_dom-create":30,"./_fails":35}],44:[function(require,module,exports){
var isObject       = require('./_is-object')
  , setPrototypeOf = require('./_set-proto').set;
module.exports = function(that, target, C){
  var P, S = target.constructor;
  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
    setPrototypeOf(that, P);
  } return that;
};
},{"./_is-object":50,"./_set-proto":91}],45:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
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
  } return              fn.apply(that, args);
};
},{}],46:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":19}],47:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":57,"./_wks":118}],48:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":19}],49:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./_is-object":50}],50:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],51:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object')
  , cof      = require('./_cof')
  , MATCH    = require('./_wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./_cof":19,"./_is-object":50,"./_wks":118}],52:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":8}],53:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":41,"./_object-create":67,"./_property-desc":86,"./_set-to-string-tag":93,"./_wks":118}],54:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":33,"./_has":40,"./_hide":41,"./_iter-create":53,"./_iterators":57,"./_library":59,"./_object-gpo":75,"./_redefine":88,"./_set-to-string-tag":93,"./_wks":118}],55:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":118}],56:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],57:[function(require,module,exports){
module.exports = {};
},{}],58:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":77,"./_to-iobject":108}],59:[function(require,module,exports){
module.exports = false;
},{}],60:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;
},{}],61:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],62:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],63:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":35,"./_has":40,"./_is-object":50,"./_object-dp":68,"./_uid":115}],64:[function(require,module,exports){
var Map     = require('./es6.map')
  , $export = require('./_export')
  , shared  = require('./_shared')('metadata')
  , store   = shared.store || (shared.store = new (require('./es6.weak-map')));

var getOrCreateMetadataMap = function(target, targetKey, create){
  var targetMetadata = store.get(target);
  if(!targetMetadata){
    if(!create)return undefined;
    store.set(target, targetMetadata = new Map);
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if(!keyMetadata){
    if(!create)return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map);
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function(MetadataKey, MetadataValue, O, P){
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function(target, targetKey){
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false)
    , keys        = [];
  if(metadataMap)metadataMap.forEach(function(_, key){ keys.push(key); });
  return keys;
};
var toMetaKey = function(it){
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function(O){
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
},{"./_export":33,"./_shared":95,"./es6.map":150,"./es6.weak-map":256}],65:[function(require,module,exports){
var global    = require('./_global')
  , macrotask = require('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./_cof')(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};
},{"./_cof":19,"./_global":39,"./_task":105}],66:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":35,"./_iobject":46,"./_object-gops":74,"./_object-keys":77,"./_object-pie":78,"./_to-object":110}],67:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
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
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":8,"./_dom-create":30,"./_enum-bug-keys":31,"./_html":42,"./_object-dps":69,"./_shared-key":94}],68:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":8,"./_descriptors":29,"./_ie8-dom-define":43,"./_to-primitive":111}],69:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":8,"./_descriptors":29,"./_object-dp":68,"./_object-keys":77}],70:[function(require,module,exports){
// Forced replacement prototype accessors methods
module.exports = require('./_library')|| !require('./_fails')(function(){
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function(){ /* empty */});
  delete require('./_global')[K];
});
},{"./_fails":35,"./_global":39,"./_library":59}],71:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":29,"./_has":40,"./_ie8-dom-define":43,"./_object-pie":78,"./_property-desc":86,"./_to-iobject":108,"./_to-primitive":111}],72:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":73,"./_to-iobject":108}],73:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":31,"./_object-keys-internal":76}],74:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],75:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":40,"./_shared-key":94,"./_to-object":110}],76:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":12,"./_has":40,"./_shared-key":94,"./_to-iobject":108}],77:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":31,"./_object-keys-internal":76}],78:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],79:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":24,"./_export":33,"./_fails":35}],80:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject')
  , isEnum    = require('./_object-pie').f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"./_object-keys":77,"./_object-pie":78,"./_to-iobject":108}],81:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN     = require('./_object-gopn')
  , gOPS     = require('./_object-gops')
  , anObject = require('./_an-object')
  , Reflect  = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = gOPN.f(anObject(it))
    , getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./_an-object":8,"./_global":39,"./_object-gopn":73,"./_object-gops":74}],82:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat
  , $trim       = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;
},{"./_global":39,"./_string-trim":103,"./_string-ws":104}],83:[function(require,module,exports){
var $parseInt = require('./_global').parseInt
  , $trim     = require('./_string-trim').trim
  , ws        = require('./_string-ws')
  , hex       = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;
},{"./_global":39,"./_string-trim":103,"./_string-ws":104}],84:[function(require,module,exports){
'use strict';
var path      = require('./_path')
  , invoke    = require('./_invoke')
  , aFunction = require('./_a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that = this
      , aLen = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !aLen)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(aLen > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./_a-function":4,"./_invoke":45,"./_path":85}],85:[function(require,module,exports){
module.exports = require('./_global');
},{"./_global":39}],86:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],87:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function(target, src, safe){
  for(var key in src)redefine(target, key, src[key], safe);
  return target;
};
},{"./_redefine":88}],88:[function(require,module,exports){
var global    = require('./_global')
  , hide      = require('./_hide')
  , has       = require('./_has')
  , SRC       = require('./_uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./_core":24,"./_global":39,"./_has":40,"./_hide":41,"./_uid":115}],89:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],90:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],91:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":8,"./_ctx":26,"./_is-object":50,"./_object-gopd":71}],92:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_descriptors":29,"./_global":39,"./_object-dp":68,"./_wks":118}],93:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":40,"./_object-dp":68,"./_wks":118}],94:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":95,"./_uid":115}],95:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":39}],96:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./_an-object')
  , aFunction = require('./_a-function')
  , SPECIES   = require('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":4,"./_an-object":8,"./_wks":118}],97:[function(require,module,exports){
var fails = require('./_fails');

module.exports = function(method, arg){
  return !!method && fails(function(){
    arg ? method.call(null, function(){}, 1) : method.call(null);
  });
};
},{"./_fails":35}],98:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":28,"./_to-integer":107}],99:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp')
  , defined  = require('./_defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./_defined":28,"./_is-regexp":51}],100:[function(require,module,exports){
var $export = require('./_export')
  , fails   = require('./_fails')
  , defined = require('./_defined')
  , quot    = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function(string, tag, attribute, value) {
  var S  = String(defined(string))
    , p1 = '<' + tag;
  if(attribute !== '')p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function(NAME, exec){
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function(){
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};
},{"./_defined":28,"./_export":33,"./_fails":35}],101:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length')
  , repeat   = require('./_string-repeat')
  , defined  = require('./_defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength || fillStr == '')return S;
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":28,"./_string-repeat":102,"./_to-length":109}],102:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./_defined":28,"./_to-integer":107}],103:[function(require,module,exports){
var $export = require('./_export')
  , defined = require('./_defined')
  , fails   = require('./_fails')
  , spaces  = require('./_string-ws')
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
},{"./_defined":28,"./_export":33,"./_fails":35,"./_string-ws":104}],104:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';
},{}],105:[function(require,module,exports){
var ctx                = require('./_ctx')
  , invoke             = require('./_invoke')
  , html               = require('./_html')
  , cel                = require('./_dom-create')
  , global             = require('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":19,"./_ctx":26,"./_dom-create":30,"./_global":39,"./_html":42,"./_invoke":45}],106:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":107}],107:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],108:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":28,"./_iobject":46}],109:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":107}],110:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":28}],111:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":50}],112:[function(require,module,exports){
'use strict';
if(require('./_descriptors')){
  var LIBRARY             = require('./_library')
    , global              = require('./_global')
    , fails               = require('./_fails')
    , $export             = require('./_export')
    , $typed              = require('./_typed')
    , $buffer             = require('./_typed-buffer')
    , ctx                 = require('./_ctx')
    , anInstance          = require('./_an-instance')
    , propertyDesc        = require('./_property-desc')
    , hide                = require('./_hide')
    , redefineAll         = require('./_redefine-all')
    , toInteger           = require('./_to-integer')
    , toLength            = require('./_to-length')
    , toIndex             = require('./_to-index')
    , toPrimitive         = require('./_to-primitive')
    , has                 = require('./_has')
    , same                = require('./_same-value')
    , classof             = require('./_classof')
    , isObject            = require('./_is-object')
    , toObject            = require('./_to-object')
    , isArrayIter         = require('./_is-array-iter')
    , create              = require('./_object-create')
    , getPrototypeOf      = require('./_object-gpo')
    , gOPN                = require('./_object-gopn').f
    , getIterFn           = require('./core.get-iterator-method')
    , uid                 = require('./_uid')
    , wks                 = require('./_wks')
    , createArrayMethod   = require('./_array-methods')
    , createArrayIncludes = require('./_array-includes')
    , speciesConstructor  = require('./_species-constructor')
    , ArrayIterators      = require('./es6.array.iterator')
    , Iterators           = require('./_iterators')
    , $iterDetect         = require('./_iter-detect')
    , setSpecies          = require('./_set-species')
    , arrayFill           = require('./_array-fill')
    , arrayCopyWithin     = require('./_array-copy-within')
    , $DP                 = require('./_object-dp')
    , $GOPD               = require('./_object-gopd')
    , dP                  = $DP.f
    , gOPD                = $GOPD.f
    , RangeError          = global.RangeError
    , TypeError           = global.TypeError
    , Uint8Array          = global.Uint8Array
    , ARRAY_BUFFER        = 'ArrayBuffer'
    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
    , PROTOTYPE           = 'prototype'
    , ArrayProto          = Array[PROTOTYPE]
    , $ArrayBuffer        = $buffer.ArrayBuffer
    , $DataView           = $buffer.DataView
    , arrayForEach        = createArrayMethod(0)
    , arrayFilter         = createArrayMethod(2)
    , arraySome           = createArrayMethod(3)
    , arrayEvery          = createArrayMethod(4)
    , arrayFind           = createArrayMethod(5)
    , arrayFindIndex      = createArrayMethod(6)
    , arrayIncludes       = createArrayIncludes(true)
    , arrayIndexOf        = createArrayIncludes(false)
    , arrayValues         = ArrayIterators.values
    , arrayKeys           = ArrayIterators.keys
    , arrayEntries        = ArrayIterators.entries
    , arrayLastIndexOf    = ArrayProto.lastIndexOf
    , arrayReduce         = ArrayProto.reduce
    , arrayReduceRight    = ArrayProto.reduceRight
    , arrayJoin           = ArrayProto.join
    , arraySort           = ArrayProto.sort
    , arraySlice          = ArrayProto.slice
    , arrayToString       = ArrayProto.toString
    , arrayToLocaleString = ArrayProto.toLocaleString
    , ITERATOR            = wks('iterator')
    , TAG                 = wks('toStringTag')
    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
    , DEF_CONSTRUCTOR     = uid('def_constructor')
    , ALL_CONSTRUCTORS    = $typed.CONSTR
    , TYPED_ARRAY         = $typed.TYPED
    , VIEW                = $typed.VIEW
    , WRONG_LENGTH        = 'Wrong length!';

  var $map = createArrayMethod(1, function(O, length){
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function(){
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
    new Uint8Array(1).set({});
  });

  var strictToLength = function(it, SAME){
    if(it === undefined)throw TypeError(WRONG_LENGTH);
    var number = +it
      , length = toLength(it);
    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function(it, BYTES){
    var offset = toInteger(it);
    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function(it){
    if(isObject(it) && TYPED_ARRAY in it)return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function(C, length){
    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function(O, list){
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function(C, list){
    var index  = 0
      , length = list.length
      , result = allocate(C, length);
    while(length > index)result[index] = list[index++];
    return result;
  };

  var addGetter = function(it, key, internal){
    dP(it, key, {get: function(){ return this._d[internal]; }});
  };

  var $from = function from(source /*, mapfn, thisArg */){
    var O       = toObject(source)
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , iterFn  = getIterFn(O)
      , i, length, values, result, step, iterator;
    if(iterFn != undefined && !isArrayIter(iterFn)){
      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
        values.push(step.value);
      } O = values;
    }
    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/*...items*/){
    var index  = 0
      , length = arguments.length
      , result = allocate(this, length);
    while(length > index)result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString(){
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */){
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */){
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */){
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */){
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */){
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */){
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */){
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */){
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator){ // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */){
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse(){
      var that   = this
        , length = validate(that).length
        , middle = Math.floor(length / 2)
        , index  = 0
        , value;
      while(index < middle){
        value         = that[index];
        that[index++] = that[--length];
        that[length]  = value;
      } return that;
    },
    some: function some(callbackfn /*, thisArg */){
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn){
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end){
      var O      = validate(this)
        , length = O.length
        , $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end){
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */){
    validate(this);
    var offset = toOffset(arguments[1], 1)
      , length = this.length
      , src    = toObject(arrayLike)
      , len    = toLength(src.length)
      , index  = 0;
    if(len + offset > length)throw RangeError(WRONG_LENGTH);
    while(index < len)this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries(){
      return arrayEntries.call(validate(this));
    },
    keys: function keys(){
      return arrayKeys.call(validate(this));
    },
    values: function values(){
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function(target, key){
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key){
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc){
    if(isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ){
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if(!ALL_CONSTRUCTORS){
    $GOPD.f = $getDesc;
    $DP.f   = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty:           $setDesc
  });

  if(fails(function(){ arrayToString.call({}); })){
    arrayToString = arrayToLocaleString = function toString(){
      return arrayJoin.call(this);
    }
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice:          $slice,
    set:            $set,
    constructor:    function(){ /* noop */ },
    toString:       arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function(){ return this[TYPED_ARRAY]; }
  });

  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
    CLAMPED = !!CLAMPED;
    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
      , ISNT_UINT8 = NAME != 'Uint8Array'
      , GETTER     = 'get' + KEY
      , SETTER     = 'set' + KEY
      , TypedArray = global[NAME]
      , Base       = TypedArray || {}
      , TAC        = TypedArray && getPrototypeOf(TypedArray)
      , FORCED     = !TypedArray || !$typed.ABV
      , O          = {}
      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function(that, index){
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function(that, index, value){
      var data = that._d;
      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function(that, index){
      dP(that, index, {
        get: function(){
          return getter(this, index);
        },
        set: function(value){
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if(FORCED){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME, '_d');
        var index  = 0
          , offset = 0
          , buffer, byteLength, length, klass;
        if(!isObject(data)){
          length     = strictToLength(data, true)
          byteLength = length * BYTES;
          buffer     = new $ArrayBuffer(byteLength);
        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if($length === undefined){
            if($len % BYTES)throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if(TYPED_ARRAY in data){
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
        while(index < length)addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if(!$iterDetect(function(iter){
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
      , $iterator         = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
      dP(TypedArrayPrototype, TAG, {
        get: function(){ return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});

    $export($export.P + $export.F * fails(function(){
      new TypedArray(1).slice();
    }), NAME, {slice: $slice});

    $export($export.P + $export.F * (fails(function(){
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
    }) || !fails(function(){
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {toLocaleString: $toLocaleString});

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function(){ /* empty */ };
},{"./_an-instance":7,"./_array-copy-within":9,"./_array-fill":10,"./_array-includes":12,"./_array-methods":13,"./_classof":18,"./_ctx":26,"./_descriptors":29,"./_export":33,"./_fails":35,"./_global":39,"./_has":40,"./_hide":41,"./_is-array-iter":47,"./_is-object":50,"./_iter-detect":55,"./_iterators":57,"./_library":59,"./_object-create":67,"./_object-dp":68,"./_object-gopd":71,"./_object-gopn":73,"./_object-gpo":75,"./_property-desc":86,"./_redefine-all":87,"./_same-value":90,"./_set-species":92,"./_species-constructor":96,"./_to-index":106,"./_to-integer":107,"./_to-length":109,"./_to-object":110,"./_to-primitive":111,"./_typed":114,"./_typed-buffer":113,"./_uid":115,"./_wks":118,"./core.get-iterator-method":119,"./es6.array.iterator":131}],113:[function(require,module,exports){
'use strict';
var global         = require('./_global')
  , DESCRIPTORS    = require('./_descriptors')
  , LIBRARY        = require('./_library')
  , $typed         = require('./_typed')
  , hide           = require('./_hide')
  , redefineAll    = require('./_redefine-all')
  , fails          = require('./_fails')
  , anInstance     = require('./_an-instance')
  , toInteger      = require('./_to-integer')
  , toLength       = require('./_to-length')
  , gOPN           = require('./_object-gopn').f
  , dP             = require('./_object-dp').f
  , arrayFill      = require('./_array-fill')
  , setToStringTag = require('./_set-to-string-tag')
  , ARRAY_BUFFER   = 'ArrayBuffer'
  , DATA_VIEW      = 'DataView'
  , PROTOTYPE      = 'prototype'
  , WRONG_LENGTH   = 'Wrong length!'
  , WRONG_INDEX    = 'Wrong index!'
  , $ArrayBuffer   = global[ARRAY_BUFFER]
  , $DataView      = global[DATA_VIEW]
  , Math           = global.Math
  , RangeError     = global.RangeError
  , Infinity       = global.Infinity
  , BaseBuffer     = $ArrayBuffer
  , abs            = Math.abs
  , pow            = Math.pow
  , floor          = Math.floor
  , log            = Math.log
  , LN2            = Math.LN2
  , BUFFER         = 'buffer'
  , BYTE_LENGTH    = 'byteLength'
  , BYTE_OFFSET    = 'byteOffset'
  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function(value, mLen, nBytes){
  var buffer = Array(nBytes)
    , eLen   = nBytes * 8 - mLen - 1
    , eMax   = (1 << eLen) - 1
    , eBias  = eMax >> 1
    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
    , i      = 0
    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
    , e, m, c;
  value = abs(value)
  if(value != value || value === Infinity){
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if(value * (c = pow(2, -e)) < 1){
      e--;
      c *= 2;
    }
    if(e + eBias >= 1){
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if(value * c >= 2){
      e++;
      c /= 2;
    }
    if(e + eBias >= eMax){
      m = 0;
      e = eMax;
    } else if(e + eBias >= 1){
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function(buffer, mLen, nBytes){
  var eLen  = nBytes * 8 - mLen - 1
    , eMax  = (1 << eLen) - 1
    , eBias = eMax >> 1
    , nBits = eLen - 7
    , i     = nBytes - 1
    , s     = buffer[i--]
    , e     = s & 127
    , m;
  s >>= 7;
  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if(e === 0){
    e = 1 - eBias;
  } else if(e === eMax){
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function(bytes){
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function(it){
  return [it & 0xff];
};
var packI16 = function(it){
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function(it){
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function(it){
  return packIEEE754(it, 52, 8);
};
var packF32 = function(it){
  return packIEEE754(it, 23, 4);
};

var addGetter = function(C, key, internal){
  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
};

var get = function(view, bytes, index, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function(view, bytes, index, conversion, value, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = conversion(+value);
  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
};

var validateArrayBufferArguments = function(that, length){
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length
    , byteLength   = toLength(numberLength);
  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if(!$typed.ABV){
  $ArrayBuffer = function ArrayBuffer(length){
    var byteLength = validateArrayBufferArguments(this, length);
    this._b       = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength){
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH]
      , offset       = toInteger(byteOffset);
    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if(DESCRIPTORS){
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset){
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset){
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if(!fails(function(){
    new $ArrayBuffer;     // eslint-disable-line no-new
  }) || !fails(function(){
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })){
    $ArrayBuffer = function ArrayBuffer(length){
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2))
    , $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;
},{"./_an-instance":7,"./_array-fill":10,"./_descriptors":29,"./_fails":35,"./_global":39,"./_hide":41,"./_library":59,"./_object-dp":68,"./_object-gopn":73,"./_redefine-all":87,"./_set-to-string-tag":93,"./_to-integer":107,"./_to-length":109,"./_typed":114}],114:[function(require,module,exports){
var global = require('./_global')
  , hide   = require('./_hide')
  , uid    = require('./_uid')
  , TYPED  = uid('typed_array')
  , VIEW   = uid('view')
  , ABV    = !!(global.ArrayBuffer && global.DataView)
  , CONSTR = ABV
  , i = 0, l = 9, Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while(i < l){
  if(Typed = global[TypedArrayConstructors[i++]]){
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV:    ABV,
  CONSTR: CONSTR,
  TYPED:  TYPED,
  VIEW:   VIEW
};
},{"./_global":39,"./_hide":41,"./_uid":115}],115:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],116:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":24,"./_global":39,"./_library":59,"./_object-dp":68,"./_wks-ext":117}],117:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":118}],118:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":39,"./_shared":95,"./_uid":115}],119:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":18,"./_core":24,"./_iterators":57,"./_wks":118}],120:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export')
  , $re     = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./_export":33,"./_replacer":89}],121:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {copyWithin: require('./_array-copy-within')});

require('./_add-to-unscopables')('copyWithin');
},{"./_add-to-unscopables":6,"./_array-copy-within":9,"./_export":33}],122:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $every  = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */){
    return $every(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":13,"./_export":33,"./_strict-method":97}],123:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', {fill: require('./_array-fill')});

require('./_add-to-unscopables')('fill');
},{"./_add-to-unscopables":6,"./_array-fill":10,"./_export":33}],124:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */){
    return $filter(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":13,"./_export":33,"./_strict-method":97}],125:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":6,"./_array-methods":13,"./_export":33}],126:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export')
  , $find   = require('./_array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);
},{"./_add-to-unscopables":6,"./_array-methods":13,"./_export":33}],127:[function(require,module,exports){
'use strict';
var $export  = require('./_export')
  , $forEach = require('./_array-methods')(0)
  , STRICT   = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */){
    return $forEach(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":13,"./_export":33,"./_strict-method":97}],128:[function(require,module,exports){
'use strict';
var ctx            = require('./_ctx')
  , $export        = require('./_export')
  , toObject       = require('./_to-object')
  , call           = require('./_iter-call')
  , isArrayIter    = require('./_is-array-iter')
  , toLength       = require('./_to-length')
  , createProperty = require('./_create-property')
  , getIterFn      = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":25,"./_ctx":26,"./_export":33,"./_is-array-iter":47,"./_iter-call":52,"./_iter-detect":55,"./_to-length":109,"./_to-object":110,"./core.get-iterator-method":119}],129:[function(require,module,exports){
'use strict';
var $export       = require('./_export')
  , $indexOf      = require('./_array-includes')(false)
  , $native       = [].indexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */){
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});
},{"./_array-includes":12,"./_export":33,"./_strict-method":97}],130:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', {isArray: require('./_is-array')});
},{"./_export":33,"./_is-array":48}],131:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":6,"./_iter-define":54,"./_iter-step":56,"./_iterators":57,"./_to-iobject":108}],132:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator){
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});
},{"./_export":33,"./_iobject":46,"./_strict-method":97,"./_to-iobject":108}],133:[function(require,module,exports){
'use strict';
var $export       = require('./_export')
  , toIObject     = require('./_to-iobject')
  , toInteger     = require('./_to-integer')
  , toLength      = require('./_to-length')
  , $native       = [].lastIndexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */){
    // convert -0 to +0
    if(NEGATIVE_ZERO)return $native.apply(this, arguments) || 0;
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(arguments[1]));
    if(index < 0)index = length + index;
    for(;index >= 0; index--)if(index in O)if(O[index] === searchElement)return index || 0;
    return -1;
  }
});
},{"./_export":33,"./_strict-method":97,"./_to-integer":107,"./_to-iobject":108,"./_to-length":109}],134:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $map    = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */){
    return $map(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":13,"./_export":33,"./_strict-method":97}],135:[function(require,module,exports){
'use strict';
var $export        = require('./_export')
  , createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , aLen   = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(aLen);
    while(aLen > index)createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});
},{"./_create-property":25,"./_export":33,"./_fails":35}],136:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});
},{"./_array-reduce":14,"./_export":33,"./_strict-method":97}],137:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});
},{"./_array-reduce":14,"./_export":33,"./_strict-method":97}],138:[function(require,module,exports){
'use strict';
var $export    = require('./_export')
  , html       = require('./_html')
  , cof        = require('./_cof')
  , toIndex    = require('./_to-index')
  , toLength   = require('./_to-length')
  , arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
},{"./_cof":19,"./_export":33,"./_fails":35,"./_html":42,"./_to-index":106,"./_to-length":109}],139:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $some   = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */){
    return $some(this, callbackfn, arguments[1]);
  }
});
},{"./_array-methods":13,"./_export":33,"./_strict-method":97}],140:[function(require,module,exports){
'use strict';
var $export   = require('./_export')
  , aFunction = require('./_a-function')
  , toObject  = require('./_to-object')
  , fails     = require('./_fails')
  , $sort     = [].sort
  , test      = [1, 2, 3];

$export($export.P + $export.F * (fails(function(){
  // IE8-
  test.sort(undefined);
}) || !fails(function(){
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn){
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});
},{"./_a-function":4,"./_export":33,"./_fails":35,"./_strict-method":97,"./_to-object":110}],141:[function(require,module,exports){
require('./_set-species')('Array');
},{"./_set-species":92}],142:[function(require,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', {now: function(){ return new Date().getTime(); }});
},{"./_export":33}],143:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export')
  , fails   = require('./_fails')
  , getTime = Date.prototype.getTime;

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./_export":33,"./_fails":35}],144:[function(require,module,exports){
'use strict';
var $export     = require('./_export')
  , toObject    = require('./_to-object')
  , toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function(){
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({toISOString: function(){ return 1; }}) !== 1;
}), 'Date', {
  toJSON: function toJSON(key){
    var O  = toObject(this)
      , pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});
},{"./_export":33,"./_fails":35,"./_to-object":110,"./_to-primitive":111}],145:[function(require,module,exports){
var TO_PRIMITIVE = require('./_wks')('toPrimitive')
  , proto        = Date.prototype;

if(!(TO_PRIMITIVE in proto))require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));
},{"./_date-to-primitive":27,"./_hide":41,"./_wks":118}],146:[function(require,module,exports){
var DateProto    = Date.prototype
  , INVALID_DATE = 'Invalid Date'
  , TO_STRING    = 'toString'
  , $toString    = DateProto[TO_STRING]
  , getTime      = DateProto.getTime;
if(new Date(NaN) + '' != INVALID_DATE){
  require('./_redefine')(DateProto, TO_STRING, function toString(){
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}
},{"./_redefine":88}],147:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', {bind: require('./_bind')});
},{"./_bind":17,"./_export":33}],148:[function(require,module,exports){
'use strict';
var isObject       = require('./_is-object')
  , getPrototypeOf = require('./_object-gpo')
  , HAS_INSTANCE   = require('./_wks')('hasInstance')
  , FunctionProto  = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))require('./_object-dp').f(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = getPrototypeOf(O))if(this.prototype === O)return true;
  return false;
}});
},{"./_is-object":50,"./_object-dp":68,"./_object-gpo":75,"./_wks":118}],149:[function(require,module,exports){
var dP         = require('./_object-dp').f
  , createDesc = require('./_property-desc')
  , has        = require('./_has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';

var isExtensible = Object.isExtensible || function(){
  return true;
};

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function(){
    try {
      var that = this
        , name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch(e){
      return '';
    }
  }
});
},{"./_descriptors":29,"./_has":40,"./_object-dp":68,"./_property-desc":86}],150:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.1 Map Objects
module.exports = require('./_collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./_collection":23,"./_collection-strong":20}],151:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export')
  , log1p   = require('./_math-log1p')
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN 
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./_export":33,"./_math-log1p":61}],152:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export')
  , $asinh  = Math.asinh;

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {asinh: asinh});
},{"./_export":33}],153:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export')
  , $atanh  = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./_export":33}],154:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export')
  , sign    = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./_export":33,"./_math-sign":62}],155:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./_export":33}],156:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./_export":33}],157:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export')
  , $expm1  = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {expm1: $expm1});
},{"./_export":33,"./_math-expm1":60}],158:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export   = require('./_export')
  , sign      = require('./_math-sign')
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./_export":33,"./_math-sign":62}],159:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export')
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , aLen = arguments.length
      , larg = 0
      , arg, div;
    while(i < aLen){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./_export":33}],160:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export')
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./_export":33,"./_fails":35}],161:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./_export":33}],162:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', {log1p: require('./_math-log1p')});
},{"./_export":33,"./_math-log1p":61}],163:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./_export":33}],164:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', {sign: require('./_math-sign')});
},{"./_export":33,"./_math-sign":62}],165:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./_export":33,"./_fails":35,"./_math-expm1":60}],166:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export')
  , expm1   = require('./_math-expm1')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./_export":33,"./_math-expm1":60}],167:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./_export":33}],168:[function(require,module,exports){
'use strict';
var global            = require('./_global')
  , has               = require('./_has')
  , cof               = require('./_cof')
  , inheritIfRequired = require('./_inherit-if-required')
  , toPrimitive       = require('./_to-primitive')
  , fails             = require('./_fails')
  , gOPN              = require('./_object-gopn').f
  , gOPD              = require('./_object-gopd').f
  , dP                = require('./_object-dp').f
  , $trim             = require('./_string-trim').trim
  , NUMBER            = 'Number'
  , $Number           = global[NUMBER]
  , Base              = $Number
  , proto             = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF        = cof(require('./_object-create')(proto)) == NUMBER
  , TRIM              = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for(var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++){
    if(has(Base, key = keys[j]) && !has($Number, key)){
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}
},{"./_cof":19,"./_descriptors":29,"./_fails":35,"./_global":39,"./_has":40,"./_inherit-if-required":44,"./_object-create":67,"./_object-dp":68,"./_object-gopd":71,"./_object-gopn":73,"./_redefine":88,"./_string-trim":103,"./_to-primitive":111}],169:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./_export":33}],170:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./_export')
  , _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./_export":33,"./_global":39}],171:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', {isInteger: require('./_is-integer')});
},{"./_export":33,"./_is-integer":49}],172:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./_export":33}],173:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export   = require('./_export')
  , isInteger = require('./_is-integer')
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./_export":33,"./_is-integer":49}],174:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./_export":33}],175:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./_export":33}],176:[function(require,module,exports){
var $export     = require('./_export')
  , $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});
},{"./_export":33,"./_parse-float":82}],177:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});
},{"./_export":33,"./_parse-int":83}],178:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , toInteger    = require('./_to-integer')
  , aNumberValue = require('./_a-number-value')
  , repeat       = require('./_string-repeat')
  , $toFixed     = 1..toFixed
  , floor        = Math.floor
  , data         = [0, 0, 0, 0, 0, 0]
  , ERROR        = 'Number.toFixed: incorrect invocation!'
  , ZERO         = '0';

var multiply = function(n, c){
  var i  = -1
    , c2 = c;
  while(++i < 6){
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function(n){
  var i = 6
    , c = 0;
  while(--i >= 0){
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function(){
  var i = 6
    , s = '';
  while(--i >= 0){
    if(s !== '' || i === 0 || data[i] !== 0){
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function(x, n, acc){
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function(x){
  var n  = 0
    , x2 = x;
  while(x2 >= 4096){
    n += 12;
    x2 /= 4096;
  }
  while(x2 >= 2){
    n  += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128..toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function(){
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits){
    var x = aNumberValue(this, ERROR)
      , f = toInteger(fractionDigits)
      , s = ''
      , m = ZERO
      , e, z, j, k;
    if(f < 0 || f > 20)throw RangeError(ERROR);
    if(x != x)return 'NaN';
    if(x <= -1e21 || x >= 1e21)return String(x);
    if(x < 0){
      s = '-';
      x = -x;
    }
    if(x > 1e-21){
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if(e > 0){
        multiply(0, z);
        j = f;
        while(j >= 7){
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while(j >= 23){
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
    if(f > 0){
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});
},{"./_a-number-value":5,"./_export":33,"./_fails":35,"./_string-repeat":102,"./_to-integer":107}],179:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $fails       = require('./_fails')
  , aNumberValue = require('./_a-number-value')
  , $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function(){
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function(){
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision){
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision); 
  }
});
},{"./_a-number-value":5,"./_export":33,"./_fails":35}],180:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":33,"./_object-assign":66}],181:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":33,"./_object-create":67}],182:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperties: require('./_object-dps')});
},{"./_descriptors":29,"./_export":33,"./_object-dps":69}],183:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":29,"./_export":33,"./_object-dp":68}],184:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});
},{"./_is-object":50,"./_meta":63,"./_object-sap":79}],185:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":71,"./_object-sap":79,"./_to-iobject":108}],186:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function(){
  return require('./_object-gopn-ext').f;
});
},{"./_object-gopn-ext":72,"./_object-sap":79}],187:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":75,"./_object-sap":79,"./_to-object":110}],188:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"./_is-object":50,"./_object-sap":79}],189:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./_is-object":50,"./_object-sap":79}],190:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"./_is-object":50,"./_object-sap":79}],191:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', {is: require('./_same-value')});
},{"./_export":33,"./_same-value":90}],192:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object')
  , $keys    = require('./_object-keys');

require('./_object-sap')('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./_object-keys":77,"./_object-sap":79,"./_to-object":110}],193:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});
},{"./_is-object":50,"./_meta":63,"./_object-sap":79}],194:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object')
  , meta     = require('./_meta').onFreeze;

require('./_object-sap')('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});
},{"./_is-object":50,"./_meta":63,"./_object-sap":79}],195:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":33,"./_set-proto":91}],196:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof')
  , test    = {};
test[require('./_wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  require('./_redefine')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./_classof":18,"./_redefine":88,"./_wks":118}],197:[function(require,module,exports){
var $export     = require('./_export')
  , $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});
},{"./_export":33,"./_parse-float":82}],198:[function(require,module,exports){
var $export   = require('./_export')
  , $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), {parseInt: $parseInt});
},{"./_export":33,"./_parse-int":83}],199:[function(require,module,exports){
'use strict';
var LIBRARY            = require('./_library')
  , global             = require('./_global')
  , ctx                = require('./_ctx')
  , classof            = require('./_classof')
  , $export            = require('./_export')
  , isObject           = require('./_is-object')
  , aFunction          = require('./_a-function')
  , anInstance         = require('./_an-instance')
  , forOf              = require('./_for-of')
  , speciesConstructor = require('./_species-constructor')
  , task               = require('./_task').set
  , microtask          = require('./_microtask')()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
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
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./_a-function":4,"./_an-instance":7,"./_classof":18,"./_core":24,"./_ctx":26,"./_export":33,"./_for-of":38,"./_global":39,"./_is-object":50,"./_iter-detect":55,"./_library":59,"./_microtask":65,"./_redefine-all":87,"./_set-species":92,"./_set-to-string-tag":93,"./_species-constructor":96,"./_task":105,"./_wks":118}],200:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export   = require('./_export')
  , aFunction = require('./_a-function')
  , anObject  = require('./_an-object')
  , rApply    = (require('./_global').Reflect || {}).apply
  , fApply    = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function(){
  rApply(function(){});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    var T = aFunction(target)
      , L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});
},{"./_a-function":4,"./_an-object":8,"./_export":33,"./_fails":35,"./_global":39}],201:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export    = require('./_export')
  , create     = require('./_object-create')
  , aFunction  = require('./_a-function')
  , anObject   = require('./_an-object')
  , isObject   = require('./_is-object')
  , fails      = require('./_fails')
  , bind       = require('./_bind')
  , rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function(){
  function F(){}
  return !(rConstruct(function(){}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function(){
  rConstruct(function(){});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(ARGS_BUG && !NEW_TARGET_BUG)return rConstruct(Target, args, newTarget);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      switch(args.length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./_a-function":4,"./_an-object":8,"./_bind":17,"./_export":33,"./_fails":35,"./_global":39,"./_is-object":50,"./_object-create":67}],202:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP          = require('./_object-dp')
  , $export     = require('./_export')
  , anObject    = require('./_an-object')
  , toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function(){
  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":8,"./_export":33,"./_fails":35,"./_object-dp":68,"./_to-primitive":111}],203:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = require('./_export')
  , gOPD     = require('./_object-gopd').f
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./_an-object":8,"./_export":33,"./_object-gopd":71}],204:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export  = require('./_export')
  , anObject = require('./_an-object');
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"./_an-object":8,"./_export":33,"./_iter-create":53}],205:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD     = require('./_object-gopd')
  , $export  = require('./_export')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return gOPD.f(anObject(target), propertyKey);
  }
});
},{"./_an-object":8,"./_export":33,"./_object-gopd":71}],206:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = require('./_export')
  , getProto = require('./_object-gpo')
  , anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./_an-object":8,"./_export":33,"./_object-gpo":75}],207:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , isObject       = require('./_is-object')
  , anObject       = require('./_an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});
},{"./_an-object":8,"./_export":33,"./_has":40,"./_is-object":50,"./_object-gopd":71,"./_object-gpo":75}],208:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./_export":33}],209:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export       = require('./_export')
  , anObject      = require('./_an-object')
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./_an-object":8,"./_export":33}],210:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', {ownKeys: require('./_own-keys')});
},{"./_export":33,"./_own-keys":81}],211:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export            = require('./_export')
  , anObject           = require('./_an-object')
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_an-object":8,"./_export":33}],212:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = require('./_export')
  , setProto = require('./_set-proto');

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./_export":33,"./_set-proto":91}],213:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP             = require('./_object-dp')
  , gOPD           = require('./_object-gopd')
  , getPrototypeOf = require('./_object-gpo')
  , has            = require('./_has')
  , $export        = require('./_export')
  , createDesc     = require('./_property-desc')
  , anObject       = require('./_an-object')
  , isObject       = require('./_is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = gOPD.f(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getPrototypeOf(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});
},{"./_an-object":8,"./_export":33,"./_has":40,"./_is-object":50,"./_object-dp":68,"./_object-gopd":71,"./_object-gpo":75,"./_property-desc":86}],214:[function(require,module,exports){
var global            = require('./_global')
  , inheritIfRequired = require('./_inherit-if-required')
  , dP                = require('./_object-dp').f
  , gOPN              = require('./_object-gopn').f
  , isRegExp          = require('./_is-regexp')
  , $flags            = require('./_flags')
  , $RegExp           = global.RegExp
  , Base              = $RegExp
  , proto             = $RegExp.prototype
  , re1               = /a/g
  , re2               = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW       = new $RegExp(re1) !== re1;

if(require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function(){
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var tiRE = this instanceof $RegExp
      , piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function(key){
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  };
  for(var keys = gOPN(Base), i = 0; keys.length > i; )proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');
},{"./_descriptors":29,"./_fails":35,"./_flags":37,"./_global":39,"./_inherit-if-required":44,"./_is-regexp":51,"./_object-dp":68,"./_object-gopn":73,"./_redefine":88,"./_set-species":92,"./_wks":118}],215:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if(require('./_descriptors') && /./g.flags != 'g')require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});
},{"./_descriptors":29,"./_flags":37,"./_object-dp":68}],216:[function(require,module,exports){
// @@match logic
require('./_fix-re-wks')('match', 1, function(defined, MATCH, $match){
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});
},{"./_fix-re-wks":36}],217:[function(require,module,exports){
// @@replace logic
require('./_fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});
},{"./_fix-re-wks":36}],218:[function(require,module,exports){
// @@search logic
require('./_fix-re-wks')('search', 1, function(defined, SEARCH, $search){
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});
},{"./_fix-re-wks":36}],219:[function(require,module,exports){
// @@split logic
require('./_fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  'use strict';
  var isRegExp   = require('./_is-regexp')
    , _split     = $split
    , $push      = [].push
    , $SPLIT     = 'split'
    , LENGTH     = 'length'
    , LAST_INDEX = 'lastIndex';
  if(
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ){
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function(separator, limit){
      var string = String(this);
      if(separator === undefined && limit === 0)return [];
      // If `separator` is not a regex, use native split
      if(!isRegExp(separator))return _split.call(string, separator, limit);
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
      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while(match = separatorCopy.exec(string)){
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if(lastIndex > lastLastIndex){
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
          });
          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if(output[LENGTH] >= splitLimit)break;
        }
        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if(lastLastIndex === string[LENGTH]){
        if(lastLength || !separatorCopy.test(''))output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
    $split = function(separator, limit){
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit){
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});
},{"./_fix-re-wks":36,"./_is-regexp":51}],220:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject    = require('./_an-object')
  , $flags      = require('./_flags')
  , DESCRIPTORS = require('./_descriptors')
  , TO_STRING   = 'toString'
  , $toString   = /./[TO_STRING];

var define = function(fn){
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if(require('./_fails')(function(){ return $toString.call({source: 'a', flags: 'b'}) != '/a/b'; })){
  define(function toString(){
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if($toString.name != TO_STRING){
  define(function toString(){
    return $toString.call(this);
  });
}
},{"./_an-object":8,"./_descriptors":29,"./_fails":35,"./_flags":37,"./_redefine":88,"./es6.regexp.flags":215}],221:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');

// 23.2 Set Objects
module.exports = require('./_collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./_collection":23,"./_collection-strong":20}],222:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function(createHTML){
  return function anchor(name){
    return createHTML(this, 'a', 'name', name);
  }
});
},{"./_string-html":100}],223:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function(createHTML){
  return function big(){
    return createHTML(this, 'big', '', '');
  }
});
},{"./_string-html":100}],224:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function(createHTML){
  return function blink(){
    return createHTML(this, 'blink', '', '');
  }
});
},{"./_string-html":100}],225:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function(createHTML){
  return function bold(){
    return createHTML(this, 'b', '', '');
  }
});
},{"./_string-html":100}],226:[function(require,module,exports){
'use strict';
var $export = require('./_export')
  , $at     = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./_export":33,"./_string-at":98}],227:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = require('./_export')
  , toLength  = require('./_to-length')
  , context   = require('./_string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments.length > 1 ? arguments[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./_export":33,"./_fails-is-regexp":34,"./_string-context":99,"./_to-length":109}],228:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function(createHTML){
  return function fixed(){
    return createHTML(this, 'tt', '', '');
  }
});
},{"./_string-html":100}],229:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function(createHTML){
  return function fontcolor(color){
    return createHTML(this, 'font', 'color', color);
  }
});
},{"./_string-html":100}],230:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function(createHTML){
  return function fontsize(size){
    return createHTML(this, 'font', 'size', size);
  }
});
},{"./_string-html":100}],231:[function(require,module,exports){
var $export        = require('./_export')
  , toIndex        = require('./_to-index')
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res  = []
      , aLen = arguments.length
      , i    = 0
      , code;
    while(aLen > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./_export":33,"./_to-index":106}],232:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = require('./_export')
  , context  = require('./_string-context')
  , INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"./_export":33,"./_fails-is-regexp":34,"./_string-context":99}],233:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function(createHTML){
  return function italics(){
    return createHTML(this, 'i', '', '');
  }
});
},{"./_string-html":100}],234:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":54,"./_string-at":98}],235:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function(createHTML){
  return function link(url){
    return createHTML(this, 'a', 'href', url);
  }
});
},{"./_string-html":100}],236:[function(require,module,exports){
var $export   = require('./_export')
  , toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl  = toIObject(callSite.raw)
      , len  = toLength(tpl.length)
      , aLen = arguments.length
      , res  = []
      , i    = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < aLen)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./_export":33,"./_to-iobject":108,"./_to-length":109}],237:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});
},{"./_export":33,"./_string-repeat":102}],238:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function(createHTML){
  return function small(){
    return createHTML(this, 'small', '', '');
  }
});
},{"./_string-html":100}],239:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = require('./_export')
  , toLength    = require('./_to-length')
  , context     = require('./_string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./_export":33,"./_fails-is-regexp":34,"./_string-context":99,"./_to-length":109}],240:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function(createHTML){
  return function strike(){
    return createHTML(this, 'strike', '', '');
  }
});
},{"./_string-html":100}],241:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function(createHTML){
  return function sub(){
    return createHTML(this, 'sub', '', '');
  }
});
},{"./_string-html":100}],242:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function(createHTML){
  return function sup(){
    return createHTML(this, 'sup', '', '');
  }
});
},{"./_string-html":100}],243:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"./_string-trim":103}],244:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
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
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
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
},{"./_an-object":8,"./_descriptors":29,"./_enum-keys":32,"./_export":33,"./_fails":35,"./_global":39,"./_has":40,"./_hide":41,"./_is-array":48,"./_keyof":58,"./_library":59,"./_meta":63,"./_object-create":67,"./_object-dp":68,"./_object-gopd":71,"./_object-gopn":73,"./_object-gopn-ext":72,"./_object-gops":74,"./_object-keys":77,"./_object-pie":78,"./_property-desc":86,"./_redefine":88,"./_set-to-string-tag":93,"./_shared":95,"./_to-iobject":108,"./_to-primitive":111,"./_uid":115,"./_wks":118,"./_wks-define":116,"./_wks-ext":117}],245:[function(require,module,exports){
'use strict';
var $export      = require('./_export')
  , $typed       = require('./_typed')
  , buffer       = require('./_typed-buffer')
  , anObject     = require('./_an-object')
  , toIndex      = require('./_to-index')
  , toLength     = require('./_to-length')
  , isObject     = require('./_is-object')
  , ArrayBuffer  = require('./_global').ArrayBuffer
  , speciesConstructor = require('./_species-constructor')
  , $ArrayBuffer = buffer.ArrayBuffer
  , $DataView    = buffer.DataView
  , $isView      = $typed.ABV && ArrayBuffer.isView
  , $slice       = $ArrayBuffer.prototype.slice
  , VIEW         = $typed.VIEW
  , ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it){
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function(){
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end){
    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
    var len    = anObject(this).byteLength
      , first  = toIndex(start, len)
      , final  = toIndex(end === undefined ? len : end, len)
      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
      , viewS  = new $DataView(this)
      , viewT  = new $DataView(result)
      , index  = 0;
    while(first < final){
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);
},{"./_an-object":8,"./_export":33,"./_fails":35,"./_global":39,"./_is-object":50,"./_set-species":92,"./_species-constructor":96,"./_to-index":106,"./_to-length":109,"./_typed":114,"./_typed-buffer":113}],246:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});
},{"./_export":33,"./_typed":114,"./_typed-buffer":113}],247:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function(init){
  return function Float32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":112}],248:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function(init){
  return function Float64Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":112}],249:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function(init){
  return function Int16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":112}],250:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function(init){
  return function Int32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":112}],251:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function(init){
  return function Int8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":112}],252:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function(init){
  return function Uint16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":112}],253:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function(init){
  return function Uint32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":112}],254:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});
},{"./_typed-array":112}],255:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function(init){
  return function Uint8ClampedArray(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
}, true);
},{"./_typed-array":112}],256:[function(require,module,exports){
'use strict';
var each         = require('./_array-methods')(0)
  , redefine     = require('./_redefine')
  , meta         = require('./_meta')
  , assign       = require('./_object-assign')
  , weak         = require('./_collection-weak')
  , isObject     = require('./_is-object')
  , getWeak      = meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = weak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./_array-methods":13,"./_collection":23,"./_collection-weak":22,"./_is-object":50,"./_meta":63,"./_object-assign":66,"./_redefine":88}],257:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');

// 23.4 WeakSet Objects
require('./_collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./_collection":23,"./_collection-weak":22}],258:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export   = require('./_export')
  , $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');
},{"./_add-to-unscopables":6,"./_array-includes":12,"./_export":33}],259:[function(require,module,exports){
// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export   = require('./_export')
  , microtask = require('./_microtask')()
  , process   = require('./_global').process
  , isNode    = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn){
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});
},{"./_cof":19,"./_export":33,"./_global":39,"./_microtask":65}],260:[function(require,module,exports){
// https://github.com/ljharb/proposal-is-error
var $export = require('./_export')
  , cof     = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it){
    return cof(it) === 'Error';
  }
});
},{"./_cof":19,"./_export":33}],261:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Map', {toJSON: require('./_collection-to-json')('Map')});
},{"./_collection-to-json":21,"./_export":33}],262:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});
},{"./_export":33}],263:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >> 16
      , v1 = $v >> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});
},{"./_export":33}],264:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});
},{"./_export":33}],265:[function(require,module,exports){
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >>> 16
      , v1 = $v >>> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});
},{"./_export":33}],266:[function(require,module,exports){
'use strict';
var $export         = require('./_export')
  , toObject        = require('./_to-object')
  , aFunction       = require('./_a-function')
  , $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter){
    $defineProperty.f(toObject(this), P, {get: aFunction(getter), enumerable: true, configurable: true});
  }
});
},{"./_a-function":4,"./_descriptors":29,"./_export":33,"./_object-dp":68,"./_object-forced-pam":70,"./_to-object":110}],267:[function(require,module,exports){
'use strict';
var $export         = require('./_export')
  , toObject        = require('./_to-object')
  , aFunction       = require('./_a-function')
  , $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter){
    $defineProperty.f(toObject(this), P, {set: aFunction(setter), enumerable: true, configurable: true});
  }
});
},{"./_a-function":4,"./_descriptors":29,"./_export":33,"./_object-dp":68,"./_object-forced-pam":70,"./_to-object":110}],268:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export  = require('./_export')
  , $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./_export":33,"./_object-to-array":80}],269:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export        = require('./_export')
  , ownKeys        = require('./_own-keys')
  , toIObject      = require('./_to-iobject')
  , gOPD           = require('./_object-gopd')
  , createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , getDesc = gOPD.f
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key;
    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
    return result;
  }
});
},{"./_create-property":25,"./_export":33,"./_object-gopd":71,"./_own-keys":81,"./_to-iobject":108}],270:[function(require,module,exports){
'use strict';
var $export                  = require('./_export')
  , toObject                 = require('./_to-object')
  , toPrimitive              = require('./_to-primitive')
  , getPrototypeOf           = require('./_object-gpo')
  , getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.get;
    } while(O = getPrototypeOf(O));
  }
});
},{"./_descriptors":29,"./_export":33,"./_object-forced-pam":70,"./_object-gopd":71,"./_object-gpo":75,"./_to-object":110,"./_to-primitive":111}],271:[function(require,module,exports){
'use strict';
var $export                  = require('./_export')
  , toObject                 = require('./_to-object')
  , toPrimitive              = require('./_to-primitive')
  , getPrototypeOf           = require('./_object-gpo')
  , getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.set;
    } while(O = getPrototypeOf(O));
  }
});
},{"./_descriptors":29,"./_export":33,"./_object-forced-pam":70,"./_object-gopd":71,"./_object-gpo":75,"./_to-object":110,"./_to-primitive":111}],272:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export')
  , $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./_export":33,"./_object-to-array":80}],273:[function(require,module,exports){
'use strict';
// https://github.com/zenparsing/es-observable
var $export     = require('./_export')
  , global      = require('./_global')
  , core        = require('./_core')
  , microtask   = require('./_microtask')()
  , OBSERVABLE  = require('./_wks')('observable')
  , aFunction   = require('./_a-function')
  , anObject    = require('./_an-object')
  , anInstance  = require('./_an-instance')
  , redefineAll = require('./_redefine-all')
  , hide        = require('./_hide')
  , forOf       = require('./_for-of')
  , RETURN      = forOf.RETURN;

var getMethod = function(fn){
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function(subscription){
  var cleanup = subscription._c;
  if(cleanup){
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function(subscription){
  return subscription._o === undefined;
};

var closeSubscription = function(subscription){
  if(!subscriptionClosed(subscription)){
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function(observer, subscriber){
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup      = subscriber(observer)
      , subscription = cleanup;
    if(cleanup != null){
      if(typeof cleanup.unsubscribe === 'function')cleanup = function(){ subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch(e){
    observer.error(e);
    return;
  } if(subscriptionClosed(this))cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe(){ closeSubscription(this); }
});

var SubscriptionObserver = function(subscription){
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if(m)return m.call(observer, value);
      } catch(e){
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value){
    var subscription = this._s;
    if(subscriptionClosed(subscription))throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if(!m)throw value;
      value = m.call(observer, value);
    } catch(e){
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch(e){
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

var $Observable = function Observable(subscriber){
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer){
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn){
    var that = this;
    return new (core.Promise || global.Promise)(function(resolve, reject){
      aFunction(fn);
      var subscription = that.subscribe({
        next : function(value){
          try {
            return fn(value);
          } catch(e){
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
  from: function from(x){
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if(method){
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function(observer){
        return observable.subscribe(observer);
      });
    }
    return new C(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          try {
            if(forOf(x, false, function(it){
              observer.next(it);
              if(done)return RETURN;
            }) === RETURN)return;
          } catch(e){
            if(done)throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  },
  of: function of(){
    for(var i = 0, l = arguments.length, items = Array(l); i < l;)items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          for(var i = 0; i < items.length; ++i){
            observer.next(items[i]);
            if(done)return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function(){ return this; });

$export($export.G, {Observable: $Observable});

require('./_set-species')('Observable');
},{"./_a-function":4,"./_an-instance":7,"./_an-object":8,"./_core":24,"./_export":33,"./_for-of":38,"./_global":39,"./_hide":41,"./_microtask":65,"./_redefine-all":87,"./_set-species":92,"./_wks":118}],274:[function(require,module,exports){
var metadata                  = require('./_metadata')
  , anObject                  = require('./_an-object')
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey){
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
}});
},{"./_an-object":8,"./_metadata":64}],275:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , toMetaKey              = metadata.key
  , getOrCreateMetadataMap = metadata.map
  , store                  = metadata.store;

metadata.exp({deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */){
  var targetKey   = arguments.length < 3 ? undefined : toMetaKey(arguments[2])
    , metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if(metadataMap === undefined || !metadataMap['delete'](metadataKey))return false;
  if(metadataMap.size)return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
}});
},{"./_an-object":8,"./_metadata":64}],276:[function(require,module,exports){
var Set                     = require('./es6.set')
  , from                    = require('./_array-from-iterable')
  , metadata                = require('./_metadata')
  , anObject                = require('./_an-object')
  , getPrototypeOf          = require('./_object-gpo')
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

var ordinaryMetadataKeys = function(O, P){
  var oKeys  = ordinaryOwnMetadataKeys(O, P)
    , parent = getPrototypeOf(O);
  if(parent === null)return oKeys;
  var pKeys  = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({getMetadataKeys: function getMetadataKeys(target /*, targetKey */){
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});
},{"./_an-object":8,"./_array-from-iterable":11,"./_metadata":64,"./_object-gpo":75,"./es6.set":221}],277:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , getPrototypeOf         = require('./_object-gpo')
  , ordinaryHasOwnMetadata = metadata.has
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

var ordinaryGetMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({getMetadata: function getMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":8,"./_metadata":64,"./_object-gpo":75}],278:[function(require,module,exports){
var metadata                = require('./_metadata')
  , anObject                = require('./_an-object')
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

metadata.exp({getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */){
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});
},{"./_an-object":8,"./_metadata":64}],279:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

metadata.exp({getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":8,"./_metadata":64}],280:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , getPrototypeOf         = require('./_object-gpo')
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

var ordinaryHasMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":8,"./_metadata":64,"./_object-gpo":75}],281:[function(require,module,exports){
var metadata               = require('./_metadata')
  , anObject               = require('./_an-object')
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

metadata.exp({hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});
},{"./_an-object":8,"./_metadata":64}],282:[function(require,module,exports){
var metadata                  = require('./_metadata')
  , anObject                  = require('./_an-object')
  , aFunction                 = require('./_a-function')
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({metadata: function metadata(metadataKey, metadataValue){
  return function decorator(target, targetKey){
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
}});
},{"./_a-function":4,"./_an-object":8,"./_metadata":64}],283:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./_export');

$export($export.P + $export.R, 'Set', {toJSON: require('./_collection-to-json')('Set')});
},{"./_collection-to-json":21,"./_export":33}],284:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export')
  , $at     = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./_export":33,"./_string-at":98}],285:[function(require,module,exports){
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export     = require('./_export')
  , defined     = require('./_defined')
  , toLength    = require('./_to-length')
  , isRegExp    = require('./_is-regexp')
  , getFlags    = require('./_flags')
  , RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function(regexp, string){
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next(){
  var match = this._r.exec(this._s);
  return {value: match, done: match === null};
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp){
    defined(this);
    if(!isRegExp(regexp))throw TypeError(regexp + ' is not a regexp!');
    var S     = String(this)
      , flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp)
      , rx    = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});
},{"./_defined":28,"./_export":33,"./_flags":37,"./_is-regexp":51,"./_iter-create":53,"./_to-length":109}],286:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"./_export":33,"./_string-pad":101}],287:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export')
  , $pad    = require('./_string-pad');

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"./_export":33,"./_string-pad":101}],288:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
}, 'trimStart');
},{"./_string-trim":103}],289:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
}, 'trimEnd');
},{"./_string-trim":103}],290:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":116}],291:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":116}],292:[function(require,module,exports){
// https://github.com/ljharb/proposal-global
var $export = require('./_export');

$export($export.S, 'System', {global: require('./_global')});
},{"./_export":33,"./_global":39}],293:[function(require,module,exports){
var $iterators    = require('./es6.array.iterator')
  , redefine      = require('./_redefine')
  , global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , wks           = require('./_wks')
  , ITERATOR      = wks('iterator')
  , TO_STRING_TAG = wks('toStringTag')
  , ArrayValues   = Iterators.Array;

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype
    , key;
  if(proto){
    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
  }
}
},{"./_global":39,"./_hide":41,"./_iterators":57,"./_redefine":88,"./_wks":118,"./es6.array.iterator":131}],294:[function(require,module,exports){
var $export = require('./_export')
  , $task   = require('./_task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./_export":33,"./_task":105}],295:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./_global')
  , $export    = require('./_export')
  , invoke     = require('./_invoke')
  , partial    = require('./_partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./_export":33,"./_global":39,"./_invoke":45,"./_partial":84}],296:[function(require,module,exports){
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
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.umulh');
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
},{"./modules/_core":24,"./modules/es6.array.copy-within":121,"./modules/es6.array.every":122,"./modules/es6.array.fill":123,"./modules/es6.array.filter":124,"./modules/es6.array.find":126,"./modules/es6.array.find-index":125,"./modules/es6.array.for-each":127,"./modules/es6.array.from":128,"./modules/es6.array.index-of":129,"./modules/es6.array.is-array":130,"./modules/es6.array.iterator":131,"./modules/es6.array.join":132,"./modules/es6.array.last-index-of":133,"./modules/es6.array.map":134,"./modules/es6.array.of":135,"./modules/es6.array.reduce":137,"./modules/es6.array.reduce-right":136,"./modules/es6.array.slice":138,"./modules/es6.array.some":139,"./modules/es6.array.sort":140,"./modules/es6.array.species":141,"./modules/es6.date.now":142,"./modules/es6.date.to-iso-string":143,"./modules/es6.date.to-json":144,"./modules/es6.date.to-primitive":145,"./modules/es6.date.to-string":146,"./modules/es6.function.bind":147,"./modules/es6.function.has-instance":148,"./modules/es6.function.name":149,"./modules/es6.map":150,"./modules/es6.math.acosh":151,"./modules/es6.math.asinh":152,"./modules/es6.math.atanh":153,"./modules/es6.math.cbrt":154,"./modules/es6.math.clz32":155,"./modules/es6.math.cosh":156,"./modules/es6.math.expm1":157,"./modules/es6.math.fround":158,"./modules/es6.math.hypot":159,"./modules/es6.math.imul":160,"./modules/es6.math.log10":161,"./modules/es6.math.log1p":162,"./modules/es6.math.log2":163,"./modules/es6.math.sign":164,"./modules/es6.math.sinh":165,"./modules/es6.math.tanh":166,"./modules/es6.math.trunc":167,"./modules/es6.number.constructor":168,"./modules/es6.number.epsilon":169,"./modules/es6.number.is-finite":170,"./modules/es6.number.is-integer":171,"./modules/es6.number.is-nan":172,"./modules/es6.number.is-safe-integer":173,"./modules/es6.number.max-safe-integer":174,"./modules/es6.number.min-safe-integer":175,"./modules/es6.number.parse-float":176,"./modules/es6.number.parse-int":177,"./modules/es6.number.to-fixed":178,"./modules/es6.number.to-precision":179,"./modules/es6.object.assign":180,"./modules/es6.object.create":181,"./modules/es6.object.define-properties":182,"./modules/es6.object.define-property":183,"./modules/es6.object.freeze":184,"./modules/es6.object.get-own-property-descriptor":185,"./modules/es6.object.get-own-property-names":186,"./modules/es6.object.get-prototype-of":187,"./modules/es6.object.is":191,"./modules/es6.object.is-extensible":188,"./modules/es6.object.is-frozen":189,"./modules/es6.object.is-sealed":190,"./modules/es6.object.keys":192,"./modules/es6.object.prevent-extensions":193,"./modules/es6.object.seal":194,"./modules/es6.object.set-prototype-of":195,"./modules/es6.object.to-string":196,"./modules/es6.parse-float":197,"./modules/es6.parse-int":198,"./modules/es6.promise":199,"./modules/es6.reflect.apply":200,"./modules/es6.reflect.construct":201,"./modules/es6.reflect.define-property":202,"./modules/es6.reflect.delete-property":203,"./modules/es6.reflect.enumerate":204,"./modules/es6.reflect.get":207,"./modules/es6.reflect.get-own-property-descriptor":205,"./modules/es6.reflect.get-prototype-of":206,"./modules/es6.reflect.has":208,"./modules/es6.reflect.is-extensible":209,"./modules/es6.reflect.own-keys":210,"./modules/es6.reflect.prevent-extensions":211,"./modules/es6.reflect.set":213,"./modules/es6.reflect.set-prototype-of":212,"./modules/es6.regexp.constructor":214,"./modules/es6.regexp.flags":215,"./modules/es6.regexp.match":216,"./modules/es6.regexp.replace":217,"./modules/es6.regexp.search":218,"./modules/es6.regexp.split":219,"./modules/es6.regexp.to-string":220,"./modules/es6.set":221,"./modules/es6.string.anchor":222,"./modules/es6.string.big":223,"./modules/es6.string.blink":224,"./modules/es6.string.bold":225,"./modules/es6.string.code-point-at":226,"./modules/es6.string.ends-with":227,"./modules/es6.string.fixed":228,"./modules/es6.string.fontcolor":229,"./modules/es6.string.fontsize":230,"./modules/es6.string.from-code-point":231,"./modules/es6.string.includes":232,"./modules/es6.string.italics":233,"./modules/es6.string.iterator":234,"./modules/es6.string.link":235,"./modules/es6.string.raw":236,"./modules/es6.string.repeat":237,"./modules/es6.string.small":238,"./modules/es6.string.starts-with":239,"./modules/es6.string.strike":240,"./modules/es6.string.sub":241,"./modules/es6.string.sup":242,"./modules/es6.string.trim":243,"./modules/es6.symbol":244,"./modules/es6.typed.array-buffer":245,"./modules/es6.typed.data-view":246,"./modules/es6.typed.float32-array":247,"./modules/es6.typed.float64-array":248,"./modules/es6.typed.int16-array":249,"./modules/es6.typed.int32-array":250,"./modules/es6.typed.int8-array":251,"./modules/es6.typed.uint16-array":252,"./modules/es6.typed.uint32-array":253,"./modules/es6.typed.uint8-array":254,"./modules/es6.typed.uint8-clamped-array":255,"./modules/es6.weak-map":256,"./modules/es6.weak-set":257,"./modules/es7.array.includes":258,"./modules/es7.asap":259,"./modules/es7.error.is-error":260,"./modules/es7.map.to-json":261,"./modules/es7.math.iaddh":262,"./modules/es7.math.imulh":263,"./modules/es7.math.isubh":264,"./modules/es7.math.umulh":265,"./modules/es7.object.define-getter":266,"./modules/es7.object.define-setter":267,"./modules/es7.object.entries":268,"./modules/es7.object.get-own-property-descriptors":269,"./modules/es7.object.lookup-getter":270,"./modules/es7.object.lookup-setter":271,"./modules/es7.object.values":272,"./modules/es7.observable":273,"./modules/es7.reflect.define-metadata":274,"./modules/es7.reflect.delete-metadata":275,"./modules/es7.reflect.get-metadata":277,"./modules/es7.reflect.get-metadata-keys":276,"./modules/es7.reflect.get-own-metadata":279,"./modules/es7.reflect.get-own-metadata-keys":278,"./modules/es7.reflect.has-metadata":280,"./modules/es7.reflect.has-own-metadata":281,"./modules/es7.reflect.metadata":282,"./modules/es7.set.to-json":283,"./modules/es7.string.at":284,"./modules/es7.string.match-all":285,"./modules/es7.string.pad-end":286,"./modules/es7.string.pad-start":287,"./modules/es7.string.trim-left":288,"./modules/es7.string.trim-right":289,"./modules/es7.symbol.async-iterator":290,"./modules/es7.symbol.observable":291,"./modules/es7.system.global":292,"./modules/web.dom.iterable":293,"./modules/web.immediate":294,"./modules/web.timers":295}],297:[function(require,module,exports){
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
},{}],298:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @sig
 * @description d
 * @param {Array} fns - One or more comma separated function arguments
 * @return {function} - a
 */
function all() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
    }

    return function _all() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return fns.every(function _testAll(fn) {
            return fn.apply(undefined, args);
        });
    };
}

/**
 * @sig
 * @description d
 * @param {Array} fns - One or more comma separated function arguments
 * @return {function} - a
 */
function any() {
    for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        fns[_key3] = arguments[_key3];
    }

    return function _any() {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
        }

        return fns.some(function _testAny(fn) {
            return fn.apply(undefined, args);
        });
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} x
 * @param {*} y - a
 * @param {*} z - b
 * @return {*} - c
 */
var c = curry(function _c(x, y, z) {
    console.log(x, y, z);
    return x(y)(z);
});

var rev = function rev() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
    }

    return args.reverse();
};

/**
 * @sig compose :: (b -> c) -> (a -> b) -> (a -> c)
 * @description d
 * @type {function}
 * @note: @see {@link pipe}
 * @param {Array} fns - a
 * @return {*} - b
 */
function compose() {
    for (var _len6 = arguments.length, fns = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        fns[_key6] = arguments[_key6];
    }

    fns = fns.reverse();
    return pipe.apply(undefined, _toConsumableArray(fns));
}

/**
 * @sig
 * @description d
 * @type {function}
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
        console.log(x, y, z);
        x ? y.apply(undefined, arguments) : z.apply(undefined, arguments);
    };
};

/**
 * @sig constant :: a -> () -> a
 * @description d
 * @param {*} item - a
 * @return {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
function constant(item) {
    return function _constant() {
        return item;
    };
}

/**
 * @sig curry :: (* -> a) -> (* -> a)
 * @description d
 * @param {function} fn - a
 * @return {function|*} - b
 */
function curry(fn) {
    if (!fn.length || 1 >= fn.length) return fn;
    return curryN(this, fn.length, fn);
}

/**
 * @sig curryN :: (* -> a) -> (* -> a)
 * @description Curries a function to a specified arity
 * @param {Object} context - The context the curried function should be invoked with
 * @param {number} arity - The number of arguments to curry the function for
 * @param {function} fn - The function to be curried
 * @param {Array} received - An array of the arguments to be applied to the function
 * @return {function | *} - Returns either a function waiting for more arguments to
 * be applied before invocation, or will return the result of the function applied
 * to the supplied arguments if the specified number of arguments have been received.
 */
function curryN(context, arity, fn) {
    var received = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    if (fn.orig && fn.orig !== fn) return curryN(context, arity, fn.orig, received);
    function _curryN() {
        for (var _len7 = arguments.length, rest = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            rest[_key7] = arguments[_key7];
        }

        var combined = received.concat(rest);
        if (arity > combined.length) return curryN(context, arity, fn, combined);
        return fn.call.apply(fn, [context].concat(_toConsumableArray(combined.slice(0, arity))));
    }

    _curryN.orig = fn;
    return _curryN;
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {Function|*} - b
 */
function curryRight(fn) {
    return curryN(this, fn.length, function _wrapper() {
        for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
        }

        return fn.call.apply(fn, [this].concat(_toConsumableArray(args.reverse())));
    });
}

/**
 * @sig
 * @description d
 * @param {*} - a
 * @return {function} - b
 */
var first = constant;

/**
 * @sig
 * @description d
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
 * @sig
 * @description d
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
 * @sig Identity :: a -> a
 * @description Identity function; takes any item and returns same item when invoked
 * @param {*} item - Any value of any type
 * @return {*} - returns item
 */
var identity = function identity(item) {
    return item;
};

/**
 * @sig ifElse :: Function -> ( Function -> ( Function -> (a -> b) ) )
 * @description Takes a predicate function that is applied to the data; If a truthy value
 * is returned from the application, the provided ifFunc argument will be
 * invoked, passing the data as an argument, otherwise the elseFunc is
 * invoked with the data as an argument.
 * @type {function}
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
 * @sig
 * @description d
 * @type {function}
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
 * @sig kestrel :: a -> () -> a
 * @description d
 * @type {function}
 * @note @see {@link constant}
 * @param {*} item - a
 * @return {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
var kestrel = constant;

/**
 * @sig
 * @description d
 * @param {function} a - a
 * @return {*} - b
 */
var m = function m(a) {
    return a(a);
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} a - a
 * @param {function} b - b
 * @return {*} - c
 */
var o = curry(function (a, b) {
    return b(a(b));
});

/**
 * @sig pipe :: [a] -> (b -> c)
 * @description -  Takes a List of functions as arguments and returns
 * a function waiting to be invoked with a single item. Once the returned
 * function is invoked, it will reduce the List of functions over the item,
 * starting with the first function in the List and working through
 * sequentially. Performs a similar functionality to compose, but applies
 * the functions in reverse order to that of compose.
 * @refer {compose}
 * @note @see {@link compose}
 * @param {function} fn - The function to run initially; may be any arity.
 * @param {Array} fns - The remaining functions in the pipeline. Each receives
 * its input from the output of the previous function. Therefore each of these
 * functions must be unary.
 * @return {function} - Returns a function waiting for the item over which
 * to reduce the functions.
 */
function pipe(fn) {
    for (var _len9 = arguments.length, fns = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
        fns[_key9 - 1] = arguments[_key9];
    }

    return function _pipe() {
        return fns.reduce(function pipeReduce(item, f) {
            return f(item);
        }, fn.apply(undefined, arguments));
    };
}

/**
 * @type:
 * @description:
 * @param: {function} a
 * @param: {function} b
 * @param: {*} c
 * @return: {*}
 */
var q = curry(function (a, b, c) {
    return b(a(c));
});

//const reduce = (accFn, start, xs) => xs.reduce(accFn, start);
/**
 * @sig
 * @description d
 * @type {function}
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
 * @sig
 * @description d
 * @type {function}
 * @return {*} - a
 */
var second = constant(identity);

/**
 * @sig
 * @description d
 * @param {Array} fns - a
 * @return {function} - b
 */
function sequence(fns) {
    return function _sequence() {
        for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
            args[_key10] = arguments[_key10];
        }

        fns.forEach(function fSequence(fn) {
            fn.apply(undefined, args);
        });
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {function} f = b
 * @return {*} - c
 */
var t = curry(function (x, f) {
    return f(x);
});

/**
 * @sig
 * @description d
 * @refer {t}
 * @note @see {@link t}
 */
var thrush = t;

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} a - a
 * @param {function} b - b
 * @return {*} - c
 */
var u = curry(function (a, b) {
    return b(a(a)(b));
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function uncurry(fn) {
    if (fn && fn.orig) return fn.orig;
    return fn;
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} depth - a
 * @param {function} fn - b
 * @return {function|*} - c
 */
var uncurryN = curry(function uncurryN(depth, fn) {
    console.log(depth, fn);
    return curryN(this, depth, function _uncurryN() {
        for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            args[_key11] = arguments[_key11];
        }

        console.log(args);
        var currentDepth = 1,
            value = fn,
            idx = 0,
            endIdx;
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
 * @sig
 * @description d
 * @type {function}
 * @param {function} a - a
 * @param {*} b - b
 * @return {*} - c
 */
var w = curry(function (a, b) {
    return a(b)(b);
});

/**
 * @sig when :: Function -> (Function -> (a -> b))
 * @description Similar to ifElse, but no 'elseFunc' argument. Instead, if the application
 * of the predicate to the data returns truthy, the transform is applied to
 * the data. Otherwise, the data is returned without invoking the transform.
 * @type {function}
 * @param {function} predicate - a
 * @param {function} transform - b
 * @param {*} data - c
 * @return {*} - d
 */
var when = curry(function (predicate, transform, data) {
    return predicate(data) ? transform(data) : data;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} predicate - a
 * @param {function} transform - b
 * @param {*} data - c
 * @return {*} - d
 */
var whenNot = curry(function (predicate, transform, data) {
    return !predicate(data) ? transform(data) : data;
});

/**
 * @sig
 * @description d
 */
var y = fixedPoint;

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function applyWhenReady(fn) {
    var values = [];
    function _applyWhenReady() {
        for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
            args[_key12] = arguments[_key12];
        }

        values = values.concat(args);
        return _applyWhenReady;
    }

    _applyWhenReady.apply = function _apply() {
        return fn.apply(undefined, _toConsumableArray(values));
    };

    _applyWhenReady.leftApply = _applyWhenReady.apply;

    _applyWhenReady.rightApply = function _rightApply() {
        console.log(values);
        return fn.apply(undefined, _toConsumableArray(values.reverse()));
    };

    return _applyWhenReady;
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

},{}],299:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @sig
 * @description d
 * @return {*} - a
 */
function get() {
    return this.value;
}

/**
 * @sig
 * @description d
 * @return {string} - b
 */
function emptyGet() {
    throw new Error('Cannot extract a null value.');
}

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @return {*} - b
 */
function orElse(f) {
    return this.value;
}

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @return {*} - b
 */
function emptyOrElse(f) {
    return f();
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {*} - b
 */
function getOrElse(x) {
    return this.value;
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {*} - b
 */
function emptyGetOrElse(x) {
    return x;
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {*} - b
 */
function apply(ma) {
    return ma.map(this.value);
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function chain(fn) {
    var val = fn(this.value);
    return Object.getPrototypeOf(this).isPrototypeOf(val) ? val : this.of(val);
}

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @param {string} prop - b
 * @return {function} - c
 */
function disjunctionEqualMaker(type, prop) {
    return function _disjunctionEquals(a) {
        return Object.getPrototypeOf(type).isPrototypeOf(a) && a[prop] && this.value === a.value;
    };
}

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
function equalMaker(type) {
    return function _equal(a) {
        return Object.getPrototypeOf(type).isPrototypeOf(a) && this.value === a.value;
    };
}

/**
 * @sig
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
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var maybeFactoryHelper = function maybeFactoryHelper(type) {
    return function (val) {
        return type(val);
    };
};

/**
 * @sig
 * @description d
 * @return {*} - a
 */
function mjoin() {
    return this.value;
}

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var pointMaker = function pointMaker(type) {
    return function (val) {
        return type.of(val);
    };
};

/**
 * @sig
 * @description d
 * @param {string} typeString - a
 * @return {function} - b
 */
function stringMaker(typeString) {
    return function _toString() {
        return typeString + '(' + this.value + ')';
    };
}

/**
 * @sig
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
    return this.of(fn(this.value));
}

function nothingMapMaker(factory) {
    return function nothingMap(fn) {
        return factory(this.value);
    };
}

function justBimap(f, g) {
    return this.of(f(this.value));
}

function nothingBimapMaker(factory) {
    return function nothingBimap(f, g) {
        return factory(g(this.value));
    };
}

var sharedMaybeFns = {
    justMap: justMap,
    nothingMapMaker: nothingMapMaker,
    justBimap: justBimap,
    nothingBimapMaker: nothingBimapMaker
};

//==========================================================================================================//
//==========================================================================================================//
//================================        Shared Either Functionality        ===============================//
//==========================================================================================================//
//==========================================================================================================//
/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function rightMap(fn) {
    return this.of(fn(this.value));
}

/**
 * @sig
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
 * @sig
 * @description d
 * @param {function} f - a
 * @param {function} g - b
 * @return {*} - c
 */
function rightBiMap(f, g) {
    return this.of(f(this.value));
}

/**
 * @sig
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

exports.apply = apply;
exports.chain = chain;
exports.disjunctionEqualMaker = disjunctionEqualMaker;
exports.equalMaker = equalMaker;
exports.lifter = lifter;
exports.maybeFactoryHelper = maybeFactoryHelper;
exports.mjoin = mjoin;
exports.pointMaker = pointMaker;
exports.stringMaker = stringMaker;
exports.valueOf = valueOf;
exports.get = get;
exports.emptyGet = emptyGet;
exports.orElse = orElse;
exports.emptyOrElse = emptyOrElse;
exports.getOrElse = getOrElse;
exports.emptyGetOrElse = emptyGetOrElse;
exports.sharedMaybeFns = sharedMaybeFns;
exports.sharedEitherFns = sharedEitherFns;

},{}],300:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constant_functor = exports.Constant = undefined;

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {constant_functor} - b
 */
function Constant(item) {
  return Object.create(constant_functor, {
    _value: {
      value: item,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {constant_functor} - b
 */
Constant.of = function (x) {
  return Constant(x);
};

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @return {boolean} - b
 */
Constant.is = function (f) {
  return constant_functor.isPrototypeOf(f);
};

/**
 * @description d
 * @typedef {Object}
 * @property {function} value
 * @property {function} map
 * @property {function} get
 * @property {function} orElse
 * @property {function} getOrElse
 * @property {function} valueOf
 * @property {function} of
 * @property {function} toString
 * @property {function} factory
 */
var constant_functor = {
  get value() {
    return this._value;
  },
  /**
   * @sig
   * @description d
   * @return {constant_functor} - a
   */
  map: function _map() {
    return this.of(this.value);
  },
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  get: _containerHelpers.get,
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @return {*} - b
   */
  orElse: _containerHelpers.orElse,
  /**
   * @sig
   * @description d
   * @param {*} x - a
   * @return {*} - b
   */
  getOrElse: _containerHelpers.getOrElse,
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  valueOf: _containerHelpers.valueOf,
  /**
   * @sig
   * @description d
   * @param {*} item - a
   * @return {constant_functor} - b
   */
  of: (0, _containerHelpers.pointMaker)(Constant),
  /**
   * @sig
   * @description d
   * @return {string} - a
   */
  toString: (0, _containerHelpers.stringMaker)('Constant'),
  factory: Constant
};

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
constant_functor.equals = (0, _containerHelpers.equalMaker)(constant_functor);

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the Constant's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {constant_functor} - c
 */
constant_functor.bimap = constant_functor.map;

/**
 * @description: sigh.... awesome spec ya got there fantasy-land. Yup, good thing you guys understand
 * JS and aren't treating it like a static, strongly-typed, class-based language with inheritance...
 * cause, ya know... that would be ridiculous if we were going around pretending there is such a thing
 * as constructors in the traditional OOP sense of the word in JS, or that JS has some form of inheritance.
 *
 * What's that? Put a constructor property on a functor that references the function used to create an
 * object that delegates to said functor? Okay.... but why would we call it a 'constructor'? Oh, that's
 * right, you wrote a spec for a language you don't understand rather than trying to understand it and
 * then writing the spec. Apparently your preferred approach is to bury your head in the sand and pretend
 * that JS has classes like the rest of the idiots.
 *
 * Thanks for your contribution to the continual misunderstanding, misapplication, reproach, and frustration
 * of JS developers; thanks for making the world of JavaScript a spec which has become the standard and as
 * such enforces poor practices, poor design, and mental hurdles.
 */
constant_functor.constructor = constant_functor.factory;

exports.Constant = Constant;
exports.constant_functor = constant_functor;

},{"../containerHelpers":299}],301:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.left_functor = exports.right_functor = exports.Right = exports.Left = exports.Either = undefined;

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor|right_functor} - b
 */
function fromNullable(x) {
  return null != x ? Right(x) : Left(x);
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @param {string} fork - b
 * @return {left_functor|right_functor} - c
 */
function Either(val, fork) {
  return 'right' === fork ? Object.create(right_functor, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    },
    isRight: {
      value: true
    },
    isLeft: {
      value: false
    }
  }) : Object.create(left_functor, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    },
    isRight: {
      value: false
    },
    isLeft: {
      value: true
    }
  });
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {right_functor} - b
 */
Either.of = function (x) {
  return Either(x, 'right');
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Either.is = function (f) {
  return Left.is(f) || Right.is(f);
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Either.isRight = function (f) {
  return f.isRight;
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Either.isLeft = function (f) {
  return f.isLeft;
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {right_functor} - b
 */
Either.Right = function (x) {
  return Either(x, 'right');
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor} - b
 */
Either.Left = function (x) {
  return Either(x);
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor|right_functor} - b
 */
Either.fromNullable = fromNullable;

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {left_functor} - b
 */
function Left(val) {
  return Object.create(left_functor, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    },
    isRight: {
      value: false,
      writable: false,
      configurable: false
    },
    isLeft: {
      value: true,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor} - b
 */
Left.of = function (x) {
  return Left(x);
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Left.is = function (f) {
  return left_functor.isPrototypeOf(f);
};

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {right_functor} - b
 */
function Right(val) {
  return Object.create(right_functor, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    },
    isRight: {
      value: true,
      writable: false,
      configurable: false
    },
    isLeft: {
      value: false,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @sig
 * @description d
 * @param {Object} x - a
 * @return {boolean} - b
 */
Right.is = function (x) {
  return right_functor.isPrototypeOf(x);
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {right_functor} - b
 */
Right.of = function (x) {
  return Right(x);
};

var right_functor = {
  get value() {
    return this._value;
  },
  /**
   * @description d
   * @param {function|undefined} fn - a
   * @return {right_functor} - b
   */
  map: _containerHelpers.sharedEitherFns.rightMap,
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @param {function} g - b
   * @return {right_functor} - c
   */
  bimap: _containerHelpers.sharedEitherFns.rightBiMap,
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  get: _containerHelpers.get,
  /**
   * @sig
   * @description d
   * @param {*} x - a
   * @return {*} - b
   */
  getOrElse: _containerHelpers.getOrElse,
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @return {right_functor} - b
   */
  orElse: _containerHelpers.orElse,
  of: (0, _containerHelpers.pointMaker)(Right),
  valueOf: _containerHelpers.valueOf,
  toString: (0, _containerHelpers.stringMaker)('Right'),
  factory: Either
};

/**
 * @description
 * @return
 */
right_functor.equals = (0, _containerHelpers.disjunctionEqualMaker)(right_functor, 'isRight');

var left_functor = {
  get value() {
    return this._value;
  },
  /**
   * @description d
   * @return {left_functor} - b
   */
  map: _containerHelpers.sharedEitherFns.leftMapMaker(Left),
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @param {function} g - b
   * @return {left_functor} - c
   */
  bimap: _containerHelpers.sharedEitherFns.leftBimapMaker(Left),
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  get: _containerHelpers.emptyGet,
  /**
   * @sig
   * @description d
   * @param {*} x - a
   * @return {*} - b
   */
  getOrElse: _containerHelpers.emptyGetOrElse,
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @return {*} - b
   */
  orElse: _containerHelpers.emptyOrElse,
  of: (0, _containerHelpers.pointMaker)(Right),
  valueOf: _containerHelpers.valueOf,
  toString: (0, _containerHelpers.stringMaker)('Left'),
  factory: Either
};

/**
 * @sig
 * @description d
 * @return {boolean} - a
 */
left_functor.equals = (0, _containerHelpers.disjunctionEqualMaker)(left_functor, 'isLeft');

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
right_functor.constructor = right_functor.factory;
left_functor.constructor = left_functor.factory;

exports.Either = Either;
exports.Left = Left;
exports.Right = Right;
exports.right_functor = right_functor;
exports.left_functor = left_functor;

},{"../containerHelpers":299}],302:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.functors = undefined;

var _constant_functor = require('./constant_functor');

var _either_functor = require('./either_functor');

var _future_functor = require('./future_functor');

var _identity_functor = require('./identity_functor');

var _io_functor = require('./io_functor');

var _list_functor = require('./list_functor');

var _maybe_functor = require('./maybe_functor');

var _validation_functor = require('./validation_functor');

var _containerHelpers = require('../containerHelpers');

var _pointlessContainers = require('../../pointlessContainers');

var mapToConstant = (0, _pointlessContainers.toContainerType)(_constant_functor.Constant),
    mapToEither = (0, _pointlessContainers.toContainerType)(_either_functor.Either),
    mapToFuture = (0, _pointlessContainers.toContainerType)(_future_functor.Future),
    mapToIdentity = (0, _pointlessContainers.toContainerType)(_identity_functor.Identity),
    mapToIo = (0, _pointlessContainers.toContainerType)(_io_functor.Io),
    mapToLeft = (0, _pointlessContainers.toContainerType)(_either_functor.Left),
    mapToList = (0, _pointlessContainers.toContainerType)(_list_functor.List),
    mapToMaybe = (0, _pointlessContainers.toContainerType)(_maybe_functor.Maybe),
    mapToRight = (0, _pointlessContainers.toContainerType)(_either_functor.Right),
    mapToValidation = (0, _pointlessContainers.toContainerType)(_validation_functor.Validation);

function toConstant() {
    return this.mapToConstant();
}
function toEither() {
    return this.mapToEither();
}
function toFuture() {
    return this.mapToFuture();
}
function toIdentity() {
    return this.mapToIdentity();
}
function toIo() {
    return this.mapToIo();
}
function toLeft() {
    return this.mapToLeft();
}
function toList() {
    return this.mapToList();
}
function toMaybe() {
    return this.mapToMaybe();
}
function toRight() {
    return this.mapToRight();
}
function toValidation() {
    return this.mapToValidation();
}

//Natural Transformations (nt):
//.fold(f) -> f = functor type factory
//nt(x)mapWith(fn) === nt(x.mapWith(fn))

_constant_functor.constant_functor.mapToEither = mapToEither;
_constant_functor.constant_functor.mapToFuture = mapToFuture;
_constant_functor.constant_functor.mapToIdentity = mapToIdentity;
_constant_functor.constant_functor.mapToIo = mapToIo;
_constant_functor.constant_functor.mapToLeft = mapToLeft;
_constant_functor.constant_functor.mapToList = mapToList;
_constant_functor.constant_functor.mapToMaybe = mapToMaybe;
_constant_functor.constant_functor.mapToRight = mapToRight;
_constant_functor.constant_functor.mapToValidation = mapToValidation;
_constant_functor.constant_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_future_functor.future_functor.mapToConstant = mapToConstant;
_future_functor.future_functor.mapToEither = mapToEither;
_future_functor.future_functor.mapToIdentity = mapToIdentity;
_future_functor.future_functor.mapToIo = mapToIo;
_future_functor.future_functor.mapToLeft = mapToLeft;
_future_functor.future_functor.mapToList = mapToList;
_future_functor.future_functor.mapToMaybe = mapToMaybe;
_future_functor.future_functor.mapToRight = mapToRight;
_future_functor.future_functor.mapToValidation = mapToValidation;
_future_functor.future_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_identity_functor.identity_functor.mapToConstant = mapToConstant;
_identity_functor.identity_functor.mapToEither = mapToEither;
_identity_functor.identity_functor.mapToFuture = mapToFuture;
_identity_functor.identity_functor.mapToIo = mapToIo;
_identity_functor.identity_functor.mapToLeft = mapToLeft;
_identity_functor.identity_functor.mapToList = mapToList;
_identity_functor.identity_functor.mapToMaybe = mapToMaybe;
_identity_functor.identity_functor.mapToRight = mapToRight;
_identity_functor.identity_functor.mapToValidation = mapToValidation;
_identity_functor.identity_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_io_functor.io_functor.mapToConstant = mapToConstant;
_io_functor.io_functor.mapToEither = mapToEither;
_io_functor.io_functor.mapToFuture = mapToFuture;
_io_functor.io_functor.mapToIdentity = mapToIdentity;
_io_functor.io_functor.mapToLeft = mapToLeft;
_io_functor.io_functor.mapToList = mapToList;
_io_functor.io_functor.mapToMaybe = mapToMaybe;
_io_functor.io_functor.mapToRight = mapToRight;
_io_functor.io_functor.mapToValidation = mapToValidation;
_io_functor.io_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_maybe_functor.just_functor.mapToConstant = mapToConstant;
_maybe_functor.just_functor.mapToEither = mapToEither;
_maybe_functor.just_functor.mapToFuture = mapToFuture;
_maybe_functor.just_functor.mapToIdentity = mapToIdentity;
_maybe_functor.just_functor.mapToIo = mapToIo;
_maybe_functor.just_functor.mapToList = mapToList;
_maybe_functor.just_functor.mapToValidation = mapToValidation;
_maybe_functor.just_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_either_functor.left_functor.mapToConstant = mapToConstant;
_either_functor.left_functor.mapToFuture = mapToFuture;
_either_functor.left_functor.mapToIdentity = mapToIdentity;
_either_functor.left_functor.mapToIo = mapToIo;
_either_functor.left_functor.mapToList = mapToList;
_either_functor.left_functor.mapToMaybe = mapToMaybe;
_either_functor.left_functor.mapToValidation = mapToValidation;
_either_functor.left_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_list_functor.list_core.mapToConstant = mapToConstant;
_list_functor.list_core.mapToEither = mapToEither;
_list_functor.list_core.mapToFuture = mapToFuture;
_list_functor.list_core.mapToIdentity = mapToIdentity;
_list_functor.list_core.mapToIo = mapToIo;
_list_functor.list_core.mapToLeft = mapToLeft;
_list_functor.list_core.mapToMaybe = mapToMaybe;
_list_functor.list_core.mapToRight = mapToRight;
_list_functor.list_core.mapToValidation = mapToValidation;

_maybe_functor.nothing_functor.mapToConstant = mapToConstant;
_maybe_functor.nothing_functor.mapToEither = mapToEither;
_maybe_functor.nothing_functor.mapToFuture = mapToFuture;
_maybe_functor.nothing_functor.mapToIdentity = mapToIdentity;
_maybe_functor.nothing_functor.mapToIo = mapToIo;
_maybe_functor.nothing_functor.mapToLeft = mapToLeft;
_maybe_functor.nothing_functor.mapToList = mapToList;
_maybe_functor.nothing_functor.mapToRight = mapToRight;
_maybe_functor.nothing_functor.mapToValidation = mapToValidation;
_maybe_functor.nothing_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_either_functor.right_functor.mapToConstant = mapToConstant;
_either_functor.right_functor.mapToFuture = mapToFuture;
_either_functor.right_functor.mapToIdentity = mapToIdentity;
_either_functor.right_functor.mapToIo = mapToIo;
_either_functor.right_functor.mapToList = mapToList;
_either_functor.right_functor.mapToMaybe = mapToMaybe;
_either_functor.right_functor.mapToValidation = mapToValidation;
_either_functor.right_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_validation_functor.validation_functor.mapToConstant = mapToConstant;
_validation_functor.validation_functor.mapToEither = mapToEither;
_validation_functor.validation_functor.mapToFuture = mapToFuture;
_validation_functor.validation_functor.mapToIdentity = mapToIdentity;
_validation_functor.validation_functor.mapToIo = mapToIo;
_validation_functor.validation_functor.mapToLeft = mapToLeft;
_validation_functor.validation_functor.mapToList = mapToList;
_validation_functor.validation_functor.mapToMaybe = mapToMaybe;
_validation_functor.validation_functor.mapToRight = mapToRight;
_validation_functor.validation_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_constant_functor.Constant.lift = (0, _containerHelpers.lifter)(_constant_functor.Constant);
_either_functor.Either.lift = (0, _containerHelpers.lifter)(_either_functor.Either);
_future_functor.Future.lift = (0, _containerHelpers.lifter)(_future_functor.Future);
_identity_functor.Identity.lift = (0, _containerHelpers.lifter)(_identity_functor.Identity);
_io_functor.Io.lift = (0, _containerHelpers.lifter)(_io_functor.Io);
_maybe_functor.Just.lift = (0, _containerHelpers.lifter)(_maybe_functor.Just);
_either_functor.Left.lift = (0, _containerHelpers.lifter)(_either_functor.Left);
_list_functor.List.lift = (0, _containerHelpers.lifter)(_list_functor.List);
_maybe_functor.Maybe.lift = (0, _containerHelpers.lifter)(_maybe_functor.Maybe);
_maybe_functor.Nothing.lift = (0, _containerHelpers.lifter)(_maybe_functor.Nothing);
_either_functor.Right.lift = (0, _containerHelpers.lifter)(_either_functor.Right);
_validation_functor.Validation.lift = (0, _containerHelpers.lifter)(_validation_functor.Validation);

var functors = {
    Constant: _constant_functor.Constant,
    Either: _either_functor.Either,
    Future: _future_functor.Future,
    Identity: _identity_functor.Identity,
    Io: _io_functor.Io,
    Just: _maybe_functor.Just,
    Left: _either_functor.Left,
    List: _list_functor.List,
    Maybe: _maybe_functor.Maybe,
    Nothing: _maybe_functor.Nothing,
    Right: _either_functor.Right,
    Validation: _validation_functor.Validation
};

Object.defineProperties(_constant_functor.constant_functor, {
    toEither: {
        get: toEither
    }
});

exports.functors = functors;

},{"../../pointlessContainers":327,"../containerHelpers":299,"./constant_functor":300,"./either_functor":301,"./future_functor":303,"./identity_functor":304,"./io_functor":305,"./list_functor":306,"./maybe_functor":307,"./validation_functor":308}],303:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.future_functor = exports.Future = undefined;

var _functionalHelpers = require('../../functionalHelpers');

var _helpers = require('../../helpers');

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {function} reject - a
 * @param {function} resolve - b
 * @return {function} - c
 */
function safeFork(reject, resolve) {
    return function _safeFork(val) {
        try {
            return resolve(val);
        } catch (ex) {
            reject(ex);
        }
    };
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {future_functor} - b
 */
function Future(fn) {
    return Object.create(future_functor, {
        _value: {
            value: (0, _functionalHelpers.once)(fn),
            writable: false,
            configurable: false
        },
        _fork: {
            value: (0, _functionalHelpers.once)(fn),
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
    return future_functor.isPrototypeOf(f);
};

/**
 * @sig
 * @description d
 * @param {function|*} val - a
 * @return {future_functor} - b
 */
Future.of = function (val) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(val)) ? Future(val) : Future(function (_, resolve) {
        return safeFork(_functionalHelpers.noop, resolve(val));
    });
};

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {future_functor} - b
 */
Future.reject = function (val) {
    return Future(function (reject, resolve) {
        return reject(val);
    });
};

/**
 * @sig
 * @description d
 * @param {function} val - a
 * @return {future_functor} - b
 */
Future.unit = function (val) {
    return Future(val).complete();
};

/**
 * @sig
 * @description d
 * @return {future_functor} - a
 */
Future.empty = function () {
    return Future(_functionalHelpers.noop);
};

var future_functor = {
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        var _this = this;

        return this.of(function (reject, resolve) {
            return _this.fork(function (a) {
                return reject(a);
            }, function (b) {
                return resolve(fn(b));
            });
        });
    },
    fork: function _fork(reject, resolve) {
        this._fork(reject, resolve);
    },
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && ma.value === this.value;
    },
    of: (0, _containerHelpers.pointMaker)(Future),
    valueOf: _containerHelpers.valueOf,
    toString: function _toString() {
        console.log(this.value, this.value.name, this.value === _functionalHelpers.once);
        return 'Future(' + this.value.name + ')';
    },
    factory: Future
};

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
future_functor.constructor = future_functor.factory;

exports.Future = Future;
exports.future_functor = future_functor;

},{"../../functionalHelpers":322,"../../helpers":325,"../containerHelpers":299}],304:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity_functor = exports.Identity = undefined;

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {identity_functor} - b
 */
function Identity(item) {
  return Object.create(identity_functor, {
    _value: {
      value: item,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {identity_functor} - b
 */
Identity.of = function (x) {
  return Identity(x);
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Identity.is = function (f) {
  return identity_functor.isPrototypeOf(f);
};

var identity_functor = {
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  get value() {
    return this._value;
  },
  /**
   * @sig
   * @description d
   * @param {function} fn - a
   * @return {identity_functor} - b
   */
  map: function _map(fn) {
    return this.of(fn(this.value));
  },
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  get: _containerHelpers.get,
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @return {*} - b
   */
  orElse: _containerHelpers.orElse,
  /**
   * @sig
   * @description d
   * @param {*} x - a
   * @return {*} - b
   */
  getOrElse: _containerHelpers.getOrElse,
  /**
   * @sig
   * @description d
   * @param {*} item - a
   * @return {identity_functor} - b
   */
  of: (0, _containerHelpers.pointMaker)(Identity),
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  valueOf: _containerHelpers.valueOf,
  /**
   * @sig
   * @description d
   * @return {string} - a
   */
  toString: (0, _containerHelpers.stringMaker)('Identity'),
  /**
   * @sig
   * @description d
   * @return {Identity} - a
   */
  factory: Identity
};

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
identity_functor.equals = (0, _containerHelpers.equalMaker)(identity_functor);

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {identity_functor} - c
 */
identity_functor.bimap = identity_functor.map;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "you're too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
identity_functor.constructor = identity_functor.factory;

exports.Identity = Identity;
exports.identity_functor = identity_functor;

},{"../containerHelpers":299}],305:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.io_functor = exports.Io = undefined;

var _combinators = require('../../combinators');

var _functionalHelpers = require('../../functionalHelpers');

var _helpers = require('../../helpers');

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {function} item - a
 * @return {io_functor} - b
 */
function Io(item) {
    return Object.create(io_functor, {
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
 * @sig
 * @description d
 * @param {function|*} item - a
 * @return {io_functor} - b
 */
Io.of = function (item) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(item)) ? Io(item) : Io((0, _combinators.constant)(item));
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Io.is = function (f) {
    return io_functor.isPrototypeOf(f);
};

/**
* @description d
* @typedef {Object}
*/
var io_functor = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.chain(function (a) {
            return Io.of(fn(a));
        });
    },
    runIo: function _runIo() {
        return this.run.apply(this, arguments);
    },
    of: (0, _containerHelpers.pointMaker)(Io),
    valueOf: _containerHelpers.valueOf,
    toString: (0, _containerHelpers.stringMaker)('Io'),
    factory: Io
};

/**
 * @description:
 * @return:
 */
io_functor.equals = (0, _containerHelpers.equalMaker)(io_functor);

/**
 * @description: Since the constant functor does not represent a disjunction, the Io's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type: {{function}}
 * @param: {function} f
 * @param: {function} g
 * @return: {@see io_functor}
 */
io_functor.bimap = io_functor.map;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
io_functor.constructor = io_functor.factory;

exports.Io = Io;
exports.io_functor = io_functor;

},{"../../combinators":298,"../../functionalHelpers":322,"../../helpers":325,"../containerHelpers":299}],306:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ordered_list_functor = exports.list_functor = exports.list_core = exports.List = undefined;

var _list_iterators = require('../list_iterators');

var _helpers = require('../../helpers');

var _functionalHelpers = require('../../functionalHelpers');

var _combinators = require('../../combinators');

var _decorators = require('../../decorators');

var _list_helpers = require('../list_helpers');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @description: Object that contains the core functionality of a List; both the m_list and ordered_m_list
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @typedef {Object}
 * @property {function} value
 * @property {function} append
 * @property {function} copyWithin
 * @property {function} concat
 * @property {function} distinct
 * @property {function} except
 * @property {function} fill
 * @property {function} filter
 * @property {function} groupBy
 * @property {function} groupByDescending
 * @property {function} groupJoin
 * @property {function} intersect
 * @property {function} intersperse
 * @property {function} join
 * @property {function} map
 * @property {function} ofType
 * @property {function} prepend
 * @property {function} reverse
 * @property {function} skip
 * @property {function} skipWhile
 * @property {function} take
 * @property {function} takeWhile
 * @property {function} union
 * @property {function} zip
 * @property {function} all
 * @property {function} any
 * @property {function} contains
 * @property {function} count
 * @property {function} equals
 * @property {function} findIndex
 * @property {function} findLastIndex
 * @property {function} first
 * @property {function} foldLeft
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
 * @property {Symbol.iterator}
 */
var list_core = _defineProperty({
    //Using getters for these properties because there's a chance the setting and/or getting
    //functionality could change; this will allow for a consistent interface while the
    //logic beneath changes
    /**
     * @sig
     * @description Getter for the underlying source object of the List
     * @return {*} - a
     */
    get value() {
        return this._value;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {number} index - a
     * @param {number} start - b
     * @param {number} end - c
     * @return {list_functor} - d
     */
    copyWithin: function _copyWithin(index, start, end) {
        return this.of(this, (0, _list_iterators.copyWithin)(index, start, end, this));
    },

    /**
     * @sig
     * @description Concatenates two or more lists by appending the "method's" List argument(s) to the
     * List's value. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @protected
     * @param {Array | *} ys - a
     * @return {list_functor} - b
     */
    concat: function _concat() {
        for (var _len = arguments.length, ys = Array(_len), _key = 0; _key < _len; _key++) {
            ys[_key] = arguments[_key];
        }

        return this.of(this, (0, _list_iterators.concat)(this, ys, ys.length));
    },

    /**
     * @sig (a -> boolean) -> List<b>
     * @description d
     * @protected
     * @param {function} comparer - a
     * @return {list_functor} - b
     */
    distinct: function _distinct(comparer) {
        return this.of(this, (0, _list_iterators.distinct)(this, comparer));
    },

    /**
     * @sig
     * @description Produces a List that contains the objectSet difference between the queryable object
     * and the List that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * equality comparer.
     * @protected
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    except: function _except(xs, comparer) {
        return this.of(this, (0, _list_iterators.except)(this, xs, comparer));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {number} value - a
     * @param {number} start - b
     * @param {number} end - c
     * @return {list_functor} - d
     */
    fill: function _fill(value, start, end) {
        return this.of(this, (0, _list_iterators.fill)(value, start, end, this));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {list_functor} - b
     */
    filter: function _filter(predicate) {
        return this.of(this, (0, _list_iterators.filter)(this, predicate));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
        return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.descending }];
        return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @sig
     * @description Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @protected
     * @param {list_core | Array} ys - a
     * @param {function} xSelector - b
     * @param {function} ySelector - c
     * @param {function} projector - d
     * @param {function} comparer - e
     * @return {list_functor} - f
     */
    groupJoin: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
        return this.of(this, (0, _list_iterators.groupJoin)(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
    },

    /**
     * @sig
     * @description Produces the objectSet intersection of the List object's value and the List
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @protected
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    intersect: function _intersect(xs, comparer) {
        return this.of(this, (0, _list_iterators.intersect)(this, xs, comparer));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {*} val - a
     * @return {list_functor} - b
     */
    intersperse: function _intersperse(val) {
        return this.of(this, (0, _list_iterators.intersperse)(this, val));
    },

    /**
     * @sig
     * @description Correlates the items in two lists based on the equality of items in each
     * List. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @protected
     * @param {Array|List} ys - a
     * @param {function} xSelector - b
     * @param {function} ySelector - c
     * @param {function} projector - d
     * @param {function} comparer - e
     * @return {list_functor} - f
     */
    join: function _join(ys, xSelector, ySelector, projector, comparer) {
        return this.of(this, (0, _list_iterators.join)(this, ys, xSelector, ySelector, projector, comparer));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} mapFunc - a
     * @return {list_functor} - b
     */
    map: function _map(mapFunc) {
        return this.of(this, (0, _list_iterators.map)(this, mapFunc));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {string|Object} type - a
     * @returns {list_functor} - b
     */
    ofType: function _ofType(type) {
        return this.of(this, (0, _list_iterators.ofType)(this, type));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {Array|generator} xs - a
     * @return {list_functor} - b
     */
    prepend: function _prepend(xs) {
        return this.of(this, (0, _list_iterators.prepend)(this, xs));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {list_functor} - a
     */
    reverse: function _reverse() {
        return this.of(this, (0, _list_iterators.reverse)(this));
    },

    /**
     * @sig
     * @description Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty list_functor is returned;
     * Otherwise, a list_functor containing the items collected from the source is
     * returned.
     * @protected
     * @param {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @return {list_functor} - a
     */
    skip: function _skip(amt) {
        return this.skipWhile((0, _list_helpers.taker_skipper)(amt));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {list_functor} - b
     */
    skipWhile: function _skipWhile() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return this.of(this, (0, _list_iterators.skipWhile)(this, predicate));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {number} amt - a
     * @return {list_functor} - b
     */
    take: function _take(amt) {
        return this.takeWhile((0, _list_helpers.taker_skipper)(amt));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {list_functor} - b
     */
    takeWhile: function _takeWhile() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return this.of(this, (0, _list_iterators.takeWhile)(this, predicate));
    },

    /**
     * @sig
     * @description Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @protected
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    union: function _union(xs, comparer) {
        return this.of(this, (0, _list_iterators.union)(this, xs, comparer));
    },

    /**
     * @sig
     * @description Produces a List of the items in the queryable object and the List passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @protected
     * @param {function} selector - a
     * @param {Array|generator} xs - b
     * @return {list_functor} - c
     */
    zip: function _zip(selector, xs) {
        return this.of(this, (0, _list_iterators.zip)(this, xs, selector));
    },

    /**
     * @sig (a -> Boolean) -> [a] -> Boolean
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {boolean} - b
     */
    all: function _all() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.all)(this, predicate);
    },

    /**
     * @sig: (a -> Boolean) -> [a] -> Boolean
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {boolean} - b
     */
    any: function _any() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.any)(this, predicate);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {Number} -  b
     */
    count: function _count(predicate) {
        return (0, _list_iterators.count)(this, predicate);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {list_core} f - a
     * @param {function} comparer - b
     * @return {boolean} - c
     */
    equals: function _equals(f, comparer) {
        return Object.getPrototypeOf(this).isPrototypeOf(f) && (0, _list_iterators.equals)(this, f, comparer);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} comparer - a
     * @return {Number} - b
     */
    findIndex: function _findIndex(comparer) {
        return (0, _list_iterators.findIndex)(this, comparer);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} comparer - a
     * @return {Number} - b
     */
    findLastIndex: function _findLastIndex(comparer) {
        return (0, _list_iterators.findLastIndex)(this, comparer);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {*} - b
     */
    first: function _first() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.first)(this, predicate);
    },

    /**
     * @sig (a -> b -> c) -> a -> [b] -> a
     * @description d
     * @protected
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    foldl: function _foldl(fn, acc) {
        return (0, _list_iterators.foldLeft)(this, fn, acc);
    },

    /**
     * @sig (a -> a -> a) -> [a] -> a
     * @description d
     * @protected
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    foldr: function _foldr(fn, acc) {
        return (0, _list_iterators.foldRight)(this, fn, acc);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {boolean} - a
     */
    isEmpty: function _isEmpty() {
        return 0 === this.data.length;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {*} - b
     */
    last: function _last() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.last)(this, predicate);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    reduceRight: function _reduceRight(fn, acc) {
        return (0, _list_iterators.reduceRight)(this, fn, acc);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {Array} - a
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     * @sig
     * @description Evaluates the current List instance and returns a new List
     * instance with the evaluated data as its source. This is used when the
     * initial List's data must be iterated more than once as it will cause
     * the evaluation to happen each item it is iterated. Rather the pulling the
     * initial data through the List's 'pipeline' every time, this property will
     * allow you to evaluate the List's data and store it in a new List that can
     * be iterated many times without needing to re-evaluate. It is effectively
     * a syntactical shortcut for: List.from(listInstance.data)
     * @protected
     * @return {list_functor} - a
     */
    toEvaluatedList: function _toEvaluatedList() {
        return List.from(this.data /* the .data property is a getter function that forces evaluation */);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {Map} - a
     */
    toMap: function _toMap() {
        return new Map(this.data.map(function _map(val, idx) {
            return [idx, val];
        }));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {Set} - a
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     * @sig
     * @description Returns a string representation of an instance of a List
     * delegator object. This function does not cause evaluation of the source,
     * but this also means the returned value only reflects the underlying
     * data, not the evaluated data.
     * @protected
     * @return {string} - a
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
        var val = list_core.isPrototypeOf(this.value) ? this.value.toString() : this.value;
        return 'List(' + val + ')';
        //return list_core.isPrototypeOf(this.value) ? this.value.toString() : `List(${this.value})`;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {*} - a
     */
    valueOf: function _valueOf() {
        return this.value;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {list_functor} - a
     */
    factory: List,

    /**
     * @sig
     * @description d
     * @protected
     * @param {*} xs - a
     * @param {generator} [iterator] - b
     * @param {Array} [sortObj] - c
     * @param {string} [key] - d
     * @return {list_functor} - e
     */
    of: function _of(xs, iterator, sortObj, key) {
        return createListDelegateInstance(xs, iterator, sortObj, key);
    }

}, Symbol.iterator, regeneratorRuntime.mark(function _iterator() {
    var data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator2, _step, item;

    return regeneratorRuntime.wrap(function _iterator$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    data = Array.from(this.value);
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 4;
                    _iterator2 = data[Symbol.iterator]();

                case 6:
                    if (_iteratorNormalCompletion = (_step = _iterator2.next()).done) {
                        _context.next = 13;
                        break;
                    }

                    item = _step.value;
                    _context.next = 10;
                    return item;

                case 10:
                    _iteratorNormalCompletion = true;
                    _context.next = 6;
                    break;

                case 13:
                    _context.next = 19;
                    break;

                case 15:
                    _context.prev = 15;
                    _context.t0 = _context['catch'](4);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                case 19:
                    _context.prev = 19;
                    _context.prev = 20;

                    if (!_iteratorNormalCompletion && _iterator2.return) {
                        _iterator2.return();
                    }

                case 22:
                    _context.prev = 22;

                    if (!_didIteratorError) {
                        _context.next = 25;
                        break;
                    }

                    throw _iteratorError;

                case 25:
                    return _context.finish(22);

                case 26:
                    return _context.finish(19);

                case 27:
                case 'end':
                    return _context.stop();
            }
        }
    }, _iterator, this, [[4, 15, 19, 27], [20,, 22, 26]]);
}));

list_core.append = list_core.concat;

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the list_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a List's data by
 * a given key.
 * @typedef {Object}
 * @property {function} sortBy
 * @property {function} sortByDescending
 * @property {function} contains
 */
var list_functor = Object.create(list_core, {
    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    sortBy: {
        value: function _orderBy(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
            return this.of(this, (0, _list_iterators.sortBy)(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    sortByDescending: {
        value: function _orderByDescending(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.descending }];
            return this.of(this, (0, _list_iterators.sortBy)(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description d
     * @protected
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
 */
var ordered_list_functor = Object.create(list_core, {
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
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    thenBy: {
        value: function _thenBy(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.ascending });
            return this.of(this.value, (0, _list_iterators.sortBy)(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    thenByDescending: {
        value: function thenByDescending(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.descending });
            return this.of(this.value, (0, _list_iterators.sortBy)(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description Performs the same functionality as list_core#contains, but utilizes
     * a binary searching algorithm rather than a sequential search. If this function is called
     * an a non-ordered List, it will internally delegate to list_core#contains instead. This
     * function should not be called on a sorted List for look for a value that is not the
     * primary field on which the List's data is sorted on as an incorrect result will likely
     * be returned.
     * @protected
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
 * @sig
 * @description Creates a new list_functor object delegate instance; list_functor type is determined by
 * the parameters passed to the function. If only the 'source' parameter is provided, a
 * 'basic' list_functor delegate object instance is created. If the source and iterator parameters
 * are passed as arguments, a 'basic' list_functor delegate object instance is created and the
 * iterator provided is used as the new instance object's iterator rather than the default
 * list_functor iterator. If the source, iterator, and sortObj parameters are passed as arguments,
 * an ordered_list_functor delegate object instance is created. The provided iterator is set on
 * the instance object to be used in lieu of the default iterator and the ._appliedSorts
 * field is set as the 'sortObj' parameter. If all four of the function's arguments are
 * provided (source, iterator, sortObj, and key), then a list_functor delegate object instance
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
 * @param {*} source - The value to be used as the underlying source of the list_functor functor; may be
 * anything javascript object that has an iterator.
 * @param {generator} iterator - A generator function that is to be used on the new list_functor delegate
 * object instance's iterator.
 * @param {Array} sortObj - An array of the sort(s) (field and direction} to be used when the
 * instance is evaluated.
 * @param {string} key - A string that denotes what value the new list_functor delegate object instance
 * was grouped on.
 * @return {list_core}
 */
var createListDelegateInstance = (0, _list_helpers.createListCreator)(list_functor, ordered_list_functor, list_functor);

/**
 * @sig
 * @description d
 * @param {*} source - a
 * @return {list_functor} - b
 */
var listFromNonGen = function listFromNonGen(source) {
    return createListDelegateInstance(source && source[Symbol.iterator] ? source : (0, _functionalHelpers.wrap)(source));
};

/**
 * @sig
 * @description d
 * @param {generator} source - a
 * @return {list_functor} - b
 */
var listFromGen = function listFromGen(source) {
    return createListDelegateInstance((0, _functionalHelpers.invoke)(source));
};

/**
 * @sig
 * @description Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_functor} - A new List instance with the value provided as the underlying source.
 */
//TODO: should I exclude strings from being used as a source directly, or allow it because
//TODO: they have an iterator?
function List(source) {
    return (0, _combinators.ifElse)((0, _functionalHelpers.delegatesFrom)(_helpers.generatorProto), listFromGen, listFromNonGen, source);
}

/**
 * @sig
 * @description Convenience function for listCreate a new List instance; internally calls List.
 * @static
 * @see List
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_functor} - A new List instance with the value provided as the underlying source.
 */
List.from = function (source) {
    return List(source);
};

/**
 * @sig
 * @description Alias for List.from
 * @static
 * @see List.from
 * @param {*}
 * @return {list_functor} - a
 */
List.of = List.from;

//TODO: implement this so that a consumer can initiate a List as ordered
List.ordered = function (source, selector) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.defaultPredicate;
    return createListDelegateInstance(source, null, [{ keySelector: selector, comparer: comparer, direction: _helpers.sortDirection.ascending }]);
};

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @return {list_functor} - a
 */
List.empty = function () {
    return createListDelegateInstance([], null, [{ keySelector: _combinators.identity, comparer: _functionalHelpers.defaultPredicate, direction: _helpers.sortDirection.ascending }]);
};

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @param {*} val - a
 * @return {list_functor} - b
 */
List.just = function (val) {
    return createListDelegateInstance([val], null, [{ keySelector: _combinators.identity, comparer: _functionalHelpers.defaultPredicate, direction: _helpers.sortDirection.ascending }]);
};

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @param {function|generator} fn - a
 * @param {*} seed - b
 * @return {list_functor} - c
 */
List.unfold = function (fn, seed) {
    return createListDelegateInstance((0, _list_iterators.unfold)(fn)(seed));
};

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @param {*} f - a
 * @return {boolean} - b
 */
List.is = function (f) {
    return list_core.isPrototypeOf(f);
};

/**
 * @sig
 * @description Generates a new list with the specified item repeated the specified number of times. Because
 * this generates a list with the same item repeated n times, the resulting List is trivially
 * sorted. Thus, a sorted List is returned rather than an unsorted list.
 * @static
 * @see List
 * @param {*} item - a
 * @param {number} count - b
 * @return {ordered_list_functor} - c
 */
List.repeat = function _repeat(item, count) {
    return createListDelegateInstance([], (0, _list_iterators.repeat)(item, count), [{ keySelector: _functionalHelpers.noop, comparer: _functionalHelpers.noop, direction: _helpers.sortDirection.descending }]);
};

/**
 * @sig
 * @summary Extension function that allows new functionality to be applied to
 * the queryable object
 * @static
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
List.extend = (0, _list_helpers.listExtensionHelper)(List, list_core, createListDelegateInstance, list_functor, ordered_list_functor);

function createGroupedListDelegate(source, key) {
    return createListDelegateInstance(source, undefined, undefined, key);
}

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
list_core.constructor = list_core.factory;
list_core.fold = list_core.foldl;
list_core.reduce = list_core.foldl;

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the List's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @protected
 * @param {function} f - a
 * @param {function} g - b
 * @return {list_core} - c
 */
list_core.bimap = list_core.map;

exports.List = List;
exports.list_core = list_core;
exports.list_functor = list_functor;
exports.ordered_list_functor = ordered_list_functor;

},{"../../combinators":298,"../../decorators":321,"../../functionalHelpers":322,"../../helpers":325,"../list_helpers":309,"../list_iterators":310}],307:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nothing_functor = exports.just_functor = exports.Nothing = exports.Just = exports.Maybe = undefined;

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {just_functor|nothing_functor} - b
 */
function fromNullable(x) {
    return null != x ? Just(x) : Nothing();
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor|nothing_functor} - b
 */
function Maybe(val) {
    return null == val ? Object.create(nothing_functor, {
        _value: {
            value: null
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    }) : Object.create(just_functor, {
        _value: {
            value: val
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
Maybe.of = function _of(val) {
    return Object.create(just_functor, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Maybe.is = function (f) {
    return just_functor.isPrototypeOf(f) || nothing_functor.isPrototypeOf(f);
};

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
Maybe.Just = Maybe.of;

/**
 * @sig
 * @description d
 * @return {nothing_functor} - a
 */
Maybe.Nothing = function () {
    return Maybe();
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Maybe.isJust = function (m) {
    return just_functor.isPrototypeOf(m);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Maybe.isNothing = function (m) {
    return nothing_functor.isPrototypeOf(m);
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {just_functor|nothing_functor} - b
 */
Maybe.fromNullable = fromNullable;

//TODO: determine if there is any purpose in splitting a maybe into two types... if those sub-types
//TODO: are not exposed, what benefit is derived from them? And if they are exposed (Just being Identity,
//TODO: and Nothing being Constant(null)), then the maybe container has a direct dependency on the Identity
//TODO: and Constant containers. This becomes an issue due to circular dependencies.
/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
function Just(val) {
    return Object.create(just_functor, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
Just.of = function _of(val) {
    return Object.create(just_functor, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Just.is = function (f) {
    return just_functor.isPrototypeOf(f);
};

/**
 * @sig
 * @description d
 * @return {nothing_functor} - a
 */
function Nothing() {
    return Object.create(nothing_functor, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    });
}

/**
 * @sig
 * @description d
 * @return {nothing_functor} - a
 */
Nothing.of = Nothing;

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Nothing.is = function (f) {
    return nothing_functor.isPrototypeOf(f);
};

//TODO: Using this.of in order to create a new instance of a Maybe container (functor/monad) will
//TODO: not work as it is implemented here in terms of creating a new maybe container with the
//TODO: proper values for the '.isJust' and '.isNothing' fields. The problem is that the '.of'
//TODO: function property will create a new maybe instance with whatever value it receives as
//TODO: as argument and treat the new maybe container instance as a 'Just', regardless of the
//TODO: actual underlying value. As 'null' and 'undefined' underlying values are traditionally
//TODO: treated as 'Nothing' maybe values, this will cause a problem during mapping/flat-mapping/etc.

var just_functor = {
    get value() {
        return this._value;
    },
    map: _containerHelpers.sharedMaybeFns.justMap,
    bimap: _containerHelpers.sharedMaybeFns.justBimap,
    get: _containerHelpers.get,
    getOrElse: _containerHelpers.getOrElse,
    orElse: _containerHelpers.orElse,
    of: (0, _containerHelpers.pointMaker)(Just),
    valueOf: _containerHelpers.valueOf,
    toString: (0, _containerHelpers.stringMaker)('Just'),
    factory: Maybe
};

/**
 * @description:
 * @return:
 */
just_functor.equals = (0, _containerHelpers.disjunctionEqualMaker)(just_functor, 'isJust');

var nothing_functor = {
    get value() {
        return this._value;
    },
    map: _containerHelpers.sharedMaybeFns.nothingMapMaker(Nothing),
    bimap: _containerHelpers.sharedMaybeFns.nothingBimapMaker(Nothing),
    get: _containerHelpers.emptyGet,
    getOrElse: _containerHelpers.emptyGetOrElse,
    orElse: _containerHelpers.emptyOrElse,
    of: (0, _containerHelpers.pointMaker)(Just),
    valueOf: _containerHelpers.valueOf,
    toString: function _toString() {
        return 'Nothing()';
    },
    factory: Maybe
};

/**
 * @description:
 * @return:
 */
nothing_functor.equals = (0, _containerHelpers.disjunctionEqualMaker)(nothing_functor, 'isNothing');

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
//maybe_functor.constructor = maybe_functor.factory;
just_functor.constructor = just_functor.factory;
nothing_functor.constructor = nothing_functor.factory;

exports.Maybe = Maybe;
exports.Just = Just;
exports.Nothing = Nothing;
exports.just_functor = just_functor;
exports.nothing_functor = nothing_functor;

},{"../containerHelpers":299}],308:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validation_functor = exports.Validation = undefined;

var _containerHelpers = require('../containerHelpers');

function Validation(val) {
    return Object.create(validation_functor, {
        _value: {
            value: val
        }
    });
}

Validation.of = function _of(val) {
    return Validation(val);
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Validation.is = function (f) {
    return validation_functor.isPrototypeOf(f);
};

var validation_functor = {
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    of: (0, _containerHelpers.pointMaker)(Validation),
    valueOf: _containerHelpers.valueOf,
    toString: (0, _containerHelpers.stringMaker)('Validation'),
    factory: Validation
};

/**
 * @sig
 * @description d
 * @return {boolean} - a
 */
validation_functor.equals = (0, _containerHelpers.equalMaker)(validation_functor);

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the Validation's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {validation_functor} - c
 */
validation_functor.bimap = validation_functor.map;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
validation_functor.constructor = validation_functor.factory;

exports.Validation = Validation;
exports.validation_functor = validation_functor;

},{"../containerHelpers":299}],309:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.listExtensionHelper = exports.taker_skipper = exports.createListCreator = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _helpers = require('../helpers');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @sig
 * @description This factory producing function is used by both the list functor and the
 * list monad when creating a new list object. Based on the parameters passed, the factory
 * function will create a new object that delegates to the appropriate type with whatever
 * additional fields it needs, i.e. ._value, .data, [Symbol.iterator], etc.
 * @param {object} baseListType - a
 * @param {object} sortedListType - b
 * @param {object} groupedListType - c
 * @return {function} - d
 */
function createListCreator(baseListType, sortedListType, groupedListType) {
    return function createListDelegateInstance(source, iterator, sortObj, key) {
        switch (createBitMask((0, _functionalHelpers.delegatesTo)(iterator, _helpers.generatorProto), (0, _functionalHelpers.isArray)(sortObj), (0, _functionalHelpers.isString)(key))) {
            /**
             * @description: case 1 = An iterator has been passed, but nothing else. Create a
             * basic list type object instance and set the iterator as the version provided.
             */
            case 1:
                return Object.create(baseListType, _defineProperty({
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    }
                }, Symbol.iterator, {
                    value: iterator
                }));
            /**
             * @description: case 2 = Only a sort object was passed in. The list is presumed to be either
             * trivially sorted via List.just or List.empty, or was initialized as an ordered list. Create
             * an ordered list type object instance, setting the _appliedSorts field as the sortObj param.
             */
            case 2:
                return Object.create(sortedListType, {
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    },
                    _appliedSorts: {
                        value: sortObj,
                        writable: false,
                        configurable: false
                    }
                });
            /**
             * @description: case 3 = Both an iterator and a sort object were passed in. The consumer
             * invoked the sortBy/sortByDescending or thenBy/thenByDescending function properties. Create
             * an ordered list type object instance, setting the iterator to the version provided (if any) and
             * the _appliedSorts field as the sortObj param.
             */
            case 3:
                return Object.create(sortedListType, _defineProperty({
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    },
                    _appliedSorts: {
                        value: sortObj,
                        writable: false,
                        configurable: false
                    }
                }, Symbol.iterator, {
                    value: iterator
                }));
            /**
             * @description: case 4 = An iterator, sort object, and a key were passed as arguments.
             * Create a grouped list type and set the iterator as the version provided, the ._appliedSorts
             * field as the sortObj param, and the ._key field as the key string argument.
             */
            case 4:
                return Object.create(groupedListType, {
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    },
                    _key: {
                        value: key,
                        writable: false,
                        configurable: false
                    },
                    key: {
                        get: function _getKey() {
                            return this._key;
                        }
                    }
                });
            /**
             * @description: default = Nothing beyond the 'source' param was passed to this
             * function; results in a bitwise value of 00. Create a 'basic' list object type
             * instance.
             */
            default:
                return Object.create(baseListType, {
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    }
                });
        }
    };

    function createBitMask() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return args.reduce(function _reduce(curr, next, idx) {
            return curr |= next << idx;
        }, args[0]);
    }
}

function taker_skipper(amt) {
    var count = -1;
    return function _skipAmt() {
        return ++count < amt;
    };
}

function listExtensionHelper(listFactory, listDelegatee, creatorFunc) {
    for (var _len2 = arguments.length, listTypes = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        listTypes[_key2 - 3] = arguments[_key2];
    }

    return function _extend(prop, fn) {
        if (!listTypes.some(function (type) {
            return prop in type;
        })) {
            listDelegatee[prop] = function _extension() {
                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                }

                return creatorFunc(this, fn.apply(undefined, [this].concat(args)));
            };
        }
        return listFactory;
    };
}

exports.createListCreator = createListCreator;
exports.taker_skipper = taker_skipper;
exports.listExtensionHelper = listExtensionHelper;

},{"../functionalHelpers":322,"../helpers":325}],310:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unfold = exports.foldRight = exports.repeat = exports.findLastIndex = exports.findIndex = exports.fill = exports.copyWithin = exports.reverse = exports.skipWhile = exports.takeWhile = exports.equals = exports.binarySearch = exports.ofType = exports.distinct = exports.reduceRight = exports.foldLeft = exports.count = exports.last = exports.first = exports.contains = exports.intersperse = exports.filter = exports.zip = exports.join = exports.groupJoin = exports.concat = exports.prepend = exports.sortBy = exports.groupBy = exports.chain = exports.map = exports.union = exports.intersect = exports.except = exports.any = exports.all = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _functionalHelpers = require('../functionalHelpers');

var _decorators = require('../decorators');

var _combinators = require('../combinators');

var _helpers = require('../helpers');

var _sortHelpers = require('./sortHelpers');

var toArray = (0, _combinators.when)((0, _decorators.not)(_functionalHelpers.isArray), Array.from);

/**
 * @sig 
 * @description -
 * @param {Array|generator} xs - some stuff
 * @param {Array|generator} ys - some other stuff
 * @return {generator} - some other other stuff
 */
function prepend(xs, ys) {
    return regeneratorRuntime.mark(function addFront() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, y, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, x;

        return regeneratorRuntime.wrap(function addFront$(_context) {
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
                            _context.next = 12;
                            break;
                        }

                        y = _step.value;
                        _context.next = 9;
                        return y;

                    case 9:
                        _iteratorNormalCompletion = true;
                        _context.next = 5;
                        break;

                    case 12:
                        _context.next = 18;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](3);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 18:
                        _context.prev = 18;
                        _context.prev = 19;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 21:
                        _context.prev = 21;

                        if (!_didIteratorError) {
                            _context.next = 24;
                            break;
                        }

                        throw _iteratorError;

                    case 24:
                        return _context.finish(21);

                    case 25:
                        return _context.finish(18);

                    case 26:
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context.prev = 29;
                        _iterator2 = xs[Symbol.iterator]();

                    case 31:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context.next = 38;
                            break;
                        }

                        x = _step2.value;
                        _context.next = 35;
                        return x;

                    case 35:
                        _iteratorNormalCompletion2 = true;
                        _context.next = 31;
                        break;

                    case 38:
                        _context.next = 44;
                        break;

                    case 40:
                        _context.prev = 40;
                        _context.t1 = _context['catch'](29);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context.t1;

                    case 44:
                        _context.prev = 44;
                        _context.prev = 45;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 47:
                        _context.prev = 47;

                        if (!_didIteratorError2) {
                            _context.next = 50;
                            break;
                        }

                        throw _iteratorError2;

                    case 50:
                        return _context.finish(47);

                    case 51:
                        return _context.finish(44);

                    case 52:
                    case 'end':
                        return _context.stop();
                }
            }
        }, addFront, this, [[3, 14, 18, 26], [19,, 21, 25], [29, 40, 44, 52], [45,, 47, 51]]);
    });
}

/**
 * @sig:
 * @description description
 * @param {Array|generator} xs - x
 * @param {Array|generator} yss - y
 * @param {number} argsCount - z
 * @return {generator} - a
 */
function concat(xs, yss, argsCount) {
    return regeneratorRuntime.mark(function concatIterator() {
        var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, x, ys, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, y, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _ys, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _y;

        return regeneratorRuntime.wrap(function concatIterator$(_context2) {
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
                            _context2.next = 12;
                            break;
                        }

                        x = _step3.value;
                        _context2.next = 9;
                        return x;

                    case 9:
                        _iteratorNormalCompletion3 = true;
                        _context2.next = 5;
                        break;

                    case 12:
                        _context2.next = 18;
                        break;

                    case 14:
                        _context2.prev = 14;
                        _context2.t0 = _context2['catch'](3);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context2.t0;

                    case 18:
                        _context2.prev = 18;
                        _context2.prev = 19;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 21:
                        _context2.prev = 21;

                        if (!_didIteratorError3) {
                            _context2.next = 24;
                            break;
                        }

                        throw _iteratorError3;

                    case 24:
                        return _context2.finish(21);

                    case 25:
                        return _context2.finish(18);

                    case 26:
                        if (!(1 === argsCount)) {
                            _context2.next = 56;
                            break;
                        }

                        ys = yss[0];
                        _iteratorNormalCompletion4 = true;
                        _didIteratorError4 = false;
                        _iteratorError4 = undefined;
                        _context2.prev = 31;
                        _iterator4 = ys[Symbol.iterator]();

                    case 33:
                        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                            _context2.next = 40;
                            break;
                        }

                        y = _step4.value;
                        _context2.next = 37;
                        return y;

                    case 37:
                        _iteratorNormalCompletion4 = true;
                        _context2.next = 33;
                        break;

                    case 40:
                        _context2.next = 46;
                        break;

                    case 42:
                        _context2.prev = 42;
                        _context2.t1 = _context2['catch'](31);
                        _didIteratorError4 = true;
                        _iteratorError4 = _context2.t1;

                    case 46:
                        _context2.prev = 46;
                        _context2.prev = 47;

                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }

                    case 49:
                        _context2.prev = 49;

                        if (!_didIteratorError4) {
                            _context2.next = 52;
                            break;
                        }

                        throw _iteratorError4;

                    case 52:
                        return _context2.finish(49);

                    case 53:
                        return _context2.finish(46);

                    case 54:
                        _context2.next = 106;
                        break;

                    case 56:
                        _iteratorNormalCompletion5 = true;
                        _didIteratorError5 = false;
                        _iteratorError5 = undefined;
                        _context2.prev = 59;
                        _iterator5 = yss[Symbol.iterator]();

                    case 61:
                        if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                            _context2.next = 92;
                            break;
                        }

                        _ys = _step5.value;
                        _iteratorNormalCompletion6 = true;
                        _didIteratorError6 = false;
                        _iteratorError6 = undefined;
                        _context2.prev = 66;
                        _iterator6 = _ys[Symbol.iterator]();

                    case 68:
                        if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                            _context2.next = 75;
                            break;
                        }

                        _y = _step6.value;
                        _context2.next = 72;
                        return _y;

                    case 72:
                        _iteratorNormalCompletion6 = true;
                        _context2.next = 68;
                        break;

                    case 75:
                        _context2.next = 81;
                        break;

                    case 77:
                        _context2.prev = 77;
                        _context2.t2 = _context2['catch'](66);
                        _didIteratorError6 = true;
                        _iteratorError6 = _context2.t2;

                    case 81:
                        _context2.prev = 81;
                        _context2.prev = 82;

                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }

                    case 84:
                        _context2.prev = 84;

                        if (!_didIteratorError6) {
                            _context2.next = 87;
                            break;
                        }

                        throw _iteratorError6;

                    case 87:
                        return _context2.finish(84);

                    case 88:
                        return _context2.finish(81);

                    case 89:
                        _iteratorNormalCompletion5 = true;
                        _context2.next = 61;
                        break;

                    case 92:
                        _context2.next = 98;
                        break;

                    case 94:
                        _context2.prev = 94;
                        _context2.t3 = _context2['catch'](59);
                        _didIteratorError5 = true;
                        _iteratorError5 = _context2.t3;

                    case 98:
                        _context2.prev = 98;
                        _context2.prev = 99;

                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }

                    case 101:
                        _context2.prev = 101;

                        if (!_didIteratorError5) {
                            _context2.next = 104;
                            break;
                        }

                        throw _iteratorError5;

                    case 104:
                        return _context2.finish(101);

                    case 105:
                        return _context2.finish(98);

                    case 106:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, concatIterator, this, [[3, 14, 18, 26], [19,, 21, 25], [31, 42, 46, 54], [47,, 49, 53], [59, 94, 98, 106], [66, 77, 81, 89], [82,, 84, 88], [99,, 101, 105]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - x
 * @param {Array|generator} ys - y
 * @param {function} comparer - z
 * @return {generator} - a
 */
function except(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    ys = toArray(ys);
    return regeneratorRuntime.mark(function exceptIterator() {
        var _this = this;

        var _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _loop, _iterator7, _step7;

        return regeneratorRuntime.wrap(function exceptIterator$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _iteratorNormalCompletion7 = true;
                        _didIteratorError7 = false;
                        _iteratorError7 = undefined;
                        _context4.prev = 3;
                        _loop = regeneratorRuntime.mark(function _loop() {
                            var x;
                            return regeneratorRuntime.wrap(function _loop$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            x = _step7.value;

                                            if (ys.some(function _comparer(y) {
                                                return comparer(x, y);
                                            })) {
                                                _context3.next = 4;
                                                break;
                                            }

                                            _context3.next = 4;
                                            return x;

                                        case 4:
                                        case 'end':
                                            return _context3.stop();
                                    }
                                }
                            }, _loop, _this);
                        });
                        _iterator7 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                            _context4.next = 11;
                            break;
                        }

                        return _context4.delegateYield(_loop(), 't0', 8);

                    case 8:
                        _iteratorNormalCompletion7 = true;
                        _context4.next = 6;
                        break;

                    case 11:
                        _context4.next = 17;
                        break;

                    case 13:
                        _context4.prev = 13;
                        _context4.t1 = _context4['catch'](3);
                        _didIteratorError7 = true;
                        _iteratorError7 = _context4.t1;

                    case 17:
                        _context4.prev = 17;
                        _context4.prev = 18;

                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }

                    case 20:
                        _context4.prev = 20;

                        if (!_didIteratorError7) {
                            _context4.next = 23;
                            break;
                        }

                        throw _iteratorError7;

                    case 23:
                        return _context4.finish(20);

                    case 24:
                        return _context4.finish(17);

                    case 25:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, exceptIterator, this, [[3, 13, 17, 25], [18,, 20, 24]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {Array|generator} ys - b
 * @param {function} xSelector - c
 * @param {function} ySelector - d
 * @param {function} projector - e
 * @param {function} listFactory - f
 * @param {function} comparer - g
 * @return {generator} - h
 */
function groupJoin(xs, ys, xSelector, ySelector, projector, listFactory) {
    var comparer = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _functionalHelpers.strictEquals;

    return regeneratorRuntime.mark(function groupJoinIterator() {
        var groupObj, groupedY, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, _x3, grp, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, yGroup;

        return regeneratorRuntime.wrap(function groupJoinIterator$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        groupObj = [{ keySelector: ySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
                        groupedY = nestLists(groupData(toArray(ys), groupObj), 0, null, listFactory);
                        _iteratorNormalCompletion8 = true;
                        _didIteratorError8 = false;
                        _iteratorError8 = undefined;
                        _context5.prev = 5;
                        _iterator8 = xs[Symbol.iterator]();

                    case 7:
                        if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
                            _context5.next = 42;
                            break;
                        }

                        _x3 = _step8.value;
                        grp = void 0;
                        _iteratorNormalCompletion9 = true;
                        _didIteratorError9 = false;
                        _iteratorError9 = undefined;
                        _context5.prev = 13;
                        _iterator9 = groupedY[Symbol.iterator]();

                    case 15:
                        if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
                            _context5.next = 23;
                            break;
                        }

                        yGroup = _step9.value;

                        if (!comparer(xSelector(_x3), yGroup.key)) {
                            _context5.next = 20;
                            break;
                        }

                        grp = yGroup;
                        return _context5.abrupt('break', 23);

                    case 20:
                        _iteratorNormalCompletion9 = true;
                        _context5.next = 15;
                        break;

                    case 23:
                        _context5.next = 29;
                        break;

                    case 25:
                        _context5.prev = 25;
                        _context5.t0 = _context5['catch'](13);
                        _didIteratorError9 = true;
                        _iteratorError9 = _context5.t0;

                    case 29:
                        _context5.prev = 29;
                        _context5.prev = 30;

                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }

                    case 32:
                        _context5.prev = 32;

                        if (!_didIteratorError9) {
                            _context5.next = 35;
                            break;
                        }

                        throw _iteratorError9;

                    case 35:
                        return _context5.finish(32);

                    case 36:
                        return _context5.finish(29);

                    case 37:
                        _context5.next = 39;
                        return projector(_x3, grp || listFactory([]));

                    case 39:
                        _iteratorNormalCompletion8 = true;
                        _context5.next = 7;
                        break;

                    case 42:
                        _context5.next = 48;
                        break;

                    case 44:
                        _context5.prev = 44;
                        _context5.t1 = _context5['catch'](5);
                        _didIteratorError8 = true;
                        _iteratorError8 = _context5.t1;

                    case 48:
                        _context5.prev = 48;
                        _context5.prev = 49;

                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }

                    case 51:
                        _context5.prev = 51;

                        if (!_didIteratorError8) {
                            _context5.next = 54;
                            break;
                        }

                        throw _iteratorError8;

                    case 54:
                        return _context5.finish(51);

                    case 55:
                        return _context5.finish(48);

                    case 56:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, groupJoinIterator, this, [[5, 44, 48, 56], [13, 25, 29, 37], [30,, 32, 36], [49,, 51, 55]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {Array|generator} ys - b
 * @param {function} comparer - c
 * @return {generator} - d
 */
function intersect(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    return regeneratorRuntime.mark(function intersectIterator() {
        var _this2 = this;

        var _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _loop2, _iterator10, _step10;

        return regeneratorRuntime.wrap(function intersectIterator$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        ys = toArray(ys);
                        _iteratorNormalCompletion10 = true;
                        _didIteratorError10 = false;
                        _iteratorError10 = undefined;
                        _context7.prev = 4;
                        _loop2 = regeneratorRuntime.mark(function _loop2() {
                            var x;
                            return regeneratorRuntime.wrap(function _loop2$(_context6) {
                                while (1) {
                                    switch (_context6.prev = _context6.next) {
                                        case 0:
                                            x = _step10.value;

                                            if (!(!(0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, x) && ys.some(function _checkEquivalency(it) {
                                                return comparer(x, it);
                                            }))) {
                                                _context6.next = 4;
                                                break;
                                            }

                                            _context6.next = 4;
                                            return x;

                                        case 4:
                                        case 'end':
                                            return _context6.stop();
                                    }
                                }
                            }, _loop2, _this2);
                        });
                        _iterator10 = xs[Symbol.iterator]();

                    case 7:
                        if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                            _context7.next = 12;
                            break;
                        }

                        return _context7.delegateYield(_loop2(), 't0', 9);

                    case 9:
                        _iteratorNormalCompletion10 = true;
                        _context7.next = 7;
                        break;

                    case 12:
                        _context7.next = 18;
                        break;

                    case 14:
                        _context7.prev = 14;
                        _context7.t1 = _context7['catch'](4);
                        _didIteratorError10 = true;
                        _iteratorError10 = _context7.t1;

                    case 18:
                        _context7.prev = 18;
                        _context7.prev = 19;

                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }

                    case 21:
                        _context7.prev = 21;

                        if (!_didIteratorError10) {
                            _context7.next = 24;
                            break;
                        }

                        throw _iteratorError10;

                    case 24:
                        return _context7.finish(21);

                    case 25:
                        return _context7.finish(18);

                    case 26:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, intersectIterator, this, [[4, 14, 18, 26], [19,, 21, 25]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {*} val - b
 * @return {generator} - c
 */
function intersperse(xs, val) {
    return regeneratorRuntime.mark(function intersperseIterator() {
        var it, next;
        return regeneratorRuntime.wrap(function intersperseIterator$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        it = xs[Symbol.iterator](), next = it.next();

                    case 1:
                        if (next.done) {
                            _context8.next = 10;
                            break;
                        }

                        _context8.next = 4;
                        return next.value;

                    case 4:
                        next = it.next();

                        if (next.done) {
                            _context8.next = 8;
                            break;
                        }

                        _context8.next = 8;
                        return val;

                    case 8:
                        _context8.next = 1;
                        break;

                    case 10:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, intersperseIterator, this);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {Array|generator} ys - b
 * @param {function} xSelector - c
 * @param {function} ySelector - d
 * @param {function} projector - e
 * @param {function} comparer - f
 * @return {generator} - g
 */
function join(xs, ys, xSelector, ySelector, projector) {
    var comparer = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _functionalHelpers.strictEquals;

    return regeneratorRuntime.mark(function joinIterator() {
        var _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, _x6, _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, y;

        return regeneratorRuntime.wrap(function joinIterator$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        ys = toArray(ys);
                        _iteratorNormalCompletion11 = true;
                        _didIteratorError11 = false;
                        _iteratorError11 = undefined;
                        _context9.prev = 4;
                        _iterator11 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
                            _context9.next = 38;
                            break;
                        }

                        _x6 = _step11.value;
                        _iteratorNormalCompletion12 = true;
                        _didIteratorError12 = false;
                        _iteratorError12 = undefined;
                        _context9.prev = 11;
                        _iterator12 = ys[Symbol.iterator]();

                    case 13:
                        if (_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done) {
                            _context9.next = 21;
                            break;
                        }

                        y = _step12.value;

                        if (!comparer(xSelector(_x6), ySelector(y))) {
                            _context9.next = 18;
                            break;
                        }

                        _context9.next = 18;
                        return projector(_x6, y);

                    case 18:
                        _iteratorNormalCompletion12 = true;
                        _context9.next = 13;
                        break;

                    case 21:
                        _context9.next = 27;
                        break;

                    case 23:
                        _context9.prev = 23;
                        _context9.t0 = _context9['catch'](11);
                        _didIteratorError12 = true;
                        _iteratorError12 = _context9.t0;

                    case 27:
                        _context9.prev = 27;
                        _context9.prev = 28;

                        if (!_iteratorNormalCompletion12 && _iterator12.return) {
                            _iterator12.return();
                        }

                    case 30:
                        _context9.prev = 30;

                        if (!_didIteratorError12) {
                            _context9.next = 33;
                            break;
                        }

                        throw _iteratorError12;

                    case 33:
                        return _context9.finish(30);

                    case 34:
                        return _context9.finish(27);

                    case 35:
                        _iteratorNormalCompletion11 = true;
                        _context9.next = 6;
                        break;

                    case 38:
                        _context9.next = 44;
                        break;

                    case 40:
                        _context9.prev = 40;
                        _context9.t1 = _context9['catch'](4);
                        _didIteratorError11 = true;
                        _iteratorError11 = _context9.t1;

                    case 44:
                        _context9.prev = 44;
                        _context9.prev = 45;

                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                            _iterator11.return();
                        }

                    case 47:
                        _context9.prev = 47;

                        if (!_didIteratorError11) {
                            _context9.next = 50;
                            break;
                        }

                        throw _iteratorError11;

                    case 50:
                        return _context9.finish(47);

                    case 51:
                        return _context9.finish(44);

                    case 52:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, joinIterator, this, [[4, 40, 44, 52], [11, 23, 27, 35], [28,, 30, 34], [45,, 47, 51]]);
    });
}

/**
 * @sig
 * @description
 * @param {Array|generator} xs - a
 * @param {Array|generator} ys - b
 * @param {function} comparer - c
 * @return {generator} - d
 */
function union(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    return regeneratorRuntime.mark(function unionIterator() {
        var isInCache, _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, _x8, _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, y;

        return regeneratorRuntime.wrap(function unionIterator$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        isInCache = (0, _helpers.cacher)(comparer);
                        _iteratorNormalCompletion13 = true;
                        _didIteratorError13 = false;
                        _iteratorError13 = undefined;
                        _context10.prev = 4;
                        _iterator13 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done) {
                            _context10.next = 14;
                            break;
                        }

                        _x8 = _step13.value;

                        if (isInCache(_x8)) {
                            _context10.next = 11;
                            break;
                        }

                        _context10.next = 11;
                        return _x8;

                    case 11:
                        _iteratorNormalCompletion13 = true;
                        _context10.next = 6;
                        break;

                    case 14:
                        _context10.next = 20;
                        break;

                    case 16:
                        _context10.prev = 16;
                        _context10.t0 = _context10['catch'](4);
                        _didIteratorError13 = true;
                        _iteratorError13 = _context10.t0;

                    case 20:
                        _context10.prev = 20;
                        _context10.prev = 21;

                        if (!_iteratorNormalCompletion13 && _iterator13.return) {
                            _iterator13.return();
                        }

                    case 23:
                        _context10.prev = 23;

                        if (!_didIteratorError13) {
                            _context10.next = 26;
                            break;
                        }

                        throw _iteratorError13;

                    case 26:
                        return _context10.finish(23);

                    case 27:
                        return _context10.finish(20);

                    case 28:
                        _iteratorNormalCompletion14 = true;
                        _didIteratorError14 = false;
                        _iteratorError14 = undefined;
                        _context10.prev = 31;
                        _iterator14 = toArray(ys)[Symbol.iterator]();

                    case 33:
                        if (_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done) {
                            _context10.next = 41;
                            break;
                        }

                        y = _step14.value;

                        if (isInCache(y)) {
                            _context10.next = 38;
                            break;
                        }

                        _context10.next = 38;
                        return y;

                    case 38:
                        _iteratorNormalCompletion14 = true;
                        _context10.next = 33;
                        break;

                    case 41:
                        _context10.next = 47;
                        break;

                    case 43:
                        _context10.prev = 43;
                        _context10.t1 = _context10['catch'](31);
                        _didIteratorError14 = true;
                        _iteratorError14 = _context10.t1;

                    case 47:
                        _context10.prev = 47;
                        _context10.prev = 48;

                        if (!_iteratorNormalCompletion14 && _iterator14.return) {
                            _iterator14.return();
                        }

                    case 50:
                        _context10.prev = 50;

                        if (!_didIteratorError14) {
                            _context10.next = 53;
                            break;
                        }

                        throw _iteratorError14;

                    case 53:
                        return _context10.finish(50);

                    case 54:
                        return _context10.finish(47);

                    case 55:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, unionIterator, this, [[4, 16, 20, 28], [21,, 23, 27], [31, 43, 47, 55], [48,, 50, 54]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {Array|generator} ys - b
 * @param {function} selector - c
 * @return {generator} - d
 */
function zip(xs, ys, selector) {
    return regeneratorRuntime.mark(function zipIterator() {
        var idx, yArr, _iteratorNormalCompletion15, _didIteratorError15, _iteratorError15, _iterator15, _step15, _x9;

        return regeneratorRuntime.wrap(function zipIterator$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        idx = 0;
                        yArr = toArray(ys);
                        _iteratorNormalCompletion15 = true;
                        _didIteratorError15 = false;
                        _iteratorError15 = undefined;
                        _context11.prev = 5;
                        _iterator15 = xs[Symbol.iterator]();

                    case 7:
                        if (_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done) {
                            _context11.next = 17;
                            break;
                        }

                        _x9 = _step15.value;

                        if (!(idx >= yArr.length || !yArr.length)) {
                            _context11.next = 11;
                            break;
                        }

                        return _context11.abrupt('return');

                    case 11:
                        _context11.next = 13;
                        return selector(_x9, yArr[idx]);

                    case 13:
                        ++idx;

                    case 14:
                        _iteratorNormalCompletion15 = true;
                        _context11.next = 7;
                        break;

                    case 17:
                        _context11.next = 23;
                        break;

                    case 19:
                        _context11.prev = 19;
                        _context11.t0 = _context11['catch'](5);
                        _didIteratorError15 = true;
                        _iteratorError15 = _context11.t0;

                    case 23:
                        _context11.prev = 23;
                        _context11.prev = 24;

                        if (!_iteratorNormalCompletion15 && _iterator15.return) {
                            _iterator15.return();
                        }

                    case 26:
                        _context11.prev = 26;

                        if (!_didIteratorError15) {
                            _context11.next = 29;
                            break;
                        }

                        throw _iteratorError15;

                    case 29:
                        return _context11.finish(26);

                    case 30:
                        return _context11.finish(23);

                    case 31:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, zipIterator, this, [[5, 19, 23, 31], [24,, 26, 30]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {boolean} - c
 */
function all(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate)) && toArray(xs).every(predicate);
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {boolean} - c
 */
function any(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate)) ? toArray(xs).some(predicate) : 0 < toArray(xs).length;
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {*} val - b
 * @param {function} comparer - c
 * @return {*} - d
 */
function contains(xs, val, comparer) {
    //TODO: see if there is any real performance increase by just using .includes when a comparer hasn't been passed
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, (0, _functionalHelpers.type)(comparer)) ? toArray(xs).includes(val) : toArray(xs).some(function (x) {
        return comparer(x, val);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {*} val - b
 * @param {function} comparer - c
 * @return {boolean} - d
 */
function binarySearch(xs, val, comparer) {
    return binarySearchRec(xs, 0, xs.length - 1, val, comparer);
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
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
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {Number} - c
 */
function count(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, (0, _functionalHelpers.type)(predicate)) ? toArray(xs).length : toArray(xs).filter(predicate).length;
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {*} - c
 */
function first(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate)) ? toArray(xs).find(predicate) : toArray(xs)[0];
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} fn - b
 * @param {*} initial - c
 * @return {*} - d
 */
function foldLeft(xs, fn) {
    var initial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    return toArray(xs).reduce(fn, initial);
}

/**
 * @sig
 * @description d
 * @param {Array} arr - a
 * @param {function} op - b
 * @param {*} acc - c
 * @return {*} - d
 */
function foldRight(arr, op, acc) {
    var list = toArray(arr),
        len = list.length,
        res = acc || list[--len];
    while (0 < len) {
        res = op(list[--len], res, len, list);
    }
    return res;
}

/**
 * @sig
 * @description s
 * @param {Array|generator} xs - a
 * @param {function} fn - b
 * @param {*} initial - c
 * @return {*} - d
 */
function reduceRight(xs, fn, initial) {
    return null == initial ? toArray(xs).reduceRight(fn) : toArray(xs).reduceRight(fn, initial);
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {*} - c
 */
function last(xs, predicate) {
    if ((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate))) return toArray(xs).filter(predicate).slice(-1)[0];
    return toArray(xs).slice(-1)[0];
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} comparer - b
 * @return {generator} - c
 */
function distinct(xs) {
    var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.strictEquals;

    var cached = (0, _helpers.cacher)(comparer);

    return regeneratorRuntime.mark(function distinctIterator() {
        var _iteratorNormalCompletion16, _didIteratorError16, _iteratorError16, _iterator16, _step16, _x12;

        return regeneratorRuntime.wrap(function distinctIterator$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _iteratorNormalCompletion16 = true;
                        _didIteratorError16 = false;
                        _iteratorError16 = undefined;
                        _context12.prev = 3;
                        _iterator16 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done) {
                            _context12.next = 13;
                            break;
                        }

                        _x12 = _step16.value;

                        if (cached(_x12)) {
                            _context12.next = 10;
                            break;
                        }

                        _context12.next = 10;
                        return _x12;

                    case 10:
                        _iteratorNormalCompletion16 = true;
                        _context12.next = 5;
                        break;

                    case 13:
                        _context12.next = 19;
                        break;

                    case 15:
                        _context12.prev = 15;
                        _context12.t0 = _context12['catch'](3);
                        _didIteratorError16 = true;
                        _iteratorError16 = _context12.t0;

                    case 19:
                        _context12.prev = 19;
                        _context12.prev = 20;

                        if (!_iteratorNormalCompletion16 && _iterator16.return) {
                            _iterator16.return();
                        }

                    case 22:
                        _context12.prev = 22;

                        if (!_didIteratorError16) {
                            _context12.next = 25;
                            break;
                        }

                        throw _iteratorError16;

                    case 25:
                        return _context12.finish(22);

                    case 26:
                        return _context12.finish(19);

                    case 27:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, distinctIterator, this, [[3, 15, 19, 27], [20,, 22, 26]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {string} dataType - b
 * @return {generator} - c
 */
function ofType(xs, dataType) {
    return regeneratorRuntime.mark(function ofTypeIterator() {
        var _checkTypeKeys, _checkItemKeys, _iteratorNormalCompletion17, _didIteratorError17, _iteratorError17, _iterator17, _step17, _x13, _iteratorNormalCompletion18, _didIteratorError18, _iteratorError18, _iterator18, _step18, _x14, _iteratorNormalCompletion19, _didIteratorError19, _iteratorError19, _iterator19, _step19, _x15, _iteratorNormalCompletion20, _didIteratorError20, _iteratorError20, _iterator20, _step20, objItem, _iteratorNormalCompletion21, _didIteratorError21, _iteratorError21, _iterator21, _step21, _x16;

        return regeneratorRuntime.wrap(function ofTypeIterator$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        _checkItemKeys = function _checkItemKeys(key) {
                            return key in dataType;
                        };

                        _checkTypeKeys = function _checkTypeKeys(key) {
                            return key in objItem;
                        };

                        if (!(dataType in _helpers.typeName)) {
                            _context13.next = 32;
                            break;
                        }

                        _iteratorNormalCompletion17 = true;
                        _didIteratorError17 = false;
                        _iteratorError17 = undefined;
                        _context13.prev = 6;
                        _iterator17 = xs[Symbol.iterator]();

                    case 8:
                        if (_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done) {
                            _context13.next = 16;
                            break;
                        }

                        _x13 = _step17.value;

                        if (!(_helpers.typeName[dataType] === (typeof _x13 === 'undefined' ? 'undefined' : _typeof(_x13)))) {
                            _context13.next = 13;
                            break;
                        }

                        _context13.next = 13;
                        return _x13;

                    case 13:
                        _iteratorNormalCompletion17 = true;
                        _context13.next = 8;
                        break;

                    case 16:
                        _context13.next = 22;
                        break;

                    case 18:
                        _context13.prev = 18;
                        _context13.t0 = _context13['catch'](6);
                        _didIteratorError17 = true;
                        _iteratorError17 = _context13.t0;

                    case 22:
                        _context13.prev = 22;
                        _context13.prev = 23;

                        if (!_iteratorNormalCompletion17 && _iterator17.return) {
                            _iterator17.return();
                        }

                    case 25:
                        _context13.prev = 25;

                        if (!_didIteratorError17) {
                            _context13.next = 28;
                            break;
                        }

                        throw _iteratorError17;

                    case 28:
                        return _context13.finish(25);

                    case 29:
                        return _context13.finish(22);

                    case 30:
                        _context13.next = 153;
                        break;

                    case 32:
                        if (!(0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(dataType))) {
                            _context13.next = 62;
                            break;
                        }

                        _iteratorNormalCompletion18 = true;
                        _didIteratorError18 = false;
                        _iteratorError18 = undefined;
                        _context13.prev = 36;
                        _iterator18 = xs[Symbol.iterator]();

                    case 38:
                        if (_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done) {
                            _context13.next = 46;
                            break;
                        }

                        _x14 = _step18.value;

                        if (!(_x14 === dataType)) {
                            _context13.next = 43;
                            break;
                        }

                        _context13.next = 43;
                        return _x14;

                    case 43:
                        _iteratorNormalCompletion18 = true;
                        _context13.next = 38;
                        break;

                    case 46:
                        _context13.next = 52;
                        break;

                    case 48:
                        _context13.prev = 48;
                        _context13.t1 = _context13['catch'](36);
                        _didIteratorError18 = true;
                        _iteratorError18 = _context13.t1;

                    case 52:
                        _context13.prev = 52;
                        _context13.prev = 53;

                        if (!_iteratorNormalCompletion18 && _iterator18.return) {
                            _iterator18.return();
                        }

                    case 55:
                        _context13.prev = 55;

                        if (!_didIteratorError18) {
                            _context13.next = 58;
                            break;
                        }

                        throw _iteratorError18;

                    case 58:
                        return _context13.finish(55);

                    case 59:
                        return _context13.finish(52);

                    case 60:
                        _context13.next = 153;
                        break;

                    case 62:
                        if (!(null === dataType)) {
                            _context13.next = 92;
                            break;
                        }

                        _iteratorNormalCompletion19 = true;
                        _didIteratorError19 = false;
                        _iteratorError19 = undefined;
                        _context13.prev = 66;
                        _iterator19 = xs[Symbol.iterator]();

                    case 68:
                        if (_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done) {
                            _context13.next = 76;
                            break;
                        }

                        _x15 = _step19.value;

                        if (!(dataType === _x15)) {
                            _context13.next = 73;
                            break;
                        }

                        _context13.next = 73;
                        return _x15;

                    case 73:
                        _iteratorNormalCompletion19 = true;
                        _context13.next = 68;
                        break;

                    case 76:
                        _context13.next = 82;
                        break;

                    case 78:
                        _context13.prev = 78;
                        _context13.t2 = _context13['catch'](66);
                        _didIteratorError19 = true;
                        _iteratorError19 = _context13.t2;

                    case 82:
                        _context13.prev = 82;
                        _context13.prev = 83;

                        if (!_iteratorNormalCompletion19 && _iterator19.return) {
                            _iterator19.return();
                        }

                    case 85:
                        _context13.prev = 85;

                        if (!_didIteratorError19) {
                            _context13.next = 88;
                            break;
                        }

                        throw _iteratorError19;

                    case 88:
                        return _context13.finish(85);

                    case 89:
                        return _context13.finish(82);

                    case 90:
                        _context13.next = 153;
                        break;

                    case 92:
                        if (!((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Object, (0, _functionalHelpers.type)(dataType)) && !(0, _functionalHelpers.isArray)(dataType))) {
                            _context13.next = 127;
                            break;
                        }

                        _iteratorNormalCompletion20 = true;
                        _didIteratorError20 = false;
                        _iteratorError20 = undefined;
                        _context13.prev = 96;
                        _iterator20 = xs[Symbol.iterator]();

                    case 98:
                        if (_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done) {
                            _context13.next = 111;
                            break;
                        }

                        objItem = _step20.value;

                        if (!dataType.isPrototypeOf(objItem)) {
                            _context13.next = 105;
                            break;
                        }

                        _context13.next = 103;
                        return objItem;

                    case 103:
                        _context13.next = 108;
                        break;

                    case 105:
                        if (!((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Object, (0, _functionalHelpers.type)(objItem)) && null !== objItem && Object.keys(dataType).every(_checkTypeKeys) && Object.keys(objItem).every(_checkItemKeys))) {
                            _context13.next = 108;
                            break;
                        }

                        _context13.next = 108;
                        return objItem;

                    case 108:
                        _iteratorNormalCompletion20 = true;
                        _context13.next = 98;
                        break;

                    case 111:
                        _context13.next = 117;
                        break;

                    case 113:
                        _context13.prev = 113;
                        _context13.t3 = _context13['catch'](96);
                        _didIteratorError20 = true;
                        _iteratorError20 = _context13.t3;

                    case 117:
                        _context13.prev = 117;
                        _context13.prev = 118;

                        if (!_iteratorNormalCompletion20 && _iterator20.return) {
                            _iterator20.return();
                        }

                    case 120:
                        _context13.prev = 120;

                        if (!_didIteratorError20) {
                            _context13.next = 123;
                            break;
                        }

                        throw _iteratorError20;

                    case 123:
                        return _context13.finish(120);

                    case 124:
                        return _context13.finish(117);

                    case 125:
                        _context13.next = 153;
                        break;

                    case 127:
                        _iteratorNormalCompletion21 = true;
                        _didIteratorError21 = false;
                        _iteratorError21 = undefined;
                        _context13.prev = 130;
                        _iterator21 = xs[Symbol.iterator]();

                    case 132:
                        if (_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done) {
                            _context13.next = 139;
                            break;
                        }

                        _x16 = _step21.value;
                        _context13.next = 136;
                        return _x16;

                    case 136:
                        _iteratorNormalCompletion21 = true;
                        _context13.next = 132;
                        break;

                    case 139:
                        _context13.next = 145;
                        break;

                    case 141:
                        _context13.prev = 141;
                        _context13.t4 = _context13['catch'](130);
                        _didIteratorError21 = true;
                        _iteratorError21 = _context13.t4;

                    case 145:
                        _context13.prev = 145;
                        _context13.prev = 146;

                        if (!_iteratorNormalCompletion21 && _iterator21.return) {
                            _iterator21.return();
                        }

                    case 148:
                        _context13.prev = 148;

                        if (!_didIteratorError21) {
                            _context13.next = 151;
                            break;
                        }

                        throw _iteratorError21;

                    case 151:
                        return _context13.finish(148);

                    case 152:
                        return _context13.finish(145);

                    case 153:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, ofTypeIterator, this, [[6, 18, 22, 30], [23,, 25, 29], [36, 48, 52, 60], [53,, 55, 59], [66, 78, 82, 90], [83,, 85, 89], [96, 113, 117, 125], [118,, 120, 124], [130, 141, 145, 153], [146,, 148, 152]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function filter(xs, predicate) {
    return regeneratorRuntime.mark(function filterIterator() {
        var _iteratorNormalCompletion22, _didIteratorError22, _iteratorError22, _iterator22, _step22, _x17;

        return regeneratorRuntime.wrap(function filterIterator$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        _iteratorNormalCompletion22 = true;
                        _didIteratorError22 = false;
                        _iteratorError22 = undefined;
                        _context14.prev = 3;
                        _iterator22 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done) {
                            _context14.next = 13;
                            break;
                        }

                        _x17 = _step22.value;

                        if (!(false !== predicate(_x17))) {
                            _context14.next = 10;
                            break;
                        }

                        _context14.next = 10;
                        return _x17;

                    case 10:
                        _iteratorNormalCompletion22 = true;
                        _context14.next = 5;
                        break;

                    case 13:
                        _context14.next = 19;
                        break;

                    case 15:
                        _context14.prev = 15;
                        _context14.t0 = _context14['catch'](3);
                        _didIteratorError22 = true;
                        _iteratorError22 = _context14.t0;

                    case 19:
                        _context14.prev = 19;
                        _context14.prev = 20;

                        if (!_iteratorNormalCompletion22 && _iterator22.return) {
                            _iterator22.return();
                        }

                    case 22:
                        _context14.prev = 22;

                        if (!_didIteratorError22) {
                            _context14.next = 25;
                            break;
                        }

                        throw _iteratorError22;

                    case 25:
                        return _context14.finish(22);

                    case 26:
                        return _context14.finish(19);

                    case 27:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, filterIterator, this, [[3, 15, 19, 27], [20,, 22, 26]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @return {generator} - b
 */
function deepFlatten(xs) {
    return regeneratorRuntime.mark(function iterator() {
        var unyieldedData, res, _iteratorNormalCompletion23, _didIteratorError23, _iteratorError23, _iterator23, _step23, _x18;

        return regeneratorRuntime.wrap(function iterator$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        unyieldedData = [];
                        _iteratorNormalCompletion23 = true;
                        _didIteratorError23 = false;
                        _iteratorError23 = undefined;
                        _context15.prev = 4;
                        _iterator23 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done) {
                            _context15.next = 20;
                            break;
                        }

                        _x18 = _step23.value;

                        res = flatteningFunc(_x18);

                        if ((0, _functionalHelpers.isArray)(res)) unyieldedData = unyieldedData.concat(Array.prototype.concat.apply([], res));

                        if (!unyieldedData.length) {
                            _context15.next = 15;
                            break;
                        }

                        _context15.next = 13;
                        return unyieldedData.shift();

                    case 13:
                        _context15.next = 17;
                        break;

                    case 15:
                        _context15.next = 17;
                        return res;

                    case 17:
                        _iteratorNormalCompletion23 = true;
                        _context15.next = 6;
                        break;

                    case 20:
                        _context15.next = 26;
                        break;

                    case 22:
                        _context15.prev = 22;
                        _context15.t0 = _context15['catch'](4);
                        _didIteratorError23 = true;
                        _iteratorError23 = _context15.t0;

                    case 26:
                        _context15.prev = 26;
                        _context15.prev = 27;

                        if (!_iteratorNormalCompletion23 && _iterator23.return) {
                            _iterator23.return();
                        }

                    case 29:
                        _context15.prev = 29;

                        if (!_didIteratorError23) {
                            _context15.next = 32;
                            break;
                        }

                        throw _iteratorError23;

                    case 32:
                        return _context15.finish(29);

                    case 33:
                        return _context15.finish(26);

                    case 34:
                        if (!unyieldedData.length) {
                            _context15.next = 39;
                            break;
                        }

                        _context15.next = 37;
                        return unyieldedData.shift();

                    case 37:
                        _context15.next = 34;
                        break;

                    case 39:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, iterator, this, [[4, 22, 26, 34], [27,, 29, 33]]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @return {*} b
 */
function flatteningFunc(data) {
    return (0, _combinators.ifElse)(_functionalHelpers.isArray, mapData, (0, _combinators.when)(_functionalHelpers.isObject, (0, _combinators.when)(objectContainsOnlyArrays, getObjectKeysAsArray)), data);
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @return {*} - b
 */
function mapData(data) {
    return Array.prototype.concat.apply([], data.map(function flattenArray(item) {
        return flatteningFunc(item);
    }));
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @return {Array} - b
 */
function getObjectKeysAsArray(data) {
    return Object.keys(data).map(function _flattenKeys(key) {
        return flatteningFunc(data[key]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @return {boolean} - b
 */
function objectContainsOnlyArrays(data) {
    return Object.keys(data).every(function _isMadeOfArrays(key) {
        return (0, _functionalHelpers.isArray)(data[key]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} xs - a
 * @param {function} fn - b
 * @return {generator} - c
 */
function chain(xs, fn) {
    return regeneratorRuntime.mark(function flatMapIterator() {
        var res, _iteratorNormalCompletion24, _didIteratorError24, _iteratorError24, _iterator24, _step24, _x19;

        return regeneratorRuntime.wrap(function flatMapIterator$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                        _iteratorNormalCompletion24 = true;
                        _didIteratorError24 = false;
                        _iteratorError24 = undefined;
                        _context16.prev = 3;
                        _iterator24 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done) {
                            _context16.next = 13;
                            break;
                        }

                        _x19 = _step24.value;

                        res = fn(_x19);
                        _context16.next = 10;
                        return Object.getPrototypeOf(xs).isPrototypeOf(res) ? res.value : res;

                    case 10:
                        _iteratorNormalCompletion24 = true;
                        _context16.next = 5;
                        break;

                    case 13:
                        _context16.next = 19;
                        break;

                    case 15:
                        _context16.prev = 15;
                        _context16.t0 = _context16['catch'](3);
                        _didIteratorError24 = true;
                        _iteratorError24 = _context16.t0;

                    case 19:
                        _context16.prev = 19;
                        _context16.prev = 20;

                        if (!_iteratorNormalCompletion24 && _iterator24.return) {
                            _iterator24.return();
                        }

                    case 22:
                        _context16.prev = 22;

                        if (!_didIteratorError24) {
                            _context16.next = 25;
                            break;
                        }

                        throw _iteratorError24;

                    case 25:
                        return _context16.finish(22);

                    case 26:
                        return _context16.finish(19);

                    case 27:
                    case 'end':
                        return _context16.stop();
                }
            }
        }, flatMapIterator, this, [[3, 15, 19, 27], [20,, 22, 26]]);
    });
}

/*
 function flatMap1(source, fn) {
    return function *flatMap1Iterator() {
        var results = [];
        for (let item of source) {
            var res = fn(item);
            if (res.length) {
                results = results.concat(res);
                yield results.shift();
            }
            else if (undefined !== res) {
                if (isArray(res)) {
                    yield res.shift();
                    results = results.concat(res);
                }
            }
            else yield res;
        }

        while (results.length) yield results.shift();
    };
 }
 */

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @return {generator} - b
 */
function flatten(xs) {
    return regeneratorRuntime.mark(function flattenIterator() {
        var unyieldedData, _iteratorNormalCompletion25, _didIteratorError25, _iteratorError25, _iterator25, _step25, _x20;

        return regeneratorRuntime.wrap(function flattenIterator$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                        unyieldedData = [];
                        _iteratorNormalCompletion25 = true;
                        _didIteratorError25 = false;
                        _iteratorError25 = undefined;
                        _context17.prev = 4;
                        _iterator25 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done) {
                            _context17.next = 19;
                            break;
                        }

                        _x20 = _step25.value;

                        if ((0, _functionalHelpers.isArray)(_x20)) unyieldedData = unyieldedData.concat(_x20);

                        if (!unyieldedData.length) {
                            _context17.next = 14;
                            break;
                        }

                        _context17.next = 12;
                        return unyieldedData.shift();

                    case 12:
                        _context17.next = 16;
                        break;

                    case 14:
                        _context17.next = 16;
                        return _x20;

                    case 16:
                        _iteratorNormalCompletion25 = true;
                        _context17.next = 6;
                        break;

                    case 19:
                        _context17.next = 25;
                        break;

                    case 21:
                        _context17.prev = 21;
                        _context17.t0 = _context17['catch'](4);
                        _didIteratorError25 = true;
                        _iteratorError25 = _context17.t0;

                    case 25:
                        _context17.prev = 25;
                        _context17.prev = 26;

                        if (!_iteratorNormalCompletion25 && _iterator25.return) {
                            _iterator25.return();
                        }

                    case 28:
                        _context17.prev = 28;

                        if (!_didIteratorError25) {
                            _context17.next = 31;
                            break;
                        }

                        throw _iteratorError25;

                    case 31:
                        return _context17.finish(28);

                    case 32:
                        return _context17.finish(25);

                    case 33:
                        if (!unyieldedData.length) {
                            _context17.next = 38;
                            break;
                        }

                        _context17.next = 36;
                        return unyieldedData.shift();

                    case 36:
                        _context17.next = 33;
                        break;

                    case 38:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, flattenIterator, this, [[4, 21, 25, 33], [26,, 28, 32]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {object} groupObject - b
 * @param {function} queryableConstructor - c
 * @return {generator} - d
 */
function groupBy(xs, groupObject, queryableConstructor) {
    return regeneratorRuntime.mark(function groupByIterator() {
        var groupedData, _iteratorNormalCompletion26, _didIteratorError26, _iteratorError26, _iterator26, _step26, _x21;

        return regeneratorRuntime.wrap(function groupByIterator$(_context18) {
            while (1) {
                switch (_context18.prev = _context18.next) {
                    case 0:
                        //gather all data from the iterable before grouping
                        groupedData = nestLists(groupData(toArray(xs), groupObject), 0, null, queryableConstructor);
                        _iteratorNormalCompletion26 = true;
                        _didIteratorError26 = false;
                        _iteratorError26 = undefined;
                        _context18.prev = 4;
                        _iterator26 = groupedData[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done) {
                            _context18.next = 13;
                            break;
                        }

                        _x21 = _step26.value;
                        _context18.next = 10;
                        return _x21;

                    case 10:
                        _iteratorNormalCompletion26 = true;
                        _context18.next = 6;
                        break;

                    case 13:
                        _context18.next = 19;
                        break;

                    case 15:
                        _context18.prev = 15;
                        _context18.t0 = _context18['catch'](4);
                        _didIteratorError26 = true;
                        _iteratorError26 = _context18.t0;

                    case 19:
                        _context18.prev = 19;
                        _context18.prev = 20;

                        if (!_iteratorNormalCompletion26 && _iterator26.return) {
                            _iterator26.return();
                        }

                    case 22:
                        _context18.prev = 22;

                        if (!_didIteratorError26) {
                            _context18.next = 25;
                            break;
                        }

                        throw _iteratorError26;

                    case 25:
                        return _context18.finish(22);

                    case 26:
                        return _context18.finish(19);

                    case 27:
                    case 'end':
                        return _context18.stop();
                }
            }
        }, groupByIterator, this, [[4, 15, 19, 27], [20,, 22, 26]]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @param {number} depth - b
 * @param {string} key - c
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
 * @sig
 * @description d
 * @param {*} xs - a
 * @param {object} groupObject - b
 * @return {Array} - c
 */
function groupData(xs, groupObject) {
    var sortedData = (0, _sortHelpers.sortData)(xs, groupObject),
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
 * @sig
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
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} fn - b
 * @return {generator} - c
 */
function map(xs, fn) {
    return regeneratorRuntime.mark(function mapIterator() {
        var _iteratorNormalCompletion27, _didIteratorError27, _iteratorError27, _iterator27, _step27, _x22, res;

        return regeneratorRuntime.wrap(function mapIterator$(_context19) {
            while (1) {
                switch (_context19.prev = _context19.next) {
                    case 0:
                        _iteratorNormalCompletion27 = true;
                        _didIteratorError27 = false;
                        _iteratorError27 = undefined;
                        _context19.prev = 3;
                        _iterator27 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done) {
                            _context19.next = 14;
                            break;
                        }

                        _x22 = _step27.value;
                        res = fn(_x22);

                        if ((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, (0, _functionalHelpers.type)(res))) {
                            _context19.next = 11;
                            break;
                        }

                        _context19.next = 11;
                        return res;

                    case 11:
                        _iteratorNormalCompletion27 = true;
                        _context19.next = 5;
                        break;

                    case 14:
                        _context19.next = 20;
                        break;

                    case 16:
                        _context19.prev = 16;
                        _context19.t0 = _context19['catch'](3);
                        _didIteratorError27 = true;
                        _iteratorError27 = _context19.t0;

                    case 20:
                        _context19.prev = 20;
                        _context19.prev = 21;

                        if (!_iteratorNormalCompletion27 && _iterator27.return) {
                            _iterator27.return();
                        }

                    case 23:
                        _context19.prev = 23;

                        if (!_didIteratorError27) {
                            _context19.next = 26;
                            break;
                        }

                        throw _iteratorError27;

                    case 26:
                        return _context19.finish(23);

                    case 27:
                        return _context19.finish(20);

                    case 28:
                    case 'end':
                        return _context19.stop();
                }
            }
        }, mapIterator, this, [[3, 16, 20, 28], [21,, 23, 27]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {Array} orderObject - b
 * @return {generator} - d
 */
function sortBy(xs, orderObject) {
    return regeneratorRuntime.mark(function orderByIterator() {
        var x_s, _iteratorNormalCompletion28, _didIteratorError28, _iteratorError28, _iterator28, _step28, _x23;

        return regeneratorRuntime.wrap(function orderByIterator$(_context20) {
            while (1) {
                switch (_context20.prev = _context20.next) {
                    case 0:
                        //gather all data from the xs before sorting
                        x_s = (0, _sortHelpers.sortData)(toArray(xs), orderObject);
                        _iteratorNormalCompletion28 = true;
                        _didIteratorError28 = false;
                        _iteratorError28 = undefined;
                        _context20.prev = 4;
                        _iterator28 = x_s[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done) {
                            _context20.next = 13;
                            break;
                        }

                        _x23 = _step28.value;
                        _context20.next = 10;
                        return _x23;

                    case 10:
                        _iteratorNormalCompletion28 = true;
                        _context20.next = 6;
                        break;

                    case 13:
                        _context20.next = 19;
                        break;

                    case 15:
                        _context20.prev = 15;
                        _context20.t0 = _context20['catch'](4);
                        _didIteratorError28 = true;
                        _iteratorError28 = _context20.t0;

                    case 19:
                        _context20.prev = 19;
                        _context20.prev = 20;

                        if (!_iteratorNormalCompletion28 && _iterator28.return) {
                            _iterator28.return();
                        }

                    case 22:
                        _context20.prev = 22;

                        if (!_didIteratorError28) {
                            _context20.next = 25;
                            break;
                        }

                        throw _iteratorError28;

                    case 25:
                        return _context20.finish(22);

                    case 26:
                        return _context20.finish(19);

                    case 27:
                    case 'end':
                        return _context20.stop();
                }
            }
        }, orderByIterator, this, [[4, 15, 19, 27], [20,, 22, 26]]);
    });
}

/**
 * @sig
 * @description d
 * @param {list_core} xs - a
 * @param {list_core} ys - b
 * @param {function} comparer - c
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
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function takeWhile(xs, predicate) {
    return regeneratorRuntime.mark(function takeWhileIterator() {
        var _iteratorNormalCompletion29, _didIteratorError29, _iteratorError29, _iterator29, _step29, _x25;

        return regeneratorRuntime.wrap(function takeWhileIterator$(_context21) {
            while (1) {
                switch (_context21.prev = _context21.next) {
                    case 0:
                        _iteratorNormalCompletion29 = true;
                        _didIteratorError29 = false;
                        _iteratorError29 = undefined;
                        _context21.prev = 3;
                        _iterator29 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done) {
                            _context21.next = 16;
                            break;
                        }

                        _x25 = _step29.value;

                        if (!predicate(_x25)) {
                            _context21.next = 12;
                            break;
                        }

                        _context21.next = 10;
                        return _x25;

                    case 10:
                        _context21.next = 13;
                        break;

                    case 12:
                        return _context21.abrupt('break', 16);

                    case 13:
                        _iteratorNormalCompletion29 = true;
                        _context21.next = 5;
                        break;

                    case 16:
                        _context21.next = 22;
                        break;

                    case 18:
                        _context21.prev = 18;
                        _context21.t0 = _context21['catch'](3);
                        _didIteratorError29 = true;
                        _iteratorError29 = _context21.t0;

                    case 22:
                        _context21.prev = 22;
                        _context21.prev = 23;

                        if (!_iteratorNormalCompletion29 && _iterator29.return) {
                            _iterator29.return();
                        }

                    case 25:
                        _context21.prev = 25;

                        if (!_didIteratorError29) {
                            _context21.next = 28;
                            break;
                        }

                        throw _iteratorError29;

                    case 28:
                        return _context21.finish(25);

                    case 29:
                        return _context21.finish(22);

                    case 30:
                    case 'end':
                        return _context21.stop();
                }
            }
        }, takeWhileIterator, this, [[3, 18, 22, 30], [23,, 25, 29]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function skipWhile(xs, predicate) {
    return regeneratorRuntime.mark(function skipWhileIterator() {
        var hasFailed, _iteratorNormalCompletion30, _didIteratorError30, _iteratorError30, _iterator30, _step30, _x26;

        return regeneratorRuntime.wrap(function skipWhileIterator$(_context22) {
            while (1) {
                switch (_context22.prev = _context22.next) {
                    case 0:
                        hasFailed = false;
                        _iteratorNormalCompletion30 = true;
                        _didIteratorError30 = false;
                        _iteratorError30 = undefined;
                        _context22.prev = 4;
                        _iterator30 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done) {
                            _context22.next = 20;
                            break;
                        }

                        _x26 = _step30.value;

                        if (hasFailed) {
                            _context22.next = 15;
                            break;
                        }

                        if (predicate(_x26)) {
                            _context22.next = 13;
                            break;
                        }

                        hasFailed = true;
                        _context22.next = 13;
                        return _x26;

                    case 13:
                        _context22.next = 17;
                        break;

                    case 15:
                        _context22.next = 17;
                        return _x26;

                    case 17:
                        _iteratorNormalCompletion30 = true;
                        _context22.next = 6;
                        break;

                    case 20:
                        _context22.next = 26;
                        break;

                    case 22:
                        _context22.prev = 22;
                        _context22.t0 = _context22['catch'](4);
                        _didIteratorError30 = true;
                        _iteratorError30 = _context22.t0;

                    case 26:
                        _context22.prev = 26;
                        _context22.prev = 27;

                        if (!_iteratorNormalCompletion30 && _iterator30.return) {
                            _iterator30.return();
                        }

                    case 29:
                        _context22.prev = 29;

                        if (!_didIteratorError30) {
                            _context22.next = 32;
                            break;
                        }

                        throw _iteratorError30;

                    case 32:
                        return _context22.finish(29);

                    case 33:
                        return _context22.finish(26);

                    case 34:
                    case 'end':
                        return _context22.stop();
                }
            }
        }, skipWhileIterator, this, [[4, 22, 26, 34], [27,, 29, 33]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @return {generator} - b
 */
function reverse(xs) {
    return regeneratorRuntime.mark(function reverseIterator() {
        var _iteratorNormalCompletion31, _didIteratorError31, _iteratorError31, _iterator31, _step31, _x27;

        return regeneratorRuntime.wrap(function reverseIterator$(_context23) {
            while (1) {
                switch (_context23.prev = _context23.next) {
                    case 0:
                        _iteratorNormalCompletion31 = true;
                        _didIteratorError31 = false;
                        _iteratorError31 = undefined;
                        _context23.prev = 3;
                        _iterator31 = toArray(xs).reverse()[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done) {
                            _context23.next = 12;
                            break;
                        }

                        _x27 = _step31.value;
                        _context23.next = 9;
                        return _x27;

                    case 9:
                        _iteratorNormalCompletion31 = true;
                        _context23.next = 5;
                        break;

                    case 12:
                        _context23.next = 18;
                        break;

                    case 14:
                        _context23.prev = 14;
                        _context23.t0 = _context23['catch'](3);
                        _didIteratorError31 = true;
                        _iteratorError31 = _context23.t0;

                    case 18:
                        _context23.prev = 18;
                        _context23.prev = 19;

                        if (!_iteratorNormalCompletion31 && _iterator31.return) {
                            _iterator31.return();
                        }

                    case 21:
                        _context23.prev = 21;

                        if (!_didIteratorError31) {
                            _context23.next = 24;
                            break;
                        }

                        throw _iteratorError31;

                    case 24:
                        return _context23.finish(21);

                    case 25:
                        return _context23.finish(18);

                    case 26:
                    case 'end':
                        return _context23.stop();
                }
            }
        }, reverseIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @param {number} count - b
 * @return {generator} - c
 */
function repeat(item, count) {
    return regeneratorRuntime.mark(function repeatIterator() {
        var i;
        return regeneratorRuntime.wrap(function repeatIterator$(_context24) {
            while (1) {
                switch (_context24.prev = _context24.next) {
                    case 0:
                        i = 0;

                    case 1:
                        if (!(i < count)) {
                            _context24.next = 7;
                            break;
                        }

                        _context24.next = 4;
                        return item;

                    case 4:
                        ++i;
                        _context24.next = 1;
                        break;

                    case 7:
                    case 'end':
                        return _context24.stop();
                }
            }
        }, repeatIterator, this);
    });
}

/**
 * @sig
 * @description d
 * @param {number} idx - a
 * @param {number} start - b
 * @param {number} end - c
 * @param {list_core} xs - d
 * @returns {generator} - e
 */
function copyWithin(idx, start, end, xs) {
    return regeneratorRuntime.mark(function copyWithinIterator() {
        var _iteratorNormalCompletion32, _didIteratorError32, _iteratorError32, _iterator32, _step32, _x28;

        return regeneratorRuntime.wrap(function copyWithinIterator$(_context25) {
            while (1) {
                switch (_context25.prev = _context25.next) {
                    case 0:
                        _iteratorNormalCompletion32 = true;
                        _didIteratorError32 = false;
                        _iteratorError32 = undefined;
                        _context25.prev = 3;
                        _iterator32 = toArray(xs).copyWithin(idx, start, end)[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done) {
                            _context25.next = 12;
                            break;
                        }

                        _x28 = _step32.value;
                        _context25.next = 9;
                        return _x28;

                    case 9:
                        _iteratorNormalCompletion32 = true;
                        _context25.next = 5;
                        break;

                    case 12:
                        _context25.next = 18;
                        break;

                    case 14:
                        _context25.prev = 14;
                        _context25.t0 = _context25['catch'](3);
                        _didIteratorError32 = true;
                        _iteratorError32 = _context25.t0;

                    case 18:
                        _context25.prev = 18;
                        _context25.prev = 19;

                        if (!_iteratorNormalCompletion32 && _iterator32.return) {
                            _iterator32.return();
                        }

                    case 21:
                        _context25.prev = 21;

                        if (!_didIteratorError32) {
                            _context25.next = 24;
                            break;
                        }

                        throw _iteratorError32;

                    case 24:
                        return _context25.finish(21);

                    case 25:
                        return _context25.finish(18);

                    case 26:
                    case 'end':
                        return _context25.stop();
                }
            }
        }, copyWithinIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @param {number} start - b
 * @param {number} end - c
 * @param {Array} xs - d
 * @return {generator} - e
 */
function fill(val, start, end, xs) {
    return regeneratorRuntime.mark(function fillIterator() {
        var _iteratorNormalCompletion33, _didIteratorError33, _iteratorError33, _iterator33, _step33, _x29;

        return regeneratorRuntime.wrap(function fillIterator$(_context26) {
            while (1) {
                switch (_context26.prev = _context26.next) {
                    case 0:
                        _iteratorNormalCompletion33 = true;
                        _didIteratorError33 = false;
                        _iteratorError33 = undefined;
                        _context26.prev = 3;
                        _iterator33 = toArray(xs).fill(val, start, end)[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done) {
                            _context26.next = 12;
                            break;
                        }

                        _x29 = _step33.value;
                        _context26.next = 9;
                        return _x29;

                    case 9:
                        _iteratorNormalCompletion33 = true;
                        _context26.next = 5;
                        break;

                    case 12:
                        _context26.next = 18;
                        break;

                    case 14:
                        _context26.prev = 14;
                        _context26.t0 = _context26['catch'](3);
                        _didIteratorError33 = true;
                        _iteratorError33 = _context26.t0;

                    case 18:
                        _context26.prev = 18;
                        _context26.prev = 19;

                        if (!_iteratorNormalCompletion33 && _iterator33.return) {
                            _iterator33.return();
                        }

                    case 21:
                        _context26.prev = 21;

                        if (!_didIteratorError33) {
                            _context26.next = 24;
                            break;
                        }

                        throw _iteratorError33;

                    case 24:
                        return _context26.finish(21);

                    case 25:
                        return _context26.finish(18);

                    case 26:
                    case 'end':
                        return _context26.stop();
                }
            }
        }, fillIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} comparer - b
 * @return {Number} - c
 */
function findIndex(xs) {
    var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.strictEquals;

    return toArray(xs).findIndex(comparer);
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} comparer - b
 * @return {Number} - c
 */
function findLastIndex(xs) {
    var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.strictEquals;

    return toArray(xs).length - toArray(xs).reverse().findIndex(comparer);
}

var unfold = _decorators.unfoldWith;

exports.all = all;
exports.any = any;
exports.except = except;
exports.intersect = intersect;
exports.union = union;
exports.map = map;
exports.chain = chain;
exports.groupBy = groupBy;
exports.sortBy = sortBy;
exports.prepend = prepend;
exports.concat = concat;
exports.groupJoin = groupJoin;
exports.join = join;
exports.zip = zip;
exports.filter = filter;
exports.intersperse = intersperse;
exports.contains = contains;
exports.first = first;
exports.last = last;
exports.count = count;
exports.foldLeft = foldLeft;
exports.reduceRight = reduceRight;
exports.distinct = distinct;
exports.ofType = ofType;
exports.binarySearch = binarySearch;
exports.equals = equals;
exports.takeWhile = takeWhile;
exports.skipWhile = skipWhile;
exports.reverse = reverse;
exports.copyWithin = copyWithin;
exports.fill = fill;
exports.findIndex = findIndex;
exports.findLastIndex = findLastIndex;
exports.repeat = repeat;
exports.foldRight = foldRight;
exports.unfold = unfold;

},{"../combinators":298,"../decorators":321,"../functionalHelpers":322,"../helpers":325,"./sortHelpers":320}],311:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.constant_monad = exports.Constant = undefined;

var _constant_functor = require('../functors/constant_functor');

var _containerHelpers = require('../containerHelpers');

function Constant(val) {
    return Object.create(constant_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {constant_monad} - b
 */
Constant.of = function _of(item) {
    return Constant(item);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Constant.is = function (m) {
    return constant_monad.isPrototypeOf(m);
};

var constant_monad = Object.create(_constant_functor.constant_functor, {
    chain: {
        value: function _chain() {
            return this;
        }
    },
    fold: {
        value: function _fold(f) {
            return f(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.of(this.value);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return this.of(this.value);
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Constant),
        writable: false,
        configurable: false
    },
    factory: {
        value: Constant
    }
});

constant_monad.mjoin = _containerHelpers.mjoin;
constant_monad.apply = _containerHelpers.apply;

constant_monad.ap = constant_monad.apply;
constant_monad.fmap = constant_monad.chain;
constant_monad.flapMap = constant_monad.chain;
constant_monad.bind = constant_monad.chain;
constant_monad.reduce = constant_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
constant_monad.constructor = constant_monad.factory;

exports.Constant = Constant;
exports.constant_monad = constant_monad;

},{"../containerHelpers":299,"../functors/constant_functor":300}],312:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.left_monad = exports.right_monad = exports.Right = exports.Left = exports.Either = undefined;

var _either_functor = require('../functors/either_functor');

var _combinators = require('../../combinators');

var _containerHelpers = require('../containerHelpers');

function Either(val, fork) {
    return 'right' === fork ? Object.create(right_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isRight: {
            value: true,
            writable: false,
            configurable: false
        },
        isLeft: {
            value: false,
            writable: false,
            configurable: false
        }
    }) : Object.create(left_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isRight: {
            value: false,
            writable: false,
            configurable: false
        },
        isLeft: {
            value: true,
            writable: false,
            configurable: false
        }
    });
}

Either.of = function _of(val) {
    return Either(val, 'right');
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Either.is = function (m) {
    return left_monad.isPrototypeOf(m) || right_monad.isPrototypeOf(m);
};

Either.Left = function _left(val) {
    return Either(val);
};

Either.Right = function _right(val) {
    return Either(val, 'right');
};

Either.isLeft = function _isLeft(ma) {
    return ma.isLeft;
};

Either.isRight = function _isRight(ma) {
    return ma.isRight;
};

function Left(val) {
    return Either(val);
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {left_monad} - b
 */
Left.of = function (val) {
    return Left(val);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Left.is = function (m) {
    return left_monad.isPrototypeOf(m);
};

function Right(val) {
    return Either(val, 'right');
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {right_monad} - b
 */
Right.of = function (val) {
    return Right(val);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Right.is = function (m) {
    return right_monad.isPrototypeOf(m);
};

var right_monad = Object.create(_either_functor.right_functor, {
    map: {
        value: _containerHelpers.sharedEitherFns.rightMap
    },
    bimap: {
        value: _containerHelpers.sharedEitherFns.rightBiMap
    },
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(_combinators.identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f, g) {
            return f(this.value).map(this.of);
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Right),
        writable: false,
        configurable: false
    },
    factory: {
        value: Either
    }
});

right_monad.chain = _containerHelpers.chain;
right_monad.mjoin = _containerHelpers.mjoin;
right_monad.apply = _containerHelpers.apply;

var left_monad = Object.create(_either_functor.left_functor, {
    map: {
        value: _containerHelpers.sharedEitherFns.leftMapMaker(Left)
    },
    bimap: {
        value: _containerHelpers.sharedEitherFns.leftBimapMaker(Left)
    },
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(_combinators.identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return a.of(Left(this.value));
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Right),
        writable: false,
        configurable: false
    },
    factory: {
        value: Either
    }
});

left_monad.chain = _containerHelpers.chain;
left_monad.mjoin = _containerHelpers.mjoin;
left_monad.apply = _containerHelpers.apply;

right_monad.ap = right_monad.apply;
left_monad.ap = left_monad.apply;
right_monad.flatMap = right_monad.chain;
left_monad.flatMap = left_monad.chain;
right_monad.bind = right_monad.chain;
left_monad.bind = left_monad.chain;
right_monad.reduce = right_monad.fold;
left_monad.reduce = left_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
right_monad.constructor = right_monad.factory;
left_monad.constructor = left_monad.factory;

exports.Either = Either;
exports.Left = Left;
exports.Right = Right;
exports.right_monad = right_monad;
exports.left_monad = left_monad;

},{"../../combinators":298,"../containerHelpers":299,"../functors/either_functor":301}],313:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.future_monad = exports.Future = undefined;

var _future_functor = require('../functors/future_functor');

var _functionalHelpers = require('../../functionalHelpers');

var _containerHelpers = require('../containerHelpers');

function safeFork(reject, resolve) {
    return function _safeFork(val) {
        try {
            return resolve(val);
        } catch (ex) {
            reject(ex);
        }
    };
}

function Future(f) {
    return Object.create(future_monad, {
        _value: {
            value: f,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {function|*} val - a
 * @return {future_functor} - b
 */
Future.of = function _of(val) {
    return 'function' === typeof val ? Future(val) : Future(function (_, resolve) {
        return safeFork(_functionalHelpers.noop, resolve(val));
    });
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Future.is = function (m) {
    return future_monad.isPrototypeOf(m);
};

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {future_functor} - b
 */
Future.reject = function _reject(val) {
    return Future(function (reject, resolve) {
        return reject(val);
    });
};

Future.unit = function _unit(val) {
    return Future(val).complete();
};

var future_monad = Object.create(_future_functor.future_functor, {
    chain: {
        //TODO: probably need to compose here, not actually map over the value; this is a temporary fill-in until
        //TODO: I have time to finish working on the Future
        value: function _chain(fn) {
            var _this = this;

            return this.of(function (reject, resolve) {
                var cancel = void 0,
                    outerFork = _this._fork(function (a) {
                    return reject(a);
                }, function (b) {
                    cancel = fn(b).fork(reject, resolve);
                });
                return cancel ? cancel : (cancel = outerFork, function (x) {
                    return cancel();
                });
            });
        }
    },
    fold: {
        value: function _fold(f, g) {
            var _this2 = this;

            return this.of(function (reject, resolve) {
                return _this2.fork(function (a) {
                    return resolve(f(a));
                }, function (b) {
                    return resolve(g(b));
                });
            });
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            });
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Future),
        writable: false,
        configurable: false
    },
    factory: {
        value: Future
    }
});

future_monad.mjoin = _containerHelpers.mjoin;
future_monad.apply = _containerHelpers.apply;

future_monad.ap = future_monad.apply;
future_monad.fmap = future_monad.chain;
future_monad.flapMap = future_monad.chain;
future_monad.bind = future_monad.chain;
future_monad.reduce = future_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
future_monad.constructor = future_monad.factory;

exports.Future = Future;
exports.future_monad = future_monad;

},{"../../functionalHelpers":322,"../containerHelpers":299,"../functors/future_functor":303}],314:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.identity_monad = exports.Identity = undefined;

var _identity_functor = require('../functors/identity_functor');

var _helpers = require('../../helpers');

var _combinators = require('../../combinators');

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {identity_monad} - b
 */
function Identity(item) {
    return Object.create(identity_monad, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {identity_monad} - b
 */
Identity.of = function _of(item) {
    return Identity(item);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Identity.is = function (m) {
    return identity_monad.isPrototypeOf(m);
};

/**
 * @sig
 * @description d
 * @return {identity_monad} - a
 */
Identity.empty = function _empty() {
    return this.of(Object.create(_helpers.emptyObject));
};

var identity_monad = Object.create(_identity_functor.identity_functor, {
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(_combinators.identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return f(this.value).map(this.of);
        }
    },
    empty: {
        value: function _empty() {
            return this.of(Object.create(_helpers.emptyObject));
        }
    },
    isEmpty: {
        get: function _getIsEmpty() {
            return _helpers.emptyObject.isPrototypeOf(this.value);
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Identity),
        writable: false,
        configurable: false
    },
    factory: {
        value: Identity
    }
});

identity_monad.chain = _containerHelpers.chain;
identity_monad.mjoin = _containerHelpers.mjoin;
identity_monad.apply = _containerHelpers.apply;

identity_monad.ap = identity_monad.apply;
identity_monad.fmap = identity_monad.chain;
identity_monad.flapMap = identity_monad.chain;
identity_monad.bind = identity_monad.chain;
identity_monad.reduce = identity_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
identity_monad.constructor = identity_monad.factory;

exports.Identity = Identity;
exports.identity_monad = identity_monad;

},{"../../combinators":298,"../../helpers":325,"../containerHelpers":299,"../functors/identity_functor":304}],315:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.io_monad = exports.Io = undefined;

var _io_functor = require('../functors/io_functor');

var _combinators = require('../../combinators');

var _containerHelpers = require('../containerHelpers');

function Io(val) {
    return Object.create(io_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

Io.of = function _of(val) {
    return 'function' === typeof val ? Io(val) : Io(function _wrapper() {
        return val;
    });
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Io.is = function (m) {
    return io_monad.isPrototypeOf(m);
};

var io_monad = Object.create(_io_functor.io_functor, {
    fold: {
        value: function _fold(fn, x) {
            return fn(this.value, x);
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            });
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Io),
        writable: false,
        configurable: false
    },
    factory: {
        value: Io
    }
});

io_monad.chain = _containerHelpers.chain;
io_monad.mjoin = _containerHelpers.mjoin;
io_monad.apply = _containerHelpers.apply;

io_monad.ap = io_monad.apply;
io_monad.fmap = io_monad.chain;
io_monad.flapMap = io_monad.chain;
io_monad.bind = io_monad.chain;
io_monad.reduce = io_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
io_monad.constructor = io_monad.factory;

exports.Io = Io;
exports.io_monad = io_monad;

},{"../../combinators":298,"../containerHelpers":299,"../functors/io_functor":305}],316:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ordered_list_monad = exports.list_monad = exports.List = undefined;

var _list_functor = require('../functors/list_functor');

var _helpers = require('../../helpers');

var _list_iterators = require('../list_iterators');

var _functionalHelpers = require('../../functionalHelpers');

var _combinators = require('../../combinators');

var _list_helpers = require('../list_helpers');

var list_monad = Object.create(_list_functor.list_functor, {
    chain: {
        /**
         * @sig
         * @description d
         * @param {function} fn - a
         * @return {list_monad} - b
         */
        value: function _chain(fn) {
            return this.of((0, _list_iterators.chain)(this, fn));
        }
    },
    groupBy: {
        value: function _groupBy(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
            return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
        }
    },
    groupByDescending: {
        value: function _groupByDescending(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.descending }];
            return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
        }
    },
    groupJoin: {
        value: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
            return this.of(this, (0, _list_iterators.groupJoin)(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    fold: {
        value: function _fold(fn, x) {
            return fn(this.value, x);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(p, _combinators.identity);
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.value.reduce(function _reduce(xs, x) {
                fn(x).map(function (x) {
                    return function (y) {
                        return y.concat([x]);
                    };
                }).apply(xs);
            }, fa.of(List.of()));

            /*
            return this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            });*/

            //TODO: this exists inside the traverse function. Function should take a typeRep + fn
            /*
             var xs = this;
             function go(idx, n) {
                 switch (n) {
                     case 0: return of(typeRep, []);
                     case 2: return lift2(pair, f(xs[idx]), f(xs[idx + 1]));
                     default:
                         var m = Math.floor(n / 4) * 2;
                         return lift2(concat_, go(idx, m), go(idx + m, n - m));
                }
             }
             return this.length % 2 === 1 ?
                 lift2(concat_, map(Array$of, f(this[0])), go(1, this.length - 1)) :
                 go(0, this.length);
             */
        }
    },
    /**
     * @sig
     * @description Applies a function contained in another functor to the source
     * of this List object instance's underlying source. A new List object instance
     * is returned.
     * @param {Object} ma - a
     * @return {list_monad} - b
     */
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val, iterator, sortObj) {
            return createListDelegateInstance(val, iterator, sortObj);
        }
    },
    factory: {
        value: List
    }
});

list_monad.ap = list_monad.apply;
list_monad.fmap = list_monad.chain;
list_monad.flapMap = list_monad.chain;
list_monad.bind = list_monad.chain;

var ordered_list_monad = Object.create(_list_functor.ordered_list_functor, {
    /**
     * @description:
     * @param: {function} fn
     * @return: {@see m_list}
     */
    chain: {
        value: function _chain(fn) {
            return this.of((0, _list_iterators.chain)(this, fn));
        }
    },
    groupBy: {
        value: function _groupBy(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
            return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
        }
    },
    groupByDescending: {
        value: function _groupByDescending(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.descending }];
            return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
        }
    },
    groupJoin: {
        value: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
            return this.of(this, (0, _list_iterators.groupJoin)(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    fold: {
        value: function _fold(fn, x) {
            return fn(this.value, x);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(p, _combinators.identity);
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.reduce(function (ys, x) {
                return fn(x).map(function (x) {
                    return function (y) {
                        return y.concat([x]);
                    };
                }).apply(ys);
            }, fa.of(this.empty));
        }
    },
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val, iterator, sortObj) {
            return createListDelegateInstance(val, iterator, sortObj);
        }
    },
    factory: {
        value: List
    }
});

ordered_list_monad.ap = ordered_list_monad.apply;
ordered_list_monad.fmap = ordered_list_monad.chain;
ordered_list_monad.flapMap = ordered_list_monad.chain;
ordered_list_monad.bind = ordered_list_monad.chain;
//ordered_list_monad.reduce = ordered_list_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "you're too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
list_monad.constructor = list_monad.factory;
ordered_list_monad.constructor = ordered_list_monad.factory;

var createListDelegateInstance = (0, _list_helpers.createListCreator)(list_monad, ordered_list_monad, list_monad);

/**
 * @sig
 * @description d
 * @param {*} source - a
 * @return {list_monad} - b
 */
var listFromNonGen = function listFromNonGen(source) {
    return createListDelegateInstance(source && source[Symbol.iterator] ? source : (0, _functionalHelpers.wrap)(source));
};

/**
 * @sig
 * @description d
 * @param {generator} source - a
 * @return {list_monad} - b
 */
var listFromGen = function listFromGen(source) {
    return createListDelegateInstance((0, _functionalHelpers.invoke)(source));
};

/**
 * @sig
 * @description Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_monad} - A new List instance with the value provided as the underlying source.
 */
//TODO: should I exclude strings from being used as a source directly, or allow it because
//TODO: they have an iterator?
function List(source) {
    return (0, _combinators.ifElse)((0, _functionalHelpers.delegatesFrom)(_helpers.generatorProto), listFromGen, listFromNonGen, source);
}

/**
 * @sig
 * @description Convenience function for create a new List instance; internally calls List.
 * @see List
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_monad} - A new List instance with the value provided as the underlying source.
 */
List.from = function (source) {
    return List(source);
};

/**
 * @sig
 * @description Alias for List.from
 * @see List.from
 * @type {function}
 * @param {*} - a
 * @return {list_monad} - b
 */
List.of = List.from;

//TODO: implement this so that a consumer can initiate a List as ordered
List.ordered = function (source) {
    return source;
};

/**
 * @sig
 * @description d
 * @return {list_monad} - a
 */
List.empty = function () {
    return List([]);
};

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {list_monad} - b
 */
List.just = function (val) {
    return List([val]);
};

/**
 * @sig
 * @description d
 * @param {function|generator} fn - a
 * @param {*} seed - b
 * @return {list_monad} - c
 */
List.unfold = function (fn, seed) {
    return createListDelegateInstance((0, _list_iterators.unfold)(fn)(seed));
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
List.is = function (m) {
    return list_monad.isPrototypeOf(m) || ordered_list_monad.isPrototypeOf(m);
};

/**
 * @sig
 * @description Generates a new list with the specified item repeated the specified number of times. Because
 * this generates a list with the same item repeated n times, the resulting List is trivially
 * sorted. Thus, a sorted List is returned rather than an unsorted list.
 * @param {*} item - a
 * @param {number} count - b
 * @return {ordered_list_monad} - c
 */
List.repeat = function _repeat(item, count) {
    return createListDelegateInstance([], (0, _list_iterators.repeat)(item, count), [{ keySelector: _functionalHelpers.noop, comparer: _functionalHelpers.noop, direction: _helpers.sortDirection.descending }]);
};

/**
 * @sig
 * @summary Extension function that allows new functionality to be applied to
 * the queryable object
 * @param {string} propName - The name of the new property that should exist on the List; must be unique
 * @param {function} fn - A function that defines the new List functionality and
 * will be called when this new List property is invoked.
 * @return {List} - a
 *
 * @description The fn parameter must be a non-generator function that takes one or more
 * arguments. If this new List function should be an immediately evaluated
 * function (like: take, any, reverse, etc.), it merely needs the accept one or more
 * arguments and know how to iterate the source. In the case of an immediately evaluated
 * function, the return type can be any javascript type. The first argument is always the
 * previous List instance that must be iterated. Additional arguments may be specified
 * if desired.
 *
 * If the function's evaluation should be deferred it needs to work a bit differently.
 * In this case, the function should accept one or more arguments, the first and only
 * required argument being the underlying source of the List object. This underlying
 * source can be anything with an iterator (generator, array, map, set, another queryable).
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
//TODO: this should probably be changed, other wise I am altering the applicative list_functor in
//TODO: addition to the monadic list_functor. I'll also need to recreate the 'toEvaluatedList' function
//TODO: since using it on a monadic list_functor would result in a list_a, not a list_m.
List.extend = (0, _list_helpers.listExtensionHelper)(List, _list_functor.list_core, createListDelegateInstance, _list_functor.list_functor, _list_functor.ordered_list_functor);

function createGroupedListDelegate(source, key) {
    return createListDelegateInstance(source, undefined, undefined, key);
}

exports.List = List;
exports.list_monad = list_monad;
exports.ordered_list_monad = ordered_list_monad;

},{"../../combinators":298,"../../functionalHelpers":322,"../../helpers":325,"../functors/list_functor":306,"../list_helpers":309,"../list_iterators":310}],317:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nothing_monad = exports.just_monad = exports.Nothing = exports.Just = exports.Maybe = undefined;

var _maybe_functor = require('../functors/maybe_functor');

var _combinators = require('../../combinators');

var _containerHelpers = require('../containerHelpers');

function Maybe(item) {
    return null == item ? Object.create(nothing_monad, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    }) : Object.create(just_monad, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {just_monad} - b
 */
Maybe.of = function _of(item) {
    return Object.create(just_monad, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Maybe.is = function (m) {
    return just_monad.isPrototypeOf(m) || nothing_monad.isPrototypeOf(m);
};

Maybe.Just = function _just(item) {
    return Maybe.of(item);
};

Maybe.Nothing = function _nothing() {
    return Object.create(nothing_monad, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    });
};

var Just = Maybe.Just;

Just.of = Just;

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Just.is = function (m) {
    return just_monad.isPrototypeOf(m);
};

var Nothing = Maybe.Nothing;

Nothing.of = Nothing;

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Nothing.is = function (m) {
    return nothing_monad.isPrototypeOf(m);
};

var just_monad = Object.create(_maybe_functor.just_functor, {
    map: {
        value: _containerHelpers.sharedMaybeFns.justMap
    },
    bimap: {
        value: _containerHelpers.sharedMaybeFns.justBimap
    },
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(_combinators.identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f, g) {
            return f(this.value).map(this.of);
        }
    },
    nothing: {
        value: function _nothing() {
            return Nothing();
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Maybe),
        writable: false,
        configurable: false
    },
    factory: {
        value: Maybe
    }
});

just_monad.chain = _containerHelpers.chain;
just_monad.mjoin = _containerHelpers.mjoin;
just_monad.apply = _containerHelpers.apply;

var nothing_monad = Object.create(_maybe_functor.nothing_functor, {
    map: {
        value: _containerHelpers.sharedMaybeFns.nothingMapMaker(Nothing)
    },
    bimap: {
        value: _containerHelpers.sharedMaybeFns.nothingBimapMaker(Nothing)
    },
    fold: {
        value: function _fold(fn) {
            return Nothing();
        }
    },
    sequence: {
        value: function _sequence(a) {
            return this.traverse(_combinators.identity, a);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return a.of(Maybe.Nothing());
        }
    },
    nothing: {
        value: function _nothing() {
            return Nothing();
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Maybe),
        writable: false,
        configurable: false
    },
    factory: {
        value: Maybe
    }
});

nothing_monad.chain = _containerHelpers.chain;
nothing_monad.mjoin = _containerHelpers.mjoin;
nothing_monad.apply = _containerHelpers.apply;

just_monad.ap = just_monad.apply;
just_monad.fmap = just_monad.chain;
just_monad.flapMap = just_monad.chain;
just_monad.bind = just_monad.chain;
just_monad.reduce = just_monad.fold;

nothing_monad.ap = nothing_monad.apply;
nothing_monad.fmap = nothing_monad.chain;
nothing_monad.flapMap = nothing_monad.chain;
nothing_monad.bind = nothing_monad.chain;
nothing_monad.reduce = nothing_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
just_monad.constructor = just_monad.factory;
nothing_monad.constructor = nothing_monad.factory;

exports.Maybe = Maybe;
exports.Just = Just;
exports.Nothing = Nothing;
exports.just_monad = just_monad;
exports.nothing_monad = nothing_monad;

},{"../../combinators":298,"../containerHelpers":299,"../functors/maybe_functor":307}],318:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.monads = undefined;

var _constant_monad = require('./constant_monad');

var _either_monad = require('./either_monad');

var _future_monad = require('./future_monad');

var _identity_monad = require('./identity_monad');

var _io_monad = require('./io_monad');

var _list_monad = require('./list_monad');

var _maybe_monad = require('./maybe_monad');

var _validation_monad = require('./validation_monad');

var _containerHelpers = require('../containerHelpers');

var _pointlessContainers = require('../../pointlessContainers');

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

var mapToConstant = (0, _pointlessContainers.toContainerType)(_constant_monad.Constant),
    mapToEither = (0, _pointlessContainers.toContainerType)(_either_monad.Either),
    mapToFuture = (0, _pointlessContainers.toContainerType)(_future_monad.Future),
    mapToIdentity = (0, _pointlessContainers.toContainerType)(_identity_monad.Identity),
    mapToIo = (0, _pointlessContainers.toContainerType)(_io_monad.Io),
    mapToLeft = (0, _pointlessContainers.toContainerType)(_either_monad.Left),
    mapToList = (0, _pointlessContainers.toContainerType)(_list_monad.List),
    mapToMaybe = (0, _pointlessContainers.toContainerType)(_maybe_monad.Maybe),
    mapToRight = (0, _pointlessContainers.toContainerType)(_either_monad.Right),
    mapToValidation = (0, _pointlessContainers.toContainerType)(_validation_monad.Validation);

_constant_monad.constant_monad.mapToEither = mapToEither;
_constant_monad.constant_monad.mapToFuture = mapToFuture;
_constant_monad.constant_monad.mapToIdentity = mapToIdentity;
_constant_monad.constant_monad.mapToIo = mapToIo;
_constant_monad.constant_monad.mapToLeft = mapToLeft;
_constant_monad.constant_monad.mapToList = mapToList;
_constant_monad.constant_monad.mapToMaybe = mapToMaybe;
_constant_monad.constant_monad.mapToRight = mapToRight;
_constant_monad.constant_monad.mapToValidation = mapToValidation;
_constant_monad.constant_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_future_monad.future_monad.mapToConstant = mapToConstant;
_future_monad.future_monad.mapToEither = mapToEither;
_future_monad.future_monad.mapToIdentity = mapToIdentity;
_future_monad.future_monad.mapToIo = mapToIo;
_future_monad.future_monad.mapToLeft = mapToLeft;
_future_monad.future_monad.mapToList = mapToList;
_future_monad.future_monad.mapToMaybe = mapToMaybe;
_future_monad.future_monad.mapToRight = mapToRight;
_future_monad.future_monad.mapToValidation = mapToValidation;
_future_monad.future_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_identity_monad.identity_monad.mapToConstant = mapToConstant;
_identity_monad.identity_monad.mapToEither = mapToEither;
_identity_monad.identity_monad.mapToFuture = mapToFuture;
_identity_monad.identity_monad.mapToIo = mapToIo;
_identity_monad.identity_monad.mapToLeft = mapToLeft;
_identity_monad.identity_monad.mapToList = mapToList;
_identity_monad.identity_monad.mapToMaybe = mapToMaybe;
_identity_monad.identity_monad.mapToRight = mapToRight;
_identity_monad.identity_monad.mapToValidation = mapToValidation;
_identity_monad.identity_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_io_monad.io_monad.mapToConstant = mapToConstant;
_io_monad.io_monad.mapToEither = mapToEither;
_io_monad.io_monad.mapToFuture = mapToFuture;
_io_monad.io_monad.mapToIdentity = mapToIdentity;
_io_monad.io_monad.mapToLeft = mapToLeft;
_io_monad.io_monad.mapToList = mapToList;
_io_monad.io_monad.mapToMaybe = mapToMaybe;
_io_monad.io_monad.mapToRight = mapToRight;
_io_monad.io_monad.mapToValidation = mapToValidation;
_io_monad.io_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_either_monad.left_monad.mapToConstant = mapToConstant;
_either_monad.left_monad.mapToFuture = mapToFuture;
_either_monad.left_monad.mapToIdentity = mapToIdentity;
_either_monad.left_monad.mapToIo = mapToIo;
_either_monad.left_monad.mapToList = mapToList;
_either_monad.left_monad.mapToMaybe = mapToMaybe;
_either_monad.left_monad.mapToValidation = mapToValidation;
_either_monad.left_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_maybe_monad.just_monad.mapToConstant = mapToConstant;
_maybe_monad.just_monad.mapToEither = mapToEither;
_maybe_monad.just_monad.mapToFuture = mapToFuture;
_maybe_monad.just_monad.mapToIdentity = mapToIdentity;
_maybe_monad.just_monad.mapToIo = mapToIo;
_maybe_monad.just_monad.mapToList = mapToList;
_maybe_monad.just_monad.mapToValidation = mapToValidation;
_maybe_monad.just_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_list_monad.list_monad.mapToConstant = mapToConstant;
_list_monad.list_monad.mapToEither = mapToEither;
_list_monad.list_monad.mapToFuture = mapToFuture;
_list_monad.list_monad.mapToIdentity = mapToIdentity;
_list_monad.list_monad.mapToIo = mapToIo;
_list_monad.list_monad.mapToLeft = mapToLeft;
_list_monad.list_monad.mapToMaybe = mapToMaybe;
_list_monad.list_monad.mapToRight = mapToRight;
_list_monad.list_monad.mapToValidation = mapToValidation;

_list_monad.ordered_list_monad.mapToConstant = mapToConstant;
_list_monad.ordered_list_monad.mapToEither = mapToEither;
_list_monad.ordered_list_monad.mapToFuture = mapToFuture;
_list_monad.ordered_list_monad.mapToIdentity = mapToIdentity;
_list_monad.ordered_list_monad.mapToIo = mapToIo;
_list_monad.ordered_list_monad.mapToLeft = mapToLeft;
_list_monad.ordered_list_monad.mapToMaybe = mapToMaybe;
_list_monad.ordered_list_monad.mapToRight = mapToRight;
_list_monad.ordered_list_monad.mapToValidation = mapToValidation;

_maybe_monad.nothing_monad.mapToConstant = mapToConstant;
_maybe_monad.nothing_monad.mapToEither = mapToEither;
_maybe_monad.nothing_monad.mapToFuture = mapToFuture;
_maybe_monad.nothing_monad.mapToIdentity = mapToIdentity;
_maybe_monad.nothing_monad.mapToIo = mapToIo;
_maybe_monad.nothing_monad.mapToLeft = mapToLeft;
_maybe_monad.nothing_monad.mapToList = mapToList;
_maybe_monad.nothing_monad.mapToRight = mapToRight;
_maybe_monad.nothing_monad.mapToValidation = mapToValidation;
_maybe_monad.nothing_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_either_monad.right_monad.mapToConstant = mapToConstant;
_either_monad.right_monad.mapToFuture = mapToFuture;
_either_monad.right_monad.mapToIdentity = mapToIdentity;
_either_monad.right_monad.mapToIo = mapToIo;
_either_monad.right_monad.mapToList = mapToList;
_either_monad.right_monad.mapToMaybe = mapToMaybe;
_either_monad.right_monad.mapToValidation = mapToValidation;
_either_monad.right_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_validation_monad.validation_monad.mapToConstant = mapToConstant;
_validation_monad.validation_monad.mapToEither = mapToEither;
_validation_monad.validation_monad.mapToFuture = mapToFuture;
_validation_monad.validation_monad.mapToIdentity = mapToIdentity;
_validation_monad.validation_monad.mapToIo = mapToIo;
_validation_monad.validation_monad.mapToLeft = mapToLeft;
_validation_monad.validation_monad.mapToList = mapToList;
_validation_monad.validation_monad.mapToMaybe = mapToMaybe;
_validation_monad.validation_monad.mapToRight = mapToRight;
_validation_monad.validation_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_constant_monad.Constant.lift = (0, _containerHelpers.lifter)(_constant_monad.Constant);
_either_monad.Either.lift = (0, _containerHelpers.lifter)(_either_monad.Either);
_future_monad.Future.lift = (0, _containerHelpers.lifter)(_future_monad.Future);
_identity_monad.Identity.lift = (0, _containerHelpers.lifter)(_identity_monad.Identity);
_io_monad.Io.lift = (0, _containerHelpers.lifter)(_io_monad.Io);
_maybe_monad.Just.lift = (0, _containerHelpers.lifter)(_maybe_monad.Just);
_either_monad.Left.lift = (0, _containerHelpers.lifter)(_either_monad.Left);
_list_monad.List.lift = (0, _containerHelpers.lifter)(_list_monad.List);
_maybe_monad.Maybe.lift = (0, _containerHelpers.lifter)(_maybe_monad.Maybe);
_maybe_monad.Nothing.lift = (0, _containerHelpers.lifter)(_maybe_monad.Nothing);
_either_monad.Right.lift = (0, _containerHelpers.lifter)(_either_monad.Right);
_validation_monad.Validation.lift = (0, _containerHelpers.lifter)(_validation_monad.Validation);

var monads = {
    Constant: _constant_monad.Constant,
    Either: _either_monad.Either,
    Future: _future_monad.Future,
    Identity: _identity_monad.Identity,
    Io: _io_monad.Io,
    Just: _maybe_monad.Just,
    Left: _either_monad.Left,
    List: _list_monad.List,
    Maybe: _maybe_monad.Maybe,
    Nothing: _maybe_monad.Nothing,
    Right: _either_monad.Right,
    Validation: _validation_monad.Validation
};

exports.monads = monads;

},{"../../pointlessContainers":327,"../containerHelpers":299,"./constant_monad":311,"./either_monad":312,"./future_monad":313,"./identity_monad":314,"./io_monad":315,"./list_monad":316,"./maybe_monad":317,"./validation_monad":319}],319:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validation_monad = exports.Validation = undefined;

var _validation_functor = require('../functors/validation_functor');

var _containerHelpers = require('../containerHelpers');

function Validation(val) {
    return Object.create(validation_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

Validation.of = function _of(val) {
    return Validation(val);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Validation.is = function (m) {
    return validation_monad.isPrototypeOf(m);
};

var validation_monad = Object.create(_validation_functor.validation_functor, {
    of: {
        value: (0, _containerHelpers.pointMaker)(Validation),
        writable: false,
        configurable: false
    },
    factory: {
        value: Validation
    }
});

validation_monad.chain = _containerHelpers.chain;
validation_monad.mjoin = _containerHelpers.mjoin;
validation_monad.apply = _containerHelpers.apply;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
validation_monad.constructor = validation_monad.factory;

exports.Validation = Validation;
exports.validation_monad = validation_monad;

},{"../containerHelpers":299,"../functors/validation_functor":308}],320:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.quickSort = exports.sortData = undefined;

var _helpers = require('../helpers');

/**
 * @sig
 * @description d
 * @param {Array} data - a
 * @param {Object} sortObject - b
 * @return {Array} - Returns an array sorted on 'n' fields in either ascending or descending
 * order for each field as specified in the 'sortObject' parameter
 */
function sortData(data, sortObject) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
        var comparer = sortObject.comparer && 'function' === typeof sort.comparer ? sort.comparer : _helpers.sortComparer;
        if (0 === index) sortedData = 5001 > data.length ? insertionSort(data, sort.keySelector, comparer, sort.direction) : mergeSort(data, sort.keySelector, comparer, sort.direction);
        //if (index === 0) sortedData = quickSort(data, sort.direction, sort.keySelector, comparer);
        else {
                var sortedSubData = [],
                    itemsToSort = [],
                    prevKeySelector = sortObject[index - 1].keySelector;
                sortedData.forEach(function _sortData(item, idx) {
                    //TODO: re-examine this logic; I think it is in reverse order
                    if (!itemsToSort.length || 0 === comparer(prevKeySelector(itemsToSort[0]), prevKeySelector(item), sort.direction)) itemsToSort.push(item);else {
                        //TODO: see if there's a realistic way that length === 1 || 2 could be combined into one statement
                        if (1 === itemsToSort.length) sortedSubData = sortedSubData.concat(itemsToSort);
                        //else if (itemsToSort.length === 2) {
                        //sortedSubData = -1 < comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1]), sort.direction) ?
                        //sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                        /*if (sortDirection.descending === sort.ascending)
                            sortedSubData = -1 < comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1]), sort.direction) ?
                                sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                        else sortedSubData = 1 > comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1]), sort.direction) ?
                            sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                        */
                        //}
                        else {
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
 * @sig
 * @description d
 * @param {Array} data - a
 * @param {function} keySelector - b
 * @param {function} comparer - c
 * @param {string} direction - d
 * @return {Array} - e
 */
function mergeSort(data, keySelector, comparer, direction) {
    if (2 > data.length) return data;
    var middle = parseInt(data.length / 2);
    return merge(mergeSort(data.slice(0, middle), keySelector, comparer, direction), mergeSort(data.slice(middle), keySelector, comparer, direction), keySelector, comparer, direction);
}

/**
 * @sig
 * @description d
 * @param {Array} left - a
 * @param {Array} right - b
 * @param {function} keySelector - c
 * @param {function} comparer - d
 * @param {string} direction - e
 * @return {Array} - f
 */
function merge(left, right, keySelector, comparer, direction) {
    if (!left.length) return right;
    if (!right.length) return left;

    if (-1 < comparer(keySelector(left[0]), keySelector(right[0]), direction)) return [(0, _helpers.deepClone)(left[0])].concat(merge(left.slice(1, left.length), right, keySelector, comparer, direction));
    return [(0, _helpers.deepClone)(right[0])].concat(merge(left, right.slice(1, right.length), keySelector, comparer, direction));
}

/**
 * @sig
 * @description d
 * @param {Array} source - a
 * @param {string} dir - b
 * @param {function} keySelector - c
 * @param {function} keyComparer - d
 * @return {Array} - Returns a sort array
 */
function quickSort(source, dir, keySelector, keyComparer) {
    var i = 0,
        copy = [];

    while (i < source.length) {
        copy[i] = source[i];
        ++i;
    }
    qSort(copy, 0, source.length - 1, dir, keySelector, keyComparer);
    return copy;
}

/**
 * @sig
 * @description d
 * @param {Array} data - a
 * @param {number} left - b
 * @param {number} right - c
 * @param {string} dir - d
 * @param {function} keySelector - f
 * @param {function} keyComparer - g
 * @return {Array} - h
 */
function qSort(data, left, right, dir, keySelector, keyComparer) {
    do {
        var i = left,
            j = right,
            itemIdx = i + (j - i >> 1);

        do {
            while (i < data.length && 0 < keyComparer(keySelector, itemIdx, i, data, dir)) {
                ++i;
            }while (0 <= j && 0 > keyComparer(keySelector, itemIdx, j, data, dir)) {
                --j;
            }if (i > j) break;
            if (i < j) {
                var tmp = data[i];
                data[i] = data[j];
                data[j] = tmp;
            }
            ++i;
            --j;
        } while (i <= j);

        if (j - left <= right - i) {
            if (left < j) qSort(data, left, j, dir, keySelector, keyComparer);
            left = i;
        } else {
            if (i < right) qSort(data, i, right, dir, keySelector, keyComparer);
            right = j;
        }
    } while (left < right);
}

/**
 * @sig
 * @description d
 * @param {Array} source - a
 * @param {function} keySelector - b
 * @param {function} keyComparer - c
 * @param {string} direction - d
 * @return {Array} - e
 */
function insertionSort(source, keySelector, keyComparer, direction) {
    var i = 0,
        cop = [];

    while (i < source.length) {
        cop[i] = source[i];
        ++i;
    }
    iSort(cop, keySelector, keyComparer, direction);
    return cop;
}

/**
 * @sig
 * @description d
 * @param {Array} source - a
 * @param {function} keySelector - b
 * @param {function} keyComparer - c
 * @param {string} direction - d
 * @return {Array} e
 */
function iSort(source, keySelector, keyComparer, direction) {
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
}

exports.sortData = sortData;
exports.quickSort = quickSort;

},{"../helpers":325}],321:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.voidFn = exports.unfoldWith = exports.unfold = exports.unary = exports.tryCatch = exports.ternary = exports.tap = exports.safe = exports.rightApply = exports.repeat = exports.once = exports.not = exports.maybe = exports.leftApply = exports.hyloWith = exports.guard = exports.bindFunction = exports.binary = exports.before = exports.apply = exports.after = undefined;

var _combinators = require('./combinators');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {function} decoration - b
 * @param {*} args - c
 * @return {*} - d
 */
var after = (0, _combinators.curryN)(undefined, 3, function _after(fn, decoration) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
    }

    var ret = fn.apply(undefined, args);
    decoration.apply(undefined, args);
    return ret;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
var apply = function apply(fn) {
    return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return function () {
            return fn.apply(undefined, args);
        };
    };
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {function} decoration - b
 * @param {*} args - c
 * @return {*} - d
 */
var before = (0, _combinators.curryN)(undefined, 3, function _before(fn, decoration) {
    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
    }

    decoration.apply(undefined, args);
    return fn.apply(undefined, args);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {*} args - b
 * @return {function} - c
 */
var binary = function binary(fn) {
    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
    }

    return _combinators.curryN.apply(undefined, [undefined, 2, fn].concat(args));
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {object} context - a
 * @param {function} fn - b
 * @return {function} - c
 */
var bindFunction = (0, _combinators.curry)(function _bindFunction(context, fn) {
    return fn.bind(context);
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
 * @sig
 * @description d
 * @param {function} fns - a
 * @return {function} - b
 */
function guard() {
    for (var _len5 = arguments.length, fns = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        fns[_key5] = arguments[_key5];
    }

    return function waitForArgs() {
        for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
        }

        if (fns.slice(1).every(function _functionRunner(fn) {
            return fn.apply(undefined, args);
        })) return fns[0].apply(fns, args);
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @return {function} - b
 */
var leftApply = function leftApply(fn) {
    return function () {
        return fn.apply(undefined, arguments);
    };
};

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
var maybe = function maybe(fn) {
    return function () {
        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
        }

        return 1 <= args.length && args.every(function _testNull(val) {
            return null != val;
        }) ? fn.call.apply(fn, [undefined].concat(args)) : null;
    };
};

/**
 * @sig not :: () -> !()
 * @description - Returns a function, that, when invoked, will return the
 * result of the inversion of the invocation of the function argument. The
 * returned function is curried to the same arity as the function argument,
 * so it can be partially applied even after being 'wrapped' inside the
 * not function.
 * @param {function} fn - a
 * @return {*} - b
 */
var not = function not(fn) {
    return function () {
        return !fn.apply(undefined, arguments);
    };
};

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @returns {function} - b
 */
function once(fn) {
    var invoked = false;
    return function _once() {
        if (!invoked) {
            invoked = true;
            return fn.apply(undefined, arguments);
        }
        return undefined;
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} num - a
 * @param {function} fn - b
 * @return {*} - c
 */
var repeat = (0, _combinators.curry)(function _repeat(num, fn) {
    return 0 < num ? (_repeat(num - 1, fn), fn(num)) : undefined;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
var rightApply = function rightApply(fn) {
    return function () {
        for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
        }

        return fn.apply(undefined, _toConsumableArray(args.reverse()));
    };
};

//TODO: need to add a try/catch function here, and see about renaming the existing 'safe' function
//TODO: as that seems more along the lines of a try/catch function, rather than a 'maybe' function.
/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function safe(fn) {
    return function _safe() {
        for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
            args[_key9] = arguments[_key9];
        }

        if (!args.length || args.includes(null) || args.includes(undefined)) return;
        return fn.apply(undefined, args);
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} arg - a
 * @param {function} fn - b
 * @return {arg} - c
 */
var tap = (0, _combinators.curry)(function _tap(fn, arg) {
    fn(arg);
    return arg;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @param {*} args - b
 * @return {function} - c
 */
var ternary = function ternary(fn) {
    for (var _len10 = arguments.length, args = Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
        args[_key10 - 1] = arguments[_key10];
    }

    return _combinators.curryN.apply(undefined, [undefined, 3, fn].concat(args));
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} catcher - a
 * @param {function} tryer - b
 * @return {function} - c
 */
var tryCatch = (0, _combinators.curry)(function _tryCatch(catcher, tryer) {
    return (0, _combinators.curryN)(this, tryer.length, function _tryCatch_() {
        for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            args[_key11] = arguments[_key11];
        }

        try {
            return tryer.apply(undefined, args);
        } catch (e) {
            return catcher.apply(undefined, [e].concat(args));
        }
    });
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @param {*} arg - b
 * @return {function} - c
 */
var unary = function unary(fn, arg) {
    return undefined === arg ? (0, _combinators.curryN)(undefined, 1, fn) : fn(arg);
};

/**
 * @sig
 * @description d
 * @param {*} seed - a
 * @return {function} - b
 */
function unfold(seed) {
    return regeneratorRuntime.mark(function _unfold(fn) {
        return regeneratorRuntime.wrap(function _unfold$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _unfold, this);
    });
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function unfoldWith(fn) {
    return regeneratorRuntime.mark(function _unfold(value) {
        var _fn, next, element, done;

        return regeneratorRuntime.wrap(function _unfold$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _fn = fn(value), next = _fn.next, element = _fn.element, done = _fn.done;

                        if (done) {
                            _context2.next = 5;
                            break;
                        }

                        _context2.next = 4;
                        return element;

                    case 4:
                        return _context2.delegateYield(_unfold(next), 't0', 5);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _unfold, this);
    });
}

/**
 * @sig
 * @description d
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
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
var voidFn = function voidFn(fn) {
    return function () {
        return void fn.apply(undefined, arguments);
    };
};

/*
 var c = leftApply(leftApply, rightApply);

 var getWith = c(getWith);
 */

exports.after = after;
exports.apply = apply;
exports.before = before;
exports.binary = binary;
exports.bindFunction = bindFunction;
exports.guard = guard;
exports.hyloWith = hyloWith;
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

},{"./combinators":298}],322:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrap = exports.type = exports.truthy = exports.subtract = exports.strictNotEqual = exports.strictEquals = exports.setSet = exports.set = exports.reverse = exports.or = exports.once = exports.objectSet = exports.nth = exports.noop = exports.notEqual = exports.negate = exports.multiply = exports.modulus = exports.mapSet = exports.lessThanOrEqual = exports.lessThan = exports.isUndefined = exports.isSymbol = exports.isString = exports.isSomething = exports.isNumber = exports.isNull = exports.isNothing = exports.isObject = exports.isFunction = exports.isBoolean = exports.isArray = exports.invoke = exports.inObject = exports.has = exports.greaterThanOrEqual = exports.greaterThan = exports.getWith = exports.flip = exports.falsey = exports.equals = exports.either = exports.divide = exports.delegatesTo = exports.delegatesFrom = exports.defaultPredicate = exports.concat = exports.both = exports.arraySet = exports.and = exports.adjust = exports.add = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _helpers = require('./helpers');

var _combinators = require('./combinators');

/**
 * @sig
 * @description Updates the value stored in a single specified index of an array. The function
 * argument should be some form of a unary projector. The 'projector' function will receive
 * the value stored in the existing array at the specified 'idx' argument location. A new array
 * is returned and the original array remains unchanged.
 * @type {function}
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
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var add = (0, _combinators.curry)(function (x, y) {
  return x + y;
});

/**
 * @sig and :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @type {function}
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var and = (0, _combinators.curry)(function (a, b) {
  return !!(a && b);
});

/**
 * @sig
 * @description Updates the value at a specified index of an array by first creating a shallow copy
 * of the array and then updating its value at the specified index.
 * @type {function}
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
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {boolean} - c
 */
var both = (0, _combinators.curry)(function _both(f, g) {
  return !!(f() && g());
});

/**
 * @sig
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
 * @sig
 * @description d
 * @type {function}
 * @return {boolean} - a
 */
var defaultPredicate = (0, _combinators.constant)(true);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {object} delegate - a
 * @param {object} delegator - b
 * @return {boolean} - c
 */
var delegatesFrom = (0, _combinators.curry)(function (delegate, delegator) {
  return delegate.isPrototypeOf(delegator);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {object} delegator - a
 * @param {object} delegate - b
 * @return {boolean} - c
 */
var delegatesTo = (0, _combinators.curry)(function (delegator, delegate) {
  return delegate.isPrototypeOf(delegator);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var divide = (0, _combinators.curry)(function (x, y) {
  return x / y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {boolean} - c
 */
var either = (0, _combinators.curry)(function _either(f, g) {
  return !!(f() || g());
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var equals = (0, _combinators.curry)(function (x, y) {
  return x == y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @see flip
 * @param {*} x - a
 * @return {boolean} - b
 */
var falsey = flip;

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var flip = function flip(x) {
  return !x;
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {*} - c
 */
var getWith = (0, _combinators.curry)(function (prop, obj) {
  return obj[prop];
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number | string} x - a
 * @param {number | string} y - b
 * @return {boolean} - c
 */
var greaterThan = (0, _combinators.curry)(function (x, y) {
  return x > y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var greaterThanOrEqual = (0, _combinators.curry)(function (x, y) {
  return x >= y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var has = (0, _combinators.curry)(function _has(prop, obj) {
  return obj.hasOwnProperty(prop);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} key - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var inObject = (0, _combinators.curry)(function _inObject(prop, obj) {
  return prop in obj;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
var invoke = function invoke(fn) {
  return fn();
};

/**
 * @sig isArray :: a -> Boolean
 * @description d
 * @param {*} data - a
 * @return {boolean} - b
 */
var isArray = function isArray(data) {
  return Array.isArray(data);
};

/**
 * @sig
 * @description d
 * @param {boolean} bool - a
 * @return {boolean} - b
 */
var isBoolean = function isBoolean(bool) {
  return _helpers.javaScriptTypes.Boolean === type(bool);
};

/**
 * @sig isFunction :: a -> Boolean
 * @description d
 * @param {function} fn - a
 * @return {boolean} - b
 */
var isFunction = function isFunction(fn) {
  return _helpers.javaScriptTypes.Function === type(fn);
};

/**
 * @sig isObject :: a -> Boolean
 * @description d
 * @param {*} item - a
 * @return {boolean} - b
 */
var isObject = function isObject(item) {
  return _helpers.javaScriptTypes.Object === type(item) && null !== item;
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var isNothing = function isNothing(x) {
  return null == x;
};

/**
 * @sig
 * @description d
 * @param {*} n - a
 * @return {string|boolean} - b
 */
var isNull = function isNull(n) {
  return type(n) && null === n;
};

/**
 * @sig
 * @description d
 * @param {number} num - a
 * @return {boolean} - b
 */
var isNumber = function isNumber(num) {
  return _helpers.javaScriptTypes.Number == type(num);
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var isSomething = function isSomething(x) {
  return null != x;
};

/**
 * @sig
 * @description d
 * @param {string} str - a
 * @return {boolean} - b
 */
var isString = function isString(str) {
  return _helpers.javaScriptTypes.String === type(str);
};

/**
 * @sig
 * @description d
 * @param {Symbol} sym - a
 * @return {boolean} - b
 */
var isSymbol = function isSymbol(sym) {
  return _helpers.javaScriptTypes.Symbol === type(sym);
};

/**
 * @sig
 * @description d
 * @param {*} u - a
 * @return {boolean} - b
 */
var isUndefined = function isUndefined(u) {
  return _helpers.javaScriptTypes.Undefined === type(u);
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThan = (0, _combinators.curry)(function (x, y) {
  return x < y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThanOrEqual = (0, _combinators.curry)(function (x, y) {
  return x <= y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} key - a
 * @param {*} val - b
 * @param {Map} map - c
 * @return {Map} - d
 */
var mapSet = (0, _combinators.curry)(function _mapSet(key, val, map) {
  map.set(key, val);
  return map;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var modulus = (0, _combinators.curry)(function (x, y) {
  return x % y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var multiply = (0, _combinators.curry)(function (x, y) {
  return x * y;
});

/**
 * @sig
 * @description d
 * @param {number} x - a
 * @return {number} - b
 */
var negate = function negate(x) {
  return -x;
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} - a
 * @param {*} - b
 * @return {boolean} - c
 */
var notEqual = (0, _combinators.curry)(function (x, y) {
  return x != y;
});

/**
 * @sig
 * @description No-op function; used as default function in some cases when argument is optional
 * and consumer does not provide.
 * @returns {undefined} - a
 */
function noop() {}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} offset - a
 * @param {Array} List - b
 * @return {*} - c
 */
var nth = (0, _combinators.curry)(function nth(offset, list) {
  var idx = 0 > offset ? list.length + offset : offset;
  return 'string' === typeof list ? list.charAt(idx) : list[idx];
});

/**
 * @sig
 * @description d
 * @type {function}
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
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function once(fn) {
  var invoked = false;
  return function _once() {
    if (!invoked) {
      invoked = true;
      fn.apply(undefined, arguments);
    }
  };
}

/**
 * @sig or :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @type {function}
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var or = (0, _combinators.curry)(function (a, b) {
  return !!(a || b);
});

/**
 * @sig
 * @description d
 * @param {Array|String} xs - a
 * @return {Array|String} - b
 */
var reverse = function reverse(xs) {
  return isArray(xs) ? xs.slice(0).reverse() : xs.split('').reverse().join('');
};

/**
 * @sig
 * @description d
 * @type {function}
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
 * @sig
 * @description d
 * @type {function}
 * @param {*} val - a
 * @param {Set} set - b
 * @return {Set} - c
 */
var setSet = (0, _combinators.curry)(function _setSet(val, set) {
  set.add(val);
  return set;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictEquals = (0, _combinators.curry)(function (x, y) {
  return x === y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictNotEqual = (0, _combinators.curry)(function (x, y) {
  return x !== y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var subtract = (0, _combinators.curry)(function (x, y) {
  return x - y;
});

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var truthy = function truthy(x) {
  return flip(falsey(x));
};

/**
 * @sig
 * @description d
 * @param {*} a - a
 * @return {string} - b
 */
var type = function type(a) {
  return typeof a === 'undefined' ? 'undefined' : _typeof(a);
};

/**
 * @sig wrap :: a -> [a]
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

},{"./combinators":298,"./helpers":325}],323:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupFactory = undefined;

var _combinators = require('../combinators');

var _decorators = require('../decorators');

var e = (0, _decorators.binary)((0, _decorators.rightApply)(_combinators.identity));

/**
 * @sig
 * @description Takes a function that can perform the desired type of concatenation and an optional
 * string that describes the type of group that is being created. The 'type' parameter is used in
 * the .toString() functionality only for representing the created group's type. The function returns
 * a new function, that, when invoked, will return a group with the concatenation function originally
 * provided as the means of concatenation. The resulting group adheres to the FantasyLand spec for monoids
 * and in addition allows for inverse concat operations to be performed, thus making the resulting data
 * structure a group, not a semigroup or monoid.
 * @param {function} concatFn - a
 * @param {function} inverseConcatFn - b
 * @param {function} invertFn - c
 * @param {*} identity - d
 * @param {string} type - e
 * @return {group} - f
 */
function groupFactory(concatFn, inverseConcatFn, invertFn, identity, type) {
    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @param {*} prev - b
     * @return {group} - c
     * @private
     */
    function _internalGroupCreator(x, prev) {
        return Object.create(group, {
            _value: {
                value: x,
                writable: false,
                configurable: false
            },
            _prev: {
                value: prev,
                writable: false,
                configurable: false
            },
            concat: {
                value: _concat
            },
            concatAll: {
                value: _concatAll
            },
            inverseConcat: {
                value: _inverseConcat
            },
            inverseConcatAll: {
                value: _inverseConcatAll
            },
            undo: {
                value: _undo
            },
            factory: {
                value: _group
            },
            constructor: {
                value: _group
            },
            isEmpty: {
                value: identity === x,
                writable: false,
                configurable: false
            },
            toString: {
                value: function _toString() {
                    return (type || 'Group') + '(' + toString.call(this) + ')';
                }
            },
            concatFn: {
                get: function _getConcatFn() {
                    return this._concatFn ? this._concatFn.bind(this) : concatFn.bind(this);
                },
                set: function _setConcatFn(fn) {
                    this._concatFn = fn.bind(this);
                }
            },
            inverseConcatFn: {
                get: function _getInverseConcatFn() {
                    return this._inverseConcatFn ? this._inverseConcatFn.bind(this) : inverseConcatFn.bind(this);
                },
                set: function _setInverseConcatFn(fn) {
                    this._inverseConcatFn = fn.bind(this);
                }
            },
            invertFn: {
                value: invertFn,
                writable: true
            }
        });
    }

    /**
     * @sig
     * @description d
     * @param {*} x - The initial value of the new semigroup/monoid
     * @return {group} - a
     */
    function _group(x) {
        return Object.create(group, {
            _value: {
                value: x,
                writable: false,
                configurable: false
            },
            _prev: {
                value: null,
                writable: false,
                configurable: false
            },
            /**
             * @description:
             * @param: {*} other
             * @return: {@see group}
             */
            concat: {
                value: _concat
            },
            /**
             * @description:
             * @param: {Array} others
             * @return: {@see group}
             */
            concatAll: {
                value: _concatAll
            },
            /**
             * @description:
             * @param: {*} other
             * @return: {@see group}
             */
            inverseConcat: {
                value: _inverseConcat
            },
            /**
             * @description:
             * @param: {*, *, ...} others
             * @return: {@see group}
             */
            inverseConcatAll: {
                value: _inverseConcatAll
            },
            /**
             * @description:
             * @return: {@see group}
             */
            undo: {
                value: _undo
            },
            /**
             * @description:
             */
            factory: {
                value: _group
            },
            constructor: {
                value: _group
            },
            /**
             * @description:
             */
            isEmpty: {
                value: identity === x,
                writable: false,
                configurable: false
            },
            /**
             * @description:
             * @return: {string}
             */
            toString: {
                value: function _toString() {
                    return type + '(' + toString.call(this) + ')';
                }
            },
            concatFn: {
                get: function _getConcatFn() {
                    console.log(this._concatFn);
                    return this._concatFn ? this._concatFn.bind(this) : concatFn.bind(this);
                },
                set: function _setConcatFn(fn) {
                    this._concatFn = fn.bind(this);
                }
            },
            inverseConcatFn: {
                get: function _getInverseConcatFn() {
                    return this._inverseConcatFn ? this._inverseConcatFn.bind(this) : inverseConcatFn.bind(this);
                },
                set: function _setInverseConcatFn(fn) {
                    this._inverseConcatFn = fn.bind(this);
                }
            },
            invertFn: {
                value: invertFn,
                writable: true
            }
        });
    }

    /**
     * @sig
     * @description d
     * @return {string} - a
     */
    function toString() {
        return Object.is(-0, this.value) ? '-0' : this.isEmpty ? 'nil' : this.value.toString();
    }

    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @return {group} - b
     * @private
     */
    function _concat(x) {
        if (x.isEmpty || !Object.getPrototypeOf(this).isPrototypeOf(x)) return this;
        return _internalGroupCreator(this.concatFn(this.value, x.value), x.value);
    }

    /**
     * @sig
     * @description d
     * @param {Array} xs - a
     * @return {group} - b
     * @private
     */
    function _concatAll() {
        var _this = this;

        for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
            xs[_key] = arguments[_key];
        }

        return xs.filter(function (x) {
            return !x.isEmpty && _this.factory === x.factory && _this.inverseConcat === x.inverseConcat;
        }, this).reduce(function (curr, next) {
            return _internalGroupCreator(curr.concatFn(curr.value, next.value), next.value);
        }, this);
    }

    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @return {group} - b
     * @private
     */
    function _inverseConcat(x) {
        if (x.isEmpty || !Object.getPrototypeOf(this).isPrototypeOf(x)) return this;
        return _internalGroupCreator(this.inverseConcatFn(this.value, x.value), invertFn(x.value));
    }

    /**
     * @sig
     * @description d
     * @param {Array} xs - a
     * @return {group} - b
     * @private
     */
    function _inverseConcatAll() {
        var _this2 = this;

        for (var _len2 = arguments.length, xs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            xs[_key2] = arguments[_key2];
        }

        return xs.filter(function (x) {
            return !x.isEmpty && Object.getPrototypeOf(_this2).isPrototypeOf(x);
        }, this).reduce(function (curr, next) {
            return _internalGroupCreator(curr.inverseConcatFn(curr.value, next.value), invertFn(next.value));
        }, this);
    }

    /**
     * @sig
     * @description d
     * @return {group} - a
     * @private
     */
    function _undo() {
        if (null != this.previous && identity != this.previous) {
            var invertedPrev = invertFn(this.previous);
            return _internalGroupCreator(this.concatFn(this.value, invertedPrev), invertedPrev);
        }
        return _group(this.value);
    }

    /**
     * @sig
     * @description d
     * @return {group} - a
     */
    _group.identity = function _identity() {
        var g = _group(identity);
        g.concatFn = e;
        return g;
    };

    /**
     * @sig
     * @description d
     * @return {group} - a
     */
    _group.empty = _group.identity;

    /**
     * @sig
     * @description d
     * @return {group} - a
     */
    _group.unit = _group.identity;

    return _group;
}

/**
 * @description
 * @typedef {Object}
 * @property {function} value
 * @property {function} previous
 * @property {function} valueOf
 */
var group = {
    get value() {
        return this._value;
    },
    get previous() {
        return this._prev;
    },
    valueOf: function _valueOf() {
        return this._value;
    }
};

// p1 = { name: first('Nico'), isPaid: all2(true), points: sum(10), friends: ['Franklin'] },
//  p2 = { name: first('Nico'), isPaid: all2(false), points: sum(2), friends: ['Gatsby'] };

function structure(obj) {
    return {
        obj: obj,
        concat: function _concat(other) {
            var newStructure = {};
            Object.getOwnPropertyNames(obj).map(function _map(key) {
                return {
                    key: key,
                    value: null != obj[key].concat(other.obj[key]).x ? obj[key].concat(other.obj[key]).x : obj[key].concat(other.obj[key])
                };
            }).forEach(function _map(item) {
                newStructure[item.key] = item.value;
            });
            return structure(newStructure);
        },
        toString: function _toString() {
            return 'structure(' + obj + ')';
        }
    };
}

exports.groupFactory = groupFactory;

},{"../combinators":298,"../decorators":321}],324:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.xnorGroup = exports.xorGroup = exports.strGroup = exports.multGroup = exports.sumGroup = undefined;

var _group_factory = require('./group_factory');

var xor = function xor(x, y) {
    return !!(x ^ y);
};

var xnor = function xnor(x, y) {
    return x && y || !x && !y;
};

var sumGroup = (0, _group_factory.groupFactory)(function (x, y) {
    return x + y;
}, function (x, y) {
    return x - y;
}, function (x) {
    return -x;
}, 0, 'Sum');

var multGroup = (0, _group_factory.groupFactory)(function (x, y) {
    return x * y;
}, function (x, y) {
    return x * (1 / y);
}, function (x) {
    return 1 / x;
}, 1, 'Multiply');

var strGroup = (0, _group_factory.groupFactory)(function (x, y) {
    return x + y;
}, function (x, y) {
    return x.slice(x.lastIndexOf(y));
}, function (x) {
    return x;
}, '', 'String');

var xorGroup = (0, _group_factory.groupFactory)(xor, function (x, y) {
    return !(x ^ y);
}, function (x) {
    return x;
}, false, 'Xor');

var xnorGroup = (0, _group_factory.groupFactory)(xnor, xnor, function (x) {
    return x;
}, false, 'Xnor');

var allGroup = (0, _group_factory.groupFactory)(_all, function (x) {
    return x;
}, undefined, 'All');

var anyGroup = (0, _group_factory.groupFactory)(function (x, y) {
    return !!(x || y);
}, function (x) {
    return !x;
}, undefined, 'Any');

function _all(x, y) {
    return !!(x && y);
}

var subGroup = (0, _group_factory.groupFactory)(function (x, y) {
    return x - y;
}, function (x) {
    return -x;
}, 0, 'Sub');

var divGroup = (0, _group_factory.groupFactory)(function (x, y) {
    return x / y;
}, function (x) {
    return 1 / x;
}, 1, 'Division');

var firstGroup = (0, _group_factory.groupFactory)(function _firstConcat(y) {
    return firstGroup(this.value);
}, 'First');

exports.sumGroup = sumGroup;
exports.multGroup = multGroup;
exports.strGroup = strGroup;
exports.xorGroup = xorGroup;
exports.xnorGroup = xnorGroup;

},{"./group_factory":323}],325:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @description - Prototype of a generator; used to detect if a function
 * argument is a generator or a regular function.
 * @typedef {Object}
 */
var generatorProto = Object.getPrototypeOf(regeneratorRuntime.mark(function _generator() {
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
 * @typedef {Object}
 * @property {string} Function
 * @property {string} Object
 * @property {string} Boolean
 * @property {string} Number
 * @property {string} Symbol
 * @property {string} String
 * @property {string} Undefined
 */
var javaScriptTypes = {
    Function: 'function',
    Object: 'object',
    Boolean: 'boolean',
    Number: 'number',
    Symbol: 'symbol',
    String: 'string',
    Undefined: 'undefined'
};

var typeName = {
    'boolean': _typeof(true),
    'function': typeof Function === 'undefined' ? 'undefined' : _typeof(Function),
    'number': _typeof(0),
    'object': _typeof({ a: 1 }),
    'string': _typeof(''),
    'symbol': _typeof(Symbol.iterator),
    'undefined': _typeof(void 0)
};

/**
 * @description d
 */
var collectionTypes = {
    'Generator': [generatorProto],
    'Array': [Array.prototype, Int16Array.prototype, Int8Array.prototype, Int32Array.prototype, Float32Array.prototype, Float64Array.prototype, Uint16Array.prototype, Uint32Array.prototype, Uint8Array.prototype, Uint8ClampedArray.prototype],
    'ArrayBuffer': [ArrayBuffer.prototype],
    'Map': [Map.prototype],
    'WeakMap': [WeakMap.prototype],
    'Set': [Set.prototype],
    'WeakSet': [WeakSet.prototype]
};

/**
 * @description d
 */
var observableStatus = {
    inactive: 0,
    active: 1,
    paused: 2,
    complete: 3
};

/**
 * @description d
 */
var sortDirection = {
    ascending: 1,
    descending: 2
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @param {*} y - b
 * @param {string} dir - c
 * @return {number} - d
 */
function sortComparer(x, y, dir) {
    var t = x > y ? 1 : x === y ? 0 : -1;
    return sortDirection.descending === dir ? t : -t;
}

/**
 * @sig
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
 * @sig
 * @description d
 * @param {Generator|Array|Map|Set} collection - a
 * @param {function} comparer - b
 * @return {{contains, getValue}} - c
 */
function genericCacher(collection, comparer) {
    function createCacheChequer() {
        switch (createBitMask.apply(undefined, _toConsumableArray(buildTypeBits(collection)))) {
            case 1:
                collection = Array.from(collection);
            case 2:
                //The collection's type is some kind of an array (@see collectionTypes). We
                //can use the .some and .find to determine if the cache already holds the
                //value we're looking for or return the value respectively.
                return {
                    contains: function _contains(item) {
                        return collection.some(function _checkEquality(it) {
                            return comparer(it, item);
                        });
                    },
                    getValue: function _getValue(value) {
                        return collection.find(function _findKey(key) {
                            return comparer(key, value);
                        });
                    }
                };
                break;
            case 4:
                //TODO: find out if an ArrayBuffer can be interacted with directly at all, and
                //TODO: remove this case if it cannot, or implement this case if it can.
                break;
            case 8: //Map
            case 16: //WeakMap
            case 32: //Set
            case 64:
                //WeakSet
                //Here, the type of the collection is a Map, WeakMap, Set, or WeakSet; we can use
                //the native functionality to find the result of the cache contains the item we
                //are looking for.
                return {
                    contains: function _contains(item) {
                        return collection.values().some(function _checkEquality(it) {
                            return comparer(it, item);
                        });
                    },
                    getValue: function _getValue(value) {
                        return collection.values().find(function _findKey(key) {
                            return comparer(key, value);
                        });
                    }
                };
                break;
            case 128:
                //The collection's type is a generator. We need to turn it into an array
                //and recursively call the 'createCacheChequer' function with the array
                //that was created from the generator.
                collection = Array.from(collection);
                //return createCacheChequer(Array.from(collection));
                break;
            default:
        }
    }

    function buildTypeBits(arrayType) {
        return Object.keys(collectionTypes).map(function _buildBits(key) {
            return collectionTypes[key].some(function _findDelegate(delegate) {
                return delegate.isPrototypeOf(arrayType);
            });
        });
    }

    function createBitMask() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return args.reduce(function _reduce(curr, next, idx) {
            return curr |= next << idx;
        }, args[0]);
    }

    return createCacheChequer();
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @param {function} keyMaker - b
 * @return {function} - c
 */
function memoizer(fn, keyMaker) {
    var lookup = new Map();
    return function _memoized() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        var key = javaScriptTypes.Function === (typeof keyMaker === 'undefined' ? 'undefined' : _typeof(keyMaker)) ? keyMaker.apply(undefined, args) : args;
        return lookup[key] || (lookup[key] = fn.apply(undefined, args));
    };
}

/**
 * @sig
 * @description d
 * @param {*} obj - a
 * @return {*} - b
 */
function deepClone(obj) {
    var uniqueObjects = new Set();

    return objectCloner(obj);

    /**
     * @sig
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
 * @sig
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
 * @sig
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
 * @sig
 * @description d
 * @param {object} obj - a
 * @return {object} - b
 */
function shallowClone(obj) {
    var clone = {};
    for (var p in obj) {
        clone[p] = obj[p];
    }
    return clone;
}

var emptyObject = {};

/**
 * @sig
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
exports.typeName = typeName;

},{}],326:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unifiedLens = exports.lensPath = exports.makeLenses = exports.prismPath = exports.lens = exports.set = exports.put = exports.over = exports.view = exports.objectLens = exports.arrayLens = undefined;

var _functionalHelpers = require('./functionalHelpers');

var _combinators = require('./combinators');

var _helpers = require('./helpers');

var _maybe_monad = require('./containers/monads/maybe_monad');

var _identity_monad = require('./containers/monads/identity_monad');

var _constant_monad = require('./containers/monads/constant_monad');

var _pointlessContainers = require('./pointlessContainers');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} idx - a
 * @param {function} f - b
 * @param {Array} xs - c
 * @return {Array} - c
 */
var arrayLens = (0, _combinators.curry)(function _arrayLens(idx, f, xs) {
    return (0, _pointlessContainers.mapWith)(function _mapWith(val) {
        return (0, _functionalHelpers.arraySet)(idx, val, xs);
    }, f(xs[idx]));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {function} f - b
 * @param {Object} xs - c
 * @return {Object} - c
 */
var objectLens = (0, _combinators.curry)(function _objectLens(prop, f, xs) {
    return (0, _pointlessContainers.mapWith)(function _map(rep) {
        return (0, _functionalHelpers.objectSet)(prop, rep, xs);
    }, f(xs[prop]));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {function} f - b
 * @param {Array|Object} xs - c
 * @return {*} - d
 */
var unifiedLens = (0, _combinators.curry)(function _unifiedLens(prop, f, xs) {
    return (0, _pointlessContainers.mapWith)(function _mapWith(value) {
        if (Array.isArray(xs)) return (0, _functionalHelpers.arraySet)(prop, value, xs);else if (Set.prototype.isPrototypeOf(xs)) return (0, _functionalHelpers.mapSet)(prop, value, xs);
        return (0, _functionalHelpers.objectSet)(prop, value, xs);
    }, f(xs[prop]));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} lens - a
 * @param {Object} target - b
 * @return {*} - c
 */
var view = (0, _combinators.curry)(function _view(lens, target) {
    return lens(_constant_monad.Constant)(target).value;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} lens - a
 * @param {function} mapFn - b
 * @param {Object} target - c
 * @return {*} - d
 */
var over = (0, _combinators.curry)(function _over(lens, mapFn, target) {
    return lens(function _lens(y) {
        return (0, _identity_monad.Identity)(mapFn(y));
    })(target).value;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} lens - a
 * @param {*} val - b
 * @param {*} target - c
 * @return {*} - d
 */
var put = (0, _combinators.curry)(function _put(lens, val, target) {
    return over(lens, (0, _combinators.kestrel)(val), target);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} lens - a
 * @param {*} val - b
 * @param {Object} targetData - c
 * @return {*} - c
 */
var set = (0, _combinators.curry)(function (lens, val, targetData) {
    return over(lens, (0, _combinators.kestrel)(val), targetData);
});

/**
 * @sig
 * @description d
 * @param {Array} paths - a
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
 * @sig
 * @description d
 * @param {Array} paths - a
 * @return {function} - b
 */
function improvedLensPath() {
    var innerLensDef = (0, _combinators.curry)(function _innerLensDef(prop, fn, xs) {
        return (0, _pointlessContainers.mapWith)(function _map(rep) {
            return (0, _functionalHelpers.objectSet)(prop, rep, xs);
        }, fn(xs[prop]));
    });

    for (var _len2 = arguments.length, paths = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        paths[_key2] = arguments[_key2];
    }

    return _combinators.compose.apply(undefined, _toConsumableArray(paths.map(function _pathsMap(p) {
        innerLensDef(p);
    })));
}

/**
 * @sig
 * @description d
 * @param {Array} path - a
 * @return {*} - b
 */
function lensPath() {
    for (var _len3 = arguments.length, path = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        path[_key3] = arguments[_key3];
    }

    return _combinators.compose.apply(undefined, _toConsumableArray(path.map(function _pathMap(p) {
        return 'string' === typeof p ? objectLens(p) : arrayLens(p);
    })));
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {Array|String} path - a
 * @param {Object} obj - b
 * @return {*} - c
 */
var prismPath = (0, _combinators.curry)(function _prismPath(path, obj) {
    path = (0, _combinators.when)(not(_functionalHelpers.isArray), split('.'), path);
    var val = obj,
        idx = 0;
    while (idx < path.length) {
        if (null == val) return _maybe_monad.Maybe.Nothing();
        val = val[path[idx]];
        ++idx;
    }
    return (0, _maybe_monad.Maybe)(val);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} getter - a
 * @param {function} setter - b
 * @param {String} key - c
 * @param {function} f - d
 * @param {Array} xs - e
 * @return {*} - f
 */
var lens = (0, _combinators.curry)(function _lens(getter, setter, key, f, xs) {
    return (0, _pointlessContainers.mapWith)(function (replace) {
        return setter(key, replace, xs);
    }, f(getter(key, xs)));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} getter - a
 * @param {function} setter - b
 * @param {String} key - c
 * @param {function} f - d
 * @param {Array} xs - e
 * @param {*} - f
 * @return {*} - g
 */
var prism = (0, _combinators.curry)(function _prism(getter, setter, key, f, xs) {
    return (0, _pointlessContainers.mapWith)(function (replace) {
        return setter(key, replace, xs);
    }, (0, _maybe_monad.Maybe)(f(getter(key, xs))));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {String} delimiter - a
 * @param {String} string - b
 * @return {Array} - c
 */
var split = (0, _combinators.curry)(function _split(delimiter, string) {
    return string.split(delimiter);
});

exports.arrayLens = arrayLens;
exports.objectLens = objectLens;
exports.view = view;
exports.over = over;
exports.put = put;
exports.set = set;
exports.lens = lens;
exports.prismPath = prismPath;
exports.makeLenses = makeLenses;
exports.lensPath = lensPath;
exports.unifiedLens = unifiedLens;

},{"./combinators":298,"./containers/monads/constant_monad":311,"./containers/monads/identity_monad":314,"./containers/monads/maybe_monad":317,"./functionalHelpers":322,"./helpers":325,"./pointlessContainers":327}],327:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.except = exports.intersect = exports.filter = exports.mcompose = exports.bind = exports.chain = exports.containerIterator = exports.toContainerType = exports.pluckWith = exports.mjoin = exports.liftN = exports.lift4 = exports.lift3 = exports.lift2 = exports.flatMapWith = exports.flatMap = exports.mapWith = exports.map = exports.fmap = exports.ap = exports.apply = undefined;

var _combinators = require('./combinators');

var _functionalHelpers = require('./functionalHelpers');

//TODO: I need to figure out how to structure this lib. I'd like to have several different types of containers...
//TODO: ...specifically, functors (pointed), monads, and maybe one other type. In addition, each container type
//TODO: would have several implementations: maybe, option, constant, identity, future_functor, io, etc. It would make sense
//TODO: to let the "higher" level containers delegate to the "lower" level implementations since they share all the
//TODO: functionality of the "lower" containers and add to them. In addition, a lot of the containers will have the
//TODO: same mapWith, flatMapWith, chain, apply, etc functionality; it would be nice to share this functionality as well.
//TODO: Finally, I'd like to have each container in a category be capable of converting their underlying value to
//TODO: another container of the same category without the use of 'apply', more in the manner of 'toContainerX'.
//TODO: However, this means that each container in a given category has a dependency on all the other containers in
//TODO: the same category. This, more than the rest, makes structuring this lib difficult. I'd like to, at the very
//TODO: least, split each container category up so that they can be imported (and preferably downloaded) individually.
//TODO: But the more separation between containers, the more they have to 'import' each other.

/**
 * @sig
 * @description d
 * @type {function}
 * @param {Object} ma - a
 * @param {Object} mb - b
 * @return {Object} - c
 */
var apply = (0, _combinators.curry)(function _apply(ma, mb) {
    return mb.apply(ma);
});

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @param {Object} mb - b
 * @return {Object} - c
 */
var ap = apply;

/**
 * @sig
 * @description d
 * @type {function}
 * @param {Object} m - a
 * @param {function} fn :: (a) -> Monad b - b
 * @return {Object} - c
 */
var flatMap = (0, _combinators.curry)(function _flatMap(m, fn) {
    return m.flatMap(fn);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {Object} - c
 */
var flatMapWith = (0, _combinators.curry)(function _flatMapWith(fn, m) {
    return m.flatMap(fn);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {Object} m - a
 * @param {function} fn :: (a) -> b
 * @return {Object} - b
 */
var map = (0, _combinators.curry)(function _map(m, fn) {
    return m.map(fn);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {Object} - c
 */
var mapWith = (0, _combinators.curry)(function _map(fn, m) {
    return m.map(fn);
});

/**
 * @sig
 * @description d
 */
var pluckWith = (0, _combinators.compose)(mapWith, _functionalHelpers.getWith);

/**
 * @sig
 * @description d
 * @type {function}
 * @see mapWith
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {*} c
 */
var fmap = mapWith;

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {Object} m - b
 * @return {*} - c
 */
var chain = (0, _combinators.curry)(function _chain(f, m) {
    return m.map(f).join(); // or compose(join, mapWith(f))(m)
});

/**
 * @sig
 * @description d
 */
var bind = chain;

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @param {function} g - b
 * @return {function} - c
 */
var mcompose = function _mcompose(f, g) {
    return (0, _combinators.compose)(chain(f), g);
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} val - a
 * @param {Object} fa - b
 * @return {Object} - c
 */
var put = (0, _combinators.curry)(function _put(val, fa) {
    return fa.put(val);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {Object} m1 - b
 * @param {Object} m2 - c
 * @return {Object} - c
 */
var lift2 = (0, _combinators.curry)(function _lift2(f, m1, m2) {
    return m1.map(f).apply(m2);
});

/**
 * @sig
 * @description d
 * @type {function}
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
 * @sig
 * @description d
 * @type {function}
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
 * @sig
 * @description d
 * @type {function}
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
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function mjoin(ma) {
    return ma.join();
}

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
function toContainerType(type) {
    return function toType() {
        var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _combinators.identity;

        return type.of(fn(this.value));
    };
}

/**
 * @sig
 * @description d
 * @return {Object} - a
 */
function containerIterator() {
    var first = true,
        val = this.value;
    return {
        next: function _next() {
            if (first) {
                first = false;
                return {
                    done: false,
                    value: val
                };
            }
            return {
                done: true
            };
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toList(ma) {
    return List(mjoin(ma));
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toMaybe(ma) {}
//return Maybe(mjoin(ma));


/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toFuture(ma) {}
//return Future(mjoin(ma));


/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toIdentity(ma) {}
//return Identity(mjoin(ma));


/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toJust(ma) {}
//return Just(mjoin(ma));


//===========================================================================================//
//===========================================================================================//
//=======================           CONTAINER TRANSFORMERS            =======================//
//===========================================================================================//
//===========================================================================================//

function _toIdentity() {
    //return Identity.from(this.value);
}

function _toJust() {
    //return Just.from(this.value);
}

function _toList() {
    //return List.from(this.value);
}

function _toMaybe() {}
//return Maybe.from(this.value);


//===========================================================================================//
//===========================================================================================//
//============================           LIST HELPERS            ============================//
//===========================================================================================//
//===========================================================================================//

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} predicate - a
 * @param {Array} xs - b
 * @return {Array} - c
 */
var filter = (0, _combinators.curry)(function _filter(predicate, xs) {
    xs.filter(predicate);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {Array} xs - a
 * @param {function} comparer - b
 * @param {Array} ys - c
 * @return {Array} - d
 */
var intersect = (0, _combinators.curry)(function _intersect(xs, comparer, ys) {
    return ys.intersect(xs, comparer);
});

/**
 * @sig
 * @description d
 * @param {Array} xs - a
 * @param {function} comparer - b
 * @param {Array} - c
 * @return {*} - d
 */
var except = (0, _combinators.curry)(function _except(xs, comparer, ys) {
    return ys.except(xs, comparer);
});

exports.apply = apply;
exports.ap = ap;
exports.fmap = fmap;
exports.map = map;
exports.mapWith = mapWith;
exports.flatMap = flatMap;
exports.flatMapWith = flatMapWith;
exports.lift2 = lift2;
exports.lift3 = lift3;
exports.lift4 = lift4;
exports.liftN = liftN;
exports.mjoin = mjoin;
exports.pluckWith = pluckWith;
exports.toContainerType = toContainerType;
exports.containerIterator = containerIterator;
exports.chain = chain;
exports.bind = bind;
exports.mcompose = mcompose;
exports.filter = filter;
exports.intersect = intersect;
exports.except = except;

},{"./combinators":298,"./functionalHelpers":322}],328:[function(require,module,exports){
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
        if (_operators.mapOperator.isPrototypeOf(this.operator)) return this.lift.call(this.source, Object.create(_operators.mapOperator).init((0, _combinators.compose)(fn, this.operator.transform)));
        return this.lift(Object.create(_operators.mapOperator).init(fn));
    },
    /**
     * @sig
     * @description d
     * @param {function} fn - a
     * @return {observable} - b
     */
    chain: function _deepMap(fn) {
        return this.lift(Object.create(_operators.chainOperator).init(fn));
    },
    /**
     * @sig
     * @description d
     * @param {function} predicate - a
     * @return {observable} - b
     */
    filter: function _filter(predicate) {
        if (_operators.filterOperator.isPrototypeOf(this.operator)) return this.lift.call(this.source, Object.create(_operators.filterOperator).init((0, _functionalHelpers.and)(predicate, this.operator.predicate)));
        return this.lift(Object.create(_operators.filterOperator).init(predicate));
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

        if (_operators.mergeOperator.isPrototypeOf(this.operator)) return this.lift.call(this.source, Object.create(_operators.mergeOperator).init([this].concat(observables, this.operator.observables)));
        return this.lift(Object.create(_operators.mergeOperator).init([this].concat(observables)));
    },
    /**
     * @sig
     * @description d
     * @param {Number} count - a
     * @return {observable} - b
     */
    itemBuffer: function _itemBuffer(count) {
        return this.lift(Object.create(_operators.itemBufferOperator).init(count));
    },
    /**
     * @sig
     * @description d
     * @param {Number} amt - a
     * @return {observable} - b
     */
    timeBuffer: function _timeBuffer(amt) {
        return this.lift(Object.create(_operators.timeBufferOperator).init(amt));
    },
    /**
     * @sig
     * @description d
     * @param {Number} amt - a
     * @return {*|observable} - b
     */
    debounce: function _debounce(amt) {
        return this.lift(Object.create(_operators.debounceOperator).init(amt));
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

exports.observable = observable;

},{"../combinators":298,"../functionalHelpers":322,"../helpers":325,"./streamOperators/operators":336,"./subscribers/subscriber":345}],329:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainOperator = undefined;

var _chainSubscriber = require('../subscribers/chainSubscriber');

var chainOperator = {
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
        return source.subscribe(Object.create(_chainSubscriber.chainSubscriber).init(subscriber, this.transform));
    }
};

exports.chainOperator = chainOperator;

},{"../subscribers/chainSubscriber":338}],330:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounceOperator = undefined;

var _debounceSubscriber = require('../subscribers/debounceSubscriber');

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

},{"../subscribers/debounceSubscriber":339}],331:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filterOperator = undefined;

var _filterSubscriber = require('../subscribers/filterSubscriber');

var filterOperator = {
    get predicate() {
        return this._predicate;
    },
    set predicate(fn) {
        this._predicate = fn;
    },
    init: function _init(predicate) {
        this.predicate = predicate;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_filterSubscriber.filterSubscriber).init(subscriber, this.predicate));
    }
};

exports.filterOperator = filterOperator;

},{"../subscribers/filterSubscriber":340}],332:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupByOperator = undefined;

var _groupBySubscriber = require('../subscribers/groupBySubscriber');

var groupByOperator = {
    get keySelector() {
        return this._keySelector;
    },
    set keySelector(ks) {
        this._keySelector = ks;
    },
    get comparer() {
        return this._comparer;
    },
    set comparer(c) {
        this._comparer = c;
    },
    get bufferAmount() {
        return this._bufferAmount || 0;
    },
    set bufferAmount(amt) {
        this._bufferAmount = amt;
    },
    init: function _init(keySelector, comparer, bufferAmount) {
        this.keySelector = keySelector;
        this.comparer = comparer;
        this.bufferAmount = bufferAmount;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_groupBySubscriber.groupBySubscriber).init(subscriber, this.keySelector, this.comparer, this.bufferAmount));
    }
};

exports.groupByOperator = groupByOperator;

},{"../subscribers/groupBySubscriber":341}],333:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.itemBufferOperator = undefined;

var _itemBufferSubscriber = require('../subscribers/itemBufferSubscriber');

var itemBufferOperator = {
    init: function _init(amt) {
        this.count = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_itemBufferSubscriber.itemBufferSubscriber).init(subscriber, this.count));
    }
};

exports.itemBufferOperator = itemBufferOperator;

},{"../subscribers/itemBufferSubscriber":342}],334:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapOperator = undefined;

var _mapSubscriber = require('../subscribers/mapSubscriber');

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
        return source.subscribe(Object.create(_mapSubscriber.mapSubscriber).init(subscriber, this.transform));
    }
};

exports.mapOperator = mapOperator;

},{"../subscribers/mapSubscriber":343}],335:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeOperator = undefined;

var _mergeSubscriber = require('../subscribers/mergeSubscriber');

var mergeOperator = {
    get observables() {
        return this._observables || [];
    },
    set observables(arr) {
        this._observables = arr;
    },
    init: function _init(observables) {
        this.observables = observables;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_mergeSubscriber.mergeSubscriber).init(subscriber, this.observables));
    }
};

exports.mergeOperator = mergeOperator;

},{"../subscribers/mergeSubscriber":344}],336:[function(require,module,exports){
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

},{"./chainOperator":329,"./debounceOperator":330,"./filterOperator":331,"./groupByOperator":332,"./itemBufferOperator":333,"./mapOperator":334,"./mergeOperator":335,"./timeBufferOperator":337}],337:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timeBufferOperator = undefined;

var _timeBufferSubscriber = require('../subscribers/timeBufferSubscriber');

var timeBufferOperator = {
    init: function _init(amt) {
        this.interval = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_timeBufferSubscriber.timeBufferSubscriber).init(subscriber, this.interval));
    }
};

exports.timeBufferOperator = timeBufferOperator;

},{"../subscribers/timeBufferSubscriber":346}],338:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainSubscriber = undefined;

var _subscriber = require('./subscriber');

var chainSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            var mappedResult;
            try {
                mappedResult = recursiveMap(item);
            } catch (err) {
                this.subscriber.error(err);
                return;
            }
            this.subscriber.next(mappedResult);
            //Promise.resolve(mappedResult).then(this.then);

            function recursiveMap(item) {
                if (isArray(item)) {
                    var res = [];
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = item[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var it = _step.value;

                            res = res.concat(recursiveMap(it));
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

                    return res;
                }
                return this.transform(item, this.count++);
            }
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

},{"./subscriber":345}],339:[function(require,module,exports){
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

},{"../../helpers":325,"./subscriber":345}],340:[function(require,module,exports){
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

},{"./subscriber":345}],341:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupBySubscriber = undefined;

var _subscriber = require('./subscriber');

var _sortHelpers = require('../../containers/sortHelpers');

var groupBySubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            if (this.buffer.length + 1 >= this.bufferAmount) {
                try {
                    var res = groupData(this.buffer, [{ keySelector: this.keySelector, comparer: this.comparer, direction: 'desc' }]);
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
        value: function _init(subscriber, keySelector, comparer, bufferAmount) {
            this.initialize(subscriber);
            this.keySelector = keySelector;
            this.comparer = comparer;
            this.bufferAmount = bufferAmount;
            this.buffer = [];
            return this;
        },
        writable: false,
        configurable: false
    }
});

function groupData(data, groupObject) {
    var sortedData = (0, _sortHelpers.sortData)(data, groupObject),
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

},{"../../containers/sortHelpers":320,"./subscriber":345}],342:[function(require,module,exports){
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

},{"./subscriber":345}],343:[function(require,module,exports){
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

},{"./subscriber":345}],344:[function(require,module,exports){
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

exports.mergeSubscriber = mergeSubscriber;

},{"./subscriber":345}],345:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subscriber = undefined;

var _helpers = require('../../helpers');

/**
 * @type {
 *  {
 *      status, status,
 *      count, count,
 *      removeSubscriber: subscriber._removeSubscriber,
 *      removeSubscription: subscriber._removeSubscription,
 *      removeSubscriptions: subscriber._removeSubscriptions,
 *      next: subscriber._next,
 *      error: subscriber._error,
 *      complete: subscriber._complete,
 *      initialize: subscriber._initialize,
 *      onError: subscriber._onError,
 *      onComplete: subscriber._onComplete,
 *      unsubscribe: subscriber._unsubscribe
 *    }
 *  }
 *  @description:
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
            next.subscriptions = next.subscriptions ? next.subscriptions.concat(this) : [].concat(this);
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

},{"../../helpers":325}],346:[function(require,module,exports){
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
                    //the map is needed here because, due to the asychronous nature of subscribers and the subsequent
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

},{"./subscriber":345}],347:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.taking = exports.dropping = exports.reduce = exports.transduce = exports.mapped = exports.filterReducer = exports.mapReducer = exports.filtering = exports.mapping = undefined;

var _combinators = require('./combinators');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @return {*} - b
 */
var mapping = (0, _combinators.curry)(function _mapping(mapFn, reduceFn, result, input) {
    return reduceFn(result, mapFn(input));
});

/**
 * @sig
 * @description d
 * @type {function}
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
 * @sig
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
 * @sig
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
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {*} x - b
 * @return {*} - c
 */
var mapped = (0, _combinators.curry)(function _mapped(f, x) {
    return identity(map((0, _combinators.compose)(function _mCompose(x) {
        return x.value;
    }, f), x));
});

/**
 * @sig
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
 * @sig
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
 * @sig
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
 * @sig
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

},{"./combinators":298}]},{},[1]);
