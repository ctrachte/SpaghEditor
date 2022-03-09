export default class Possum {
  // TODO: trap should be like a hashing key? implement hashing
  // TODO: chars " and ' are not being translated back correctly
  constructor(spaghetti, bait, trap) {
    this.spaghetti = spaghetti;
    this.bait = bait; // salt
    this.trap = trap; // hash key
    this.destroy = this.destroy.bind(this);
    this.janitor = this.janitor.bind(this);
    this.takeBait = this.takeBait.bind(this);
    // Possum destroys the spagetti
    this.mess = this.destroy();
    // janitor cleans up the mess
    this.clean = this.janitor();
    console.log(
      "original spaghetti (string):",
      spaghetti,
      "after possum makes a mess:",
      this.mess,
      "after Janitor Cleans:",
      this.clean
    );
  }
  destroy = () =>
    this.spaghetti
      .split("")
      .map(this.makeMess)
      .map(this.takeBait)
      .map(this.takeByte)
      .join("");
  janitor = () =>
    this.mess
      .match(/.{1,2}/g)
      .map(this.mop)
      .map(this.takeBait)
      .map(this.reorganize)
      .join("");
  makeMess = (spaghetti) =>
    spaghetti.split("").map(this.codepoint);
  takeByte = (noodle) => {
    // console.log(Number(noodle))
    let number = "0" + Number(noodle).toString(16);
    // console.log(number.length);
    if (number.length !== 2) {
      return number.substring(
        (number.length - 2),
        (number.length)
      )
    } else {
      return number;
    }
  };
  takeBait = (mess) => this.makeMess(this.bait).reduce((a, b) => a ^ b, mess);
  mop = (pile) => {
    // console.log(pile);
    return parseInt(pile, 16);
  };
  reorganize = (mess) => {
    // console.log(mess);
    return String.fromCodePoint("0" + mess);
  };
  codepoint (string) {
      // console.log(string, string.codePointAt(0))
      return string.codePointAt(0);
  }
}
