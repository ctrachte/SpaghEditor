export default class Possum {
    // TODO: trap should be like a hashing key? implement hashing
  constructor(spaghetti, bait, trap) {
    this.spaghetti = spaghetti;
    this.bait = bait; // salt
    this.trap = trap; // hash key
    this.destroy = this.destroy.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
    this.takeBait = this.takeBait.bind(this);
    // Possum destroys the spagetti
    this.mess = this.destroy(); // -> 426f666665
    // chef cleans up the mess
    this.clean = this.cleanUp(); // -> Hello
    console.log("original input:", spaghetti, "mess:", this.mess, "cleanUp:", this.clean);
  }
  makeMess = (spaghetti) => spaghetti.split("").map((noodle) => noodle.charCodeAt(0))
  takeByte = (noodle) => ("0" + Number(noodle).toString(16)).substring(("0" + Number(noodle).toString(16)).length-2,("0" + Number(noodle).toString(16)).length)
  takeBait = (mess) => this.makeMess(this.bait).reduce((a, b) => a ^ b, mess);
  destroy() {
    return this.spaghetti
      .split("")
      .map(this.makeMess)
      .map(this.takeBait)
      .map(this.takeByte)
      .join("");
  }
  cleanUp() {
    return this.mess
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(this.takeBait)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  }
}
