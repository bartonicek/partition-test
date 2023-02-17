import { Partition } from "./Partition";
import { Partitioned } from "./Partitioned";

export class Representation {
  partition: Partition;
  partitioneds: Record<string, Partitioned<unknown>>;

  constructor(
    partition: Partition,
    partitioneds: Record<string, Partitioned<unknown>>
  ) {
    this.partition = partition;
    this.partitioneds = partitioneds;
  }

  static of = (
    partition: Partition,
    partitioneds: Record<string, Partitioned<unknown>>
  ) => new Representation(partition, partitioneds);
}
