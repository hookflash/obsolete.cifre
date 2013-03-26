/*

 Copyright (c) 2013 SMB Phone Inc.
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 The views and conclusions contained in the software and documentation are those
 of the authors and should not be interpreted as representing official policies,
 either expressed or implied, of the FreeBSD Project.

*/

( // Module boilerplate to support browser globals, node.js and AMD.
  (typeof module !== "undefined" && function (m) { module.exports = m(); }) ||
  (typeof define === "function" && function (m) { define(m); }) ||
  (function (m) { window.cifre_sha256 = m(); })
)(function(){
  "use strict";

  var K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);

  var state = new Uint32Array(8);
  var bstate = new Uint8Array(state.buffer);

  // Create a buffer for each 64 word block.
  var block = new Uint32Array(64);

  // function hex8(num) {
  //   var hex = num.toString(16).toUpperCase();
  //   return "00000000".substr(hex.length) + hex;
  // }

  function ror(n, i) {
    return (n << (32 - i)) | (n >>> i);
  }

  function fn1(e, f, g, h, w, k) {
    return (ror(e, 6) ^ ror(e, 11) ^ ror(e, 25)) +
           ((e & f) ^ ((~e) & g)) + h + w + k;
  }
  function fn2(a, b, c, p) {
    return p + (ror(a, 2) ^ ror(a, 13) ^ ror(a, 22)) +
           ((a & (b ^ c)) ^ (b & c));
  }

  function extend(block) {
    // Extend the block
    for (var i = 16; i < 64; i++) {
      var s0 = block[i - 15];
      s0 = ror(s0, 7) ^ ror(s0, 18) ^ (s0 >>> 3);
      var s1 = block[i - 2];
      s1 = ror(s1, 17) ^ ror(s1, 19) ^ (s1 >>> 10);
      block[i] = block[i - 16] + s0 + block[i - 7] + s1;
    }
  }

  function cycle(state, block) {

    var a = state[0],
        b = state[1],
        c = state[2],
        d = state[3],
        e = state[4],
        f = state[5],
        g = state[6],
        h = state[7],
        p;

    extend(block);

    // console.log("\nInitial hash value:");
    // for (var i = 0; i < 8; i++) {
    //   console.log("  H[" + i + "] = " + hex8(state[i]));
    // }
    // console.log("\nBlock Contents:");
    // for (var i = 0; i < 16; i++) {
    //     console.log("  W[" + i + "] = " + hex8(block[i]));
    // }


    // console.log("\n         A         B         C         D         E         F         G         H");
    // Partially unroll loops so we don't have to shift variables.
    for (var i = 0; i < 64; i += 8) {
      h = fn2(a, b, c, p = fn1(e, f, g, h, block[i], K[i])); d = (p + d);
      // console.log("t=%s: %s  %s  %s  %s  %s  %s  %s  %s", i,
      //   hex8(h), hex8(a), hex8(b), hex8(c), hex8(d), hex8(e), hex8(f), hex8(g));
      g = fn2(h, a, b, p = fn1(d, e, f, g, block[i + 1], K[i + 1])); c = (p + c);
      // console.log("t=%s: %s  %s  %s  %s  %s  %s  %s  %s", i + 1,
      //   hex8(g), hex8(h), hex8(a), hex8(b), hex8(c), hex8(d), hex8(e), hex8(f));
      f = fn2(g, h, a, p = fn1(c, d, e, f, block[i + 2], K[i + 2])); b = (p + b);
      // console.log("t=%s: %s  %s  %s  %s  %s  %s  %s  %s", i + 2,
      //   hex8(f), hex8(g), hex8(h), hex8(a), hex8(b), hex8(c), hex8(d), hex8(e));
      e = fn2(f, g, h, p = fn1(b, c, d, e, block[i + 3], K[i + 3])); a = (p + a);
      // console.log("t=%s: %s  %s  %s  %s  %s  %s  %s  %s", i + 3,
      //   hex8(e), hex8(f), hex8(g), hex8(h), hex8(a), hex8(b), hex8(c), hex8(d));
      d = fn2(e, f, g, p = fn1(a, b, c, d, block[i + 4], K[i + 4])); h = (p + h);
      // console.log("t=%s: %s  %s  %s  %s  %s  %s  %s  %s", i + 4,
      //   hex8(d), hex8(e), hex8(f), hex8(g), hex8(h), hex8(a), hex8(b), hex8(c));
      c = fn2(d, e, f, p = fn1(h, a, b, c, block[i + 5], K[i + 5])); g = (p + g);
      // console.log("t=%s: %s  %s  %s  %s  %s  %s  %s  %s", i + 5,
      //   hex8(c), hex8(d), hex8(e), hex8(f), hex8(g), hex8(h), hex8(a), hex8(b));
      b = fn2(c, d, e, p = fn1(g, h, a, b, block[i + 6], K[i + 6])); f = (p + f);
      // console.log("t=%s: %s  %s  %s  %s  %s  %s  %s  %s", i + 6,
      //   hex8(b), hex8(c), hex8(d), hex8(e), hex8(f), hex8(g), hex8(h), hex8(a));
      a = fn2(b, c, d, p = fn1(f, g, h, a, block[i + 7], K[i + 7])); e = (p + e);
      // console.log("t=%s: %s  %s  %s  %s  %s  %s  %s  %s", i + 7,
      //   hex8(a), hex8(b), hex8(c), hex8(d), hex8(e), hex8(f), hex8(g), hex8(h));
    }

    // console.log();
    // process.stdout.write("H[0] = " + hex8(state[0]) + " + " + hex8(a));
    state[0] += a;
    // console.log(" = " + hex8(state[0]));
    // process.stdout.write("H[1] = " + hex8(state[1]) + " + " + hex8(b));
    state[1] += b;
    // console.log(" = " + hex8(state[1]));
    // process.stdout.write("H[2] = " + hex8(state[2]) + " + " + hex8(c));
    state[2] += c;
    // console.log(" = " + hex8(state[2]));
    // process.stdout.write("H[3] = " + hex8(state[3]) + " + " + hex8(d));
    state[3] += d;
    // console.log(" = " + hex8(state[3]));
    // process.stdout.write("H[4] = " + hex8(state[4]) + " + " + hex8(e));
    state[4] += e;
    // console.log(" = " + hex8(state[4]));
    // process.stdout.write("H[5] = " + hex8(state[5]) + " + " + hex8(f));
    state[5] += f;
    // console.log(" = " + hex8(state[5]));
    // process.stdout.write("H[6] = " + hex8(state[6]) + " + " + hex8(g));
    state[6] += g;
    // console.log(" = " + hex8(state[6]));
    // process.stdout.write("H[7] = " + hex8(state[7]) + " + " + hex8(h));
    state[7] += h;
    // console.log(" = " + hex8(state[7]));

  }

  function sha256(input) {
    var inputLength = input.length;

    // Pad the input string length.
    var length = inputLength + 9;
    length += 64 - (length % 64);

    state[0] = 0x6a09e667;
    state[1] = 0xbb67ae85;
    state[2] = 0x3c6ef372;
    state[3] = 0xa54ff53a;
    state[4] = 0x510e527f;
    state[5] = 0x9b05688c;
    state[6] = 0x1f83d9ab;
    state[7] = 0x5be0cd19;

    for (var offset = 0; offset < length; offset += 64) {

      // Copy input to block and write padding as needed
      for (var i = 0; i < 64; i++) {
        var b = 0,
            o = offset + i;
        if (o < inputLength) {
          b = input[o];
        }
        else if (o === inputLength) {
          b = 0x80;
        }
        else {
          // Write original bit length as a 64bit big-endian integer to the end.
          var x = length - o - 1;
          if (x >= 0 && x < 4) {
            b = (inputLength << 3 >>> (x * 8)) & 0xff;
          }
        }
        // Interpret the input bytes as big-endian per the spec
        if (i % 4 === 0) {
          block[i >> 2] = b << 24;
        }
        else {
          block[i >> 2] |= b << ((3 - (i % 4)) * 8);
        }
      }

      cycle(state, block);
    }

    // Swap the bytes around since they are little endian internally
    return [
      bstate[3], bstate[2], bstate[1], bstate[0],
      bstate[7], bstate[6], bstate[5], bstate[4],
      bstate[11], bstate[10], bstate[9], bstate[8],
      bstate[15], bstate[14], bstate[13], bstate[12],
      bstate[19], bstate[18], bstate[17], bstate[16],
      bstate[23], bstate[22], bstate[21], bstate[20],
      bstate[27], bstate[26], bstate[25], bstate[24],
      bstate[31], bstate[30], bstate[29], bstate[28],
    ];
  }

  return sha256;
});
