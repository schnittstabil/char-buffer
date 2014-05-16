'use strict';
/**
  * @class CharBuffer
  */

/**
  * @method constructor
  *
  * Construct the {@link CharBuffer#_default} object.
  *
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *   {@link String#length length} of the {@link String} represented by this
  *   buffer).
  */
function CharBuffer(initCapacity){
  return CharBuffer._default.call(this, initCapacity);
}

/* istanbul ignore if: IE-fix */
if(!CharBuffer.name){
  CharBuffer.name = 'CharBuffer';
}

/**
  * @property {CharBuffer[]} CharBuffers
  * @static
  *
  * Array of all {@link CharBuffer.CharBuffer} implementations.
  */
CharBuffer.CharBuffers = [
  require('./char-buffer'),
  require('./string-buffer'),
  require('./string-array-buffer'),
  require('./typed-array-buffer'),
  require('./node-buffer')
];

/**
  * @property {String[]} [supported=["StringBuffer", "StringArrayBuffer",
  *   "TypedArrayBuffer", "NodeBuffer"]]
  * @static
  *
  * Names of the supported {@link CharBuffer.CharBuffer} implementations of the
  * current platform.
  */
CharBuffer.supported = [];

/**
  * @property {CharBuffer.CharBuffer} [_default=
  *   CharBuffers.filter(isSupported).last()]
  * @static
  * @private
  *
  * The default implementation of the current platform.
  * See [High-performance String Concatenation in JavaScript][1].
  *
  * [1]: http://www.sitepoint.com/javascript-fast-string-concatenation
  */
CharBuffer._default = null;


var i,
    buffer;

// last supported {@link CharBuffer.CharBuffers} becomes
// {@link CharBuffer._default}
for(i=0; i<CharBuffer.CharBuffers.length; i++){
  buffer = CharBuffer.CharBuffers[i];

  /* istanbul ignore else */
  if(buffer.isSupported){
    CharBuffer.supported.push(buffer.name);
    CharBuffer._default = buffer;
  }

  // export buffer
  CharBuffer[buffer.name] = buffer;
}

/* istanbul ignore next */
/**
  * @property {Boolean}
  * @static
  * Indicates whether any CharBuffer is supported by the current platform.
  */
CharBuffer.isSupported = CharBuffer._default ? CharBuffer._default.isSupported : false;

exports = module.exports = CharBuffer;
