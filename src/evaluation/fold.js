function fold(source, fn, initial = 0) {
    return function *reduceIterator() {
        var val = initial,
            idx = 0;
        for (let item of source) {
             val = yield fn(val, item, idx);
             ++idx;
        }
        return val;
    };
}

export { fold };