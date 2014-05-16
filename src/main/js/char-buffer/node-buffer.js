'use strict';
var CharBuffer = require('./char-buffer');

/**
  * @class CharBuffer.NodeBuffer
  * @extends CharBuffer.CharBuffer
  *
  * {@link CharBuffer.CharBuffer} implementation using a [Node.js Buffer][1].
  *
  * [1]: http://nodejs.org/api/buffer.html
  */

/**
  * @method constructor
  *
  * Constructs a NodeBuffer representing an empty {@link String}.
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} represented by this
  *     buffer).
  */
function NodeBuffer(initCapacity){
  if(!(this instanceof NodeBuffer)){
    return new NodeBuffer(initCapacity);
  }
  initCapacity = initCapacity || 16;
  this._buffer = new Buffer(initCapacity*2);
  this._length = 0;
}

NodeBuffer.prototype = new CharBuffer();

/* istanbul ignore if: IE-fix */
if(!NodeBuffer.name){
  NodeBuffer.name = 'NodeBuffer';
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
NodeBuffer.prototype._ensureCapacity = function(minCapacity){
  if(this._buffer.length < minCapacity*2){
    if(minCapacity < this._buffer.length){
      minCapacity = this._buffer.length; // i.e. double the capacity (!)
    }
    var buffer = new Buffer(minCapacity*2);
    this._buffer.copy(buffer);
    this._buffer = buffer;
  }
};

/**
  * Appends a charCode to the buffer using
  * [Buffer.writeUInt16LE(charCode, ...)][1].
  *
  * [1]: http://nodejs.org/api/buffer.html#buffer_buf_writeuint16le_value_offset_noassert
  * @param {Number} charCode The charCode to append.
  */
NodeBuffer.prototype.append = function(charCode){
  this._ensureCapacity(this._length+1);
  this._buffer.writeUInt16LE(charCode, this._length*2);
  this._length++;
  return this;
};

/** */
NodeBuffer.prototype.setLength = function(newLength){
  var msg;
  if(newLength < 0 || newLength*2 > this._buffer.length){
    msg = 'newLength must be between 0 and ' + (this._buffer.length/2);
    msg += ', ' + newLength + ' given.';
    throw new RangeError(msg);
  }
  this._length = newLength;
  return this;
};

/** */
NodeBuffer.prototype.getLength = function(){
  return this._length;
};


/**
  * Returns the {@link String} represented by this buffer using
  * [Buffer.toString('utf16le', ...)][1].
  *
  * [1]: http://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end
  *
  * @return {String} The string.
  */
NodeBuffer.prototype.toString = function(){
  return this._buffer.toString('utf16le', 0, this._length*2);
};

/**
  * @inheritdoc CharBuffer.CharBuffer#isSupported
  * @static
  */
NodeBuffer.isSupported = (function() {
  try{
    var buffer = new Buffer('A', 'utf16le');
    return buffer.readUInt16LE(0) === 65;
  }catch(e){
    /* istanbul ignore next */
    return false;
  }
}());


module.exports = NodeBuffer;
