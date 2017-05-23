import { List, _list_f, ordered_list_f } from '../../../../src/containers/functors/list_functor';

describe('List functor test', function _testListFunctor() {
    describe('List object factory tests', function _testListObjectFactory() {
        it('should return a new List functor regardless of data type', function testListFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                l1 = List(),
                l2 = List(null),
                l3 = List(1),
                l4 = List(arr),
                l5 = List(obj),
                l6 = List(Symbol()),
                l7 = List('testing constant'),
                l8 = List(false);

            _list_f.isPrototypeOf(l1).should.be.true;
            _list_f.isPrototypeOf(l2).should.be.true;
            _list_f.isPrototypeOf(l3).should.be.true;
            _list_f.isPrototypeOf(l4).should.be.true;
            _list_f.isPrototypeOf(l5).should.be.true;
            _list_f.isPrototypeOf(l6).should.be.true;
            _list_f.isPrototypeOf(l7).should.be.true;
            _list_f.isPrototypeOf(l8).should.be.true;

            expect([undefined]).to.eql(l1.value);
            expect([null]).to.eql(l2.value);
            expect([1]).to.eql(l3.value);
            expect(arr).to.eql(l4.value);
            expect([obj]).to.eql(l5.value);
            expect('object').to.eql(typeof l6.value);
            expect('testing constant').to.eql(l7.value);
            expect([false]).to.eql(l8.value);
        });

        it('should return the same type/value when using the #of function', function testListDotOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = List.of(),
                i2 = List.of(null),
                i3 = List.of(1),
                i4 = List.of(arr),
                i5 = List.of(obj),
                i6 = List.of(Symbol()),
                i7 = List.of('testing constant'),
                i8 = List.of(false);

            _list_f.isPrototypeOf(i1).should.be.true;
            _list_f.isPrototypeOf(i2).should.be.true;
            _list_f.isPrototypeOf(i3).should.be.true;
            _list_f.isPrototypeOf(i4).should.be.true;
            _list_f.isPrototypeOf(i5).should.be.true;
            _list_f.isPrototypeOf(i6).should.be.true;
            _list_f.isPrototypeOf(i7).should.be.true;
            _list_f.isPrototypeOf(i8).should.be.true;

            expect([undefined]).to.eql(i1.value);
            expect([null]).to.eql(i2.value);
            expect([1]).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect([obj]).to.eql(i5.value);
            expect('object').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect([false]).to.eql(i8.value);
        });
    });

    describe('List functor object tests', function _testListFunctorObject() {

    });
});