import { subscriber } from './subscriber';
import { delegatesTo } from '../../functionalHelpers';
import { observable} from '../observable';

var chainSubscriber = Object.create(subscriber);

chainSubscriber.next = function _next(item) {
    //TODO: If the returned observable is subscribed to, ensure that the chain subscriber 'unsubscribes' properly
    var chainedResult;
    try {
        chainedResult = this.transform(item, this.count++);
        //TODO: Should the returned observable be subscribed to, or just pass the returned value through
        //TODO: to the next subscriber like is being done now? The problem with passing through the value
        //TODO: is that is the returned value is an array and each item should be passed through individually,
        //TODO: they will instead be passed through as a single array.
        if (observable.isPrototypeOf(chainedResult)) {
            chainedResult = chainedResult.source;
        }
        this.subscriber.next(chainedResult);
    }
    catch (err) {
        this.subscriber.error(err);
    }
};

chainSubscriber.init = function _init(subscriber, transform) {
    this.initialize(subscriber);
    this.transform = transform;
    this.subscriber = subscriber;
    return this;
};

export { chainSubscriber };