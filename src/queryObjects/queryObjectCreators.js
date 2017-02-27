import { internal_queryable, internal_orderedQueryable } from './queryable';
import { generatorProto } from '../helpers';

//TODO: Consider making some sort of abstract object or something that has
//TODO: the .extend and .from functionality, but the queryable objects do
//TODO: not delegate to it. The problem here is that consumer-level objects
//TODO: are "seeing" .from and .extend, and can use them to create/extend
//TODO: queryables respectively. Those two properties can be set to "undefined"
//TODO: on the consumer-level objects, but the property names still show,
//TODO: and it doesn't stop them from using the delegated function as
//TODO: long as they reference the delegate.

//TODO: It seems like I should probably publicly expose a "queryable" object
//TODO: that only has .extend and .from functionality. The consumer-level
//TODO: objects don't delegate to the "queryable" object, but rather to
//TODO: hidden objects that are not publicly available. The .extend
//TODO: function would extend the "hidden" objects, not itself, and
//TODO: .from would return a new consumer-level object that delegates
//TODO: to one of the "hidden" objects.

function createNewQueryableDelegator(source, iterator) {
    var obj = Object.create(internal_queryable);
    obj.dataComputed = false;
    obj.source = source;
    //if the iterator param has been passed and is a generator, set it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (iterator && generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;

    return addGetter(obj);
}

function createNewOrderedQueryableDelegator(source, iterator, sortObj) {
    var obj = Object.create(internal_orderedQueryable);
    obj.source = source;
    obj.dataComputed = false;
    //Need to maintain a list of all the sorts that have been applied; effectively,
    //the underlying sorting function will only be called a single time for
    //all sorts.
    obj._appliedSorts = sortObj;
    //if the iterator param has been passed and is a generator, set it as the object's
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
                //TODO: not sure if I plan on 'saving' the eval-ed data of a queryable object, and if I do, it'll take a different
                //TODO: form that what is currently here; for now I am going to leave the check for pre-eval-ed data in place
                if (!this.dataComputed) {
                    var res = Array.from(this);
                    this.dataComputed = true;
                    this.evaluatedData = res;
                    return res;
                }
                return this.evaluatedData;
            }
        }
    );
}

export { createNewQueryableDelegator, createNewOrderedQueryableDelegator };