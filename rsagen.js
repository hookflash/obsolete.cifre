"use strict";
// Generate an RSA key B bits long and using public exponent E


var getRandomValues;
if (typeof window === "object" && window.crypto && window.crypto.getRandomValues) {
  getRandomValues = window.getRandomValues;
}
else if (typeof process === "object" && process.versions) {
  getRandomValues = function (buffer) {
    var bytes = buffer.BYTES_PER_ELEMENT;
    var length = buffer.length;
    var rand = require('crypto').randomBytes(length * bytes);
    var o = 0;
    for (var i = 0; i < length; i++) {
      buffer[i] = 0;
      for (var j = 0; j < bytes; j++) {
        buffer[i] |= rand[o++] << (j * 8);
      }
    }
  };
}
else {
  throw new Error("Your platform doesn't have a known secure rng");
}

function BigInt(num) {
  this.data = undefined;
  if (typeof num === "string") {
    this.fromHex(num);
  }
  else if (num >>> 0 === num) {
    this.data = new Uint32Array([num]);
  }
}
BigInt.ONE = new BigInt(1);

BigInt.prototype.fromRandom = function (bitLength) {
  var words = Math.ceil(bitLength / 32);
  this.data = new Uint32Array(words);
  getRandomValues(this.data);
  var l = bitLength % 32;
  if (l) {
    var mask = 0;
    for (var i = 0, l = bitLength % 32; i < l; i++) {
      mask |= 1 << i;
    }
    this.data[this.data.length - 1] &= mask;
  }
};
BigInt.prototype.fromHex = function (hex) {
  var words = Math.ceil(hex.length / 8);
  this.data = new Uint32Array(words);
  var end = hex.length;
  var start;
  for (var i = 0; i < words; i++) {
    start = Math.max(end - 8, 0);
    this.data[i] = parseInt(hex.substring(start, end), 16);
    end = start;
  }
};

BigInt.prototype.toHex = function () {
  var hex = "";
  for (var i = this.data.length - 1; i >= 0; i--) {
    hex += this.data[i].toString(16);
  }
  return hex;
};

BigInt.prototype.toBin = function () {
  var hex = "";
  for (var i = this.data.length - 1; i >= 0; i--) {
    hex += this.data[i].toString(2);
  }
  return hex;
};
BigInt.prototype.valueOf = function () {
  var num = 0;
  for (var i = 0, l = this.data.length; i < l; i++) {
    num += this.data[i] * Math.pow(0x100000000, i);
  }
  return num;
};

// BigInt.prototype.inspect = function () {
//   return "<" + this.constructor.name + " " + this.toHex() + ">";
// };

BigInt.prototype.subtract = function (other) {
  var result = new BigInt();
  result.data = new Uint32Array(Math.max(this.data.length, other.data.length));
  this.subTo(other, result);
  return result;
};

// result = this - other
BigInt.prototype.subTo = function (other, result) {
  console.log({
    a: this,
    b: other
  });
  var borrow = 0;
  for (var i = 0, l = other.data.length; i < l; i++) {
    var part = this.data[i];
    if (i < other.data.length) {
      part -= other.data[i] - borrow;
    }
    console.log({part:part})
    if (part < 0) {
      part += 0x100000000;
      borrow = 1;
    }
    result.data[i] = part;
  }
};

function gen(B, e) {
  var qs = B >> 1;
  var ee = new BigInt(e);
  for(;;) {
    for(;;) {
      var p = new BigInt(B-qs, true);
      if(p.subtract(BigInt.ONE).gcd(ee).compareTo(BigInt.ONE) == 0 && p.isProbablePrime(10)) break;
    }
    for(;;) {
      var q = new BigInt(qs, true);
      if(q.subtract(BigInt.ONE).gcd(ee).compareTo(BigInt.ONE) == 0 && q.isProbablePrime(10)) break;
    }
    if(p.compareTo(q) <= 0) {
      var t = p;
      p = q;
      q = t;
    }
    var p1 = p.subtract(BigInteger.ONE);
    var q1 = q.subtract(BigInteger.ONE);
    var phi = p1.multiply(q1);
    if(phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
      this.n = p.multiply(q);
      this.d = ee.modInverse(phi);
      this.dmp1 = this.d.mod(p1);
      this.dmq1 = this.d.mod(q1);
      this.coeff = q.modInverse(p);
      break;
    }
  }

}
Uint32Array.prototype.inspect = Buffer.prototype.inspect;
Uint16Array.prototype.inspect = Buffer.prototype.inspect;
Uint8Array.prototype.inspect = Buffer.prototype.inspect;


var a = new BigInt("1f2f3f4f5f6f7f8f9fafbfcfdfefff");
var b = new BigInt("102030405060708090a0b0c0d0e0f0");
var c = a.subtract(b);
console.log({
  a:a,
  b:b,
  c:c
});

var a = new BigInt("10000000000");
var b = new BigInt("1");
var c = a.subtract(b);
console.log({
  a:a,
  b:b,
  c:c
});

// gen(2048, 0x10001);
