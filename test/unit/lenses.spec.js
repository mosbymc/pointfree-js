import { arrayLens, objectLens, view, over, put, set, lens, maybePath, makeLenses, lensPath } from '../../src/lenses';
import { compose } from '../../src/combinators';

describe('Test lenses', function _testLenses() {
    describe('Test makeLenses', function _makeLensesTest() {
        it( '', function () {
            let L = makeLenses('comments','body');

            const firstCommentBody = compose(L.comments, L.num(0), L.body);
        });
    });
});