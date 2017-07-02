import { delegatesTo, isArray, isString } from '../functionalHelpers';
import { generatorProto } from '../helpers';

/**
 * @description: This factory producing function is used by both the list functor and the
 * list monad when creating a new list object. Based on the parameters passed, the factory
 * function will create a new object that delegates to the appropriate type with whatever
 * additional fields it needs, i.e. ._value, .data, [Symbol.iterator], etc.
 * @param: {object} baseListType
 * @param: {object} sortedListType
 * @param: {object} groupedListType
 * @return: {function}
 */
function createListCreator(baseListType, sortedListType, groupedListType) {
    return function createListDelegateInstance(source, iterator, sortObj, key) {
        switch(createBitMask(delegatesTo(iterator, generatorProto), isArray(sortObj), isString(key))) {
            /**
             * @description: case 1 = An iterator has been passed, but nothing else. Create a
             * basic list type object instance and set the iterator as the version provided.
             */
            case 1:
                return Object.create(baseListType, {
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    },
                    [Symbol.iterator]: {
                        value: iterator
                    }
                });
            /**
             * @description: case 3 = Both an iterator and a sort object were passed. Create an
             * ordered list type object instance, setting the iterator to the version provided and
             * the _appliedSorts field as the sortObj param.
             */
            case 3:
                return Object.create(sortedListType, {
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    },
                    _appliedSorts: {
                        value: sortObj,
                        writable: false,
                        configurable: false
                    },
                    [Symbol.iterator]: {
                        value: iterator
                    }
                });
            /**
             * @description: case 4 = An iterator, sort object, and a key were passed as arguments.
             * Create a grouped list type and set the iterator as the version provided, the ._appliedSorts
             * field as the sortObj param, and the ._key field as the key string argument.
             */
            case 4:
                return Object.create(groupedListType, {
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    },
                    _key: {
                        value: key,
                        writable: false,
                        configurable: false
                    },
                    key: {
                        get: function _getKey() {
                            return this._key;
                        }
                    }
                });
            /**
             * @description: default = Nothing beyond the 'source' param was passed to this
             * function; results in a bitwise value of 00. Create a 'basic' list object type
             * instance.
             */
            default:
                return Object.create(baseListType, {
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    }
                });
        }
    };

    function createBitMask(...args) {
        return args.reduce(function _reduce(curr, next, idx) {
            return curr |= next << idx;
        }, args[0]);
    }
}

export { createListCreator };