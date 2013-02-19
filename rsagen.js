"use strict";
Uint32Array.prototype.inspect = Buffer.prototype.inspect;
Uint16Array.prototype.inspect = Buffer.prototype.inspect;
Uint8Array.prototype.inspect = Buffer.prototype.inspect;

// // Generate an RSA key B bits long and using public exponent E


// function getPrime(words) {


// }


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

// function BigInt(num) {
//   this.data = undefined;
//   if (typeof num === "string") {
//     this.fromHex(num);
//   }
//   else if (num >>> 0 === num) {
//     this.data = new Uint32Array([num]);
//   }
// }
// BigInt.ONE = new BigInt(1);

// BigInt.prototype.fromRandom = function (bitLength) {
//   var words = Math.ceil(bitLength / 32);
//   this.data = new Uint32Array(words);
//   getRandomValues(this.data);
//   var l = bitLength % 32;
//   if (l) {
//     var mask = 0;
//     for (var i = 0, l = bitLength % 32; i < l; i++) {
//       mask |= 1 << i;
//     }
//     this.data[this.data.length - 1] &= mask;
//   }
// };
// BigInt.prototype.fromHex = function (hex) {
//   var words = Math.ceil(hex.length / 8);
//   this.data = new Uint32Array(words);
//   var end = hex.length;
//   var start;
//   for (var i = 0; i < words; i++) {
//     start = Math.max(end - 8, 0);
//     this.data[i] = parseInt(hex.substring(start, end), 16);
//     end = start;
//   }
// };

// BigInt.prototype.toHex = function () {
//   var hex = "";
//   for (var i = this.data.length - 1; i >= 0; i--) {
//     hex += this.data[i].toString(16);
//   }
//   return hex;
// };

// BigInt.prototype.toBin = function () {
//   var hex = "";
//   for (var i = this.data.length - 1; i >= 0; i--) {
//     hex += this.data[i].toString(2);
//   }
//   return hex;
// };
// BigInt.prototype.valueOf = function () {
//   var num = 0;
//   for (var i = 0, l = this.data.length; i < l; i++) {
//     num += this.data[i] * Math.pow(0x100000000, i);
//   }
//   return num;
// };

// // BigInt.prototype.inspect = function () {
// //   return "<" + this.constructor.name + " " + this.toHex() + ">";
// // };

// BigInt.prototype.subtract = function (other) {
//   var result = new BigInt();
//   result.data = new Uint32Array(Math.max(this.data.length, other.data.length));
//   this.subTo(other, result);
//   return result;
// };

// // result = this - other
// BigInt.prototype.subTo = function (other, result) {
//   console.log({
//     a: this,
//     b: other
//   });
//   var borrow = 0;
//   for (var i = 0, l = other.data.length; i < l; i++) {
//     var part = this.data[i];
//     if (i < other.data.length) {
//       part -= other.data[i] - borrow;
//     }
//     console.log({part:part})
//     if (part < 0) {
//       part += 0x100000000;
//       borrow = 1;
//     }
//     result.data[i] = part;
//   }
// };


// gen(2047, 0x10001);

// function gen(B, e) {
//   var qs = B >> 1;
//   var ee = new BigInt(e);
//   console.log("B-qs", B-qs);
//   console.log("qs", qs);
//   for(;;) {
//     for(;;) {
//       var p = new BigInt(B-qs, true);
//       if(p.subtract(BigInt.ONE).gcd(ee).compareTo(BigInt.ONE) == 0 && p.isProbablePrime(10)) break;
//     }
//     for(;;) {
//       var q = new BigInt(qs, true);
//       if(q.subtract(BigInt.ONE).gcd(ee).compareTo(BigInt.ONE) == 0 && q.isProbablePrime(10)) break;
//     }
//     if(p.compareTo(q) <= 0) {
//       var t = p;
//       p = q;
//       q = t;
//     }
//     var p1 = p.subtract(BigInteger.ONE);
//     var q1 = q.subtract(BigInteger.ONE);
//     var phi = p1.multiply(q1);
//     if(phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
//       this.n = p.multiply(q);
//       this.d = ee.modInverse(phi);
//       this.dmp1 = this.d.mod(p1);
//       this.dmq1 = this.d.mod(q1);
//       this.coeff = q.modInverse(p);
//       break;
//     }
//   }

// }


// var a = new BigInt("1f2f3f4f5f6f7f8f9fafbfcfdfefff");
// var b = new BigInt("102030405060708090a0b0c0d0e0f0");
// var c = a.subtract(b);
// console.log({
//   a:a,
//   b:b,
//   c:c
// });

// var a = new BigInt("10000000000");
// var b = new BigInt("1");
// var c = a.sub+tract(b);
// console.log({
//   a:a,
//   b:b,
//   c:c
// });

// gen(2048, 0x10001);



