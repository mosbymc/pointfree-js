import { internal_queryable, internal_orderedQueryable } from './queryable';
import { generatorProto } from '../helpers';
import { set, ifThisThenThat, pipe } from '../functionalHelpers';

function createNewQueryableDelegator(source, iterator) {
    var setIterator = ifThisThenThat(isIterator, set(Symbol.iterator, iterator), iterator);
    var constructQueryable = pipe(addGetter, setIterator, set('source', source), set('dataComputed', false));
    return constructQueryable(Object.create(internal_queryable));


    /*
    var obj = Object.create(internal_queryable);
    obj.dataComputed = false;
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
    obj.dataComputed = false;
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

//var queryableConstructor = pipe(setIt)

function isIterator(iterator) {
    return iterator && generatorProto.isPrototypeOf(iterator);
}


function addGetter(obj) {
    return Object.defineProperty(
        obj,
        'data', {
            get: function _data() {
                if (!this.dataComputed) {
                    var res = Array.from(this);
                    this.evaluatedData = res;
                    return res;
                }
                return this.evaluatedData;
            }
        }
    );
}

export { createNewQueryableDelegator, createNewOrderedQueryableDelegator };