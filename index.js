require('babel-polyfill');

window.pjs = {
    monads: require('./src/dataStructures/monads/monads'),
    functors: require('./src/dataStructures/functors/functors'),
    groups: require('./groups/groups'),
    stream: require('./src/streams/observable'),
    combinators: require('./src/combinators'),
    decorators: require('./src/decorators'),
    transducers: require('./src/transducers'),
    lenses: require('./src/lenses'),
    functionalHelpers: require('./src/functionalHelpers')
};