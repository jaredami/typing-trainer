import { A } from "@ember/array";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class PracticeWordsComponent extends Component {
  @tracked keyPressed = "X";
  @tracked sentence = this.getRandomWords();
  @tracked letterIndex = 0;

  wordsArr = A([]);
  sentenceLength = 10;

  @action
  updateSentence() {
    this.sentence = this.getRandomWords();
  }

  getRandomWords() {
    this.removeButtonFocus();

    this.wordsArr = [];

    for (let i = 0; i < this.sentenceLength; i++) {
      this.wordsArr.pushObject(this.getRandomWord(this.getRandomNumber(10, 2)));
    }
    return this.wordsArr.join(" ").replaceAll(" ", "_").split("");
  }

  removeButtonFocus() {
    document.getElementById("get-sentence-btn").blur();
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
    this.keyPressed = event.key;

    this.checkIfCorrectKey();

    if (this.letterIndex === this.sentence.length) {
      this.updateSentence();
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

  @action
  isCurrentChar(index) {
    return index === this.letterIndex;
  }
}
