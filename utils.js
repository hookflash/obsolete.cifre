// Utility bag for debugging and unit tests.
// Copyright © 2013 Hookflash Inc.
// Released under the MIT license.
// Written by Tim Caswell <tim@creationix.com>

define('utils', function () {
  "use strict";

  function hex(val) {
    if (val >>> 0 !== val) { return "  "; }
    if (val < 0x10) { return "0" + val.toString(16); }
    return val.toString(16);
  }

  // Dump a Uint8Array as a 4-row hex stream
  function dump(block) {
    if (!(block instanceof Uint8Array)) {
      block = new Uint8Array(block.buffer);
    }
    var rows = new Array(4);
    var width = Math.ceil(block.length / 4);
    for (var i = 0; i < 4; i++) {
      rows[i] = new Array(width);
      for (var j = 0; j < width; j++) {
        rows[i][j] = block[i + j * 4];
      }
    }
    console.log(rows.map(function (row) {
      return row.map(hex).join(",");
    }).join("\n"));
  }

  function fromhex(string) {
    var length = string.length;
    var array = new Uint8Array(length / 2);
    for (var i = 0; i < length; i += 2) {
      array[i / 2] = parseInt(string.substr(i, 2), 16);
    }
    return array;
  }

  function tohex(array) {
    var string = "";
    for (var i = 0, l = array.length; i < l; i++) {
      string += hex(array[i]);
    }
    return string;
  }

  // Convert a JS string into a UTF-8 encoded byte array.
  function stringToBuffer(string) {
    // Convert the unicode string to be the ASCII representation of
    // the UTF-8 bytes.
    string = unescape(encodeURIComponent(string));
    var length = string.length;
    var buf = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
      buf[i] = string.charCodeAt(i);
    }
    return buf;
  }

  return {
    dump: dump,
    tohex: tohex,
    fromhex: fromhex,
    stringToBuffer: stringToBuffer,
  };
});