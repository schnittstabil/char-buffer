define('char-buffer/abstract-char-buffer',['require','exports','module'],function (require, exports, module) {
/**
  * @class CharBuffer.AbstractCharBuffer
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
function AbstractCharBuffer(initCapacity) {
  /* istanbul ignore if */
  if (!(this instanceof AbstractCharBuffer)) {
    return new AbstractCharBuffer(initCapacity);
  }
}

/* istanbul ignore if: IE-fix */
if (!AbstractCharBuffer.name) {
  AbstractCharBuffer.name = 'AbstractCharBuffer';
}

/**
  * @chainable
  * @abstract
  *
  * Appends a charCode to the buffer. The length of the buffer increases by 1.
  *
  * @param {Number} charCode The charCode to append.
  */
AbstractCharBuffer.prototype.append = undefined;

/**
  * @abstract
  * @method
  * @chainable
  *
  * Writes a charCode to the buffer at an offset.
  *
  * @param {Number} charCode The charCode to write.
  * @param {Number} offset The zero based offset to write at.
  * @throws {Error} if offset < 0 or offset > this.length
  */
AbstractCharBuffer.prototype.write = undefined;

/**
  * @abstract
  * @method
  *
  * Reads the charCode at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {Number} The charCode.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
AbstractCharBuffer.prototype.read = undefined;

/**
  * @abstract
  * @method
  *
  * Reads the charCode at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {Number} The charCode.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
AbstractCharBuffer.prototype.charCodeAt = undefined;

/**
  * @abstract
  * @method
  *
  * Reads the char at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {String} The char.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
AbstractCharBuffer.prototype.charAt = undefined;

/**
  * @property {Number} length Length of the {@link String} represented by this buffer.
  * @readonly
  */
AbstractCharBuffer.prototype.length = 0;

/**
  * @abstract
  * @method
  *
  * Gets the length of the {@link String} represented by this buffer.
  * @return {Number} The length of the {@link String}.
  */
AbstractCharBuffer.prototype.getLength = function() {
  return this.length;
};

/**
  * @method
  * @chainable
  *
  * Sets the length of the {@link String} represented by this buffer.
  * @param {Number} newLength The new length.
  * @throws {RangeError} if `newLength < 0 || newLength > this.length`
  */
AbstractCharBuffer.prototype.setLength = function(newLength) {
  var msg;
  if (newLength < 0 || newLength > this.length) {
    msg = 'newLength must be between 0 and ' + (this.length);
    msg += ', ' + newLength + ' given.';
    throw new RangeError(msg);
  }
  this.length = newLength;
  return this;
};

/**
  * @method
  *
  * Executes a function once per charCode.
  * See also {@link Array#forEach}
  *
  * @param {Function} callback            Function to execute for each charCode.
  * @param {Number}   callback.charCode   The charCode.
  * @param {Number}   callback.index      The index of the charCode.
  * @param {Object}   callback.charbuffer The CharBuffer being traversed.
  * @param {Object}   [thisArg=undefined] Value to use as this when executing callback.
  */
AbstractCharBuffer.prototype.forEach = function(callback, thisArg) {
  var T,
      i,
      len = this.length;

  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  if (arguments.length > 1) {
    T = thisArg;
  }
  for (i = 0; i < len; i++) {
    callback.call(T, this.charCodeAt(i), i, this);
  }
};

/**
  * @method
  *
  * Creates a new CharBuffer with the results of calling a provided function on every charCode.
  * See also {@link Array#map}
  *
  * @param {Function} callback            Function to execute for each charCode.
  * @param {Number}   callback.charCode   The charCode.
  * @param {Number}   callback.index      The index of the charCode.
  * @param {Object}   callback.charbuffer The CharBuffer being traversed.
  * @param {Number}   callback.return     The new charCode to write into the new CharBuffer.
  * @param {Object}   [thisArg=undefined] Value to use as this when executing callback.
  * @return {CharBuffer} CharBuffer of the return values of callback function.
  */
AbstractCharBuffer.prototype.map = function(callback, thisArg) {
  var T,
      i,
      len = this.length,
      output = new this.constructor(len);

  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  if (arguments.length > 1) {
    T = thisArg;
  }

  for (i = 0; i < len; i++) {
    output.append(callback.call(T, this.charCodeAt(i), i, this));
  }
  return output;
};

/**
  * @abstract
  * @method
  *
  * Returns the {@link String} represented by this buffer.
  * @return {String} The string.
  */
AbstractCharBuffer.prototype.toString = undefined;

/**
  * @static
  * @property {Boolean} [isSupported=true]
  * @template
  * @inheritable
  * Indicates whether this CharBuffer is supported by the current platform.
  */
AbstractCharBuffer.isSupported = false;

/**
  * @static
  * @method
  * @inheritable
  *
  * Creates a new CharBuffer from a {@link String}.
  *
  * @param {String} string The string.
  * @param {Function} [transform=identity]  Function that produces a charCode of the new CharBuffer
  *                                         from a charCode of the string parameter.
  * @param {Number} transform.charCode The charCode of the string.
  * @param {Number} transform.index The index of the charCode within the string.
  * @param {Number} transform.return The charCode to write into the new CharBuffer.
  * @return {CharBuffer} CharBuffer of the string, transformed by transform.
  *
  *     @example
  *     var charBuffer;
  *
  *     charBuffer = CharBuffer.fromString('abc');
  *     console.log(charBuffer.toString()); // output: abc
  *
  *     charBuffer = CharBuffer.fromString('abc', function(charCode, index){
  *       return charCode + 3;
  *     });
  *     console.log(charBuffer.toString()); // output: def
  *
  */
AbstractCharBuffer.fromString = null;

/**
  * @static
  * @method
  * @protected
  *
  * Creates a fromString implementation.
  *
  * @param {Function} Constr A CharBuffer constructor.
  * @return {Function} A default fromString implementation for Constr.
  */
AbstractCharBuffer.fromStringConstr = function(Constr) {
  return function(string, transform) {
    var len = string.length,
        output = new Constr(len),
        i;
    // manual loop optimization :-)
    if (transform) {
      for (i = 0; i < len; i++) {
        output.append(transform.call(transform, string.charCodeAt(i), i));
      }
    } else {
      for (i = 0; i < len; i++) {
        output.append(string.charCodeAt(i));
      }
    }
    return output;
  };
};

module.exports = AbstractCharBuffer;

});

