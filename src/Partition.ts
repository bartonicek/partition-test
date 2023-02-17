import { toJSON, mapDict, prop, fromJSON, cartesianDict } from "./funs";
import { ArraySet } from "./ArraySet";
import { Dict } from "./Dict";

type PartitionType = {
  cardinality: number;
  labelJSONs?: Array<string>;
  indices?: number[];
  subpartitions?: Record<string, Partition>;
};

export class Partition implements PartitionType {
  cardinality: number;
  labelJSONs?: Array<string>;
  indices?: number[];
  subpartitions?: Record<string, Partition>;

  constructor(partitionObj: PartitionType) {
    this.cardinality = partitionObj.cardinality;
    this.labelJSONs = partitionObj.labelJSONs ?? [];
    this.indices = partitionObj.indices ?? [];
    this.subpartitions = partitionObj.subpartitions ?? {};
  }

  static of = (partitionObj: PartitionType) => new Partition(partitionObj);

  static from = (x: any[], labels?: string[]) => {
    const stringX = x.map(toJSON);
    const labelJSONs = labels
      ? labels.map(toJSON)
      : Array.from(new Set(stringX)).sort();
    const cardinality = labelJSONs.length;
    const indices = stringX.map((el) => labelJSONs.indexOf(el));

    return Partition.of({ cardinality, labelJSONs, indices });
  };

  static product = (partitions: Record<string, Partition>) => {
    const first = partitions[Object.keys(partitions)[0]];

    const possibleJSONs = Dict.of(partitions)
      .map((x) => x.labels)
      .fold(cartesianDict)
      .map(toJSON);

    const partitionJSONs = Array(possibleJSONs.length);
    const usedIndices = new Set();

    const dirtyIndices = first.indices!.reduce((result, _, nIndex) => {
      const partitionJSON = Dict.of(partitions)
        .map((x) => x.labelAt(nIndex))
        .fold(toJSON);

      const dirtyIndex = possibleJSONs.indexOf(partitionJSON);
      partitionJSONs[dirtyIndex] = partitionJSON;
      usedIndices.add(dirtyIndex);
      result.push(dirtyIndex);
      return result;
    }, [] as number[]);

    const indices = dirtyIndices.map((e) => Array.from(usedIndices).indexOf(e));

    return Partition.of({
      cardinality: partitionJSONs.flat().length,
      labelJSONs: partitionJSONs.flat(),
      indices,
      subpartitions: partitions,
    });
  };

  get labels() {
    return this.labelJSONs!.map(fromJSON);
  }

  labelAt = (k: number) => fromJSON(this.labelJSONs!.at(this.indices![k]));
  indexAt = (k: number) => this.indices![k];
}
