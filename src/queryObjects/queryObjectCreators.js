import { queryable, orderedQueryable } from './queryable';
import { generatorProto } from '../helpers';

function createNewQueryableDelegator(source, iterator) {
    var obj = Object.create(queryable);
    obj._dataComputed = false;
    obj._source = source;
    obj._evaluatedData = null;
    //if the iterator param has been passed and is a generator, set it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (iterator && generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;
    return addGetter(obj);
}

function createNewOrderedQueryableDelegator(source, iterator, sortObj) {
    var obj = Object.create(orderedQueryable);
    obj._source = source;
    obj._dataComputed = false;
    obj._evaluatedData = null;
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

function tmpGetter(obj) {
    return Object.defineProperties(
        obj, {
            'evaluatedData': {
                get: function _getEvaluatedData() {
                    return this._evaluatedData;
                },
                set: function _setEvaluatedData(val) {
                    this._evaluatedData = val;
                    this._dataComputed = true;
                }
            },
            'dataComputed': {
                get: function _getDataComputed() {
                    return this._dataComputed;
                },
                set: function _setDataComputed(val) {
                    this._dataComputed = val;
                }
            },
            'source': {
                get: function _getSource() {
                    return this._source;
                },
                set: function _setSource(val) {
                    this._source = val;
                }
            },
            'data': {
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
        }
    );
}

export { createNewQueryableDelegator, createNewOrderedQueryableDelegator };