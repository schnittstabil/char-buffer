'use strict';
var CharBuffer = require('./char-buffer');

/**
  * @class CharBuffer.StringBuffer
  * @extends CharBuffer.CharBuffer
  *
  * {@link CharBuffer.CharBuffer} implementation using a single {@link String}.
  */

/**
  * @method constructor
  *
  * Constructs a StringArrayBuffer representing an empty string.
  */
function StringBuffer(){
  if(!(this instanceof StringBuffer)){
    return new StringBuffer();
  }
  this._buffer = '';
}

StringBuffer.prototype = new CharBuffer();

/* istanbul ignore if: IE-fix */
if(!StringBuffer.name){
  StringBuffer.name = 'StringBuffer';
}

/**
  * Appends a charCode to the buffer using
  * {@link String#fromCharCode} and {@link String#concat +}.
  *
  * @param {Number} charCode The charCode to append.
  */
StringBuffer.prototype.append = function(charCode){
  this._buffer += String.fromCharCode(charCode);
  return this;
};

/** */
StringBuffer.prototype.setLength = function(newLength){
  var msg;
  if(newLength < 0 || newLength > this._buffer.length){
    msg = 'newLength must be between 0 and ' + (this._buffer.length);
    msg += ', ' + newLength + ' given.';
    throw new RangeError(msg);
  }
  this._buffer = this._buffer.slice(0, newLength);
  return this;
};

/** */
StringBuffer.prototype.getLength = function(){
  return this._buffer.length;
};

/**
  * Returns the internal {@link String}.
  * @return {String} The string.
  */
StringBuffer.prototype.toString = function(){
  return this._buffer;
};

/**
  * @inheritdoc CharBuffer.CharBuffer#isSupported
  * @static
  */
StringBuffer.isSupported = true;


module.exports = StringBuffer;
