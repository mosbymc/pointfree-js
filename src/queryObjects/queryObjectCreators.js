import { queryable, orderedQueryable } from './queryable';
import {  generatorProto } from '../helpers';

function createNewQueryableDelegator(source, iterator) {
    var obj = Object.create(queryable);
    obj.dataComputed = false;
    obj.source = source;
    //if the iterator param has been passed and is a generator, set it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (iterator && generatorProto.isPrototypeOf(iterator))
        obj[Symbol.iterator] = iterator;

    return addGetter(obj);
}

function createNewOrderedQueryableDelegator(source, iterator, sortObj) {
    var obj = Object.create(orderedQueryable);
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

    //Shadow the orderBy/orderByDescending function of the delegate so that if another
    //orderBy/orderByDescending function is immediately chained to an orderedQueryable
    //delegator object, it will treat it as a thenBy/thenByDescending call respectively.
    //TODO: These could also be treated as no-ops, or a deliberate re-ordering of the
    //TODO: source; I feel the latter would be an odd thing do to, so it might not
    //TODO: make sense to treat it that way.

    //TODO: Rather than shadowing, I could make the queryable's orderBy/orderByDescending
    //TODO: functions check the context object's prototype; if it finds that the
    //TODO: orderedQueryable is in the context's prototype chain, then it could treat
    //TODO: the function call differently
    /*obj.orderBy = function _orderBy(keySelector, comparer) {
        return this.thenBy(keySelector, comparer);
    };

    obj.orderByDescending = function _orderByDescending(keySelector, comparer) {
        return this.thenByDescending(keySelector, comparer);
    };

    obj.thenBy = function _thenBy(keySelector, comparer) {
        var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'asc' });
        return createNewOrderedQueryableDelegator(this.source, orderBy(this, sortObj), sortObj);
    };

    obj.thenByDescending = function thenByDescending(keySelector, comparer) {
        var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'desc' });
        return createNewOrderedQueryableDelegator(this.source, orderBy(this, sortObj), sortObj);
    };*/

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
                    //TODO: is this valid for an object that has an iterator? Seems like it should work...
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