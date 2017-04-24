var javaScriptTypes = {
    'function': 'function',
    'object': 'object',
    'boolean': 'boolean',
    'number': 'number',
    'symbol': 'symbol',
    'string': 'string',
    'undefined': 'undefined'
};

var observableStatus = {
    inactive: 0,
    active: 1,
    paused: 2,
    complete: 3
};

var sortDirection = {
    Ascending: 1,
    Descending: 2
};

function sortComparer(keySelector, idx1, idx2, val1, source, dir) {
    var val2 = keySelector(source[idx2]);
    var c = val1 > val2 ? 1 : val1 === val2 ? idx1 - idx2 : -1;
    return dir === sortDirection.Ascending ? c : -c;
}

function defaultEqualityComparer(a, b) {
    return a === b;
}

function defaultGreaterThanComparer(a, b) {
    return a > b;
}

function defaultPredicate() {
    return true;
}

var generatorProto = Object.getPrototypeOf(function *_generator(){});

//TODO: this will have to be changed as the false value could be a legit value for a collection...
//TODO:... I'm thinking reusing the 'flag' object to indicate the end of the list for the .next functions
//TODO: should be reusable here to indicate a 'false' value
function memoizer(comparer) {
    comparer = comparer || defaultEqualityComparer;
    //TODO: need to make another change here... ideally, no queryable function should ever pass an undefined value to
    //TODO: the memoizer, but I don't want to depend on that. The problem here is that, if the defaultEqualityComparer is
    //TODO: not used, then an exception could well be thrown if the comparer tries to access a property on or invoke the
    //TODO: undefined value that the memoizer's array is initialized with. Likely the best approach is to examine the item
    //TODO to be memoized, and if it is undefined, then just return true
    var items = [];    //initialize the array with an undefined value as we don't accept that as a legit value for the comparator
    return function _memoizeThis(item) {
        if (undefined === item || items.some(function _checkEquality(it) { return comparer(it, item); })) {
            return true;
        }
        items[items.length] = item;
        return false;
    };
}

function newMemoizer(fn, comparer = defaultEqualityComparer) {
    var items = [];

    return function _memoizedFunc(...args) {
        if (!args.length || items.some(function _checkEquality(it) {
            return comparer(it, args);
            }))
            return true;
        items[items.length] = args;
        return fn(...args);
    }
}

function deepClone(obj) {
    if (null == obj || javaScriptTypes.object !== typeof obj)
        return obj;

    if (Array.isArray(obj))
        return deepCopy(obj);

    var temp = {};
    Object.keys(obj).forEach(function _cloneGridData(field) {
        temp[field] = deepClone(obj[field]);
    });
    return temp;
}

function deepCopy(arr) {
    var length = arr.length,
        newArr = new arr.constructor(length),
        index = -1;
    while (++index < length) {
        newArr[index] = deepClone(arr[index]);
    }
    return newArr;
}

function shallowClone(obj) {
    var clone = {};
    for (var p in obj) {
        clone[p] = obj[p];
    }
    return clone;
}

function alterFunctionLength(fn, len) {
    return Object.defineProperty(
        fn,
        'length', {
            value: len
        }
    );
}

export { javaScriptTypes, sortDirection, observableStatus, sortComparer, defaultEqualityComparer, defaultGreaterThanComparer, defaultPredicate, memoizer,
    deepClone, deepCopy, shallowClone, generatorProto, alterFunctionLength };
