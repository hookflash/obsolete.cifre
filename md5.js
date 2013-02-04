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
  (typeof define === "function" && function (m) { define("md5", m); }) ||
  (function (m) { window.aes = m(); })
)(function () {
  "use strict";

  // r specifies the per-round shift amounts
  var r = new Uint8Array([
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ]);

  // k is binary integer part of the sines of integers (Radians)
  var k = new  Uint32Array([
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
  ], true);

  function rotateLeft(x, c) {
    return (x << c) | (x >>> (32 - c));
  }

  // input is a Uint8Array bitstream of the data
  function md5(input) {

    // Pad the input and convert to Uint32Array
    var words = Math.ceil((input.length + 5) / 4);
    words += 16 - (words % 16);
    var expanded = new Uint8Array(words * 4);
    expanded.set(input);
    expanded[input.length] = 0x80;
    var o = expanded.length - 8;
    var l = input.length << 3;
    while (l) {
      expanded[o++] = l;
      l = l >>> 8;
    }

    expanded = new Uint32Array(expanded.buffer);

    var h = new Uint32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);

    // Process the message in successive 512-bit chunks:
    for (var j = 0, l = expanded.length; j < l; j += 16) {
      // break chunk into sixteen 32-bit words w[j], 0 ≤ j ≤ 15
      var w = expanded.subarray(j, j + 16);

      // Initialize the hash value for this chunk.
      var state = new Uint32Array(h);
      var sb = new Uint8Array(state.buffer);

      // Main Loop
      for (var i = 0; i < 64; i++) {
        var tmp = new Uint32Array(16);
        var v = new DataView(tmp.buffer);

        var f, g;
        if (i < 16) {
          f = (state[3] ^ (state[1] & (state[2] ^ state[3])));
          g = i;
        } else if (i < 32) {
          f = state[2] ^ (state[3] & (state[1] ^ state[2]))
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          f = state[1] ^ state[2] ^ state[3];
          g = (3 * i + 5) % 16;
        } else {
          f = state[2] ^ (state[1] | (~state[3]));
          g = (7 * i) % 16;
        }
        f = f >>> 0;

        var temp = state[3];
        state[3] = state[2];
        state[2] = state[1];
        state[1] = (state[1] + rotateLeft(state[0] + f + k[i] + w[g], r[i])) >>> 0;
        state[0] = temp;
      }
      h[0] += state[0];
      h[1] += state[1];
      h[2] += state[2];
      h[3] += state[3];
    }

    return new Uint8Array(h.buffer);
  }

  return md5;
});
