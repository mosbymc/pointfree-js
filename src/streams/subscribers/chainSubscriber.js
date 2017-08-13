import { subscriber } from './subscriber';
import { delegatesTo } from '../../functionalHelpers';
import { observable} from '../observable';

var chainSubscriber = Object.create(subscriber, {
    next: {
        value: function _next(item) {
            var mappedResult;
            try {
                mappedResult = this.transform(item, this.count++);
                //TODO: figure out what needs to be done to pull the item out of the inner observable
                this.subscriber.next(delegatesTo(mappedResult, observable) ? mappedResult.value : mappedResult);
            }
            catch (err) {
                this.subscriber.error(err);
            }
            //Promise.resolve(mappedResult).then(this.then);
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

export { chainSubscriber };