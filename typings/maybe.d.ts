interface Maybe<T> {
    (source: T): just<T> | nothing;
    of(source: T): maybe<T>;
    is(x: any): boolean;
    isJust(x: any): boolean;
    isNothing(x: any): boolean;
    just(source: T): just<T>;
    nothing(source: T): nothing;
    fromNullable(x: any): just<T> | nothing;
    lift(fn: (args: any) => any): (args: any) => maybe<any>;
    empty(): maybe<undefined>;
}

interface Just<T> {
    (source: T): just<T>;
    of(source: T): just<T>;
    is(x: any): boolean;
    lift(fn: (args: any) => any): (args: any) => just<any>;
    empty(): just<undefined>;
}

interface Nothing {
    (source: any): nothing;
    of(source: any): nothing;
    is(x: any): boolean;
    lift(fn: (args: any) => any): (args: any) => nothing;
    empty(): nothing;
}

interface maybe<T> extends IMonad<T> {
    map(fn: (x: T) => any): maybe<any>;
    bimap(f: (x: T) => any, g: (y: T) => any): maybe<any>;
    chain(fn: (x: T) => maybe<any>): maybe<any>;
    chainRec(fn: (next: (val: T) => any, done: (val: any) => any, ) => any, value: any): maybe<any>;
    join(): maybe<T>;
    apply(i: maybe<(x: T) => any>): maybe<any>;
    fold(fn: (x: T, accumulator: any) => any, acc: any): any;
    contramap(fn: (x: any) => T): maybe<T>;
    dimap(f: (x: any) => T, g: (y: T) => any): maybe<any>;
    sequence(p: IMonad) : IMonad<maybe<any>>;
    traverse(a: IMonad, fn: (x: T) => IMonad<any>): IMonad<maybe<any>>;
    factory: Maybe;
}

interface just<T> extends IMonad<T> {
    map(fn: (x: T) => any): just<any>;
    bimap(f: (x: T) => any, g: (y: T) => any): just<any> | nothing;
    chain(fn: (x: T) => just<any>): just<any>;
    chainRec(fn: (next: (val: T) => any, done: (val: any) => any, ) => any, value: any): just<any>;
    join(): just<T>;
    apply(i: just<(x: T) => any>): just<any>;
    fold(fn: (x: T, accumulator: any) => any, acc: any): any;
    contramap(fn: (x: any) => T): just<T>;
    dimap(f: (x: any) => T, g: (y: T) => any): just<any>;
    sequence(p: IMonad): IMonad<just<any>>;
    traverse(a: IMonad, fn: (x: T) => IMonad<any>): IMonad<just<any>>;
    equals(x: any): boolean;
    factory: Just;
}

interface nothing extends IMonad {
    map(fn: (x: any) => any): nothing;
    bimap(f: (x: any) => any, g: (y: any) => any): nothing;
    chain(fn: (x: any) => nothing): nothing;
    chainRec(fn: (next: (val: any) => any, done: (val: any) => any, ) => any, value: any): nothing;
    join(): nothing;
    apply(i: nothing): nothing;
    fold(fn: (x: any, accumulator: any) => any, acc: any): any;
    contramap(fn: (x: any) => any): nothing;
    dimap(f: (x: any) => any, g: (y: any) => any): nothing;
    sequence(p: IMonad) : IMonad<nothing>;
    traverse(a: IMonad, fn: (x: any) => IMonad<any>): IMonad<nothing>;
    equals(x: any): boolean;
    factory: Maybe;
}