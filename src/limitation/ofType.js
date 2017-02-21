import { javaScriptTypes } from '../helpers';

function ofType(source, type) {
    return function *ofTypeIterator() {
        function _checkTypeKeys(key) {
            return key in objItem;
        }
        function _checkItemKeys(key) {
            return key in type;
        }

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
                for (var objItem of source) {
                    if (type.isPrototypeOf(objItem))
                        yield objItem;
                    else if (javaScriptTypes.object === typeof objItem && null !== objItem &&
                        Object.keys(type).every(_checkTypeKeys) && Object.keys(objItem).every(_checkItemKeys)) {
                        yield objItem;
                    }
                }
            }
        }
    };
}

export { ofType };