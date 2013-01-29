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

  return {
    dump: dump,
    tohex: tohex,
    fromhex: fromhex
  };
});