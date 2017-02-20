function concat(source, enumerable) {
    return function *concatIterator() {
        for (let item of source) {
            if (undefined !== item) yield item;
        }

        for (let item of enumerable) {
            if (undefined !== item) yield item;
        }
    };
}

export { concat };