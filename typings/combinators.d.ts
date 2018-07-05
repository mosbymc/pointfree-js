declare module 'combinators' {
    export = combinators;
}

interface combinators {
    all(fns: Array<(...args) => boolean>, ...args: Array<any>): boolean;
    any(fns: Array<(...args) => boolean>, ...args: Array<any>): boolean;
    compose(...fns: Array<(...args) => any>): any;
    constant(item: any): () => any;
    identity(item: any): any;
    ifElse(predicate: (...args: Array<any>) => boolean, ifFunc: (x: any) => any, elseFunc: (y: any) => any, data: any): any;

}