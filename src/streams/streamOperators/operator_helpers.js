function createGettersAndSetters(obj, ...props) {
    props.forEach(function _assignProps(prop) {
        let propName, defaultVal;
        if (Array.isArray(prop)) {
            propName = prop[0];
            defaultVal = prop[1];
        }
        else {
            propName = prop;
        }

        Object.defineProperty(obj,
            propName, {
                get: function _get() {
                    return this[`_${propName}`] || defaultVal;
                },
                set: function _set(val) {
                    this[`_${propName}`] = val;
                }
            }
        );
    });
    return obj;
}

function subscribe(subscriber, source, operatorSubscriber) {
    var args = Object.getOwnPropertyNames(this)
        .filter(prop => Object.getOwnPropertyDescriptor(this, prop).get)
        .map(prop => this[prop]);
    return source.subscribe(Object.create(operatorSubscriber).init(subscriber, ...args));
}

function initOperator(...props) {
    return function _initOperator(...args) {
        createGettersAndSetters(this, ...props);
        props.forEach((prop, idx) => this[prop] = args[idx]);
        return this;
    };
}

export { createGettersAndSetters, initOperator, subscribe };