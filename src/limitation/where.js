function where(source, predicate) {
    return function *whereIterator() {
        for (let item of source) {
            if (predicate(item))
                yield item;
        }
    };
}

export { where };