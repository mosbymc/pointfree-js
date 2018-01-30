interface Future<> {
    (source: () => any): future;
    of(source: any): future;
    is(x: any): boolean;
    empty(): future;
}

interface future<any> {
    extract: any;
    map(fn: (x: any) => any): future<any>;
    bimap(f: (x: any) => any, g: (y: any) => any): future;
    chain(fn: (x: any) => future<any>): future<any>;
    join(): future<any>;
    apply(i: future<(x: any) => any>): future<any>;
    fold(fn: (x: any, accumulator: any) => any, acc: any): any;
    contramap(fn: (x: any) => any): future;
    dimap(f: (x: any) => any, g: (y: any) => any): future;
    isEmpty(): boolean;
    equals(x: any): boolean;
    toString(): string;
    factory: Future;
}