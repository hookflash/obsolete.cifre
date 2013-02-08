var md5 = require('../md5');
var myers = require('./myers-md5');
var stringToBuffer = require('../utils').stringToBuffer;
var dump = require('../utils').dump;
var tohex = require('../utils').tohex;
var assert = require('assert');
var input = stringToBuffer("Hello World\n");
var crypto = require('crypto');

function bench(fn) {
  var output;
  console.log("Input");
  dump(input);
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

function nativeMd5(string) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(string);
  return md5sum.digest('hex');
}

console.log("cifre-md5");
assert.equal(tohex(md5(input)), "e59ff97941044f85df5297e1c302d260");
console.log("VERIFIED, benchmarking...")
bench(function () { md5(input); });

console.log("myers-md5");
assert.equal(myers("Hello World\n"), "e59ff97941044f85df5297e1c302d260");
console.log("VERIFIED, benchmarking...")
bench(function () { myers("Hello World\n"); });

console.log("native-openssl-md5");
assert.equal(nativeMd5("Hello World\n"), "e59ff97941044f85df5297e1c302d260");
console.log("VERIFIED, benchmarking...")
bench(function () { nativeMd5("Hello World\n"); });
