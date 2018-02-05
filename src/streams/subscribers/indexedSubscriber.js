import { subscriber } from './subscriber';

function IndexSubscriber(s, idx, ...args) {
    var ret = subscriber.isPrototypeOf(s) ? Object.create(subscriber) : {};
    //A for-in loop is necessary because all the keys in 's' and it's delegation chain need
    //to be copied over, but Object.keys doesn't return the values you'd expect...
    for (let key in s) {
        if ('function' === typeof s[key]) {
            if ('next' !== key) {
                ret[key] = (...args) => s[key](...args);
            }
            else ret[key] = (item) => s[key](item, idx);
        }
        else ret[key] = s[key];
    }
    return ret;
}

IndexSubscriber.fromObservable = function _fromObservable(observer, sub, idx, ...args) {
    return IndexSubscriber(observer.subscribe(nextProxy(sub, idx), errorProxy(sub), completeProxy(sub)), idx);
};

function nextProxy(sub, index) {
    return function _nextProxy(item) {
        return sub.next(item, index);
    };
}

function errorProxy(sub) {
    return function _errorProxy(err) {
        return sub.error(err);
    };
}

function completeProxy(sub) {
    return function _completeProxy() {
        return sub.complete();
    };
}

export { IndexSubscriber };