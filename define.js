// Simple browser module system.
// Copyright © 2012-2013 Tim Caswell
// Released under the MIT license.

var defines = {};
var modules = {};

function define(name, fn) {
  "use strict";
  defines[name] = fn;
}

function load(name) {
  "use strict";
  var module, define;
  module = modules[name];
  if (module !== undefined) {
    return module;
  }
  define = defines[name];
  if (define !== undefined) {
    delete defines[name];
    return modules[name] = define();
  }
  throw new Error("Cannot find module " + name);
}