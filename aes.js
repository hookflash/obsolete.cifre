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

define('aes', function () {
  "use strict";

  // pre-computed multiplicative inverse in GF(2^8) used by subBytes and keyExpansion.
  var sBox = new Uint8Array([
    0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
    0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
    0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
    0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
    0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
    0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
    0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
    0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
    0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
    0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
    0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
    0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
    0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
    0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
    0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
    0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16,
  ]);

  var sBoxInv = new Uint8Array([
    0x52,0x09,0x6A,0xD5,0x30,0x36,0xA5,0x38,0xBF,0x40,0xA3,0x9E,0x81,0xF3,0xD7,0xFB,
    0x7C,0xE3,0x39,0x82,0x9B,0x2F,0xFF,0x87,0x34,0x8E,0x43,0x44,0xC4,0xDE,0xE9,0xCB,
    0x54,0x7B,0x94,0x32,0xA6,0xC2,0x23,0x3D,0xEE,0x4C,0x95,0x0B,0x42,0xFA,0xC3,0x4E,
    0x08,0x2E,0xA1,0x66,0x28,0xD9,0x24,0xB2,0x76,0x5B,0xA2,0x49,0x6D,0x8B,0xD1,0x25,
    0x72,0xF8,0xF6,0x64,0x86,0x68,0x98,0x16,0xD4,0xA4,0x5C,0xCC,0x5D,0x65,0xB6,0x92,
    0x6C,0x70,0x48,0x50,0xFD,0xED,0xB9,0xDA,0x5E,0x15,0x46,0x57,0xA7,0x8D,0x9D,0x84,
    0x90,0xD8,0xAB,0x00,0x8C,0xBC,0xD3,0x0A,0xF7,0xE4,0x58,0x05,0xB8,0xB3,0x45,0x06,
    0xD0,0x2C,0x1E,0x8F,0xCA,0x3F,0x0F,0x02,0xC1,0xAF,0xBD,0x03,0x01,0x13,0x8A,0x6B,
    0x3A,0x91,0x11,0x41,0x4F,0x67,0xDC,0xEA,0x97,0xF2,0xCF,0xCE,0xF0,0xB4,0xE6,0x73,
    0x96,0xAC,0x74,0x22,0xE7,0xAD,0x35,0x85,0xE2,0xF9,0x37,0xE8,0x1C,0x75,0xDF,0x6E,
    0x47,0xF1,0x1A,0x71,0x1D,0x29,0xC5,0x89,0x6F,0xB7,0x62,0x0E,0xAA,0x18,0xBE,0x1B,
    0xFC,0x56,0x3E,0x4B,0xC6,0xD2,0x79,0x20,0x9A,0xDB,0xC0,0xFE,0x78,0xCD,0x5A,0xF4,
    0x1F,0xDD,0xA8,0x33,0x88,0x07,0xC7,0x31,0xB1,0x12,0x10,0x59,0x27,0x80,0xEC,0x5F,
    0x60,0x51,0x7F,0xA9,0x19,0xB5,0x4A,0x0D,0x2D,0xE5,0x7A,0x9F,0x93,0xC9,0x9C,0xEF,
    0xA0,0xE0,0x3B,0x4D,0xAE,0x2A,0xF5,0xB0,0xC8,0xEB,0xBB,0x3C,0x83,0x53,0x99,0x61,
    0x17,0x2B,0x04,0x7E,0xBA,0x77,0xD6,0x26,0xE1,0x69,0x14,0x63,0x55,0x21,0x0C,0x7D,
  ]);

  var rCon = new Uint8Array([0x8d,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36]);

  var xTime = new Uint8Array(256);
  for (var i = 0; i < 128; i++) {
    xTime[i] = i << 1;
    xTime[i + 128] = (i << 1) ^ 0x1b;
  }

  // Accepts 16, 24, and 32 byte byte arrays in Uint8Array format.
  // Returns a new expanded key schedule array.
  function keyExpansion(key) {
    var length = key.length;
    if (!(length === 16 || length === 24 || length === 32)) {
      throw new TypeError("Only key lengths of 16, 24, and 32 are supported");
    }
    var size = length * 4 + 112;
    var state = new Uint8Array(size);
    state.set(key);
    for (var i = length; i < size; i += 4) {
      var o = i - length;
      var s0 = state[i - 4], b0 = state[o],
          s1 = state[i - 3], b1 = state[o + 1],
          s2 = state[i - 2], b2 = state[o + 2],
          s3 = state[i - 1], b3 = state[o + 3];
      if (i % length === 0) {
        // Combined rotate, sbox substitution, and rcon xor
        var st = s0;
        s0 = sBox[s1] ^ rCon[i / length];
        s1 = sBox[s2];
        s2 = sBox[s3];
        s3 = sBox[st];
      }
      else if ((length > 24) && (i % length === 16)) {
        s0 = sBox[s0];
        s1 = sBox[s1];
        s2 = sBox[s2];
        s3 = sBox[s3];
      }
      state[i]     = s0 ^ b0;
      state[i + 1] = s1 ^ b1;
      state[i + 2] = s2 ^ b2;
      state[i + 3] = s3 ^ b3;
    }
    return state;
  }

  // input is 16 bytes vector of input data that will be mutated in place.
  // key is the output on AES.keyExpansion(key) on a 16, 24, or 32 byte key.
  // vectors must implement .length and [] access. (JS array or Uint8Array)
  function encrypt(state, key) {
    addRoundKey(state, key, 0);
    for (var i = 16, l = key.length - 16; i < l; i += 16) {
      subBytes(state);
      shiftRows(state);
      mixColumns(state);
      addRoundKey(state, key, i);
    }
    subBytes(state);
    shiftRows(state);
    addRoundKey(state, key, i);
  }

  function decrypt(state, key) {
    var length = key.length;
    addRoundKey(state, key, length - 16);
    unshiftRows(state);
    unsubBytes(state);
    for (var i = length - 32; i >= 16; i -= 16) {
      addRoundKey(state, key, i);
      unmixColumns(state);
      unshiftRows(state);
      unsubBytes(state);
    }
    addRoundKey(state, key, 0);
  }

  function subBytes(state) {
    for (var i = 0, l = state.length; i < l; i++) {
      state[i] = sBox[state[i]];
    }
  }

  function unsubBytes(state) {
    for (var i = 0, l = state.length; i < l; i++) {
      state[i] = sBoxInv[state[i]];
    }
  }

  function addRoundKey(state, keySchedule, offset) {
    for (var i = 0, l = state.length; i < l; i++) {
      state[i] = state[i] ^ keySchedule[offset + i];
    }
  }

  // shift rows 0, 1, 2, and 3 columns left respectively
  function shiftRows(state) {
    var tmp = state[1];
    state[1] = state[5];
    state[5] = state[9];
    state[9] = state[13];
    state[13] = tmp;
    tmp = state[2];
    state[2] = state[10];
    state[10] = tmp;
    tmp = state[6];
    state[6] = state[14];
    state[14] = tmp;
    tmp = state[15];
    state[15] = state[11];
    state[11] = state[7];
    state[7] = state[3];
    state[3] = tmp;
  }

  // Undo a shiftRows action
  function unshiftRows(state) {
    var tmp = state[13];
    state[13] = state[9];
    state[9] = state[5];
    state[5] = state[1];
    state[1] = tmp;
    tmp = state[2];
    state[2] = state[10];
    state[10] = tmp;
    tmp = state[6];
    state[6] = state[14];
    state[14] = tmp;
    tmp = state[3];
    state[3] = state[7];
    state[7] = state[11];
    state[11] = state[15];
    state[15] = tmp;
  }

  function mixColumns(state) {
    for (var i = 0; i < 16; i += 4) {
      var s0 = state[i],     s2 = state[i + 2],
          s1 = state[i + 1], s3 = state[i + 3];
      var h = s0 ^ s1 ^ s2 ^ s3;
      state[i + 0] ^= h ^ xTime[s0 ^ s1];
      state[i + 1] ^= h ^ xTime[s1 ^ s2];
      state[i + 2] ^= h ^ xTime[s2 ^ s3];
      state[i + 3] ^= h ^ xTime[s3 ^ s0];
    }
  }

  function unmixColumns(state) {
    for (var i = 0; i < 16; i += 4) {
      var s0 = state[i],     s2 = state[i + 2],
          s1 = state[i + 1], s3 = state[i + 3];
      var h = s0 ^ s1 ^ s2 ^ s3;
      var xh = xTime[h];
      var h1 = xTime[xTime[xh ^ s0 ^ s2]] ^ h;
      var h2 = xTime[xTime[xh ^ s1 ^ s3]] ^ h;
      state[i + 0] ^= h1 ^ xTime[s0 ^ s1];
      state[i + 1] ^= h2 ^ xTime[s1 ^ s2];
      state[i + 2] ^= h1 ^ xTime[s2 ^ s3];
      state[i + 3] ^= h2 ^ xTime[s3 ^ s0];
    }
  }

  function ecbEncrypt(state, key) {
    if (key.length <= 32) { key = keyExpansion(key); }
    var length = state.length;
    if (length % 16 > 0) { throw new TypeError("Data length must be multiple of 16"); }
    for (var i = 0; i < length; i += 16) {
      var chunk = state.subarray(i, i + 16);
      encrypt(chunk, key);
      state.set(chunk, i);
    }
  }

  function ecbDecrypt(state, key) {
    if (key.length <= 32) { key = keyExpansion(key); }
    var length = state.length;
    if (length % 16 > 0) { throw new TypeError("Data length must be multiple of 16"); }
    for (var i = length - 16; i >= 0; i -= 16) {
      var chunk = state.subarray(i, i + 16);
      decrypt(chunk, key);
      state.set(chunk, i);
    }
  }

  function xorBlock(a, b) {
    for (var i = 0; i < 16; i++) {
      a[i] ^= b[i];
    }
  }

  function newIv() {
    var iv = new Uint8Array(16);
    window.crypto.getRandomValues(iv);
    return iv;
  }

  function cbcEncrypt(state, key, iv) {
    var length = state.length;
    if (length % 16 > 0) { throw new TypeError("Data length must be multiple of 16"); }
    if (key.length <= 32) { key = keyExpansion(key); }
    for (var i = 0; i < length; i += 16) {
      var chunk = state.subarray(i, i + 16);
      xorBlock(chunk, iv);
      encrypt(chunk, key);
      iv = chunk;
    }
  }

  function cbcDecrypt(state, key, iv) {
    var length = state.length;
    if (length % 16 > 0) { throw new TypeError("Data length must be multiple of 16"); }
    if (key.length <= 32) { key = keyExpansion(key); }
    var next = new Uint8Array(16);
    for (var i = 0; i < length; i += 16) {
      var chunk = state.subarray(i, i + 16);
      next.set(chunk);
      decrypt(chunk, key);
      xorBlock(chunk, iv);
      var t = next;
      next = iv;
      iv = t;
    }
  }

  function cfbEncrypt(state, key, iv) {
    var length = state.length;
    if (key.length <= 32) { key = keyExpansion(key); }
    iv = new Uint8Array(iv);
    for (var i = 0; i < length; i += 16) {
      encrypt(iv, key);
      for (var j = 0, m = length - i; j < 16 && j < m; j++) {
        state[j + i] = (iv[j] ^= state[j + i]);
      }
    }
  }

  function cfbDecrypt(state, key, iv) {
    var length = state.length;
    if (key.length <= 32) { key = keyExpansion(key); }
    iv = new Uint8Array(iv);
    for (var i = 0; i < length; i += 16) {
      encrypt(iv, key);
      for (var j = 0, m = length - i; j < 16 && j < m; j++) {
        var t = state[j + i];
        state[j + i] = iv[j] ^ t;
        iv[j] = t;
      }
    }
  }

  function ofbEncrypt(state, key, iv) {
    var length = state.length;
    if (key.length <= 32) { key = keyExpansion(key); }
    iv = new Uint8Array(iv);
    for (var i = 0; i < length; i += 16) {
      encrypt(iv, key);
      for (var j = 0, m = length - i; j < 16 && j < m; j++) {
        state[i + j] ^= iv[j];
      }
    }
  }

  function addOne(block) {
    var i = 15;
    while (block[i] === 0xff) {
      block[i--] = 0;
      if (i < 0) { i = 15; }
    }
    block[i] += 1;
  }

  function ctrEncrypt(state, key, iv) {
    var length = state.length;
    if (key.length <= 32) { key = keyExpansion(key); }
    var ctr = new Uint8Array(iv);
    for (var i = 0; i < length; i += 16) {
      if (i > 0) { addOne(ctr); }
      var nonce = new Uint8Array(ctr);
      encrypt(nonce, key);
      for (var j = 0, m = length - i; j < 16 && j < m; j++) {
        state[i + j] ^= nonce[j];
      }
    }
  }

  return {
    encrypt: encrypt,
    decrypt: decrypt,
    keyExpansion: keyExpansion,
    newIv: newIv,
    ecb: { encrypt: ecbEncrypt, decrypt: ecbDecrypt },
    cbc: { encrypt: cbcEncrypt, decrypt: cbcDecrypt },
    cfb: { encrypt: cfbEncrypt, decrypt: cfbDecrypt },
    ofb: { encrypt: ofbEncrypt, decrypt: ofbEncrypt },
    ctr: { encrypt: ctrEncrypt, decrypt: ctrEncrypt },
  };
});
