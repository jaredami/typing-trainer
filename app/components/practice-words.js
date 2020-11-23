import { A } from "@ember/array";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class PracticeWordsComponent extends Component {
  @service stats;
  @service settings;

  @tracked sample = this.getSample();
  @tracked letterIndex = 0;
  @tracked mistakeIndexes = A([]);
  @tracked wpm = "-";

  sampleLength = 5;
  startTime;

  // Region: Build Samples =========================================

  @action
  handleNewSampleButtonClick() {
    // This is to avoid the button event firing again when space bar is pressed.
    this.removeButtonFocus();
    this.sample = this.getSample();
  }

  removeButtonFocus() {
    document.getElementById("get-sample-btn").blur();
  }

  getSample() {
    return this.getRandomWords().join(" ").replaceAll(" ", "_").split("");
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

  // Region: Handle Key Presses =========================================

  @action
  handleKeyDown(event) {
    if (this.letterIndex === 0) {
      this.handleStartOfSample();
    }

    this.checkIfCorrectKey(event.key);

    if (this.letterIndex === this.sample.length) {
      this.handleEndOfSample();
    }

    this.toggleActiveKeyClass(this.getKeyElement(event));
  }

  handleStartOfSample() {
    this.startTime = Date.now();
  }

  checkIfCorrectKey(keyPressed) {
    if (
      (this.sample[this.letterIndex] === "_" && keyPressed === " ") ||
      keyPressed === this.sample[this.letterIndex]
    ) {
      this.letterIndex++;
    } else {
      if (
        keyPressed !== "Shift" &&
        !this.mistakeIndexes.includes(this.letterIndex)
      ) {
        this.mistakeIndexes.pushObject(this.letterIndex);
      }
    }
  }

  handleEndOfSample() {
    this.getWpm();
    this.stats.addWpmEntry(this.wpm);
    this.sample = this.getSample();
    this.letterIndex = 0;
    this.mistakeIndexes = [];
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
    this.toggleActiveKeyClass(this.getKeyElement(event));
  }

  getKeyElement(keyEvent) {
    const charSelector = `[data-char="${keyEvent.key.toUpperCase()}"]`;
    const charElement = document.body.querySelector(charSelector);

    const keySelector = `[data-key="${keyEvent.keyCode}"]`;
    const keyElement = document.body.querySelector(keySelector);

    return charElement || keyElement;
  }

  toggleActiveKeyClass(element) {
    element.classList.toggle("active-key");
  }
}
