( // Module boilerplate to support browser globals, node.js and AMD.
  (typeof module !== "undefined" && function (m) { module.exports = m(require('./utils'), require('./md5'), require('./sha1'), require('./sha256'), require('./aes'), require('./rsa')); }) ||
  (typeof define === "function" && function (m) { define(["./utils", "./md5", "./sha1", "./sha256", "./aes", "./rsa"], m); }) ||
  (function (m) { window.cifre = m(window.cifre_utils, window.cifre_md5, window.cifre_sha1, window.cifre.sha256, window.cifre_aes, window.cifre_rsa); })
)(function (utils, md5, sha1, sha256, aes, rsa) {
  return {
    utils: utils,
    md5: md5,
    sha1: sha1,
    sha256: sha256,
    aes: aes,
    rsa: rsa
  };
});
