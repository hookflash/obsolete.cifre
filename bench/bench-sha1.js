var sha1 = require('../sha1');
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

function nativeSha1(string) {
  var sha1sum = crypto.createHash('sha1');
  sha1sum.update(string);
  return sha1sum.digest('hex');
}

console.log("cifre-sha1");
var input = stringToBuffer("abc");
assert.equal(tohex(sha1(input)), "a9993e364706816aba3e25717850c26c9cd0d89d");
console.log("VERIFIED, benchmarking...")
bench(function () { sha1(input); });


console.log("native-openssl-sha1");
assert.equal(nativeSha1("Hello World\n"), "648a6a6ffffdaa0badb23b8baf90b6168dd16b3a");
console.log("VERIFIED, benchmarking...")
bench(function () { nativeSha1("Hello World\n"); });