define('char-buffer/string-buffer',['require','exports','module','./abstract-char-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');

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

StringBuffer.prototype.constructor = StringBuffer;

/* istanbul ignore if: IE-fix */
if (!StringBuffer.name) {
  StringBuffer.name = 'StringBuffer';
}

/**
  * @method
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

/** @method */
StringBuffer.prototype.append = function(charCode) {
  this._buffer += String.fromCharCode(charCode);
  this.length = this._buffer.length;
  return this;
};

/** @method */
StringBuffer.prototype.charCodeAt = function(offset) {
  return this._buffer.charCodeAt(offset);
};

/** @method */
StringBuffer.prototype.charAt = function(offset) {
  return this._buffer.charAt(offset);
};

/** @method */
StringBuffer.prototype.read = StringBuffer.prototype.charCodeAt;

/** @method */
StringBuffer.prototype.setLength = function(newLength) {
  AbstractCharBuffer.prototype.setLength.call(this, newLength);
  this._buffer = this._buffer.slice(0, this.length);
  return this;
};

/**
  * @method
  * Returns the internal {@link String}.
  * @return {String} The string.
  */
StringBuffer.prototype.toString = function() {
  return this._buffer;
};

/** @static @property */
StringBuffer.isSupported = true;

/** @static @method */
StringBuffer.fromString = function(string, transform) {
  var output = new StringBuffer(),
      len = string.length,
      buffer,
      i;

  if (transform) {
    buffer = '';
    for (i = 0; i < len; i++) {
      buffer += String.fromCharCode(transform.call(transform, string.charCodeAt(i), i));
    }
  } else {
    // JavaScript strings are immutable
    buffer = string;
  }

  output._buffer = buffer;
  output.length = len;
  return output;
};

module.exports = StringBuffer;

});

