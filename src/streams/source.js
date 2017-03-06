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

export { createNewFiniteSource, createNewInfiniteSource, sourceTypes };