'use strict';
var CharBuffer = require('./char-buffer');

/**
  * @class CharBuffer.TypedArrayBuffer
  * @extends CharBuffer.CharBuffer
  *
  * {@link CharBuffer.CharBuffer} implementation using a [Typed Array][1]
  * (more precisely an [Uint16Array][2]]).
  *
  * [1]: https://www.khronos.org/registry/typedarray/specs/latest/
  * [2]: https://developer.mozilla.org/en-US/docs/Web/API/Uint16Array
  */

/**
  * @method constructor
  *
  * Constructs a NodeBuffer representing an empty {@link String}.
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} represented by this
  *     buffer).
  */
function TypedArrayBuffer(initCapacity){
  if(!(this instanceof TypedArrayBuffer)){
    return new TypedArrayBuffer(initCapacity);
  }
  initCapacity = initCapacity || 16;
  this._buffer = new Uint16Array(initCapacity);
  this._length = 0;
}

TypedArrayBuffer.prototype = new CharBuffer();

/* istanbul ignore if: IE-fix */
if(!TypedArrayBuffer.name){
  TypedArrayBuffer.name = 'TypedArrayBuffer';
}

/**
  * @method _ensureCapacity
  * @protected
  *
  * Ensures a minimum capacity.
  * @param {Number} minCapacity The minimum capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} this buffer may
  *     represent).
  */
TypedArrayBuffer.prototype._ensureCapacity = function(minCapacity){
  if(this._buffer.length < minCapacity){
    if(minCapacity < this._buffer.length*2){
      minCapacity = this._buffer.length*2; // i.e. double the capacity (!)
    }
    var buffer = new Uint16Array(minCapacity);
    buffer.set(this._buffer);
    this._buffer = buffer;
  }
};

/**
  * Appends a charCode to the buffer using [...].
  *
  * @param {Number} charCode The charCode to append.
  */
TypedArrayBuffer.prototype.append = function(charCode){
  this._ensureCapacity(this._length+1);
  this._buffer[this._length++] = charCode;
  return this;
};

/** */
TypedArrayBuffer.prototype.setLength = function(newLength){
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
TypedArrayBuffer.prototype.getLength = function(){
  return this._length;
};

// jshint -W101
/**
  * Returns the {@link String} represented by this buffer using
  * {@link String#fromCharCode}.
  *
  * For details see:
  *
  * - [How to convert ArrayBuffer to and from String][1]
  * - [WebKit Bug 80797 - Argument length limited to 65536 ][2]
  *
  * [1]: http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  * [2]: https://bugs.webkit.org/show_bug.cgi?id=80797
  *
  * @return {String} The string.
  */
TypedArrayBuffer.prototype.toString = function(){
// jshint +W101
  var ARGS_MAX = 65535,
      len = this._length,
      buf = '',
      startPos = 0,
      endPos = 0;

  if(len <= ARGS_MAX){
    return String.fromCharCode.apply(
        null,
        this._buffer.subarray(startPos, len)
      );
  }

  do{
    startPos = endPos;
    endPos += ARGS_MAX;
    if(endPos>len){
      endPos=len;
    }
    buf += String.fromCharCode.apply(
        null,
        this._buffer.subarray(startPos,endPos)
      );
  }while(endPos < len);

  return buf;
};

/**
  * @inheritdoc CharBuffer.CharBuffer#isSupported
  * @static
  */
TypedArrayBuffer.isSupported = (function(){
  try{
    return String.fromCharCode.apply(null, new Uint16Array()) === '';
  }catch(err){
    /* istanbul ignore next */
    return false;
  }
}());


module.exports = TypedArrayBuffer;
