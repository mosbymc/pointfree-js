interface IMonad<T> {
    readonly extract: T;
    isEmpty(): boolean;
    valueOf(): T;
    toString(): string;
}