export default class Possum {
  constructor(spaghetti, bait, trap) {
    this.spaghetti = spaghetti;
    this.bait = bait; // salt
    this.trap = trap; // hash key
    this.destroy = this.destroy.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    // Possum destroys the spagetti
    this.mess = this.destroy(this.bait, this.spaghetti); // -> 426f666665
    // chef cleans up the mess
    this.clean = this.cleanUp(this.bait, this.mess); // -> Hello
    console.log("mess:", this.mess, "cleanUp", this.clean);
  }
  makeMess(spaghetti) {
    return spaghetti.split("").map((noodle) => noodle.charCodeAt(0));
  }
  takeByte(noodle) {
    return ("0" + Number(noodle).toString(16)).substring(-2);
  }
  takeBait(bait) {
    return this.makeMess(bait).reduce((a, b) => a ^ b, bait);
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
