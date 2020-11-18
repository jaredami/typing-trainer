import { A } from "@ember/array";
import Service from "@ember/service";

export default class StatsService extends Service {
  entries = A([]);

  addWpmEntry(item) {
    this.entries.pushObject(item);
    console.log("this.entries", this.entries);
  }

  getAverageWpm() {
    return (
      this.entries.length &&
      Math.round(
        (100 * this.entries.reduce((a, b) => a + b)) / this.entries.length
      ) / 100
    );
  }

  getTotalSamples() {
    return this.entries.length;
  }
}
