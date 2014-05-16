'use strict';
var CharBuffer = require('./char-buffer');

/**
  * @class CharBuffer.StringArrayBuffer
  * @extends CharBuffer.CharBuffer
  *
  * {@link CharBuffer.CharBuffer} implementation using an {@link Array} of
  * {@link String}s.
  */

/**
  * @method constructor
  *
  * Constructs a StringArrayBuffer representing an empty {@link String}.
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} represented by this
  *     buffer).
  */
function StringArrayBuffer(initCapacity){
  if(!(this instanceof StringArrayBuffer)){
    return new StringArrayBuffer(initCapacity);
  }
  initCapacity = initCapacity || 16;
  this._buffer = new Array(initCapacity);
  this._length = 0;
}

StringArrayBuffer.prototype = new CharBuffer();

/* istanbul ignore if: IE-fix */
if(!StringArrayBuffer.name){
  StringArrayBuffer.name = 'StringArrayBuffer';
}

/**
  * Appends a charCode to the buffer using
  * {@link String#fromCharCode} and {@link Array#push []}.
  *
  * @param {Number} charCode The charCode to append.
  */
StringArrayBuffer.prototype.append = function(charCode){
  this._buffer[this._length++] = String.fromCharCode(charCode);
  return this;
};

/** */
StringArrayBuffer.prototype.setLength = function(newLength){
  var msg;
  if(newLength < 0 || newLength > this._buffer.length){
    msg = 'newLength must be between 0 and ' + (this._buffer.length);
    msg += ', ' + newLength + ' given.';
    throw new RangeError(msg);
  }
  this._length = newLength;
  return this;
};

/** */
StringArrayBuffer.prototype.getLength = function(){
  return this._length;
};

/**
  * Returns the {@link String} represented by this buffer.
  * @return {String} The string.
  */
StringArrayBuffer.prototype.toString = function(){
  return this._buffer.slice(0,this._length).join('');
};

/**
  * @inheritdoc CharBuffer.CharBuffer#isSupported
  * @static
  */
StringArrayBuffer.isSupported = true;


module.exports = StringArrayBuffer;
