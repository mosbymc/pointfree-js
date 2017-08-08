require('babel-polyfill');

window.pjs = {
    monads: require('./src/containers/monads/monads').monads,
    functors: require('./src/containers/functors/functors').functors,
    groups: require('./src/groups/groups'),
    stream: require('./src/streams/observable'),
    combinators: require('./src/combinators'),
    decorators: require('./src/decorators'),
    transducers: require('./src/transducers'),
    lenses: require('./src/lenses'),
    functionalHelpers: require('./src/functionalHelpers')
};

/*
module.exports = {
    monads: require('./src/containers/monads/monads'),
    functors: require('./src/containers/functors/functors'),
    groups: require('./src/groups/groups'),
    stream: require('./src/streams/observable'),
    combinators: require('./src/combinators'),
    decorators: require('./src/decorators'),
    transducers: require('./src/transducers'),
    lenses: require('./src/lenses'),
    functionalHelpers: require('./src/functionalHelpers')
};
*/

/*
import { observable } from 'src/streams/observable';
import { monads } from 'src/containers/monads/monads';
import { functors } from 'src/containers/functors/functors';
import * as groups from 'src/groups/groups';
import * as combinators from 'src/combinators';
import * as decorators from 'src/decorators';
import * as functionalHelpers from 'src/functionalHelpers';
import * as lenses from 'src/lenses';
import * as transducers from 'src/transducers';
import * as functionalContainerHelpers from 'src/functionalContainerHelpers';
import * as pointlessContainers from 'src/pointlessContainers';

window.observable = observable;
window.monads = monads;
window.functors = functors;
window.groups = groups;
window.combinators = combinators;
window.decorators = decorators;
window.functionalHelpers = functionalHelpers;
window.lenses = lenses;
window.transducers = transducers;
window.functionalContainerHelpers = functionalContainerHelpers;
window.pointlessContainer = pointlessContainers;
*/