define('char-buffer/string-array-buffer',['require','exports','module','./abstract-char-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');

/**
  * @class CharBuffer.StringArrayBuffer
  * @extends CharBuffer.AbstractCharBuffer
  *
  * {@link CharBuffer.AbstractCharBuffer} implementation using an {@link Array} of
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
function StringArrayBuffer(initCapacity) {
  if (!(this instanceof StringArrayBuffer)) {
    return new StringArrayBuffer(initCapacity);
  }
  AbstractCharBuffer.call(this);
  initCapacity = initCapacity || 16;
  this._buffer = new Array(initCapacity);
}

StringArrayBuffer.prototype = new AbstractCharBuffer();

StringArrayBuffer.prototype.constructor = StringArrayBuffer;

/* istanbul ignore if: IE-fix */
if (!StringArrayBuffer.name) {
  StringArrayBuffer.name = 'StringArrayBuffer';
}

/**
  * @method
  * Write a charCode to the buffer using
  * {@link String#fromCharCode} and {@link Array#push []}.
  *
  * @param {Number} charCode The charCode to append.
  * @param {Number} offset The zero based offset to write at.
  */
StringArrayBuffer.prototype.write = function(charCode, offset) {
  if (typeof offset === 'undefined') {
    offset = this.length;
  }
  this._buffer[offset] = String.fromCharCode(charCode);
  this.length = offset + 1 > this.length ? offset + 1 : this.length;
  return this;
};

/** @method */
StringArrayBuffer.prototype.append = StringArrayBuffer.prototype.write;

/** @method */
StringArrayBuffer.prototype.read = function(offset) {
  return this._buffer[offset].charCodeAt(0);
};

/** @method */
StringArrayBuffer.prototype.charAt = function(offset) {
  return this._buffer[offset];
};

/** @method */
StringArrayBuffer.prototype.charCodeAt = StringArrayBuffer.prototype.read;

/**
  * @method
  * Returns the {@link String} represented by this buffer.
  * @return {String} The string.
  */
StringArrayBuffer.prototype.toString = function() {
  return this._buffer.slice(0, this.length).join('');
};

/** @static @property */
StringArrayBuffer.isSupported = true;

/** @static @method */
StringArrayBuffer.fromString = AbstractCharBuffer.fromStringConstr(StringArrayBuffer);

module.exports = StringArrayBuffer;

});

