require('babel-polyfill');

window.pjs = {
    monads: require('./src/containers/monads/monads'),
    functors: require('./src/containers/functors/functors'),
    groups: require('./groups/groups'),
    stream: require('./src/streams/observable'),
    combinators: require('./src/combinators'),
    decorators: require('./src/decorators'),
    transducers: require('./src/transducers'),
    lenses: require('./src/lenses'),
    functionalHelpers: require('./src/functionalHelpers')
};