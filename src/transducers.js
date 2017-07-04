import { compose } from './combinators'

var mapping = (f) => (reducing) => (result, input) => reducing(result, f(input));

var filtering = (predicate ) => (reducing) => (result, input) => predicate(input) ? reducing(result, input) : result;

var transduce = (xform, reducing, initial, input) => input.reduce(xform(reducing), initial);

var xform = compose(
    mapping((x) => x + 1),
    filtering((x) => 0 === x % 2));

transduce(xform, (xs, x) => {
    xs.push(x);
    return xs;
}, [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
// [2, 4, 6, 8, 10]

transduce(xform, (sum, x) => sum + x, 0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

console.log(transduce(xform, (sum, x) => sum + x, 0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));



var reduce = (txf, acc, xs) => {
    for (let item of xs){
        let next = txf(acc, item);//we could also pass an index or xs, but K.I.S.S.
        acc = next && next[reduce.stopper] || next;// {[reduce.stopper]:value} or just a value
        if (next[reduce.stopper]){
            break;
        }
    }
    return acc;
};

Object.defineProperty(reduce, 'stopper', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Symbol('stop reducing')//no possible computation could come up with this by accident
});


//types of transformations
const mapping2 = transformFn => reducingFn =>
    (acc, item) => reducingFn(acc, transformFn(item, acc));

const filtering2 = testFn => reducingFn => (acc, item) =>
    testFn(item, acc) ? reducingFn(acc, item) : acc;

//defining particular mapping/filtering operations
const divideByThree = mapping2(x => x / 3);// returns a transducer
const keepOnlyIntegers = filtering2(x => 0 === x % 1);//returns a transducer

//combining them
const divBy3andOnlyIntegers = compose(divideByThree, keepOnlyIntegers);// transducers compose!


//using the composed transducer in a reduce method with concat on a starting array
[3,4,9,13,14,12].reduce( divBy3andOnlyIntegers(concat), []);//-> [ 1, 3, 4 ]

//a transducer (composed or not) + a reducing function = a reducing function
const divBy3andOnlyIntegersAndSum = compose(divideByThree, keepOnlyIntegers)(sum);

//using the completed reducing function on a starting value
reduce(divBy3andOnlyIntegersAndSum, 0, [3,4,9,13,14,12]);//-> (1+3+4) = 8


function dropGate(skips) {
    return function _dropGate(x) {
        return 0 > --skips;
    };
}

function dropping1(skips) {
    return filtering(dropGate(skips));
    //return compose(filtering, dropGate)(skips);
    //return filtering(function _f(x) { return --skips < 0; });
}

function dropping2(skips) {
    return function _dropping2(reducingFunc) {
        return function _dropping2_(acc, item) {
            return 0 <= --skips ? acc : reducingFunc(acc, item);
        };
    };
}


var x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    .reduce(mapping((x) => x + 1)((xs, x) => {
        xs.push(x);
        return xs;
    }), [])
    .reduce(filtering((x) => 0 === x % 2)((xs, x) => {
        xs.push(x);
        return xs;
    }), []);

var xs1 = compose(
    mapping(function _mapFunc(x) {
        return x + 1;
    }),
    filtering(function _filterFunc(x) {
        return 0 === x % 2;
    }));