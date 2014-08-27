'use strict';
var AbstractCharBuffer = require('./abstract-char-buffer');
var StringBuffer = require('./string-buffer');
var StringArrayBuffer = require('./string-array-buffer');
var TypedArrayBuffer = require('./typed-array-buffer');
var NodeBuffer = require('./node-buffer');

/**
  * @class CharBuffer
  * @extends CharBuffer.AbstractCharBuffer
  */

/**
  * @method constructor
  *
  * Construct the default default implementation of {@link CharBuffer.AbstractCharBuffer} of the current platform.
  *
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} represented by this
  *     buffer).
  */
var CharBuffer = null;

var supported = [],
    CharBuffers = [
      AbstractCharBuffer,
      StringBuffer,
      StringArrayBuffer,
      TypedArrayBuffer,
      NodeBuffer
    ],
    i,
    buffer;

// last supported {@link CharBuffer.CharBuffers} becomes
// {@link CharBuffer}
for (i = 0; i < CharBuffers.length; i++) {
  buffer = CharBuffers[i];

  /* istanbul ignore else */
  if (buffer.isSupported) {
    supported.push(buffer.name);
    CharBuffer = buffer;
  }
}

/**
  * @static
  * @property {String[]} [supported=["StringBuffer", "StringArrayBuffer",
  *   "TypedArrayBuffer", "NodeBuffer"]]
  *
  * Names of the supported {@link CharBuffer.AbstractCharBuffer} implementations of the
  * current platform.
  */
CharBuffer.supported = supported;

/**
  * @static
  * @property {CharBuffer[]} CharBuffers
  *
  * Array of all {@link CharBuffer.AbstractCharBuffer} implementations.
  */
CharBuffer.CharBuffers = CharBuffers;

for (i = 0; i < CharBuffers.length; i++) {
  buffer = CharBuffers[i];

  // export buffer
  CharBuffer[buffer.name] = buffer;
}

module.exports = CharBuffer;
