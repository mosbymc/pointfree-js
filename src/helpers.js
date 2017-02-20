var functionTypes = {
    atomic: 'atomic',
    collective: 'collective',
    initiatory: 'initiatory',
    collation: 'collation',
    evaluation: 'evaluation',
    limitation: 'limitation',
    projection: 'projection'
};

var operationTypes = {
    atomic: 'atomic',
    collective: 'collective',
    initiatory: 'initiatory'
};

var javaScriptTypes = {
    'function': 'function',
    'object': 'object',
    'boolean': 'boolean',
    'number': 'number',
    'symbol': 'symbol',
    'string': 'string',
    'undefined': 'undefined'
};

var javaScriptPrimitiveTypes = {
    'undefined': javaScriptTypes.undefined,
    'number': javaScriptTypes.number,
    'string': javaScriptTypes.string,
    'boolean': javaScriptTypes.boolean,
    'symbol': javaScriptTypes.symbol
};

var comparisons = {
    strictEquality: 'eq',
    looseEquality: '==',
    strictInequality: 'neq',
    looseInequality: '!=',
    greaterThanOrEqual: 'gte',
    greaterThan: 'gt',
    lessThanOrEqual: 'lte',
    lessThan: 'lt',
    falsey: 'falsey',
    truthy: 'truthy',
    contains: 'ct',
    doesNotContain: 'nct',
    startsWith: 'startsWith',
    endsWith: 'endsWith'
};

var dataTypes = {
    number: '^-?(?:[1-9]{1}[0-9]{0,2}(?:,[0-9]{3})*(?:\\.[0-9]+)?|[1-9]{1}[0-9]{0,}(?:\\.[0-9]+)?|0(?:\\.[0-9]+)?|(?:\\.[0-9]+)?)$',
    numberChar: '[\\d,\\.-]',
    integer: '^\\-?\\d+$',
    time: '^(0?[1-9]|1[012])(?:(?:(:|\\.)([0-5]\\d))(?:\\2([0-5]\\d))?)?(?:(\\ [AP]M))$|^([01]?\\d|2[0-3])(?:(?:(:|\\.)([0-5]\\d))(?:\\7([0-5]\\d))?)$',
    timeChar: '[\\d\\.:\\ AMP]',
    date: '^(?:(?:(?:(?:(?:(?:(?:(0?[13578]|1[02])(\\/|-|\\.)(31))\\2|(?:(0?[1,3-9]|1[0-2])(\\/|-|\\.)(29|30)\\5))|(?:(?:(?:(?:(31)(\\/|-|\\.)(0?[13578]|1[02])\\8)|(?:(29|30)(\\/|-|\\.)' +
    '(0?[1,3-9]|1[0-2])\\11)))))((?:1[6-9]|[2-9]\\d)?\\d{2})|(?:(?:(?:(0?2)(\\/|-|\\.)(29)\\15)|(?:(29)(\\/|-|\\.)(0?2))\\18)((?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])' +
    '|(?:(?:16|[2468][048]|[3579][26])00))))|(?:(?:((?:0?[1-9])|(?:1[0-2]))(\\/|-|\\.)(0?[1-9]|1\\d|2[0-8]))\\22|(0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)((?:0?[1-9])|(?:1[0-2]))\\25)((?:1[6-9]|[2-9]\\d)?\\d{2}))))' +
    '|(?:(?:((?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\\/|-|\\.)(?:(?:(?:(0?2)(?:\\29)(29))))|((?:1[6-9]|[2-9]\\d)?\\d{2})(\\/|-|\\.)' +
    '(?:(?:(?:(0?[13578]|1[02])\\33(31))|(?:(0?[1,3-9]|1[0-2])\\33(29|30)))|((?:0?[1-9])|(?:1[0-2]))\\33(0?[1-9]|1\\d|2[0-8]))))$',
    datetime: '^(((?:(?:(?:(?:(?:(?:(?:(0?[13578]|1[02])(\\/|-|\\.)(31))\\4|(?:(0?[1,3-9]|1[0-2])(\\/|-|\\.)(29|30)\\7))|(?:(?:(?:(?:(31)(\\/|-|\\.)(0?[13578]|1[02])\\10)|(?:(29|30)(\\/|-|\\.)' +
    '(0?[1,3-9]|1[0-2])\\13)))))((?:1[6-9]|[2-9]\\d)?\\d{2})|(?:(?:(?:(0?2)(\\/|-|\\.)(29)\\17)|(?:(29)(\\/|-|\\.)(0?2))\\20)((?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])' +
    '|(?:(?:16|[2468][048]|[3579][26])00))))|(?:(?:((?:0?[1-9])|(?:1[0-2]))(\\/|-|\\.)(0?[1-9]|1\\d|2[0-8]))\\24|(0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)((?:0?[1-9])|(?:1[0-2]))\\27)' +
    '((?:1[6-9]|[2-9]\\d)?\\d{2}))))|(?:(?:((?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\\/|-|\\.)(?:(?:(?:(0?2)(?:\\31)(29))))' +
    '|((?:1[6-9]|[2-9]\\d)?\\d{2})(\\/|-|\\.)(?:(?:(?:(0?[13578]|1[02])\\35(31))|(?:(0?[1,3-9]|1[0-2])\\35(29|30)))|((?:0?[1-9])|(?:1[0-2]))\\35(0?[1-9]|1\\d|2[0-8])))))' +
    '(?: |T)((0?[1-9]|1[012])(?:(?:(:|\\.)([0-5]\\d))(?:\\44([0-5]\\d))?)?(?:(\\ [AP]M))$|([01]?\\d|2[0-3])(?:(?:(:|\\.)([0-5]\\d))(?:\\49([0-5]\\d))?)$))',
    dateChar: '\\d|\\-|\\/|\\.',
    dateTimeChar: '[\\d\\.:\\sAMP\\-\\/]'
};