// Simple freeList for allocated arrays.
var pools = {};
function getArray(length, blank) {
  var pool = pools[length];
  // console.log("GET", length, pool && pool.length);
  if (!(pool && pool.length)) {
    // console.log("ALLOCATE NEW ARRAY", length);
    return new Uint32Array(length);
  }
  return pool.pop();
}
function returnArray(arr) {
  var length = arr.length;
  var pool = pools[length];
  if (!pool) { pool = pools[length] = []; }
  // if (pool.length > 10) return;
  pool.push(arr);
  // console.log("RETURN", length, pool.length);
}

function BigInt(data) {
  this.data = data;
}

// Static function to create a BigInt from a hex string
BigInt.fromHex = function (hex) {
  var num = new BigInt();
  var end = hex.length;
  var length = Math.ceil(end / 8);
  var data = num.data = getArray(length);
  var start;
  for (var i = 0; i < length; i++) {
    start = Math.max(end - 8, 0);
    data[i] = parseInt(hex.substring(start, end), 16);
    end = start;
  }
  return num;
};


// Static function to create a random BigInt of specified bit-length
BigInt.fromRandom = function (bits) {
  var num = new BigInt;
  var data = num.data = getArray(Math.ceil(bits / 32));
  getRandomValues(data);
  // Zero out extra bits if there are any
  var t = bits & 31;
  if (t > 0) {
    data[data.length - 1] &= ((1 << t) - 1);
  }
  return num;
};

// Extract the data from BigInt instance, but also allows array-like values
// and plain Number instances.
BigInt.fromAny = function (value) {
  if (typeof value === "number") {
    return new BigInt([value]);
  }
  if ("length" in value) {
    return new BigInt(value);
  }
  if (value instanceof BigInt) {
    return value;
  }
  throw new TypeError("Value must be Number, BigInt, array-like");
};

BigInt.prototype.clean = function () {
  returnArray(this.data);
  this.data = undefined;
};

//  value from this and returns result as new BigInt
BigInt.prototype.subtract = function (value) {
  value = BigInt.fromAny(value);
  var target = new BigInt(getArray(this.data.length));
  var j = value.data.length - 1;
  var i = this.data.length - 1;
  var borrow = 0;
  while (i >= 0) {
    var part = this.data[i] - borrow;
    if (j >= 0) {
      part -= value.data[j];
      j--;
    }
    if (part < 0) {
      part += 0x100000000;
      borrow = 1;
    }
    else {
      borrow = 0;
    }
    target.data[i] = part;
    i--;
  }
  return target;
};

// Adds value to this and returns result as new BigInt
BigInt.prototype.add = function (value) {
  value = BigInt.fromAny(value);
  var target = new BigInt(getArray(this.data.length));
  var j = value.data.length - 1;
  var i = this.data.length - 1;
  var carry = 0;
  while (i >= 0) {
    var part = this.data[i] + carry;
    if (j >= 0) {
      part += value.data[j];
      j--;
    }
    if (part >= 0x100000000) {
      part -= 0x100000000;
      carry = 1;
    }
    else {
      carry = 0;
    }
    target.data[i] = part;
    i--;
  }
  return target;
};

// Get a single bit from a number.
// Where position is bit position starting with 0 as LSB
BigInt.prototype.getBit = function (position) {
  var word = this.data[position >> 5] | 0;
  return (word >> (position % 32)) & 1;
};

// Get a single nibble (4 bits) from a number.
// Where position is nibble position starting with 0 as LSB
BigInt.prototype.getNibble = function (position) {
  var word = this.data[position >> 3] >>> 0;
  return (word >>> ((position % 8) << 2)) & 0xf;
};

// Binary gcd algorithm (HAC 14.54)
BigInt.prototype.gcd = function (value) {
  value = BigInt.fromAny(value);
  console.log(this, value);

  // While both x and y are even do the following: x=x/2, y=y/2, g=2*g
  // Optimized to just record shift offsets
  var g = 0;
  for(var g = 0;;g++) {
    console.log(g, this.getBit(g),value.getBit(g));
    if (this.getBit(g) || value.getBit(g)) break;
  }
  var a = g; // Shift bits to this
  var b = g; // Shift bits to value
  g = 1 << g;


  console.log({g:g})

};

// function rsaGenerate(bits, e) {
//   var qs = bits >> 1;
//   var pbits = bits - qs;
//   var p = new Uint32Array((pbits >> 4) + 1);
//   random(p, pbits);
//   console.log(pbytes);
// }

