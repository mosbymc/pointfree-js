import { subscriber } from './subscriber';

var filterSubscriber = Object.create(subscriber, {
    next: {
        value: function _next(item) {
            try {
                if (this.predicate(item, this.count++))
                    this.subscriber.next(item);
                //Promise.resolve(item).then(this.then);
            }
            catch (err) {
                this.subscriber.error(err);
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, predicate) {
            this.initialize(subscriber);
            this.predicate = predicate;
            return this;
        },
        writable: false,
        configurable: false
    }
});

export { filterSubscriber };