define('char-buffer/typed-array-buffer',['require','exports','module','./abstract-char-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');

/**
  * @class CharBuffer.TypedArrayBuffer
  * @extends CharBuffer.AbstractCharBuffer
  *
  * {@link CharBuffer.AbstractCharBuffer} implementation using a [Typed Array][1]
  * (more precisely an [Uint16Array][2]).
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
function TypedArrayBuffer(initCapacity) {
  if (!(this instanceof TypedArrayBuffer)) {
    return new TypedArrayBuffer(initCapacity);
  }
  AbstractCharBuffer.call(this);
  initCapacity = initCapacity || 16;
  this._buffer = new Uint16Array(initCapacity);
}

TypedArrayBuffer.prototype = new AbstractCharBuffer();

TypedArrayBuffer.prototype.constructor = TypedArrayBuffer;

/* istanbul ignore if: IE-fix */
if (!TypedArrayBuffer.name) {
  TypedArrayBuffer.name = 'TypedArrayBuffer';
}

/**
  * @method
  * @protected
  *
  * Ensures a minimum capacity.
  * @param {Number} minCapacity The minimum capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} this buffer may
  *     represent).
  */
TypedArrayBuffer.prototype._ensureCapacity = function(minCapacity) {
  if (this._buffer.length < minCapacity) {
    if (minCapacity < this._buffer.length * 2) {
      minCapacity = this._buffer.length * 2; // i.e. double the capacity (!)
    }
    var buffer = new Uint16Array(minCapacity);
    buffer.set(this._buffer);
    this._buffer = buffer;
  }
};

/**
  * @method
  * Appends a charCode to the buffer using [...].
  *
  * @param {Number} charCode The charCode to append.
  * @param {Number} offset The zero based offset to write at.
  */
TypedArrayBuffer.prototype.write = function(charCode, offset) {
  if (typeof offset === 'undefined') {
    offset = this.length;
  }
  this._ensureCapacity(offset + 1);
  this._buffer[offset] = charCode;
  this.length = offset + 1 > this.length ? offset + 1 : this.length;
  return this;
};

/** @method */
TypedArrayBuffer.prototype.append = TypedArrayBuffer.prototype.write;

/** @method */
TypedArrayBuffer.prototype.read = function(offset) {
  return this._buffer[offset];
};

/** @method */
TypedArrayBuffer.prototype.charCodeAt = TypedArrayBuffer.prototype.read;

/** @method */
TypedArrayBuffer.prototype.charAt = function(offset) {
  return String.fromCharCode(this.read(offset));
};

// jshint -W101
/**
  * @method
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
TypedArrayBuffer.prototype.toString = function() {
// jshint +W101
  var ARGS_MAX = 65535,
      len = this.length,
      buf = '',
      startPos = 0,
      endPos = 0;

  if (len <= ARGS_MAX) {
    return String.fromCharCode.apply(
        null,
        this._buffer.subarray(startPos, len)
      );
  }

  do {
    startPos = endPos;
    endPos += ARGS_MAX;
    if (endPos > len) {
      endPos = len;
    }
    buf += String.fromCharCode.apply(
        null,
        this._buffer.subarray(startPos, endPos)
      );
  } while (endPos < len);

  return buf;
};

/** @static @property */
TypedArrayBuffer.isSupported = (function() {
  try {
    return String.fromCharCode.apply(null, new Uint16Array()) === '';
  } catch (err) {
    /* istanbul ignore next */
    return false;
  }
}());

/** @static @method */
TypedArrayBuffer.fromString = AbstractCharBuffer.fromStringConstr(TypedArrayBuffer);

module.exports = TypedArrayBuffer;

});

