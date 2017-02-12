function map(source, fn) {
    return function *mapIterator() {
        for (let item of source) {
            yield fn(item);
        }
    };
}

export { map };