import { subscriber } from '../../../../src/streams/subscribers/subscriber';
import { mapSubscriber } from '../../../../src/streams/subscribers/mapSubscriber';
import { observableStatus } from '../../../../src/helpers';

describe('Test subscriber', function _testSubscriber() {
    it('should return an \'inactive\' status when no status has been set', function _getUnsetStatus() {
        subscriber.status.should.eql(observableStatus.inactive);
    });

    it('should remain \'inactive\' when a illegitimate value is used', function _testStatusSetWithBadValue() {
        subscriber.status = 4;
        subscriber.status.should.eql(observableStatus.inactive);
    });

    it('should update a subscriber\'s status with any legit value', function _testStatusUpdate() {
        subscriber.status = observableStatus.active;
        subscriber.status.should.eql(observableStatus.active);

        subscriber.status = observableStatus.paused;
        subscriber.status.should.eql(observableStatus.paused);

        subscriber.status = observableStatus.complete;
        subscriber.status.should.eql(observableStatus.complete);

        subscriber.status = observableStatus.inactive;
        subscriber.status.should.eql(observableStatus.inactive);
    });

    it('should set the provided function as next, error, and complete properties of it\'s \'inner subscriber\'', function _testFunctionSubscriber() {
        function result(val) { return val; }
        function error() { return 2; }
        function complete() { return 3; }

        var s = Object.create(subscriber).initialize(result, error, complete);
        s.subscriptions.should.eql([]);
        s.subscriber.next.should.eql(result);
        s.subscriber.error.should.eql(error);
        s.subscriber.complete.should.eql(complete);

        s.then('1').should.eql('1');
        s.status.should.eql(observableStatus.active);
        s.count.should.eql(0);

        var q = Object.create(subscriber).initialize(s);
        q.subscriptions.should.eql([]);
        q.count.should.eql(0);
        q.status.should.eql(observableStatus.active);

        q.subscriber.should.eql(s);
        q.then('2').should.eql(s);
    });

    it('should increment the count as the event handlers are invoked', function _testSubscriberEventHandlers() {
        var count = 0;
        function next(val) { count += val; }

        var s = Object.create(subscriber).initialize(next, next, next);

        s.next(10);
        count.should.eql(10);
        s.error(1);
        count.should.eql(11);
    });
});