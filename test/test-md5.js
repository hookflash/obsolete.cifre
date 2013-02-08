Uint8Array.prototype.inspect = Buffer.prototype.inspect;
var utils = require('../utils');
var md5 = require('../md5');
var assert = require('assert');

var tests = [
  "", "d41d8cd98f00b204e9800998ecf8427e",
  "a", "0cc175b9c0f1b6a831c399e269772661",
  "abc", "900150983cd24fb0d6963f7d28e17f72",
  "message digest", "f96b697d7cb7938d525a2f31aaf161d0",
  "abcdefghijklmnopqrstuvwxyz", "c3fcd3d76192e4007dfb496cca67e13b",
]

describe("md5", function () {

  for (var i = 0; i < tests.length; i += 2) {
    var input = tests[i];
    var expectedHex = tests[i + 1];
    it("Should hash '" + input + "' to '" + expectedHex + "'", function () {
      var hash = utils.tohex(md5(utils.stringToBuffer(input)));
      assert.equal(expectedHex, hash);
    });
  }

});
