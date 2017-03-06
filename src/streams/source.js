import { observable } from './observable';
import { queryable_core } from '../queryObjects/queryable';
import { generatorProto } from '../helpers';
import { isArray } from '../functionalHelpers';

var sourceTypes = {
    finite: 1,
    infinite: 2
};


var source = {
    type: null,
    underlying: null
};

var finiteSource = Object.create(source),
    infiniteSource = Object.create(source);

finiteSource.type = sourceTypes.finite;
infiniteSource.type = sourceTypes.infinite;
infiniteSource.event = null;

function createNewFiniteSource(data) {
    var s = Object.create(finiteSource);
    s.underlying = data;
    return s;
}

function createNewInfiniteSource(item, evt) {
    var s = Object.create(infiniteSource);
    s.underlying = item;
    s.event = evt;
    return s;
}

function genWrapper(source) {
    return function *testGen() {
        for (let item of source)
            yield Promise.resolve(item)
                .then(function _resolve() {
                    return item;
                });
    }
}

var t = [1, 2, 3, 4, 5];

testRunner(genWrapper, t);


function testRunner(gen, args) {
    var it = gen(...args);

    function runGen() {
        it.next()
            .then(function _resolve(data) {
                if (!it.done) {
                    console.log(data);
                    return runGen();
                }
            });
    }
}


/*
 Iterables contains a "generator" that can be recursively iterated until
 no values remain...
 - Take no args, return a generator for iteration

 ...Observables pass a "generator" to an observer
 - Take a generator argument and return nothing
 - An observer takes three function arguments:
 > next
 > throw
 > return
 - An observer also has a .forEach property that will
 iterate each value received from the observable
 - these are used as callbacks for the observer to
 receive the data that the observable produces
 */


WebSocket.prototype.observer = function _observer(generator) {
    function message(v) {
        var pair = generator.next(v);
        if (pair.done) cleanUp();
    }

    function error(e) {
        cleanUp();
        generator.throw(e);
    }

    function close(v) {
        cleanUp();
        generator.return(v);
    }

    function cleanUp() {
        this.removeEventListener("message", message);
        this.removeEventListener("error", error);
        this.removeEventListener("close", close);
    }

    this.addEventListener("message", message);
    this.addEventListener("error", error);
    this.addEventListener("close", close);
};

export { createNewFiniteSource, createNewInfiniteSource, sourceTypes };