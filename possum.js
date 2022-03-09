export default class Possum {
  // TODO: trap should be like a hashing key? implement hashing
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
      "original input:",
      spaghetti,
      "mess:",
      this.mess,
      "Janitor:",
      this.clean
    );
  }
  makeMess = (spaghetti) =>
    spaghetti.split("").map((noodle) => noodle.charCodeAt(0));
  takeByte = (noodle) =>
    ("0" + Number(noodle).toString(16)).substring(
      ("0" + Number(noodle).toString(16)).length - 2,
      ("0" + Number(noodle).toString(16)).length
    );
  takeBait = (mess) => this.makeMess(this.bait).reduce((a, b) => a ^ b, mess);
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
      .map((scoop) => parseInt(scoop, 16))
      .map(this.takeBait)
      .map((noodle) => String.fromCharCode(noodle))
      .join("");
}
