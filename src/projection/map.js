function map(source, fn) {
    return function *mapIterator() {
        if (fn.name === '_identity2') {
            console.log(source);
        }
        for (let item of source) {
            yield fn(item);
        }
    };
}

export { map };