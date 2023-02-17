export class ArraySet<T> {
  array: any[];
  set: Set<any>;

  constructor(x?: T[]) {
    this.set = new Set(x);
    this.array = Array.from(this.set);
  }

  get length() {
    return this.array.length;
  }

  static of = <T>(x: T[]) => new ArraySet(x);

  at = (k: number) => this.array[k];
  indexOf = (x: any) => this.array.indexOf(x);
  map = (callbackfn: (value: unknown) => unknown) => this.array.map(callbackfn);
  sort = (comparefn?: (a: any, b: any) => number) => {
    this.array.sort(comparefn);
    return this;
  };

  pushIfNew = (...items: any[]) => {
    for (const item of items) {
      if (this.set.has(item)) continue;
      this.set.add(item);
      this.array.push(item);
    }
    return this.array.length;
  };
}
