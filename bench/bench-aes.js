var aes = require('../aes');
var dump = require('../utils').dump;
var tohex = require('../utils').tohex;
var fromhex = require('../utils').fromhex;
var assert = require('assert');
var crypto = require('crypto');

var key = fromhex("603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4");
var iv = fromhex("000102030405060708090a0b0c0d0e0f");
var inputHex = "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710";
var expectedHex = "dc7e84bfda79164b7ecd8486985d386039ffed143b28b1c832113c6331e5407bdf10132415e54b92a13ed0a8267ae2f975a385741ab9cef82031623d55b1e471";

var state = fromhex(inputHex);
console.log("KEY");
dump(key)
console.log("IV");
dump(iv);
console.log("INPUT");
dump(state);
aes.cfb.encrypt(state, key, iv);
console.log("OUTPUT");
dump(state)

assert.equal(tohex(state), expectedHex);
// aes.cfb.encrypt()

console.log("VERIFIED, BENCHMARKING");
bench(function () {
  aes.cfb.encrypt(state, key, iv);
});


function bench(fn) {
  var output;
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
