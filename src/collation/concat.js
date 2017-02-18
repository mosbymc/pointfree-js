function concat(source, collection) {
    return function *concatIterator() {
        for (let item of source) {
            if (undefined !== item) yield item;
        }

        for (let item of collection) {
            if (undefined !== item) yield item;
        }
    };
}

export { concat };