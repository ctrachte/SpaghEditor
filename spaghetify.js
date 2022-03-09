export default class Possum {
  constructor(spaghetti, bait, trap) {
    this.spaghetti = spaghetti;
    this.bait = bait; // salt
    this.trap = trap; // hash key
    this.destroy = this.destroy.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.makeMess = this.makeMess.bind(this);
    this.takeBait = this.takeBait.bind(this);
    // Possum destroys the spagetti
    this.mess = destroy("salt", "Hello"); // -> 426f666665
    // chef cleans up the mess
    this.cleanUp = cleanUp("salt", "426f666665"); // -> Hello
    console.log("mess:", this.mess, "cleanUp", this.cleanUp);
  }
  makeMess(spaghetti) {
    spaghetti.split("").map((noodle) => noodle.charCodeAt(0));
  }
  takeByte = (noodle) => ("0" + Number(noodle).toString(16)).substring(-2);
  takeBait(bait) {
    this.makeMess(bait).reduce((a, b) => a ^ b, bait);
  }
  destroy() {
    return this.spaghetti
      .split("")
      .map(this.makeMess)
      .map(this.takeBait)
      .map(this.takeByte)
      .join("");
  }
  cleanUp() {
    return this.spaghetti
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(this.takeBait)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  }
}