var emptyObj = Object.create(null);

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

function memoizer() {
    var cache = new Set();
    return function memoizeForMeWillYa(item) {
        if (!cache.has(item)) {
            cache.add(item);
            return false;
        }
        return true;
    };
}

//TODO: this will have to be changed as the false value could be a legit value for a collection...
//TODO:... I'm thinking reusing the 'flag' object to indicate the end of the list for the .next functions
//TODO: should be reusable here to indicate a 'false' value
function memoizer2(comparer) {
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

function comparator(type, val, base) {
    switch (type) {
        case 'eq':
        case '===':
            return val === base;
        case '==':
            return val == base;
        case 'neq':
        case '!==':
            return val !== base;
        case '!=':
            return val != base;
        case 'gte':
        case '>=':
            return val >= base;
        case 'gt':
        case '>':
            return val > base;
        case 'lte':
        case '<=':
            return val <= base;
        case 'lt':
        case '<':
            return val < base;
        case 'not':
        case '!':
        case 'falsey':
            return !val;
        case 'truthy':
            return !!val;
        case 'ct':
            return !!~val.toString().toLowerCase().indexOf(base.toString().toLowerCase());
        case 'nct':
            return !~val.toString().toLowerCase().indexOf(base.toString().toLowerCase());
        case 'startsWith':
            return val.toString().substring(0, base.toString().length) === base.toString();
        case 'endsWith':
            return val.toString().substring((val.length - base.toString().length), val.length) === base.toString();
    }
}

function dataTypeValueNormalizer(dataType, val) {
    if (val == null) return val;
    switch(dataType) {
        case 'time':
            var value = getNumbersFromTime(val);
            if (val.indexOf('PM') > -1) value[0] += 12;
            return convertTimeArrayToSeconds(value);
        case 'datetime':
            let dateTimeRegex = new RegExp(dataTypes.datetime),
                execVal1;
            if (dateTimeRegex.test(val)) {
                execVal1 = dateTimeRegex.exec(val);

                var dateComp1 = execVal1[2],
                    timeComp1 = execVal1[42];
                timeComp1 = getNumbersFromTime(timeComp1);
                if (timeComp1[3] && timeComp1[3] === 'PM')
                    timeComp1[0] += 12;
                let month = execVal1[23] || execVal1[28],
                    day = execVal1[25] || execVal1[26],
                    year = execVal1[29];
                dateComp1 = new Date(year, month, day);
                return dateComp1.getTime() + convertTimeArrayToSeconds(timeComp1);
            }
            else return 0;
        case 'number':
            return parseFloat(val);
        case 'date':
            let dateRegex = new RegExp(dataTypes.date),
                execVal;
            if (dateRegex.test(val)) {
                execVal = dateRegex.exec(val);
                let day = execVal[23] || execVal[24],
                    month = execVal[21] || execVal[26],
                    year = execVal[27];
                return new Date(year, month, day);
            }
            return new Date();
        case 'boolean':
        default:
            return val.toString();
    }
}

function getNumbersFromTime(val) {
    var re = new RegExp("^(0?[1-9]|1[012])(?:(?:(:|\\.)([0-5]\\d))(?:\\2([0-5]\\d))?)?(?:(\\ [AP]M))$|^([01]?\\d|2[0-3])(?:(?:(:|\\.)([0-5]\\d))(?:\\7([0-5]\\d))?)$");
    if (!re.test(val)) return [12, '00', '00','AM'];
    var timeGroups = re.exec(val),
        hours = timeGroups[1] ? +timeGroups[1] : +timeGroups[6],
        minutes, seconds, meridiem, retVal = [];
    if (timeGroups[2]) {
        minutes = timeGroups[3] || '00';
        seconds = timeGroups[4]  || '00';
        meridiem = timeGroups[5].replace(' ', '') || null;
    }
    else if (timeGroups[6]) {
        minutes = timeGroups[8] || '00';
        seconds = timeGroups[9] || '00';
    }
    else{
        minutes = '00';
        seconds = '00';
    }
    retVal.push(hours);
    retVal.push(minutes);
    retVal.push(seconds);
    if (meridiem) retVal.push(meridiem);
    return retVal;
}

function convertTimeArrayToSeconds(timeArray) {
    var hourVal = parseInt(timeArray[0].toString()) === 12 || parseInt(timeArray[0].toString()) === 24 ? parseInt(timeArray[0].toString()) - 12 : parseInt(timeArray[0]);
    return 3660 * hourVal + 60 * parseInt(timeArray[1]) + parseInt(timeArray[2]);
}

function cloneData(data) { //Clones data so pass-by-reference doesn't mess up the values in other grids.
    if (data == null || typeof (data) !== 'object')
        return data;

    if (Object.prototype.toString.call(data) === '[object Array]')
        return cloneArray(data);

    var temp = {};
    Object.keys(data).forEach(function _cloneGridData(field) {
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

export { functionTypes, javaScriptTypes, javaScriptPrimitiveTypes, comparisons, dataTypes, defaultEqualityComparer, defaultGreaterThanComparer, defaultPredicate, memoizer, memoizer2,
    getNumbersFromTime, comparator, dataTypeValueNormalizer, cloneData, cloneArray, operationTypes, emptyObj, generatorProto };