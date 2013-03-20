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
    "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
  'contact:{"section":{"$id":"A","cipher":"sha256/aes256","created":1363698704,"expires":1426770704,"saltBundle":{"salt":{"$id":"c5f568521a24c5baf618d1ada3b8e300fdc963e0","#text":"432d09beaed2b7bd392a73c8c3dddf86098981bc"},"signature":{"reference":"#c5f568521a24c5baf618d1ada3b8e300fdc963e0","algorithm":"http://openpeer.org/2012/12/14/jsonsig#rsa-sha1","digestValue":"0a0f158931d9e6abe2e3d99a7841242762a86feb","digestSigned":"by5doZ5jRK12qi4lIFUdeHpYR7ta3AUesWQX0Odr9nUL9MsdJTyccLeZMXFt2dcQKtfIyzOwFkpUbQuH7IFB4JLgPnGkJW/WfEggGxisTSDr+CYi3NU0hStWDvC+m6OLXjQAOc0PeI3ketUSXcEiNukkOvxuBlflbE0Zf7/zXejG+9L6Ve/0z3eKsJ487gyjhPhGxgLoGb1G6+3jWNvBubUqVhYac3hVMvI95zIkZg44T25gnuEwKfXpkfKRZRptbuk1Dq6StA52ZBKn1xQM8z3akPj9CPLcSTW3Rb+CiG3tgyRxBl7nYBaJeGDWNxtF0B9ttBY46AV69ugrdJlRbA==","key":{"$id":"5d4e02f0800c0f354a72b2983914ca409ce6cf0c","domain":"unstable.hookflash.me","service":"salt"}}}}}',
  "dcbe8e9a46a0ab4441e5502f9561dd1d32cad5e6c09328df0eb0822b502c0bf3"
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
