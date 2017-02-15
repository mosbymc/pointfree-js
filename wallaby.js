var wallabify = require('wallabify'),
    proxyquireify = require('proxyquireify'),
    // proxyquireify patch
    proxyquireifyPrelude = require('fs').readFileSync(require('path').join(__dirname, 'node_modules/proxyquireify/lib/prelude.js')).toString();

/*require('proxyquireify/lib/find-dependencies');
 require.cache[require.resolve('proxyquireify/lib/find-dependencies')].exports = function _cache(src) {
 if (!/require\(.+proxyquireify.+\)/.test(src)) return [];
 // IMPORTANT: list all variables that you assign like var proxyquire = require('proxyquireify')(require);
 var hash = ['proxyquire']
 .map(function _map(name) {
 return require('proxyquireify/node_modules/detective')(src, {word: name});
 })
 .reduce(function _reduce(acc, arr) {
 arr.forEach(function _forEach(x) {
 acc[x] = true;
 });
 return acc;
 }, {});

 return Object.keys(hash);
 };*/

process.env.BABEL_ENV = 'test';

module.exports = function _wallaby(wallaby) {
    return {
        //debug: true,
        /*
         name: the name of the project; displayed in the wallaby code coverage application
         */
        name: 'queryable-js',

        /*
         framework: the test framework being used; defaults to jasmine
         */
        framework: 'mocha',

        /*
         files: the files that should be included in the phantomjs sandbox
         - load: Indicates to wallaby if it or something else will load the files into sandbox; those that are
         set to false are being loaded by browserify after transpilation
         - instrument: Indicates to wallaby if coverage reporting (in the IDE and application) should be checked against the matched files
         */
        files: [
            { pattern: 'node_modules/chai/chai.js', instrument: false },
            { pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false },
            { pattern : 'src/**/*.js', load: false },
            { pattern: 'test/testData.js', load: false },
            '!test/**/*.spec.js',
            '!src/index.js'
        ],

        /*
         tests: the tests to be run, load is set to false because they will be required through browserify after transpilation
         - load: Indicates to wallaby if it or something else will load the files into sandbox; those that are
         set to false are being loaded by browserify after transpilation
         */
        tests: [
            { pattern: 'test/**/*.spec.js', load: false }
        ],

        /*
         filesWithNoCoverageCalculated: turns off code coverage reporting in the wallaby application, but leave it on
         inside the IDE so that I can maintain in-line errors with selected files
         */
        filesWithNoCoverageCalculated: ['src/expressionParser/expressionParser.js', 'test/testData.js'],

        /*
         compilers: wallaby ships with three built-in compilers: typescript, coffeescript, and babel; files
         matched by glob patterns will be passed through selected compilers, in this case, the
         babel compiler is being used with the .babelrc file in the project root
         */
        compilers: {
            'src/**/*.js': wallaby.compilers.babel(),
            'test/**/*.js': wallaby.compilers.babel()
        },

        /*
         postprocessor: uses the wallabify postprocessor to 'require' files matched by the glob patterns
         into the sandbox
         */
        postprocessor: wallabify({
            entryPatterns: [
                'src/**/*.js',
                'test/**/*.js'
            ]
        }),

        /*
         setup: wallaby will run this function one it launches the phantomjs sandbox; this will setup
         the global variables being used in the tests and utilize browserify to load the files
         */
        setup: function _setup() {
            window.should = chai.should();
            window.expect = chai.expect;
            window.__moduleBundler.loadTests();
        }
    };
};