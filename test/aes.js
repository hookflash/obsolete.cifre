Uint8Array.prototype.inspect = Buffer.prototype.inspect;
var ASSERT = require('assert');
var UTILS = require('../utils');
var AES = require('../aes');
var SHA256 = require('../forge/sha256')();
var FORGE_UTIL = require('../forge/util')();

describe("aes", function () {

  it("encrypt decrypt", function () {

      function sha256(data) {
        var md = SHA256.create();
        md.start();
        md.update(data);
        return md.digest().toHex();
      }

      function encrypt(key, ivHex, plainText) {
        var state = UTILS.stringToArray(plainText);
        AES.cfb.encrypt(state, AES.keyExpansion(UTILS.fromhex(key)), UTILS.fromhex(ivHex));
            console.log("\nEXPANDED KEY");
            UTILS.dump(AES.keyExpansion(UTILS.fromhex(key)));
            console.log("IV");
            UTILS.dump(UTILS.fromhex(ivHex));
            console.log("GIVEN PLAIN TEXT");
            UTILS.dump(UTILS.stringToArray(plainText));
            console.log("CALCULATED ENCRYPTED TEXT");
            UTILS.dump(state);
        return UTILS.tohex(state);
      }

      function decrypt(key, ivHex, cipherHex) {
        var state = UTILS.fromhex(cipherHex);

        AES.cfb.decrypt(state, AES.keyExpansion(UTILS.fromhex(key)), UTILS.fromhex(ivHex));

            console.log("\nEXPANDED KEY");
            UTILS.dump(AES.keyExpansion(UTILS.fromhex(key)));
            console.log("IV");
            UTILS.dump(UTILS.fromhex(ivHex));
            console.log("GIVEN ENCRYPTED TEXT");
            UTILS.dump(UTILS.fromhex(cipherHex));
            console.log("CALCULATED PLAIN TEXT");
            UTILS.dump(state);
        return arrayToAscii(state);
      }

      var key = sha256("k9kgd9s87w6u8sjkksd84823kdnvbxez");
      var ivHex = "97ffb2cc1fcdc8d5daa4a12f107d894e";
      var data = '{"service":""}';

console.log("input", data);
      var encrypted = encrypt(key, ivHex, data);
console.log("encrypted", encrypted);
      var decrypted = decrypt(key, ivHex, encrypted);
console.log("decrypted", decrypted);
      ASSERT.equal(data, decrypted, data);

      data = '{"service":"github"}';

console.log("input", data);
      var encrypted = encrypt(key, ivHex, data);
console.log("encrypted", encrypted);
      var decrypted = decrypt(key, ivHex, encrypted);
console.log("decrypted", decrypted);
      ASSERT.equal(data, decrypted, data);

      data = decrypt.toString();

console.log("input", data);
      var encrypted = encrypt(key, ivHex, data);
console.log("encrypted", encrypted);
      var decrypted = decrypt(key, ivHex, encrypted);
console.log("decrypted", decrypted);
      ASSERT.equal(data, decrypted, data);

  });
});

function arrayToAscii(array) {
  var string = "";
  for (var i = 0, l = array.length; i < l; i++) {
    string += String.fromCharCode(array[i]);
  }
  return string;
}

