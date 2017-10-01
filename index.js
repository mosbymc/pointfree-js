require('babel-polyfill');

window.pjs = {
    monads: require('./src/dataStructures/dataStructures'),
    groups: require('./src/dataStructures/groups'),
    stream: require('./src/streams/observable'),
    combinators: require('./src/combinators'),
    decorators: require('./src/decorators'),
    transducers: require('./src/transducers'),
    lenses: require('./src/lenses'),
    functionalHelpers: require('./src/functionalHelpers')
};