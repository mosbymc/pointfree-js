import { observable } from './observable';
import { queryable_core } from '../queryObjects/queryable';
import { generatorProto } from '../helpers';
import { isArray } from '../functionalHelpers';

var _stream = {
    source: null,
    exec: function _exec() {}
};

var stream = {
    from: function _from(source) {
        //... if the source is a generator, an array, or another queryable, accept it as is...
        if (generatorProto.isPrototypeOf(source) || isArray(source) || queryable_core.isPrototypeOf(source)){
            var s = Object.create(_stream);
            return s;
        }
        //... otherwise, turn the source into an array before creating a new queryable delegator object;
        //if it has an iterator, use Array.from, else wrap the source arg in an array...
        //return createNewQueryableDelegator(null !== source && source[Symbol.iterator] ? Array.from(source) : wrap(source));
    }
};