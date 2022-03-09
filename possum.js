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
    this.generateKey = this.generateKey.bind(this);
    // // Possum destroys the spagetti
    // this.mess = this.destroy();
    // // janitor cleans up the mess
    // this.clean = this.janitor();
    // console.log(
    //   "original spaghetti (string):",
    //   spaghetti,
    //   "after possum makes a mess:",
    //   this.mess,
    //   "after Janitor Cleans:",
    //   this.clean
    // );
    this.generateKey(this.spaghetti.toString());
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
  makeMess = (spaghetti) => spaghetti.split("").map(this.codepoint);
  takeByte = (noodle) => {
    // console.log(Number(noodle))
    let number = "0" + Number(noodle).toString(16);
    // console.log(number.length);
    if (number.length !== 2) {
      return number.substring(number.length - 2, number.length);
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
  codepoint(string) {
    // console.log(string, string.codePointAt(0))
    return string.codePointAt(0);
  };
  stringToArrayBuffer(str) {
    const buff = new ArrayBuffer(str.length * 2); // Because there are 2 bytes for each char.
    const buffView = new Uint16Array(buff);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      buffView[i] = str.codePointAt(i);
    }
    return buff;
  };
  arrayBufferToString(buff) {
    return String.fromCodePoint.apply(null, new Uint16Array(buff));
  };
  async generateKey(string) {
    let context = this;
    const stringToEncrypt = string || context.spaghetti;
    console.log(stringToEncrypt)
    // https://github.com/diafygi/webcrypto-examples#rsa-oaep---generatekey
    // The resultant publicKey will be used to encrypt
    // and the privateKey will be used to decrypt.
    // Note: This will generate new keys each time, you must store both of them in order for
    // you to keep encrypting and decrypting.
    //
    // I warn you that storing them in the localStorage may be a bad idea, and it gets out of the scope
    // of this post.
    context.key = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-512" },
      },
      true,
      // This depends a lot on the algorithm used
      // Look down below https://auth0.com/docs/protocols/oauth2/redirect-users
      // and see the table. Since we're using RSA-OAEP we have encrypt and decrypt
      // available
      ["encrypt", "decrypt"]
    );
    console.log(context.key)

    // key will yield a key.publicKey and key.privateKey property.

    context.encryptedUri = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      context.key.publicKey,
      context.stringToArrayBuffer(stringToEncrypt)
    );
    console.log("encrypted:", context.arrayBufferToString(context.encryptedUri))
    context.msg = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      context.key.privateKey,
      context.encryptedUri
    );
    console.log('decrypted', context.arrayBufferToString(context.msg))
  };
}
