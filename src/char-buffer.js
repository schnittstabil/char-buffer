'use strict';
import AbstractCharBuffer from './abstract-char-buffer';
import StringBuffer from './string-buffer';
import StringArrayBuffer from './string-array-buffer';
import TypedArrayBuffer from './typed-array-buffer';
import NodeBuffer from './node-buffer';

/**
  * @class CharBuffer
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
  * @property {String[]} [supported=["StringBuffer", "StringArrayBuffer",
  *   "TypedArrayBuffer", "NodeBuffer"]]
  * @static
  *
  * Names of the supported {@link CharBuffer.AbstractCharBuffer} implementations of the
  * current platform.
  */
CharBuffer.supported = supported;

/**
  * @property {CharBuffer[]} CharBuffers
  * @static
  *
  * Array of all {@link CharBuffer.AbstractCharBuffer} implementations.
  */
CharBuffer.CharBuffers = CharBuffers;

for (i = 0; i < CharBuffers.length; i++) {
  buffer = CharBuffers[i];

  // export buffer
  CharBuffer[buffer.name] = buffer;
}

export default CharBuffer;