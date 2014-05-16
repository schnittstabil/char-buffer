define('char-buffer/char-buffer',['require','exports','module'],function (require, exports, module) {
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

});

define('char-buffer/string-buffer',['require','exports','module','./char-buffer'],function (require, exports, module) {
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

});

define('char-buffer/string-array-buffer',['require','exports','module','./char-buffer'],function (require, exports, module) {
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

});

define('char-buffer/typed-array-buffer',['require','exports','module','./char-buffer'],function (require, exports, module) {
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

});

define('char-buffer/node-buffer',['require','exports','module','./char-buffer'],function (require, exports, module) {
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

});

define('char-buffer/index',['require','exports','module','./char-buffer','./string-buffer','./string-array-buffer','./typed-array-buffer','./node-buffer'],function (require, exports, module) {
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

});

define('char-buffer',['require','exports','module','./char-buffer/index'],function (require, exports, module) {
/*
 * AMD entry point (i.e. require('CharBuffer', ...))
 */
module.exports = require('./char-buffer/index');

});

