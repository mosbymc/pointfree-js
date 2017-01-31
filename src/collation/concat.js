function concat(source, collection) {
    return function *concatIterator() {
        for (let item of source)
            yield item;

        for (let item of collection)
            yield item;
    };
}

export { concat };