'use strict';

/*jshint bitwise: false*/
// References:
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill
//   http://es5.github.com/#x15.4.4.18
function forEach(array, callback, thisArg) {
  var T,
      k = 0,
      kValue,
      O = Object(array),
      len = O.length >>> 0;

  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  if (arguments.length > 1) {
    T = thisArg;
  }

  while (k < len) {
    if (k in O) {
      kValue = O[k];
      callback.call(T, kValue, k, O);
    }
    k++;
  }
}
module.exports = forEach;
