interface Identity<T> {
    (source: T): identity<T>;
    of(source: T): identity<T>;
    is(x: any): boolean;
    lift(fn: (args: T) => T): (args: T) => identity<T>;
    empty(): identity<undefined>;
}

interface identity<T> extends IMonad<T> {
    map(fn: (x: T) => any): identity<any>;
    bimap(f: (x: T) => any, g: (y: T) => any): identity<any>;
    chain(fn: (x: T) => identity<any>): identity<any>;
    chainRec(fn: (next: (val: T) => any, done: (val: any) => any, ) => any, value: any): identity<any>;
    join(): identity<T>;
    apply(i: identity<(x: T) => any>): identity<any>;
    fold(fn: (x: T, accumulator: any) => any, acc: any): any;
    contramap(fn: (x: any) => T): identity<T>;
    dimap(f: (x: any) => T, g: (y: T) => any): identity<any>;
    sequence(p: IMonad) : IMonad<identity<any>>;
    traverse(a: IMonad, fn: (x: T) => IMonad<any>): IMonad<identity<any>>;
    equals(x: any): boolean;
    factory: Identity;
}