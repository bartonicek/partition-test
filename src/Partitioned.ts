import { MapFn, ReduceFn } from "./types";
import { fromJSON } from "./funs";
import { Partition } from "./Partition";

export class Partitioned<T> {
  constructor(public values: T[], public partition: Partition) {}

  static of = <T>(x: T[], partition: Partition) =>
    new Partitioned(x, partition);

  get cardinality() {
    return this.partition.cardinality;
  }

  get labelJSONs() {
    return this.partition.labelJSONs;
  }

  get indices() {
    return this.partition.indices;
  }

  get labels() {
    return this.indices.map((i) => fromJSON(this.labelJSONs.at(i)));
  }

  map = <R>(mapfn: MapFn<T, R>) =>
    Partitioned.of(this.values.map(mapfn), this.partition);

  reduce = <U>(reducefn: ReduceFn<T, U>, initialValue: U) => {
    const { cardinality, indices, labelJSONs, values } = this;

    const reducedIndices = Array.from(Array(cardinality), (_, i) => i);
    const reducedValues: U[] = Array(cardinality).fill(initialValue);
    indices.forEach(
      (partIndex, nIndex) =>
        (reducedValues[partIndex] = reducefn(
          reducedValues[partIndex],
          values[nIndex]
        ))
    );

    const partition = Partition.of({
      cardinality,
      labelJSONs,
      indices: reducedIndices,
    });

    return Partitioned.of(reducedValues, partition);
  };
}

export const withPartition = <T>(x: T[], partition: Partition) =>
  Partitioned.of(x, partition);
