define(function (require, exports, module) {
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
  * @chainable
  * @abstract
  *
  * Write a charCode to the buffer at an offset.
  *
  * @param {Number} charCode The charCode to write.
  * @param {Number} offset The zero based offset to write at.
  * @throws {Error} if offset < 0 or offset > this.length
  */
CharBuffer.prototype.write = undefined;

/**
  * @abstract
  *
  * Read the charCode at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {Number} The charCode.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
CharBuffer.prototype.read = undefined;

/**
  * @abstract
  *
  * Read the charCode at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {Number} The charCode.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
CharBuffer.prototype.charCodeAt = undefined;

/**
  * @abstract
  *
  * Read the char at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {String} The char.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
CharBuffer.prototype.charAt = undefined;


/**
  * @property {Number} length Length of the {@link String} represented by this buffer.
  * @readonly
  */
CharBuffer.prototype.length = 0;

/**
  * @abstract
  *
  * Gets the length of the {@link String} represented by this buffer.
  * @return {Number} The length of the {@link String}.
  */
CharBuffer.prototype.getLength = function(){
  return this.length;
};

/**
  * @chainable
  *
  * Sets the length of the {@link String} represented by this buffer.
  * @param {Number} newLength The new length.
  * @throws {RangeError} if `newLength < 0 || newLength > this.length`
  */
CharBuffer.prototype.setLength = function(newLength){
  var msg;
  if(newLength < 0 || newLength > this.length){
    msg = 'newLength must be between 0 and ' + (this.length);
    msg += ', ' + newLength + ' given.';
    throw new RangeError(msg);
  }
  this.length = newLength;
  return this;
};

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

});
