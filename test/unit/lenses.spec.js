import { arrayLens, objectLens, view, over, put, set, lens, prism, prismPath, makeLenses, lensPath } from '../../src/lenses';
import { reverse } from '../../src/functionalHelpers';
import { compose, curry } from '../../src/combinators';
import { map, mapWith } from '../../src/pointless_data_structures';
import * as monads from '../../src/dataStructures/dataStructures';
import { testData } from '../testData';

var Identity = monads.Identity,
    Future = monads.Future;

function toUpper(str) {
    return str.toUpperCase();
}

function replace(regex, str) {
    return str.replace(regex);
}

function _getValue(x) { return x.value }

var mapped = curry(function(f, x) {
    return Identity(mapWith(compose(_getValue, f), x));
});

describe('Test lenses', function _testLenses() {
    describe('Test makeLenses', function _makeLensesTest() {
        var addrs = [{street: '99 Walnut Dr.', zip: '04821'}, {street: '2321 Crane Way', zip: '08082'}];
        var user = {id: 3, name: 'Charles Bronson', addresses: addrs};

        it('should create a lens path and view/update object', function _createPathForViewingAndUpdating() {
            var name = lensPath('name');

            view(name, user).should.eql('Charles Bronson');
            set(name, 'Richard Branson', user)
                .should.eql({ id: 3, name: 'Richard Branson', addresses: [{ street: '99 Walnut Dr.', zip: '04821' }, { street: '2321 Crane Way', zip: '08082' }]});
            over(name, toUpper, user)
                .should.eql({ id: 3, name: 'CHARLES BRONSON', addresses: [{ street: '99 Walnut Dr.', zip: '04821' }, { street: '2321 Crane Way', zip: '08082' }]});
        });

        it('should create a lens path and view/update object', function _createPathForViewingAndUpdating() {
            var name = prismPath('name');

            //view(name, user).should.eql('Charles Bronson');
            /*
            set(name, 'Richard Branson', user)
                .should.eql({ id: 3, name: 'Richard Branson', addresses: [{ street: '99 Walnut Dr.', zip: '04821' }, { street: '2321 Crane Way', zip: '08082' }]});
            over(name, toUpper, user)
                .should.eql({ id: 3, name: 'CHARLES BRONSON', addresses: [{ street: '99 Walnut Dr.', zip: '04821' }, { street: '2321 Crane Way', zip: '08082' }]});
                */
        });

        it('should work', function _createPathOnList() {
            var list = monads.List(testData.dataSource.data),
                drillDown = lensPath('drillDownData'),
                year = lensPath('Year'),
                third = lensPath(2),
                second = lensPath(1);

            view(compose(third, drillDown, second, year), list.extract).should.eql(testData.dataSource.data[2].drillDownData[1].Year);
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

        it('should work on javascript maps', function _testLensPathOnMap() {
            var obj = { id: 5, name: 'Test' },
                friends = new Map();
            friends.set('Mike', { id: 2, name: 'Mike' });
            friends.set('Charles', { id: 4, name: 'Charles' });
            friends.set('Tim', { id: 1, name: 'Tim' });
            obj.friends = friends;

            var friendLens = lensPath('friends'),
                CharlesLens = lensPath('Charles'),
                newFriendLens = lensPath('Anthony'),
                nameLens = lensPath('name');

            var friendCharles = compose(friendLens, CharlesLens),
                charlesNames = compose(friendLens, CharlesLens, nameLens),
                newFriend = compose(friendLens, newFriendLens);

            function _x(...args) {
                console.log(args);
            }

            var i = { id: 6, name: 'Face' };

            view(friendCharles, obj).should.eql(friends.get('Charles'));
            over(charlesNames, reverse, obj).friends.get('Charles').should.eql({ id: 4, name: 'selrahC' });
            console.log(set(newFriend, i, obj).friends)
        });

        it('should do other stuff', function _testOtherStuff() {
            var name = lensPath('name');
            over(compose(mapped, mapped, mapped, name), toUpper, monads.Identity.of(monads.Maybe.of([user])))
                .toString().should.eql('Identity(Just([object Object]))');
        });

        it('should do even more stuff', function _testEvenMoreStuff() {
            var addresses = lensPath('addresses');
            var street = lensPath('street');
            var allStreets = compose(addresses, mapped, street);

            //  :: Int -> Task Error User
            var getUser = id => Future((rej, res) => setTimeout(() => res(user), 400));

            // profilePage :: User -> Html
            var profilePage = compose(map(x => `<span>${x.street}<span>`), view(addresses));

            // updateUser :: User -> User
            var updateUser = over(allStreets, replace(/\d+/, '****'));

            // renderProfile :: User -> Html
            var renderProfile = compose(map(compose(profilePage, updateUser)), getUser);

            //console.log(Object.getPrototypeOf(renderProfile));
            //renderProfile(1).fork(console.log, console.log);
        });

        it('should do even more other stuff', function _testEvenMoreOtherStuff() {
            function capitalizeFirst(str) {
                return str.toUpperCase();
            }

            var bigBird = {
                name: "Big Bird",
                age: 6,
                comments: [
                    {body: 'sing, sing a song', title: 'Line 1'},
                    {body: 'make it simple', title: 'Line 2'},
                    {body: 'sing out strong', title: 'Line 3'}]
            };

            //console.log(over(lensPath('comments', 0, 'body'), capitalizeFirst)(bigBird));//inline);

            const firstCommentBody = lensPath('comments', 0, 'body');//assign lens to a resuable named variable
            //console.log(over(firstCommentBody, capitalizeFirst)(bigBird));//then use

            const mapped = curry((f, x) => Identity(mapWith(compose(x => x.value, f), x)));
            const mapTwice = compose(mapped, mapped);
            //console.log(over(mapTwice, x => x + 1, [[4, 6, 7], [5, 7, 8]]));
            //console.log(over(mapped, mapWith(x => x + 1), [[4, 6, 7], [5, 7, 8]]));


            const dataset = {
                entries: [
                    {id: "1"},
                    {id: "2"},
                    {id: "3"}
                ]
            };

            const L = makeLenses('entries', 'id');

            //console.log(L.id);

            const eachEntrysId = compose(L.entries, mapped, L.id);
            const makeInt = x => parseInt(x, 10);
            over(eachEntrysId, makeInt)(dataset).should.eql({
                entries: [
                    {id: 1},
                    {id: 2},
                    {id: 3}
                ]
            });

            var mapLens = lens((k, xs) => xs.get(k), (k, r, xs) => xs.set(k, r)),
                m = new Map([['tumblers', ['jill', 'jack']]]);
            view(mapLens('tumblers'), m).should.eql(['jill', 'jack']);

            var mapPrism = prism((k, xs) => xs.get(k), (k, r, xs) => xs.set(k, r));
            view(mapPrism('no_tumblers'), m).should.eql({});
        });
    });
});