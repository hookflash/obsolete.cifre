var aes = require('../aes');
var dump = require('../utils').dump;
var tohex = require('../utils').tohex;
var fromhex = require('../utils').fromhex;
var assert = require('assert');
var crypto = require('crypto');

var data = {
  ecb: {
    key:    "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4",
    input:  "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710",
    output: "f3eed1bdb5d2a03c064b5a7e3db181f8591ccb10d410ed26dc5ba74a31362870b6ed21b99ca6f4f9f153e7b1beafed1d23304b7a39f9f3ff067d8d8f9e24ecc7"
  },
  cbc: {
    key:    "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4",
    iv:     "000102030405060708090a0b0c0d0e0f",
    input:  "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710",
    output: "f58c4c04d6e5f1ba779eabfb5f7bfbd69cfc4e967edb808d679f777bc6702c7d39f23369a9d9bacfa530e26304231461b2eb05e2c39be9fcda6c19078c6a9d1b"
  },
  cfb: {
    key:    "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4",
    iv:     "000102030405060708090a0b0c0d0e0f",
    input:  "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710",
    output: "dc7e84bfda79164b7ecd8486985d386039ffed143b28b1c832113c6331e5407bdf10132415e54b92a13ed0a8267ae2f975a385741ab9cef82031623d55b1e471"
  },
  ofb: {
    key:    "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4",
    iv:     "000102030405060708090a0b0c0d0e0f",
    input:  "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710",
    output: "dc7e84bfda79164b7ecd8486985d38604febdc6740d20b3ac88f6ad82a4fb08d71ab47a086e86eedf39d1c5bba97c4080126141d67f37be8538f5a8be740e484"
  },
  ctr: {
    key:    "603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4",
    iv:     "f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff",
    input:  "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710",
    output: "601ec313775789a5b7a7f504bbf3d228f443e3ca4d62b59aca84e990cacaf5c52b0930daa23de94ce87017ba2d84988ddfc9c58db67aada613c2dd08457941a6"
  }
};

Object.keys(data).forEach(function (mode) {
  var test = data[mode];
  var key = fromhex(test.key);
  var expandedKey = aes.keyExpansion(key);
  var iv = test.iv && fromhex(test.iv);
  var state = fromhex(test.input);
  console.log("Testing " + mode + " encryption...");
  aes[mode].encrypt(state, expandedKey, iv);
  assert.equal(tohex(state), test.output);
  console.log("Testing " + mode + " decryption...");
  aes[mode].decrypt(state, expandedKey, iv);
  assert.equal(tohex(state), test.input);
  test.iv && assert.equal(tohex(iv), test.iv);
  console.log("VERIFIED, benchmarking");
  bench(function () {
    aes[mode].encrypt(state, expandedKey, iv);
    aes[mode].decrypt(state, expandedKey, iv);
  });
  assert.equal(tohex(state), test.input);
  test.iv && assert.equal(tohex(iv), test.iv);
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
