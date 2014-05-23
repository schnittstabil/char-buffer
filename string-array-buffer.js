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
  CharBuffer.call(this);
  initCapacity = initCapacity || 16;
  this._buffer = new Array(initCapacity);
}

StringArrayBuffer.prototype = new CharBuffer();

/* istanbul ignore if: IE-fix */
if(!StringArrayBuffer.name){
  StringArrayBuffer.name = 'StringArrayBuffer';
}

/**
  * Write a charCode to the buffer using
  * {@link String#fromCharCode} and {@link Array#push []}.
  *
  * @param {Number} charCode The charCode to append.
  * @param {Number} offset The zero based offset to write at.
  */
StringArrayBuffer.prototype.write = function(charCode, offset){
  if(typeof offset === 'undefined'){
    offset = this.length;
  }
  this._buffer[offset] = String.fromCharCode(charCode);
  this.length = offset+1 > this.length ? offset+1 : this.length, true;
  return this;
};

/** */
StringArrayBuffer.prototype.append = StringArrayBuffer.prototype.write;

/** */
StringArrayBuffer.prototype.read = function(offset){
  return this._buffer[offset].charCodeAt(0);
};

/** */
StringArrayBuffer.prototype.charAt = function(offset){
  return this._buffer[offset];
};

/** */
StringArrayBuffer.prototype.charCodeAt = StringArrayBuffer.prototype.read;

/**
  * Returns the {@link String} represented by this buffer.
  * @return {String} The string.
  */
StringArrayBuffer.prototype.toString = function(){
  return this._buffer.slice(0,this.length).join('');
};

/**
  * @inheritdoc CharBuffer.CharBuffer#isSupported
  * @static
  */
StringArrayBuffer.isSupported = true;


module.exports = StringArrayBuffer;
