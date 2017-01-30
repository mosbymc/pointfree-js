import { defaultEqualityComparer, memoizer2, emptyObj } from '../helpers';

function union(previousFunc, collection, comparer) {
    comparer = comparer || defaultEqualityComparer;
    var havePreviouslyViewed = memoizer2(comparer),
        atEndOfList = false,
        atEndOfCollection = false;

    function unionFunc(item) {
        //TODO: once I change the response type/object of the memoizer, I can just return the evaluation of something
        //TODO: like this: emptyObject.isPrototypeOf(havePreviouslyViewed(item))... so the 'next' function will
        //TODO: check for true to forward the item, or false to pull another item to evaluate
        return havePreviouslyViewed(item) ? undefined : item;
    }

    return Object.defineProperty(
        unionFunc,
        'next', {
            writable: false,
            configurable: false,
            value: function _next() {
                var next,
                    res;
                while (!atEndOfList && undefined === res) {
                    next = previousFunc.next();
                    if (emptyObj.isPrototypeOf(next)) {
                        atEndOfList = true;
                        break;
                    }

                    res = unionFunc(next);
                    if (false !== res) return res;
                }

                while (!atEndOfCollection && undefined === res) {
                    next = collection.shift();
                    if (!collection.length) atEndOfCollection = true;
                    res = unionFunc(next);
                    if (false !== res) return res;
                }
                return Object.create(emptyObj);
            }
        }
    )
}

export { union };