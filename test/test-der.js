Uint8Array.prototype.inspect = Buffer.prototype.inspect;
var encode = require('../der').encode;
var decode = require('../der').decode;
var utils = require('../utils');
var fs = require('fs');
var assert = require('assert');
var BigInteger = require('../forge/jsbn');

/*
var pem = fs.readFileSync(__dirname + "/key.pem", "ascii");
pem = pem.split("\n").slice(1, -2).join("");
var der = new Buffer(pem, "base64");
var data;
*/

describe("der", function () {
/*
  it("Should decode an existing private key", function () {
    data = decode(der);
    assert(Array.isArray(data));
    assert.equal(data.length, 9);
    assert.equal(data[0], 0);
    assert.equal(data[2], 0x10001);
    assert(data[1] instanceof BigInteger);
  });

  it("Should encode back to the original", function () {
    var encoded = new Buffer(encode(data));
    var base64 = encoded.toString('base64');
    assert.equal(base64, pem);
  });
*/
});
