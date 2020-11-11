import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class PracticeWordsComponent extends Component {
  @action
  getRandomWords() {
    let words = [];

    for (let i = 0; i < 20; i++) {
      words.push(this.getRandomWord(this.getRandomNumber(10, 2)));
    }
    console.log("words", words);
  }

  getRandomWord(wordLength = 10) {
    let consonants = "bcdfghjlmnpqrstv".split("");
    let vowels = "aeiou".split("");
    let word = "";
    let length = parseInt(wordLength, 10);

    for (let i = 0; i < length / 2; i++) {
      const randConsonant = consonants[this.getRandomNumber(consonants.length)];
      const randVowel = vowels[this.getRandomNumber(vowels.length)];

      word += i === 0 ? randConsonant.toUpperCase() : randConsonant;
      word += i * 2 < length - 1 ? randVowel : "";
    }

    return word;
  }

  getRandomNumber(upperLimit, lowerLimit = 0) {
    return Math.floor(Math.random() * upperLimit) + lowerLimit;
  }
}
