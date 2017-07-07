//TODO: Fold - works like map, except does not put the resulting value into another container, just returns the value of the function applied to the monad
//TODO: FlatMap/Chain/Bind - works like Map in that it runs a function on a value and returns that value inside a container of the same type; however,
//TODO: it is also similar to Fold in that it 'removes' the outer wrapping container. So, presumably, a Chain function is used when you pass Ma's value to a
//TODO: function that returns an Ma. FlatMap will prevent the resulting nested container so that you are left with just Ma, and not MMa. However, it also makes
//TODO: sense to me that FlatMap could be called with the identity function and de-nest an already nested container.

//TODO: But here's the problem... if FoldMap is like Fold, but takes a mapping function to perform prior to folding the monad, then that means that Fold just
//TODO: returns this.value.


require('lambdajs').expose(global);
require('pointfree-fantasy').expose(global);
require('lenses').expose(global);

var _ = require('rembda');
var Maybe = require('pointfree-fantase/instance/maybe');
var Future = require('data.future');

var Db = {
    //getUser :: Number -> Future(Maybe(user))
    getUser: function _getUser(id) {
        return new Future(function _futureUser(rej, res) {
            setTimeout(function _timeout() {
                res(Maybe(users[id]));
            }, 10);
        });
    }
};

var users = [
    { name: 'Kate', addresses: [ { street: { number: 22, name: 'Walnut St.' } } ] },
    { name: 'Ajit', addresses: [ { street: { number: 52, name: 'Crane Ave.' } } ] }
];


var L = makeLenses(['addresses', 'street', 'name']);
L.dbResp = compose(mapped, mapped);
L.usersAddresses = compose(L.dbResp, L.addresses);
L.firstStreetsName = compose(L.num(0), L.street, L.addresses);

var upperCaseTheStreet = over(L.firstStreetsName, toUpperCase);

var prog = compose(over(L.usersAddresses, upperCaseTheStreet, Db.getUser, get('id')));
prog({ id: 100 }).fork(console.log, map(compose(console.log, get('addresses'))));
