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
  (typeof define === "function" && function (m) { define("sha1", m); }) ||
  (function (m) { window.sha1 = m(); })
)(function(){
  "use strict";

  // input is a Uint8Array bitstream of the data
  return function(input){
    var H = new Uint32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]),
      m = [],
      l  = input.length * 8,
      w  = [];

    for (var i = 0, b = 0; i < l/8; i++, b += 8) m[b >>> 5] |= input[i] << (24 - b % 32);

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >>> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4];

      for (var j = 0; j < 80; j++) {
        if (j < 16)
          w[j] = m[i + j];
        else {
          var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
          w[j] = (n << 1) | (n >>> 31);
        }
        
        var t = ((H[0] << 5) | (H[0] >>> 27)) + H[4] + (w[j] >>> 0) + (
                j < 20 ? (H[1] & H[2] | ~H[1] & H[3]) + 0x5a827999 :
                j < 40 ? (H[1] ^ H[2] ^ H[3]) + 0x6ed9eba1 :
                j < 60 ? (H[1] & H[2] | H[1] & H[3] | H[2] & H[3]) - 0x70e44324 :
                         (H[1] ^ H[2] ^ H[3]) - 0x359d3e2a);

        H[4] = H[3];
        H[3] = H[2];
        H[2] = (H[1] << 30) | (H[1] >>> 2);
        H[1] = H[0];
        H[0] = t;
      }

      H[0] += a;
      H[1] += b;
      H[2] += c;
      H[3] += d;
      H[4] += e;
    }
      
    return new Uint32Array(H.buffer);
  }
});