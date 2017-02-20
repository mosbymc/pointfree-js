function fold(source, fn, initial = 0) {
    var data = Array.from(source);
    return data.reduce(fn, initial);
}

export { fold };