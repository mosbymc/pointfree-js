interface Identity<> {
    (source: any): identity;
    of(source: any): identity;
    is(x: any): boolean;
    empty(): identity;
}

interface identity<any> {
    extract: any;
    map(fn: (x: any) => any): identity<any>;
    bimap(f: (x: any) => any, g: (y: any) => any): identity;
    chain(fn: (x: any) => identity<any>): identity<any>;
    join(): identity<any>;
    apply(i: identity<(x: any) => any>): identity<any>;
    fold(fn: (x: any, accumulator: any) => any, acc: any): any;
    contramap(fn: (x: any) => any): identity;
    dimap(f: (x: any) => any, g: (y: any) => any): identity;
    isEmpty(): boolean;
    equals(x: any): boolean;
    toString(): string;
    factory: Identity;
}