var BigInteger = require('cifre/rsa').BigInteger;

exports.decode = decode;
function decode(data) {
  var offset = 0;
 
  // Decode length headers
  function parseLength() {
    var value = data[offset++];
    if (value < 0x80) { return value; }
    return parseInteger(value & 0x7f);
  }

  function parseInteger(length) {
    var value = 0;
    for (var i = 0; i < length; i++) {
      value = (value << 8) | data[offset++];
    }
    return value;
  }

  function parseBigInteger(length) {
    var arr = new Array(length);
    for (var i =0; i < length; i++) {
      arr[i] = data[offset++];
    };
    return new BigInteger(arr, 256);
  }

  function parseSequence(length) {
    var arr = [];
    var end = offset + length;
    while (offset < end) {
      arr.push(parse());
    }
    return arr;
  }
  
  // Decode type headers
  function parse() {
    var type = data[offset++];
    var length = parseLength();
    var value;
    switch (type) {
      case 0x02:
        if (length > 6) return parseBigInteger(length);
        return parseInteger(length);
      case 0x30:
        return parseSequence(length);
      default:
        throw new Error("TODO: Implement data type 0x" + type.toString(16));
    }
  }

  return parse();
}
