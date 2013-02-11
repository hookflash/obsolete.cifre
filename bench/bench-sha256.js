var sha256 = require('../sha256');
var stringToBuffer = require('../utils').stringToBuffer;
var dump = require('../utils').dump;
var tohex = require('../utils').tohex;
var assert = require('assert');
var crypto = require('crypto');

function bench(fn) {
  var output;
  // console.log("Input");
  // dump(input);
  var before = Date.now();
  var count = 0;
  var each = 0;
  while (Date.now() - before < 300) {
    output = fn();
    each++;
  }
  before = Date.now();
  var delta;
  do {
    for (var i = 0; i < each; i++) {
      output = fn();
    }
    count += i;
    delta = Date.now() - before;
    console.log(Math.floor(count / delta * 1000));
  } while (delta < 2000)
  return output;
}

function nativeSha256(string) {
  var sha1sum = crypto.createHash('sha256');
  sha1sum.update(string);
  return sha1sum.digest('hex');
}

console.log("cifre-sha256");
var input = stringToBuffer("abc");
assert.equal(tohex(sha256(input)), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
console.log("VERIFIED, benchmarking...")
bench(function () { sha256(input); });

console.log("native-openssl-sha256");
assert.equal(nativeSha256("Hello World\n"), "d2a84f4b8b650937ec8f73cd8be2c74add5a911ba64df27458ed8229da804a26");
console.log("VERIFIED, benchmarking...")
bench(function () { nativeSha256("Hello World\n"); });
