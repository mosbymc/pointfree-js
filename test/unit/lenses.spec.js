import { arrayLens, objectLens, view, over, put, set, lens, maybePath, makeLenses, lensPath } from '../../src/lenses';
import { compose, curry } from '../../src/combinators';
import { map, mapWith } from '../../src/pointlessContainers';
import { functors } from '../../src/containers/functors/functors';

var Identity = functors.Identity;

describe('Test lenses', function _testLenses() {
    describe('Test makeLenses', function _makeLensesTest() {
        it( '', function () {
            let L = makeLenses('comments','body');

            const firstCommentBody = compose(L.comments, L.num(0), L.body);
        });

        it('', function() {
            function capitalizeFirst(str) {
                return str.toUpperCase();
            }



            var bigBird = {
                name: "Big Bird",
                age:6,
                comments:[
                    {body:'sing, sing a song',title:'Line 1'},
                    {body:'make it simple',title:'Line 2'},
                    {body:'sing out strong',title:'Line 3'}]
            };

            console.log(over(lensPath('comments', 0, 'body'), capitalizeFirst)(bigBird));//inline);

            const firstCommentBody = lensPath('comments',0,'body');//assign lens to a resuable named variable
            console.log(over(firstCommentBody, capitalizeFirst)(bigBird));//then use

            const mapped = curry(
                (f, x) => Identity( mapWith( compose( x=>x.value, f), x) )
            );
            const mapTwice = compose(mapped, mapped);
            console.log(over(mapTwice, x=>x+1, [[4, 6, 7], [5, 7, 8]]));
            console.log(over(mapped, mapWith(x=>x+1), [[4, 6, 7], [5, 7, 8]]));


            const dataset = {
                entries: [{id:"1"},{id:"2"},{id:"3"}]
            };

            const L = makeLenses('entries','id');

            const eachEntrysId = compose(L.entries, mapped, L.id);
            const makeInt = x => parseInt(x, 10);

            console.log(over(eachEntrysId, makeInt)(dataset));//boom: we fixed all the ids so they're Integers!

            console.log(over(L.entries, mapWith(over(L.id, x => parseInt(x, 10))), dataset));//same result, but eh, messy

        });
    });
});