define('char-buffer/node-buffer',['require','exports','module','./abstract-char-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');

/**
  * @class CharBuffer.NodeBuffer
  * @extends CharBuffer.AbstractCharBuffer
  *
  * {@link CharBuffer.AbstractCharBuffer} implementation using a [Node.js Buffer][1].
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
function NodeBuffer(initCapacity) {
  if (!(this instanceof NodeBuffer)) {
    return new NodeBuffer(initCapacity);
  }
  AbstractCharBuffer.call(this);
  initCapacity = initCapacity || 16;
  this._buffer = new Buffer(initCapacity * 2);
}

NodeBuffer.prototype = new AbstractCharBuffer();

NodeBuffer.prototype.constructor = NodeBuffer;

/* istanbul ignore if: IE-fix */
if (!NodeBuffer.name) {
  NodeBuffer.name = 'NodeBuffer';
}

/**
  * @method
  * @protected
  *
  * Ensures a minimum capacity.
  * @param {Number} minCapacity The minimum capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} this buffer may
  *     represent).
  */
NodeBuffer.prototype._ensureCapacity = function(minCapacity) {
  if (this._buffer.length < minCapacity * 2) {
    if (minCapacity < this._buffer.length) {
      minCapacity = this._buffer.length; // i.e. double the capacity (!)
    }
    var buffer = new Buffer(minCapacity * 2);
    this._buffer.copy(buffer);
    this._buffer = buffer;
  }
};

/**
  * @method
  * Write a charCode to the buffer using
  * [Buffer.writeUInt16LE(charCode, ...)][1].
  *
  * [1]: http://nodejs.org/api/buffer.html#buffer_buf_writeuint16le_value_offset_noassert
  * @param {Number} charCode The charCode to append.
  * @param {Number} offset The zero based offset to write at.
  */
NodeBuffer.prototype.write = function(charCode, offset) {
  if (typeof offset === 'undefined') {
    offset = this.length;
  }
  this._ensureCapacity(offset + 1);
  this._buffer.writeUInt16LE(charCode, offset * 2);
  this.length = offset + 1 > this.length ? offset + 1 : this.length;
  return this;
};

/** @method */
NodeBuffer.prototype.append = NodeBuffer.prototype.write;

/** @method */
NodeBuffer.prototype.read = function(offset) {
  return this._buffer.readUInt16LE(offset * 2);
};

/** @method */
NodeBuffer.prototype.charCodeAt = NodeBuffer.prototype.read;

/** @method */
NodeBuffer.prototype.charAt = function(offset) {
  return String.fromCharCode(this.read(offset));
};

/**
  * @method
  * Returns the {@link String} represented by this buffer using
  * [Buffer.toString('utf16le', ...)][1].
  *
  * [1]: http://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end
  *
  * @return {String} The string.
  */
NodeBuffer.prototype.toString = function() {
  return this._buffer.toString('utf16le', 0, this.length * 2);
};

/** @static @property */
NodeBuffer.isSupported = (function() {
  try {
    var buffer = new Buffer('A', 'utf16le');
    return buffer.readUInt16LE(0) === 65;
  } catch (e) {
    /* istanbul ignore next */
    return false;
  }
}());

/** @static @method */
NodeBuffer.fromString = AbstractCharBuffer.fromStringConstr(NodeBuffer);

module.exports = NodeBuffer;

});

define('char-buffer/char-buffer',['require','exports','module','./abstract-char-buffer','./string-buffer','./string-array-buffer','./typed-array-buffer','./node-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');
var StringBuffer = require('./string-buffer');
var StringArrayBuffer = require('./string-array-buffer');
var TypedArrayBuffer = require('./typed-array-buffer');
var NodeBuffer = require('./node-buffer');

/**
  * @class CharBuffer
  * @extends CharBuffer.AbstractCharBuffer
  */

/**
  * @method constructor
  *
  * Construct the default default implementation of {@link CharBuffer.AbstractCharBuffer} of the current platform.
  *
  * @param {Number} initCapacity The initial capacity (i.e. the expected
  *     {@link String#length length} of the {@link String} represented by this
  *     buffer).
  */
var CharBuffer = null;

var supported = [],
    CharBuffers = [
      AbstractCharBuffer,
      StringBuffer,
      StringArrayBuffer,
      TypedArrayBuffer,
      NodeBuffer
    ],
    i,
    buffer;

// last supported {@link CharBuffer.CharBuffers} becomes
// {@link CharBuffer}
for (i = 0; i < CharBuffers.length; i++) {
  buffer = CharBuffers[i];

  /* istanbul ignore else */
  if (buffer.isSupported) {
    supported.push(buffer.name);
    CharBuffer = buffer;
  }
}

/**
  * @static
  * @property {String[]} [supported=["StringBuffer", "StringArrayBuffer",
  *   "TypedArrayBuffer", "NodeBuffer"]]
  *
  * Names of the supported {@link CharBuffer.AbstractCharBuffer} implementations of the
  * current platform.
  */
CharBuffer.supported = supported;

/**
  * @static
  * @property {CharBuffer[]} CharBuffers
  *
  * Array of all {@link CharBuffer.AbstractCharBuffer} implementations.
  */
CharBuffer.CharBuffers = CharBuffers;

for (i = 0; i < CharBuffers.length; i++) {
  buffer = CharBuffers[i];

  // export buffer
  CharBuffer[buffer.name] = buffer;
}

module.exports = CharBuffer;

});

define('char-buffer', ['char-buffer/char-buffer'], function(cb){ return cb; });