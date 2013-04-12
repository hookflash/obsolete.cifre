var BigInteger = require('./forge/jsbn');

// Implements a subset or DER/BER codec needed for RSA keys.

var log256 = Math.log(256);

function encodeInteger(value) {
  if (value === 0) { return [0]; }
  var length = 1 + Math.floor(Math.log(value) / log256);
  var array = new Array(length);
  while (value) {
    array[--length] = value & 0xff;
    value /= 0x100;
  }
  return array;
}

function encodeBigInteger(value) {
  return value.toByteArray();
}

function encodeSequence(value) {
  var arr = [];
  for (var i = 0, l = value.length; i < l; i++) {
    arr = arr.concat(encode(value[i]));
  }
  return arr;
}

exports.encode = encode;
function encode(value) {

  var data;
  var type;
  if (value instanceof BigInteger) {
    data = encodeBigInteger(value);
    type = 0x02;
  }
  else if (typeof value === 'number') {
    data = encodeInteger(value);
    type = 0x02;
  }
  else if (Array.isArray(value)) {
    data = encodeSequence(value);
    type = 0x30;
  }
  else {
    throw new Error("Unknown value: " + value);
  }
  var length = data.length;
  if (length < 0x80) {
    return [type, length].concat(data);
  }
  var l = encodeInteger(length);
  return [type, l.length | 0x80].concat(l).concat(data);
}

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
