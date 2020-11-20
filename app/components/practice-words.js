import { A } from "@ember/array";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { inject as service } from "@ember/service";

export default class PracticeWordsComponent extends Component {
  @service stats;

  @tracked keyPressed = "X";
  @tracked sample = this.getRandomWords();
  @tracked letterIndex = 0;
  @tracked wpm = "-";

  sampleLength = 5;
  startTime;

  @action
  updateSample() {
    this.sample = this.getRandomWords();
    this.removeButtonFocus();
  }

  removeButtonFocus() {
    document.getElementById("get-sample-btn").blur();
  }

  getRandomWords() {
    const wordsArr = A([]);
    for (let i = 0; i < this.sampleLength; i++) {
      wordsArr.pushObject(this.getRandomWord(this.getRandomNumber(10, 2)));
    }
    return wordsArr.join(" ").replaceAll(" ", "_").split("");
  }

  getRandomWord(wordLength = 10) {
    let consonants = "bcdfghjlmnpqrstv".split("");
    let vowels = "aeiou".split("");
    let word = "";
    let length = parseInt(wordLength, 10);

    for (let i = 0; i < length / 2; i++) {
      const randConsonant = consonants[this.getRandomNumber(consonants.length)];
      const randVowel = vowels[this.getRandomNumber(vowels.length)];

      word += i === 0 ? randConsonant : randConsonant;
      // word += i === 0 ? randConsonant.toUpperCase() : randConsonant;
      word += i * 2 < length - 1 ? randVowel : "";
    }

    return word;
  }

  getRandomNumber(upperLimit, lowerLimit = 0) {
    return Math.floor(Math.random() * upperLimit) + lowerLimit;
  }

  @action
  handleKeyDown(event) {
    if (this.letterIndex === 0) {
      this.startTime = Date.now();
    }

    this.keyPressed = event.key;

    this.checkIfCorrectKey();

    if (this.letterIndex === this.sample.length) {
      this.handleEndOfSample();
    }
  }

  checkIfCorrectKey() {
    if (
      (this.sample[this.letterIndex] === "_" && this.keyPressed === " ") ||
      this.keyPressed === this.sample[this.letterIndex]
    ) {
      this.letterIndex++;
      console.log("correct");
    } else {
      console.log("incorrect");
    }
  }

  handleEndOfSample() {
    this.getWpm();
    this.stats.addWpmEntry(this.wpm);
    this.updateSample();
    this.letterIndex = 0;
  }

  getWpm() {
    const elapsedTime = Date.now() - this.startTime;
    const seconds = elapsedTime / 1000;
    const minutes = seconds / 60;
    const roughWpm = this.sample.length / 5 / minutes;
    this.wpm = Math.round(100 * roughWpm) / 100;
  }

  @action
  isCurrentChar(index) {
    return index === this.letterIndex;
  }
}
