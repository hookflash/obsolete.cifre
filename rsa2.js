
function BigInt(num) {
  if (num) {
    this.digits = [num];
    this.bitLength = Math.floor(Math.log(num) / Math.log(2)) + 1;
  }
  else {
    this.digits = [];
    this.bitLength = 0;
  }
}

// Constructs a randomly generated positive BigInt that is probably prime, with the specified bitLength.
BigInt.randomPrime = function (bitLength, certainty) {
  var self = BigInt.zero(bitLength);
  while (true) {
    self.randomize();
    self.digits[0] |= 1;
    console.log(self.toHex());
    if (self.isProbablePrime(certainty)) {
      console.log("YES!");
      return self;
    }
    console.log("NO...")
  }
  throw new Error("Gave up");
};


// Constructs a empty zero value with specefied bitlength
BigInt.zero = function (bitLength) {
  var self = new BigInt();
  self.bitLength = bitLength;
  self.digits = new Uint32Array(((bitLength - 1) >> 5) + 1);
  return self;
};

BigInt.fromHex = function (hex) {
  var num = new BigInt();
  var end = hex.length;
  var num = BigInt.zero(end * 4);
  var length = num.digits.length;
  var start;
  for (var i = 0; i < length; i++) {
    start = Math.max(end - 8, 0);
    num.digits[i] = parseInt(hex.substring(start, end), 16);
    end = start;
  }
  return num;

};

BigInt.prototype.randomize = function () {
  // Fill with safe random bits
  window.crypto.getRandomValues(this.digits);
  // Zero out extra bits if there are any
  var extra = this.bitLength & 31;
  if (extra > 0) {
    this.digits[this.digits.length - 1] &= ((1 << extra) - 1);
  }
};

var lowPrimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,
  83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,
  191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,
  293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,
  419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,
  541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,
  653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,
  787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,
  919,929,937,941,947,953,967,971,977,983,991,997];
var numLowPrimes = lowPrimes.length;
var lplim = Math.ceil((1 << 26) / lowPrimes[lowPrimes.length-1]);

// (public) test primality with certainty >= 1-.5^t
BigInt.prototype.isProbablePrime = function (t) {

  // For tiny numbers (10 bits or less), just look up in the primes table
  if (this.bitLength <= 10) {
    var digit = this.digits[0];
    for (var i = 0; i < numLowPrimes; i++) {
      if (digit === lowPrimes[i]) return true;
    }
  }

  // Fail all even numbers
  if (this.getLowestSetBit() > 0) return false;

  // Check for composites related to the known prime list
  var i = 1;
  while (i < numLowPrimes) {
    var m = lowPrimes[i];
    var j = i + 1;
    while (j < numLowPrimes && m < lplim) {
      m *= lowPrimes[j++];
    }
    m = this.modInt(m);
    while (i < j) {
      if (m % lowPrimes[i++] === 0) return false;
    }
  }

  console.log("Passed quick check")


  // Check using Miller-Rabin

  // Skip the first bit to simulate subtracting by 1
  var k = this.getLowestSetBit(1);

  var r = this.shiftRight(k);
  t = Math.min((t + 1) >> 1, numLowPrimes);
  for (var i = 0; i < t; i++) {
    // Pick bases at random, instead of starting at 2
    var a = new BigInt(lowPrimes[Math.floor(Math.random() * numLowPrimes)]);

    var y = a.modPow(r, this);
  //   var y = a.modPow(r,this);
  //   if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
  //     var j = 1;
  //     while(j++ < k && y.compareTo(n1) != 0) {
  //       y = y.modPowInt(2,this);
  //       if(y.compareTo(BigInteger.ONE) == 0) return false;
  //     }
  //     if(y.compareTo(n1) != 0) return false;
  //   }
  }
  return true;

};

BigInt.prototype.toHex = function () {
  var str = "";
  for (var i = this.digits.length - 1; i >= 0; i--) {
    var part = this.digits[i].toString(16);
    str += "00000000".substr(part.length) + part;
  }
  return str;
};

// Returns the position of the lowest set bit or -1 for all zero.
BigInt.prototype.getLowestSetBit = function (start) {
  for (var i = start || 0; i < this.bitLength; i += 32) {
    var o = i >> 5;
    for (var j = 0, l = Math.max(32, this.bitLength - i); j < l; j++) {
      if (this.digits[o] & (1<<j)) return i + j;
    }
  }
  return -1;
};

BigInt.prototype.shiftRight = function (bits) {
  var copy = BigInt.zero(this.bitLength - bits);
  var diff = bits >> 5;
  if (bits % 32 === 0) {
    for (var i = 0, l = copy.digits.length; i < l; i++) {
      copy.digits[i] = this.digits[i + diff];
    }
    return copy;
  }
  var mod = bits % 32;
  for (var i = 0, l = copy.digits.length; i < l; i++) {
    copy.digits[i] = (this.digits[i + diff] >>> mod) +
                     (this.digits[i + diff + 1] << (32 - mod));
  }
  return copy;
}

// return this % n when n < 2^26
BigInt.prototype.modInt = function (n) {
  if (n <= 0) return 0;
  var remainder = 0;
  for (var i = this.digits.length - 1; i >= 0; i--) {
    remainder = (this.digits[i] + remainder * 0x100000000) % n;
  }
  return remainder;
};

// var string = "ffeeddccbbaa99887766554433221100"
// var a = BigInt.fromHex(string);
// console.log(a.toHex());
// for (var i = 0; i < 120; i += 1) {
//   console.log(i, a.shiftRight(i).toHex());
// }

console.log(BigInt.randomPrime(1032, 10));
