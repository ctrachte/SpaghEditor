

// need a class that takes in a string, markdown or html and then maps to a JSON object

class TheChef {
    constructor (props) {
        this.raw = props.raw,
        this.json = props.json,
        this.text = props.text,
        this.html = props.html,
        this.markdown = props.markdown,
        this.markdownScore = this.markdownScore.bind(this),
        this.WhatTypeIsThe = this.WhatTypeIsThe.bind(this)
    }
    //parent method to determine type
    WhatTypeIsThe (raw) {
        this.string = toString(raw);
        RegExpScore.htmlRegEx = new RegExp(/<\/?[a-z][\s\S]*>/i);
        this.type = {
            'html': htmlRegEx.test(this.raw),
            'markdownScore': markdownScore(this.raw),
            'json': isJson(this.raw),
        };
    }
    // creates a scoring system to weight the chances that the string is a markdown string
    markdownScore(raw) {
        this.RegExpScore = new Object();
        RegExpScore.matchHeading = /# [a-z]/gm.test(raw);
        RegExpScore.matchBold = /\*\*.*\*\*/gm.test(raw);
        RegExpScore.matchItalic = /\*.*\*/gm.test(raw);
        RegExpScore.matchLink = /\[(.+)\]\(([^ ]+?)( "(.+)")?\)/gm.test(raw);
    }
}