Uint8Array.prototype.inspect = Buffer.prototype.inspect;
var utils = require('../utils');
var sha256 = require('../sha256');
var assert = require('assert');

var tests = [
  "", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "a", "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
  "abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  "message digest", "f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650",
  "abcdefghijklmnopqrstuvwxyz", "71c480df93d6ae2f1efad1447c66c9525e316218cf51fc8d9ed832f2daf18b73",
  "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
    "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1"
]

describe("sha256", function () {

  for (var i = 0; i < tests.length; i += 2) {
    var input = tests[i];
    var expectedHex = tests[i + 1];
    it("Should hash '" + input + "' to '" + expectedHex + "'", function () {
      var hash = utils.tohex(sha256(utils.stringToArray(input)));
      assert.equal(expectedHex, hash);
    });
  }

});
