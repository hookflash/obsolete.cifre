var utils = load('utils');
var aesCFB = load('aes').CFB;

// Generate a random key
var key = new Uint8Array(32);
crypto.getRandomValues(key);

console.log("key");
utils.dump(key);

var plainText = stringToBuffer("Hello!  How are you.");

console.log("plainText");
dump(plainText);

var encrypted = aesCFB.encrypt(plainText, key);

console.log("encrypted");
dump(encrypted);
