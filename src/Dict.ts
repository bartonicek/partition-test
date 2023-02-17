export class Dict<T> {
  constructor(public value: Record<string, T>) {}

  static of = <T>(value: Record<string, T>) => new Dict(value);

  flat = () => this.value;
  map = <U>(mapfn: (value: T) => U) => {
    const result = {} as Record<string, U>;
    for (const [key, value] of Object.entries(this.value))
      result[key] = mapfn(value);
    return Dict.of(result);
  };

  reduce = <U>(reducefn: (result: U, nextValue: T) => U, initialValue: U) => {
    let result = initialValue;
    for (const value of Object.values(this.value))
      result = reducefn(result, value);
    return result;
  };

  fold = <U>(foldfn: (value: Record<string, T>) => U) => foldfn(this.value);
}
