import { javaScriptTypes } from '../helpers';

function ofType(source, dataType) {
    return function *ofTypeIterator() {
        function _checkTypeKeys(key) {
            return key in objItem;
        }
        function _checkItemKeys(key) {
            return key in dataType;
        }

        if (dataType in javaScriptTypes) {
            for (let item of source) {
                if (javaScriptTypes[dataType] === typeof item) yield item;
            }
        }
        else {
            if (typeof dataType === javaScriptTypes.function) {
                for (let item of source) {
                    if (item === dataType) yield item;
                }
            }
            else if (null === dataType) {
                for (let item of source) {
                    if (dataType === item) yield item;
                }
            }
            else {
                for (var objItem of source) {
                    if (dataType.isPrototypeOf(objItem))
                        yield objItem;
                    else if (javaScriptTypes.object === typeof objItem && null !== objItem &&
                        Object.keys(dataType).every(_checkTypeKeys) && Object.keys(objItem).every(_checkItemKeys)) {
                        yield objItem;
                    }
                }
            }
        }
    };
}

export { ofType };