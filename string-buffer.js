'use strict';
import AbstractCharBuffer from './abstract-char-buffer';

/**
  * @class CharBuffer.StringBuffer
  * @extends CharBuffer.AbstractCharBuffer
  *
  * {@link CharBuffer.AbstractCharBuffer} implementation using a single {@link String}.
  */

/**
  * @method constructor
  *
  * Constructs a StringBuffer representing an empty string.
  */
function StringBuffer() {
  if (!(this instanceof StringBuffer)) {
    return new StringBuffer();
  }
  AbstractCharBuffer.call(this);
  this._buffer = '';
}

StringBuffer.prototype = new AbstractCharBuffer();

/* istanbul ignore if: IE-fix */
if (!StringBuffer.name) {
  StringBuffer.name = 'StringBuffer';
}

/**
  * Write a charCode to the buffer using
  * {@link String#fromCharCode} and {@link String#concat +}.
  *
  * @param {Number} charCode The charCode to append.
  * @param {Number} offset The zero based offset to write at.
  */
StringBuffer.prototype.write = function(charCode, offset) {
  if (typeof offset === 'undefined' || offset === this.length) {
    return this.append(charCode);
  }
  var pre  = this._buffer.slice(0, offset),
      post = this._buffer.slice(offset + 1);
  this._buffer = pre + String.fromCharCode(charCode) + post;
  this.length = this._buffer.length;
  return this;
};

/** */
StringBuffer.prototype.append = function(charCode) {
  this._buffer += String.fromCharCode(charCode);
  this.length = this._buffer.length;
  return this;
};

/** */
StringBuffer.prototype.charCodeAt = function(offset) {
  return this._buffer.charCodeAt(offset);
};

/** */
StringBuffer.prototype.charAt = function(offset) {
  return this._buffer.charAt(offset);
};

/** */
StringBuffer.prototype.read = StringBuffer.prototype.charCodeAt;

/** */
StringBuffer.prototype.setLength = function(newLength) {
  this.constructor.prototype.setLength.call(this, newLength);
  this._buffer = this._buffer.slice(0, this.length);
  return this;
};

/**
  * Returns the internal {@link String}.
  * @return {String} The string.
  */
StringBuffer.prototype.toString = function() {
  return this._buffer;
};

/**
  * @inheritdoc CharBuffer.AbstractCharBuffer#isSupported
  * @static
  */
StringBuffer.isSupported = true;

export default StringBuffer;
