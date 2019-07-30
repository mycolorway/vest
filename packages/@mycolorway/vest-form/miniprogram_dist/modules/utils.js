"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.padString = padString;

function padString(string, length, padString) {
  if (string.length >= length) {
    return string + '';
  } else {
    var padResult = '';

    for (var i = 0; i < length - string.length; i++) {
      padResult += padString;
    }

    return padResult + string;
  }
}