import { internal_queryable, internal_orderedQueryable } from './queryable';
import { generatorProto } from '../helpers';
import { set, when, compose, isSomething, constant, apply, tap, ifElse } from '../functionalHelpers';


//=========================================================================================//
//===============================          Helpers         ================================//
//=========================================================================================//
var setSource = set('source'),
    setIterator = set(Symbol.iterator),
    isIterator = apply(generatorProto.isPrototypeOf),
    queryable = ifElse(isSomething, createQueryable, createOrderedQueryable);

function constructQueryableDelegator(source, iterator, sortObj) {
    var b = when(constant(isIterator(iterator)), set(Symbol.iterator, iterator)),
        f = tap(isIterator, iterator); //=> true
        //f => iterator
    //TODO: I might be able to work out a composition of 'isIterator' and 'setIterator' via 'tap'. I would still
    //TODO: need the 'when' function, but if 'tap' internally runs 'isIterator', then it would return the iterator
    //TODO: object which would then be passed to the setIterator function, which would then be waiting for the
    //TODO: object argument to be passed to it.
    return compose(addGetter, when(isIterator(iterator), setIterator(iterator)), setSource)(source, queryable(sortObj));
}

function createQueryable() {
    return Object.create(internal_queryable);
}

function createOrderedQueryable(sorts) {
    return set('_appliedSorts', sorts, Object.create(internal_orderedQueryable));
}


function createNewQueryableDelegator(source, iterator) {
    var constructQueryable = compose(addGetter, setIterator(iterator), set('source', source), set('dataComputed', false));
    return constructQueryable(Object.create(internal_queryable));


    /*
    var obj = Object.create(internal_queryable);
    obj.source = source;
    //if the iterator param has been passed and is a generator, objectSet it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (iterator && generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;

    return addGetter(obj);
    */
}

function createNewOrderedQueryableDelegator(source, iterator, sortObj) {
    var obj = Object.create(internal_orderedQueryable);
    obj.source = source;
    //Need to maintain a list of all the sorts that have been applied; effectively,
    //the underlying sorting function will only be called a single time for
    //all sorts.
    obj._appliedSorts = sortObj;
    //if the iterator param has been passed and is a generator, objectSet it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (iterator && generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;

    return addGetter(obj);
}

function addGetter(obj) {
    return Object.defineProperty(
        obj,
        'data', {
            get: function _data() {
                return Array.from(this);
            }
        }
    );
}

export { createNewQueryableDelegator, createNewOrderedQueryableDelegator };