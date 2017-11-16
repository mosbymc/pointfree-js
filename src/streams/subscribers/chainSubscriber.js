import { subscriber } from './subscriber';
import { delegatesTo } from '../../functionalHelpers';
import { observable} from '../observable';

var chainSubscriber = Object.create(subscriber, {
    //TODO: If the returned observable is subscribed to, ensure that the chain subscriber 'unsubscribes' properly
    next: {
        value: function _next(item) {
            var chainedResult;
            try {
                chainedResult = this.transform(item, this.count++);
                //TODO: Should the returned observable be subscribed to, or just pass the returned value through
                //TODO: to the next subscriber like is being done now? The problem with passing through the value
                //TODO: is that is the returned value is an array and each item should be passed through individually,
                //TODO: they will instead be passed through as a single array.
                this.subscriber.next(delegatesTo(chainedResult, observable) ? chainedResult.source : chainedResult);
            }
            catch (err) {
                this.subscriber.error(err);
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

export { chainSubscriber };