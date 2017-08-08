import { subscriber } from './subscriber';

var mapSubscriber = Object.create(subscriber, {
    next: {
        value: function _next(item) {
            var res;
            try {
                res = this.transform(item, this.count++);
            }
            catch (err) {
                this.subscriber.error(err);
                return;
            }
            this.subscriber.next(res);
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

export { mapSubscriber };