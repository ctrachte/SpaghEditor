// need a class that takes in a string, markdown or html and then maps to a JSON object

export default class TheChef {
  constructor(props) {
    (this.outputElement = props.outputElement),
      (this.raw = props.raw),
      (this.json = props.json),
      (this.noodles = props.text),
      (this.html = props.html),
      (this.markdown = props.markdown),
      (this.devMode = true), // true if you want to see values logged
      (this.markdownScore = this.markdownScore.bind(this)),
      (this.whatKindOfNoodles = this.whatKindOfNoodles.bind(this)),
      (this.brain = this.brain.bind(this));
    this.plateDish = this.plateDish.bind(this);
    this.makeSpaghetti = this.makeSpaghetti.bind(this);
    this.brain();
  }
  // equivalent of 'main' method
  brain() {
    // seperate lines and evaluate
    this.noodles = this.makeNoodles(this.raw);
    // determine type
    this.whatKindOfNoodles();
    // parses based on type
    this.makeSpaghetti();
    // return completed JSON object, and appends to preview window
    this.plateDish();
    // log values for devmode
    if (this.devMode) {
      console.table(this.noodles);
    }
  }
  //parent method to determine type of each line/noodle
  whatKindOfNoodles() {
    this.noodles = this.noodles.map(
      function (noodle) {
        let value = noodle;
        noodle = new Object();
        noodle.value = value;
        noodle.type = {
          html: this.htmlScore(noodle.value),
          markdownScore: this.markdownScore(noodle.value),
          json: this.isJson(noodle.value),
        };
        return noodle;
      }.bind(this)
    );
  }
  // scoring system to weight the chances that the string is a markdown string
  // TODO: Check for tabs, spaces, and replace
  // TODO: return values from each of these RegExp (Strainer)
  markdownScore(raw) {
    let RegExpScore = new Object();
    RegExpScore.matchHeading1 = /^#{1}[? ]/.test(raw) ? 5 : 0; // very low score
    RegExpScore.matchHeading2 = /^#{2}[? ]/.test(raw) ? 10 : 0; // low score
    RegExpScore.matchHeading3 = /^#{3}[? ]/.test(raw) ? 15 : 0; // medium score
    RegExpScore.matchHeading4 = /^#{4}[? ]/.test(raw) ? 15 : 0; // medium score
    RegExpScore.matchHeading5 = /^#{5}[? ]/.test(raw) ? 20 : 0; // high score
    RegExpScore.matchHeading6 = /^#{6}[? ]/.test(raw) ? 30 : 0; // very high score
    // RegExpScore.matchBold = /^(*{2}|_{2}){1}(.+)+\1$/.test(raw); // medium score
    RegExpScore.matchItalic = /\*.*\*/.test(raw) ? 5 : 0; // low score
    RegExpScore.matchBold = /\*\*.*\*\*\*/.test(raw) ? 10 : 0; // low score
    RegExpScore.matchLink = /\[(.+)\]\(([^ ]+?)( "(.+)")?\)/.test(raw) ? 50 : 0; // very high score
    RegExpScore.total = 0;
    // total score:
    Object.values(RegExpScore).forEach((score) => {
      RegExpScore.total += score;
    });
    return RegExpScore;
  }
  // test raw string to see if it should be evaluated as HTML
  htmlScore(raw) {
    let RegExpScore =
      /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(
        raw
      );
    return RegExpScore;
  }
  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  makeNoodles(text) {
    return text.split("\n");
  }
  plateDish(noodles) {
    // converts raw noodles to a dish of spaghetti
    noodles.map(
      function (noodle, index) {
        this.outputElement.appendChild(noodle.htmlElement);
      }.bind(this)
    );
  }
  parseMarkdown(noodle) {
    // turn markdown text line into new clsElement();
  }
  parseHtml(noodle) {
    // turn html raw text line into new clsElement();
    let newElement = new clsElement();
    newElement.text = JSON.stringify(textLine);
    return newElement;
  }
  parseText(noodle) {
    // turn raw text line into new clsElement();
  }
}
class clsElement {
  constructor(props) {
    this.elementType = "div";
    this.format = "";
    this.text = "";
    this.htmlElement = document.createElement(this.elementType);
    this.htmlElement.innerHTML = this.text;
  }
}
