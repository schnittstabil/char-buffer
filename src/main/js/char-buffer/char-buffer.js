'use strict';
/**
  * @class CharBuffer.CharBuffer
  * @abstract
  *
  * Base class for all CharBuffers.
  */

/**
  * @method constructor
  *
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} represented by this
  *     buffer).
  */
function CharBuffer(initCapacity){
  if(!(this instanceof CharBuffer)){
    return new CharBuffer(initCapacity);
  }
}

/* istanbul ignore if: IE-fix */
if(!CharBuffer.name){
  CharBuffer.name = 'CharBuffer';
}

/**
  * @chainable
  * @abstract
  *
  * Appends a charCode to the buffer. The length of the buffer increases by 1.
  *
  * @param {Number} charCode The charCode to append.
  */
CharBuffer.prototype.append = undefined;

/**
  * @abstract
  *
  * Gets the length of the {@link String} represented by this buffer.
  * @return {Number} The length of the string.
  */
CharBuffer.prototype.getLength = undefined;

/**
  * @chainable
  * @abstract
  *
  * Sets the length of the {@link String} represented by this buffer.
  * @param {Number} newLength The new length.
  */
CharBuffer.prototype.setLength = undefined;

/**
  * @abstract
  *
  * Returns the {@link String} represented by this buffer.
  * @return {String} The string.
  */
CharBuffer.prototype.toString = undefined;

/**
  * @property {Boolean}
  * @static
  * @template
  * Indicates whether this CharBuffer is supported by the current platform.
  */
CharBuffer.isSupported = false;

module.exports = CharBuffer;
