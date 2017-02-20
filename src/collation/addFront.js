function addFront(source, enumerable) {
    return function *addFront() {
        for (let item of enumerable) {
            if (undefined !== item) yield item;
        }

        for (let item of source) {
            if (undefined !== item) yield item;
        }
    };
}

export { addFront };