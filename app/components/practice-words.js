import { A } from "@ember/array";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { inject as service } from "@ember/service";

export default class PracticeWordsComponent extends Component {
  @service stats;

  @tracked keyPressed = "X";
  @tracked sentence = this.getRandomWords();
  @tracked letterIndex = 0;
  @tracked wpm = "-";

  sentenceLength = 5;
  startTime;

  @action
  updateSentence() {
    this.sentence = this.getRandomWords();
    this.removeButtonFocus();
  }

  removeButtonFocus() {
    document.getElementById("get-sentence-btn").blur();
  }

  getRandomWords() {
    const wordsArr = A([]);
    for (let i = 0; i < this.sentenceLength; i++) {
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

    if (this.letterIndex === this.sentence.length) {
      this.handleEndOfSentence();
    }
  }

  checkIfCorrectKey() {
    if (
      (this.sentence[this.letterIndex] === "_" && this.keyPressed === " ") ||
      this.keyPressed === this.sentence[this.letterIndex]
    ) {
      this.letterIndex++;
      console.log("correct");
    } else {
      console.log("incorrect");
    }
  }

  handleEndOfSentence() {
    this.getWpm();
    this.stats.addWpmEntry(this.wpm);
    this.updateSentence();
    this.letterIndex = 0;
  }

  getWpm() {
    const elapsedTime = Date.now() - this.startTime;
    const seconds = elapsedTime / 1000;
    const minutes = seconds / 60;
    const roughWpm = this.sentence.length / 5 / minutes;
    this.wpm = Math.round(100 * roughWpm) / 100;
  }

  @action
  isCurrentChar(index) {
    return index === this.letterIndex;
  }
}
