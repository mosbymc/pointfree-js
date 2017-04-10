import { subscriber } from './subscriber';

var deepMapSubscriber = Object.create(subscriber, {
    next: {
        value: function _next(item) {
            var mappedResult;
            try {
                mappedResult = recursiveMap(item);
            }
            catch (err) {
                this.subscriber.error(err);
                return;
            }
            this.subscriber.next(mappedResult);
            //Promise.resolve(mappedResult).then(this.then);

            function recursiveMap(item) {
                if (isArray(item)) {
                    var res = [];
                    for (let it of item) {
                        res = res.concat(recursiveMap(it));
                    }
                    return res;
                }
                return this.transform(item, this.count++);
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, transform) {
            this.initialize(subscriber);
            this.transform = transform;
            return this;
        },
        writable: false,
        configurable: false
    }
});

export { deepMapSubscriber };