Uint8Array.prototype.inspect = Buffer.prototype.inspect;
var utils = require('../utils');
var sha1 = require('../sha1');
var assert = require('assert');

var tests = [
  "", "da39a3ee5e6b4b0d3255bfef95601890afd80709",
  "a", "86f7e437faa5a7fce15d1ddcb9eaeaea377667b8",
  "abc", "a9993e364706816aba3e25717850c26c9cd0d89d",
  "message digest", "c12252ceda8be8994d5fa0290a47231c1d16aae3",
  "abcdefghijklmnopqrstuvwxyz", "32d10c7b8cf96570ca04ce37f2a19d84240d3a89",
  "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
    "84983e441c3bd26ebaae4aa1f95129e5e54670f1",
  "asdfasdfasdfasdfasdfasdfasdfasdfasdfsadfsadfsdfasdfasdfasdfasdfsf",
    "c834ca59bc7ca88127749729ed71babf0b1c963a"
]

describe("sha1", function () {

  for (var i = 0; i < tests.length; i += 2) {
    var input = tests[i];
    var expectedHex = tests[i + 1];
    it("Should hash '" + input + "' to '" + expectedHex + "'", function () {
      var hash = utils.tohex(sha1(utils.stringToArray(input)));
      assert.equal(expectedHex, hash);
    });
  }

});
