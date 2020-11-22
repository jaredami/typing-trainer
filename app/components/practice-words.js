import { A } from "@ember/array";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class PracticeWordsComponent extends Component {
  @service stats;
  @service settings;

  @tracked keyPressed = "-";
  @tracked sample = this.createSample();
  @tracked letterIndex = 0;
  @tracked wpm = "-";

  sampleLength = 5;
  startTime;

  /**
   * Sample Region =========================================
   */

  @action
  getNewSample() {
    this.removeButtonFocus();
    this.sample = this.createSample();
  }

  removeButtonFocus() {
    document.getElementById("get-sample-btn").blur();
  }

  createSample() {
    const newSample = this.getRandomWords()
      .join(" ")
      .replaceAll(" ", "_")
      .split("");
    return newSample;
  }

  getRandomWords() {
    const wordsArr = A([]);
    for (let i = 0; i < this.sampleLength; i++) {
      wordsArr.pushObject(this.getRandomWord(this.getRandomNumber(10, 2)));
    }
    return wordsArr;
  }

  getRandomWord(wordLength = 10) {
    let consonants = "bcdfghjlmnpqrstv".split("");
    let vowels = "aeiou".split("");
    let word = "";
    let length = parseInt(wordLength, 10);

    for (let i = 0; i < length / 2; i++) {
      const randConsonant = consonants[this.getRandomNumber(consonants.length)];
      const randVowel = vowels[this.getRandomNumber(vowels.length)];

      if (this.settings.includeCapitals) {
        word += i === 0 ? randConsonant.toUpperCase() : randConsonant;
      } else {
        word += i === 0 ? randConsonant : randConsonant;
      }
      word += i * 2 < length - 1 ? randVowel : "";
    }

    return word;
  }

  getRandomNumber(upperLimit, lowerLimit = 0) {
    return Math.floor(Math.random() * upperLimit) + lowerLimit;
  }

  /**
   * Key Press Region =========================================
   */

  @action
  handleKeyDown(event) {
    if (this.letterIndex === 0) {
      this.handleStartOfSample();
    }

    this.keyPressed = event.key;
    this.checkIfCorrectKey();

    if (this.letterIndex === this.sample.length) {
      this.handleEndOfSample();
    }

    const charSelector = `[data-char="${event.key.toUpperCase()}"]`;
    const charElement = document.body.querySelector(charSelector);
    charElement?.classList.add("active-key");

    const keySelector = `[data-key="${event.keyCode}"]`;
    const keyElement = document.body.querySelector(keySelector);
    keyElement?.classList.add("active-key");
  }

  handleStartOfSample() {
    this.startTime = Date.now();
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
    this.getNewSample();
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

  @action
  handleKeyUp(event) {
    const charSelector = `[data-char="${event.key.toUpperCase()}"]`;
    const charElement = document.body.querySelector(charSelector);
    charElement?.classList.remove("active-key");

    const keySelector = `[data-key="${event.keyCode}"]`;
    const keyElement = document.body.querySelector(keySelector);
    keyElement?.classList.remove("active-key");
  }
}
