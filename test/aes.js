Uint8Array.prototype.inspect = Buffer.prototype.inspect;
var ASSERT = require('assert');
var UTILS = require('../utils');
var AES = require('../aes');
var SHA256 = require('../forge/sha256')();
var FORGE_UTIL = require('../forge/util')();

describe("aes", function () {

  it("encrypt decrypt", function () {

      function arrayToHex(array) {      
        return FORGE_UTIL.bytesToHex(array.map(function(code) {
          return String.fromCharCode(code);
        }).join(''));
      }

      function hexToArray(base64) {
          var data = FORGE_UTIL.hexToBytes(base64);
          var length = data.length;
          var state = new Array(length);
          for (var i = 0; i < length; i++) {
            state[i] = data.charCodeAt(i);
          }
          return state;
      }

      function sha256(data) {
        var md = SHA256.create();
        md.start();
        md.update(data);
        return md.digest().toHex();
      }

      function encrypt(key, iv, data) {
        var length = data.length;
        var state = new Array(length);
        for (var i = 0; i < length; i++) {
          state[i] = data.charCodeAt(i);
        }
        AES.cfb.encrypt(state, AES.keyExpansion(UTILS.fromhex(key)), UTILS.fromhex(iv));
        return arrayToHex(state);
      }

      function decrypt(key, iv, data) {
        var state = hexToArray(data);
        AES.cfb.encrypt(state, AES.keyExpansion(UTILS.fromhex(key)), UTILS.fromhex(iv));
        return state.map(function(code) {
            return String.fromCharCode(code);
        }).join('');
      }

      var key = sha256("k9kgd9s87w6u8sjkksd84823kdnvbxez");
      var iv = "97ffb2cc1fcdc8d5daa4a12f107d894e";
      var data = '{"service":""}';

console.log("encrypted", encrypt(key, iv, data));
console.log("decrypted", decrypt(key, iv, encrypt(key, iv, data)));

      ASSERT.equal(decrypt(key, iv, encrypt(key, iv, data)), data);

      data = '{"service":"github"}';

console.log("encrypted", encrypt(key, iv, data));
console.log("decrypted", decrypt(key, iv, encrypt(key, iv, data)));

      ASSERT.equal(decrypt(key, iv, encrypt(key, iv, data)), data);

      data = decrypt.toString();

console.log("encrypted", encrypt(key, iv, data));
console.log("decrypted", decrypt(key, iv, encrypt(key, iv, data)));

      ASSERT.equal(decrypt(key, iv, encrypt(key, iv, data)), data);
  });
});
