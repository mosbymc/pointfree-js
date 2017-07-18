import { arrayLens, objectLens, view, over, put, set, lens, maybePath, makeLenses, lensPath } from '../../src/lenses';
import { reverse } from '../../src/functionalHelpers';
import { compose, curry } from '../../src/combinators';
import { map, mapWith } from '../../src/pointlessContainers';
import { functors } from '../../src/containers/functors/functors';

var Identity = functors.Identity;
function toUpper(str) {
    return str.toUpperCase();
}

function _getValue(x) { return x.value }

var mapped = curry(function(f, x) {
    return Identity(mapWith(compose(_getValue, f), x));
});

describe('Test lenses', function _testLenses() {
    describe('Test makeLenses', function _makeLensesTest() {
        var addrs = [{street: '99 Walnut Dr.', zip: '04821'}, {street: '2321 Crane Way', zip: '08082'}];
        var user = {id: 3, name: 'Charles Bronson', addresses: addrs};

        it( '', function () {
            var name = lensPath('name');

            view(name, user).should.eql('Charles Bronson');
            set(name, 'Richard Branson', user)
                .should.eql({ id: 3, name: 'Richard Branson', addresses: [{ street: '99 Walnut Dr.', zip: '04821' }, { street: '2321 Crane Way', zip: '08082' }]});
            over(name, toUpper, user)
                .should.eql({ id: 3, name: 'CHARLES BRONSON', addresses: [{ street: '99 Walnut Dr.', zip: '04821' }, { street: '2321 Crane Way', zip: '08082' }]});
        });

        it('should do stuff', function _doStuff() {
            var addresses = lensPath('addresses');
            var street = lensPath('street');
            var first = arrayLens(0);
            var firstStreet = compose(addresses, first, street);

            view(firstStreet, user).should.eql('99 Walnut Dr.');
            over(firstStreet, reverse, user)
                .should.eql({ id: 3, name: 'Charles Bronson', addresses: [{ street: '.rD tunlaW 99', zip: '04821' }, { street: '2321 Crane Way', zip: '08082' }]});
        });

        it('should do other stuff', function _testOtherStuff() {
            var name = lensPath('name');
            over(compose(mapped, mapped, mapped, name), toUpper, functors.Identity.of(functors.Maybe.of([user])))
                .toString().should.eql('Identity(Just([object Object]))');
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