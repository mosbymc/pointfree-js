declare module 'functionalHelpers' {
    export = functionalHelpers;
}

interface functionalHelpers<> {
    add(x: number, y: number): number;
    add(x: string, y: string): string;
    and(x: any, y: any): boolean;
    both(f: (...args: Array<any>) => boolean, g: (...args: Array<any>) => boolean): (...args: Array<any>) => boolean;
    defaultPredicate(): () => true;
    delegatesFrom(delegate: object, delegator: object): boolean;
    delegatesTo(delegator: object, delegate: object): boolean;
    divide(x: number, y: number): boolean;
    either(f: () => boolean, g: () => boolean): boolean;
    equals(x: any, y: any): boolean;
    falsey(x: any): boolean;
    flip(x: any): boolean;
    getWith(prop: string, obj: object): any;
    greaterThan(x: number, y: number): boolean;
    greaterThan(x: string, y: string): boolean;
    greaterThanOrEqual(x: number, y: number): boolean;
    greaterThanOrEquals(x: string, y: string): boolean;
    has(prop: string, obj: object): boolean;
    inObject(prop: string, obj: object): boolean;
    invoke(fn: () => any): any;
    isArray(x: any): boolean;
    isBoolean(x: any): boolean;
    isFunction(x: any): boolean;
    isObject(x: any): boolean;
    isPrimitive(x: any): boolean;
    isNothing(x: any): boolean;
    isNull(x: any): boolean;
    isNumber(x: any): boolean;
    isSomething(x: any): boolean;
    isString(x: any): boolean;
    isSymbol(x: any): boolean;
    isUndefined(x: any): boolean;
    lessThan(x: number, y: number): boolean;
    lessThan(x: string, y: string): boolean;
    lessThanOrEqual(x: number, y: number): boolean;
    lessThanOrEqual(x: string, y: string): boolean;
    modulus(x: number, y: number): number;
    multiple(x: number, y: number): number;
    negate(x: number): number;
    notEqual(x: any, y: any): boolean;
    noop(): void;
    once(fn: (...args) => any): (...args) => any;
    or(a: any, b: any): boolean;
    remainder(x: number, y: number): number;
    reverse(...args: Array<any>): Array<any>;
    strictEquals(x: any, y: any): boolean;
    strictNotEqual(x: any, y: any): boolean;
    subtract(x: number, y: number): number;
    truthy(x: any): boolean;
    wrap(data: any): Array<any>;
}