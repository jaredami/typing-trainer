import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class StatsComponent extends Component {
  @service stats;

  @tracked wpm = this.stats.entries;
}
