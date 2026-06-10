'use strict';

// Minimal chalk stub for Jest (CJS-compatible). Chalk v5 is ESM-only and
// cannot be loaded by Jest's CommonJS transform. The helper.js already has a
// try/catch fallback that makes chalk purely cosmetic; this stub satisfies
// the require() call so Jest does not fail during test collection.

const identity = (s) => s;

const handler = {
  get(_target, prop) {
    if (prop === 'level') return 3;
    if (prop === '__esModule') return false;
    return new Proxy(identity, handler);
  },
  apply(_target, _thisArg, args) {
    return args[0];
  },
};

const chalk = new Proxy(identity, handler);

module.exports = chalk;
module.exports.default = chalk;
