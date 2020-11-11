import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class PracticeWordsComponent extends Component {
  @action
  getRandomWords() {
    let words = [];

    for (let i = 0; i < 10; i++) {
      words.push(this.getRandomWord());
    }
    console.log("words", words);
  }

  getRandomWord() {
    let consonants = "bcdfghjlmnpqrstv";
    let vowels = "aeiou";
    let rand = function (limit) {
      return Math.floor(Math.random() * limit);
    };
    let i;
    let word = "";
    let length = parseInt(10, 10);

    vowels = vowels.split("");
    consonants = consonants.split("");

    for (i = 0; i < length / 2; i++) {
      var randConsonant = consonants[rand(consonants.length)],
        randVowel = vowels[rand(vowels.length)];
      word += i === 0 ? randConsonant.toUpperCase() : randConsonant;
      word += i * 2 < length - 1 ? randVowel : "";
    }

    return word;
  }
}
