import { javaScriptTypes } from '../helpers';

function ofType(source, type) {
    return function *ofTypeIterator() {
        if (type in javaScriptTypes) {
            for (let item of source) {
                if (javaScriptTypes[type] === typeof item) yield item;
            }
        }
        else {
            if (typeof type === javaScriptTypes.function) {
                for (let item of source) {
                    if (item === type) yield item;
                }
            }
            else if (null === type) {
                for (let item of source) {
                    if (type === item) yield item;
                }
            }
            else {
                for (let item of source) {
                    if (type.isPrototypeOf(item))
                        yield item;
                    else if (javaScriptTypes.object === typeof item
                        && null !== item
                        && Object.keys(type).every(function _checkTypeKeys(key) {
                            return key in item;
                        })
                        && Object.keys(item).every(function _checkItemKeys(key) {
                            return key in type;
                        })) {
                        yield item;
                    }
                }
            }
        }
    };
}

export { ofType };