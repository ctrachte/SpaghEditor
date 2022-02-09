// need a class that takes in a string, markdown or html and then maps to a JSON object

export default class TheChef {
  constructor(props) {
    (this.raw = props.raw),
      (this.json = props.json),
      (this.noodles = props.text),
      (this.html = props.html),
      (this.markdown = props.markdown),
      (this.devMode = true), // true if you want to see values logged
      (this.markdownScore = this.markdownScore.bind(this)),
      (this.WhatTypeIsThe = this.WhatTypeIsThe.bind(this)),
      console.log(this.raw);
    this.markdownScore(this.raw);
    this.noodles = this.seperateLines(this.raw);
    this.dish = this.parseText(this.noodles)
    console.log(this.dish);
  }
  //parent method to determine type
  WhatTypeIsThe(raw) {
    this.noodles = toString(raw);
    RegExpScore.htmlRegEx = new RegExp(/<\/?[a-z][\s\S]*>/i);
    this.type = {
      html: htmlRegEx.test(this.raw),
      markdownScore: markdownScore(this.raw),
      json: isJson(this.raw),
    };
  }
  // creates a scoring system to weight the chances that the string is a markdown string
  // TODO: Check for tabs, spaces, and replace
  // TODO: return values from each of these RegExp (Strainer)
  markdownScore(raw) {
    let RegExpScore = new Object();
    RegExpScore.matchHeading1 = /^#{1}[? ]/gm.test(raw) ? 5 : 0; // very low score
    RegExpScore.matchHeading2 = /^#{2}[? ]/gm.test(raw) ? 10 : 0; // low score
    RegExpScore.matchHeading3 = /^#{3}[? ]/gm.test(raw) ? 15 : 0; // medium score
    RegExpScore.matchHeading4 = /^#{4}[? ]/gm.test(raw) ? 15 : 0; // medium score
    RegExpScore.matchHeading5 = /^#{5}[? ]/gm.test(raw) ? 20 : 0; // high score
    RegExpScore.matchHeading6 = /^#{6}[? ]/gm.test(raw) ? 30 : 0; // very high score
    // RegExpScore.matchBold = /^(*{2}|_{2}){1}(.+)+\1$/gm.test(raw); // medium score
    RegExpScore.matchItalic = /\*.*\*/gm.test(raw) ? 5 : 0; // low score
    RegExpScore.matchBold = /\*\*.*\*\*\*/gm.test(raw) ? 10 : 0; // low score
    RegExpScore.matchLink = /\[(.+)\]\(([^ ]+?)( "(.+)")?\)/gm.test(raw)
      ? 50
      : 0; // very high score
    RegExpScore.total = 0;
    // total score:
    Object.values(RegExpScore).forEach((score) => {
      RegExpScore.total += score;
    });
    if (this.devMode) {
      console.log("Markdown RegEx Score: ", RegExpScore);
    }
  }
  seperateLines(text) {
    return text.split("\n");
  }

  parseText(textLinesArray) {

    //Pasting from MS Word
    //class="MsoNormal"

    //Parse by line
    let linesObjArr = [];
    for (let x = 0; x < textLinesArray.length; x++) {
      let line = textLinesArray[x];

      let newLine = [];
      //newLine.elements.push()
      let newElement = new clsElement();
      newElement.text = JSON.stringify(textLinesArray[x]);

      linesObjArr.push(newElement);
    }
    return linesObjArr;
    // console.log(JSON.stringify(linesObjArr));
    //editorel.value = '';

    // linesObjArr.forEach((line) =>
    // {
    //     console.log(line);
    //     //editorel.value += line + '\n';
    // });

    //editorel.value = JSON.stringify(linesObjArr);
  }
}
class clsElement
{
    constructor()
    {
        this.elementType = 'div';
        this.format = '';
        this.text = '';
        // this.htmlElement = document.createElement(this.elementType);
        // this.htmlElement.innerHTML = this.text;
    }
}
