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
    if (this.observables) {
        //console.log(...getSetters(this).map(prop => this[prop]));
        //console.log(Object.getPrototypeOf(operatorSubscriber));
    }
    return source.subscribe(Object.create(operatorSubscriber).init(subscriber, ...getSetters(this).map(prop => this[prop])));
}

function initOperator(...props) {
    return function _initOperator(...args) {
        return executeOnSetters(createGettersAndSetters(this, ...props), setDefaultValues(props.map(prop => !Array.isArray(prop) ? prop : prop[0]), args));
    };
}

function setDefaultValues(props, args) {
    return function _cb(objectProp, idx) {
        if (props.includes(objectProp)) {
            this[objectProp] = args[idx];
        }
    };
}

function getSetters(obj) {
    return Object.getOwnPropertyNames(obj)
        .filter(prop => Object.getOwnPropertyDescriptor(obj, prop).set);
}

function executeOnSetters(obj, fn) {
    getSetters(obj).forEach(fn, obj);
    return obj;
}

export { createGettersAndSetters, initOperator, subscribe };