import { A } from "@ember/array";
import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class PracticeWordsComponent extends Component {
  @tracked keyPressed = 'X';
  @tracked sentence = '';

  wordsArr = A([]);
  letterIndex = 0;

  // Build sentence
  @action
  getRandomWords() {
    for (let i = 0; i < 20; i++) {
      this.wordsArr.pushObject(this.getRandomWord(this.getRandomNumber(10, 2)));
    }

    this.sentence = this.wordsArr.join(' ');
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

  // Handle key press
  @action
  handleKeyDown(event) {
    this.keyPressed = event.key;

    this.checkIfCorrectKey();
  }

  checkIfCorrectKey() {
    if (this.keyPressed === this.sentence[this.letterIndex]) {
      console.log('correct');

      this.letterIndex++;
    } else {
      console.log('incorrect');
    }
  }
}