// var key = {
//   n: fromhex("222d69894dc368448550727b322043b481a924b4598ebbb8a71e33a5d229f332e75992c37986f5c994297bab2b304ebf80a56f4f6bfaea62398df02dcc381ee9a1fcf28294c7aecc4b5c2e957324ba825dee36d2a0b730200e22ba0e7dc6f6a2371ba3703dccc5ea1ffdbdbfb05b1514258de57c4f817d8c2ae16d372718d15ba4c8896547dd7d16ee2826dd3fa7b3a2975e2285f298f314007be15281cae0e01f540b2b7f4a3907c4846774b4451fd194f3bf8140b221e8f525c02b84ed91636b337629a47969b2166e9e4f4524b0fecdeac8541925f0bd46cd0cb779bb9781d8963927832633bd8648efa8f7352ed0104a77ca33dddbd95a07bee8f0ef180a3"),
//   e: fromhex("10001"),
//   d: fromhex("19bb0ec56c623d51b8fc83f3f41d0e5c0b72084c2f50a24bb6a5aa44a1212c139ad17908e9a98dca215dc9d9683e8a4aead3a225ad29cee3fc68bbf5fed6118fdb80d0233757ce65c826b27b99a0813a3cf56718d41e9680cba3a167df91b78510f021f012d6e3fa0bf3c0b35c56765c2099dfb7e3339e0db50ada6ab7689bd5bbd6d94a7520fa7c13efa4185b81b857a2ccafcd189b6c10572e698ed1866245a4cd12351d60bce34350909d30493d0c9d864fa3417b56d2a1030d408fef54d6b4ae85f0e968701ea916470e34de5f525b97c5ca1887a24d8d072332c94a6141807e29e029dc6f43737b1d7a4a59d97b156d4643f5582e5f18e2c417006d84f21"),
//   p: fromhex("17b34592ee021621c77ddcbc5be11bdb99b8a82cac2fd36ca7e10df242ab8a38723d3e8fa8c48f26efdd1507ca3042e4afbad492f31274efba6014064b49fff281ae1c0e977b55e1e5960630643d1cebb06e4ed21385e58b2b4108369316fc6f4e1b9e340ca8d8cc23da45fb62bbc01adc704ca4b3f99c618be8157a65251acd7"),
//   q: fromhex("1712b4d1f70246bdf426cad830d30bc8ece572e8d9489e960a8e3eb58231653eafcb329fb34b059c5772269581230d406ffd23e9c096506695402bd8b2fce39dbb9b566a15ce508b42bb2a14a5b0c978864daad491b4935093efe26a616035510052548ff2f2b137b9e599466f0892c5fa37758b0259a78d84853f541502ee515"),
//   dmp1: fromhex("13bd73c38f8e1955054de5ded54047edbeb9b9098c5941660ce63cb17daa5733f0a2e64acdacf9f6da6e7027ced627c14644fced709bfcddf78432e993280d90b5468983f5d3fa926ea1688241db4d0d5a24666e3f6894ea379ab0f693c8df74edbfbf23672ff37304a1b70c4d0e4851972dca089d06d8a3bede0d95a64d2367d"),
//   dmq1: fromhex("123a8c330a0479615f803a67dd030fdf7911b9dc2eb649dc5e908d0897c870a5bafb3d8ea0771802b1af94be2f1d433df27c3b2055302c6b2f65587ec6c2370e0a072a997b8ad9657c9e241bd5dfbafc8696dbed3f043c12c01e187255664e1925b8e5e82858071cf0b86d8510f9e40397b0b323d50281f6b389164456a94f215"),
//   coeff: fromhex("7c0cf8342001dab5fc1ed06d6e08f4f0b6b687a3b395df3a79125f8d2bd729cfc1e6526236fea195abdb3d39ff372b6bea8a8531ecc2a7df9d2112109960bf19116c752b507a56bfe40a825df7392f463ccf118de11bf375f79d2106d214897c699723004929cd1aa75074c5318acf3cb139429118b57d4cdab1f2b532a7b98a"),
// }

// console.log(key.p.length);


var a = BigInt.fromRandom(48);
a = BigInt.fromHex("fedcba987654")
console.log(a);
var bits = ""
for (var i = 0; i < 16*4; i++) {
  bits = a.getBit(i) + bits;
}
console.log(bits, parseInt(bits, 2).toString(16));

var nibbles = ""
for (var i = 0; i < 16; i++) {
  nibbles = a.getNibble(i).toString(16) + nibbles;
}
console.log(nibbles, parseInt(nibbles, 16).toString(16));


// var a = BigInt.fromAny(1764)
// var b = a.gcd(868);


// var bits = 2048;
// bench(function () {
//   var q = BigInt.fromRandom(bits / 2 + 8);
//   // console.log(q);
//   var t = q.subtract(1);
//   // console.log(t);
//   t.clean();
//   t = q.add(1);
//   // console.log(t);
//   t.clean();
//   q.clean();
// })


// function bench(fn) {
//   var output;
//   // console.log("Input");
//   // dump(input);
//   var before = Date.now();
//   var count = 0;
//   var each = 0;
//   while (Date.now() - before < 500) {
//     output = fn();
//     each++;
//   }
//   before = Date.now();
//   var delta;
//   do {
//     for (var i = 0; i < each; i++) {
//       output = fn();
//     }
//     count += i;
//     delta = Date.now() - before;
//     console.log(Math.floor(count / delta * 1000));
//   } while (delta < 2000)
//   return output;
// }
