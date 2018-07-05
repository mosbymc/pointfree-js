interface Future<T> {
    (source: (rej: (err: any) => void, res: (success: T) => void) => void): future;
    of(source: T): future<() => T>;
    is(x: any): boolean;
    lift(fn: (args: T) => T): (args: T) => future<() => T>;
    empty(): future;
}

interface future<T> extends IMonad<T> {
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