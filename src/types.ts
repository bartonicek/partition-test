import { Dict } from "./Dict";

export type CallbackRecord = Record<string, () => any>;
export type CallbackDict = Dict<() => any>;

export type ReduceFn<T, U> = (result: U, nextValue: T) => U;
export type MapFn<T, R> = (value: T, index: number) => R;
export type Map2Fn<T1, T2, R> = (value1: T1, value2: T2, index?: number) => R;
