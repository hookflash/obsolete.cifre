// Build jsbn.js and rsa.js from third-party folder ./jsbn

var fs = require('fs');

var js =
'( // Module boilerplate to support browser globals, node.js and AMD.\n' +
'  (typeof module !== "undefined" && function (m) { module.exports = m(); }) ||\n' +
'  (typeof define === "function" && function (m) { define(m); }) ||\n' +
'  (function (m) { window.cifre_rsa = m(); })\n' +
')(function () {\n' +
'  "use strict";\n' +
[ "jsbn.js", "jsbn2.js", "prng4.js", "rng.js", "rsa.js", "rsa2.js"
].map(function (name) {
  return "\n////////////////////////////////////////////////////////////////////////////////\n" +
         "// " + name + "\n" +
         "////////////////////////////////////////////////////////////////////////////////\n\n"
         + fs.readFileSync(__dirname + "/jsbn/" + name, "utf8");
}).join("\n") +
'\n////////////////////////////////////////////////////////////////////////////////\n' +
'\n  return {\n' +
'    BigInteger: BigInteger,\n' +
'    RSAKey: RSAKey,\n' +
'    linebrk: linebrk,\n' +
'  };\n' +
'});\n';

console.log(js);
