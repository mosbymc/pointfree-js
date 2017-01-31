function zip(source, collection, selector) {
    return function *zipIterator() {
        var res,
            idx = 0;
        for (let item of source) {
            if (idx > collection.length) return;
            res = selector(item, collection[idx]);
            if (undefined !== res) yield res;
            ++idx;
        }
    };
}

export { zip };