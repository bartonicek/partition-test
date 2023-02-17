import { record } from "purify-ts";
import { Partition } from "./Partition";
import { ReduceFn } from "./types";

export const identity = (x: any) => x;
export const product = (x: number, y: number) => x * y;

export const isEmpty = (obj: object) => obj && Object.keys(obj).length === 0;

export const first = (x: any[]) => x[0];
export const last = (x: any[]) => x[x.length - 1];
export const length = (x: any[]) => x.length;

export const toCallback = (x: any) => () => x;

export const pipe =
  (...funs: Function[]) =>
  (x: any) =>
    funs.reduce((result, nextFun) => nextFun(result), x);

export const prop = (key: string) => (obj: Record<string, any>) => obj[key];
export const flat = (x: { flat: () => any }) => x.flat();

export const injectGeneric =
  <T extends object>(fun: (obj: T) => T) =>
  (obj: T) => {
    return { ...obj, ...fun(obj) };
  };

export const fromJSON = (x: any) => JSON.parse(x);
export const toJSON = (x: any) => JSON.stringify(x);

export const mapDict = <T, U>(
  dict: Record<string, T>,
  callbackfn: (value: T) => U
) => {
  const res = {} as Record<string, U>;
  for (const [key, value] of Object.entries(dict)) res[key] = callbackfn(value);
  return res;
};

export const reduceDict = <T, U>(
  dict: Record<string, T>,
  reducefn: (result: U, nextValue: T) => U,
  initialValue: U
) => {
  let result = initialValue;
  for (const value of Object.values(dict)) result = reducefn(result, value);
  return result;
};

export const rollSum = (result: number[], nextValue: number) => {
  result.push(nextValue + (last(result) ?? 0));
  return result;
};

export const emptyArrays = (n: number) => Array.from(Array(n), () => []);

export const reduceByPartition = <T extends unknown, U>(
  x: T[],
  partition: Partition,
  reducefn: (result: U, nextValue: T) => U,
  initialValue: U
) => {
  const reducedValues: U[] = Array(partition.cardinality).fill(initialValue);
  partition.indices!.forEach((partIndex, nIndex) => {
    reducedValues[partIndex] = reducefn(reducedValues[partIndex], x[nIndex]);
  });
  return reducedValues;
};

function* cartesianGenerator<T>(items: T[][]): Generator<T[]> {
  const remainder =
    items.length > 1 ? cartesianGenerator(items.slice(1)) : [[]];
  for (const r of remainder) for (const h of items[0]) yield [h, ...r];
}

export const cartesian = <T>(items: T[][]) => [...cartesianGenerator(items)];

export const cartesianDict = <T>(items: Record<string, T[]>) => {
  return Object.entries(items).reduce((result, nextEntry) => {
    const [key, values] = nextEntry;
    const valueSingletons = values.map((v) => ({ [key]: v }));
    if (result.length === 0) return valueSingletons;
    return result.flatMap((r) => valueSingletons.map((v) => ({ ...r, ...v })));
  }, [] as Record<string, any>[]);
};
