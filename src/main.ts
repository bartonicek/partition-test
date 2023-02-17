import { Partition } from "./Partition";
import { Wrangler } from "./Wrangler";
import {
  cartesian,
  cartesianDict,
  injectGeneric,
  length,
  mapDict,
  pipe,
  product,
  reduceByPartition,
  reduceDict,
  toJSON,
} from "./funs";
import { CallbackRecord, ReduceFn } from "./types";
import { Dict } from "./Dict";

const group = Partition.from(["B", "B", "A", "A", "B", "A", "A"]);
const gender = Partition.from(["M", "M", "M", "F", "M", "F", "M"]);
const marker = Partition.from([0, 0, 0, 1, 0, 0, 1]);

const v1 = [100, 200, 150, 200, 100, 300, 100];

const combined = Partition.product({ group, gender, marker });

const labelDict = Dict.of(combined.subpartitions!).map((x) => x.labels);
const items = labelDict.flat();

console.log(combined);
console.log(reduceByPartition(v1, combined, (a, b) => a + b, 0));

// Wrangler

// ---------

// //               c    c
// // withPartition(sums, )

// Representation

// console.log(sums.values);

// {
//   "0": "{group: "A", gender: "M"}, marker: "0"}"
// }

// {
//   "AM": [10, 20, 30, 50, 50], // [10, 30, 60, 110, 160]
//   "BM": [10, 20, 50, 40, 50],

// }

// const labels = sums.labels;
// const values = sums.values;

const inject = (fun: (obj: CallbackRecord) => CallbackRecord) =>
  injectGeneric<CallbackRecord>(fun);

const f = ({}: CallbackRecord) => ({ title: () => "Mr" });
const g = ({ firstName, lastName, title }: CallbackRecord) => ({
  label: () => [title(), firstName(), lastName()].join(" "),
});

const wrangler1 = Wrangler.from({ firstName: "Adam", lastName: "Bartonicek" });

const wrangler2 = wrangler1.map(inject(f)).map(inject(g));
const wrangler3 = wrangler1.map((x) => inject(g)(inject(f)(x)));
const wrangler4 = wrangler1.map(pipe(inject(f), inject(g)));

const wranglers = [wrangler2, wrangler3, wrangler4];
// wranglers.forEach((x) => console.log(x.flat().label()));

const wrangler5 = Wrangler.from({ a: [0, 1, 2, 3] })
  .map(
    inject(({ a }) => ({
      lengthA: () => a().length,
      sumA: () => a().reduce((a: number, b: number) => a + b),
    }))
  )
  .map(
    inject(({ sumA, lengthA }) => ({
      meanA: () => sumA() / lengthA(),
    }))
  );
