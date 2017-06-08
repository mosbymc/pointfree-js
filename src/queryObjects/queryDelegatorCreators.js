import { internal_queryable, internal_orderedQueryable } from './queryable';
import { generatorProto } from '../helpers';
import { set } from '../functionalHelpers';


//=========================================================================================//
//===============================          Helpers         ================================//
//=========================================================================================//

function createQueryable() {
    return Object.create(internal_queryable, {
        data: {
            get: function _getData() {
                return Array.from(this);
            }
        }
    });
}

function createOrderedQueryable(sorts) {
    return set('_appliedSorts', sorts, Object.create(internal_orderedQueryable, {
        data: {
            get: function _getData() {
                return Array.from(this);
            }
        }
    }));
}

function createNewQueryableDelegator(source, iterator) {
    var obj = createQueryable();
    obj.source = source;
    //if the iterator param has been passed and is a generator, objectSet it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;

    return obj;
}

function createNewOrderedQueryableDelegator(source, iterator, sortObj) {
    var obj = createOrderedQueryable(sortObj);
    obj.source = source;
    //Need to maintain a list of all the sorts that have been applied; effectively,
    //the underlying sorting function will only be called a single time for
    //all sorts.
    obj._appliedSorts = sortObj;
    //if the iterator param has been passed and is a generator, objectSet it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;

    return obj;
}

export { createNewQueryableDelegator, createNewOrderedQueryableDelegator };