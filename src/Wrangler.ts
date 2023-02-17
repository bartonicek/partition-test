import { Dict } from "./Dict";
import { toCallback } from "./funs";
import { CallbackDict, CallbackRecord } from "./types";

export class Wrangler {
  value: CallbackDict;

  constructor(value: CallbackDict) {
    this.value = value;
  }

  static of = (value: CallbackDict) => new Wrangler(value);
  static from = (object: Record<string, any>) =>
    Wrangler.of(Dict.of(object).map(toCallback));

  flat = () => this.value.flat();
  fold = (foldfn: <U>(value: Record<string, () => any>) => U) =>
    this.value.fold(foldfn);

  map = (mapfn: (obj: CallbackRecord) => CallbackRecord) =>
    Wrangler.of(Dict.of(this.value.fold(mapfn)));
}
