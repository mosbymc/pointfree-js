declare module 'combinators' {
    export = combinators;
}

interface combinators<> {
    all(fns: Array<(x: any, y: any, z: any) => boolean>, ...args: Array<any>): boolean;
    any(fns: Array<(x: any, y: any, z: any) => boolean>, ...args: Array<any>): boolean;
    constant(item: any): () => any;
    identity(item: any): any;
    ifElse(predicate: (...args: Array<any>) => boolean, ifFunc: (x: any) => any, elseFunc: (y: any) => any, data: any): any;

}