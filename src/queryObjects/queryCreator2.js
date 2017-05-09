import { internal_queryable } from './queryable';
import { generatorProto } from '../helpers';

function createQueryable() {
    return Object.create(internal_queryable, {
        data: {
            get: function _getData() {
                return Array.from(this);
            }
        }
    });
}

function createNewQueryableDelegator(source, iterator) {
    var obj = createQueryable(iterator);
    obj.source = source;
    //if the iterator param has been passed and is a generator, objectSet it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;

    return obj;
}

export { createNewQueryableDelegator };