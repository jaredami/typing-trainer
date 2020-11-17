import { A } from "@ember/array";
import Service from "@ember/service";

export default class StatsService extends Service {
  entries = A([]);

  addEntry(item) {
    this.entries.pushObject(item);
    console.log("this.entries", this.entries);
  }
}
