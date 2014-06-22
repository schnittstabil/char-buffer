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
  * @chainable
  * @abstract
  *
  * Write a charCode to the buffer at an offset.
  *
  * @param {Number} charCode The charCode to write.
  * @param {Number} offset The zero based offset to write at.
  * @throws {Error} if offset < 0 or offset > this.length
  */
AbstractCharBuffer.prototype.write = undefined;

/**
  * @abstract
  *
  * Read the charCode at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {Number} The charCode.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
AbstractCharBuffer.prototype.read = undefined;

/**
  * @abstract
  *
  * Read the charCode at an offset.
  *
  * @param {Number} offset The zero based offset.
  * @return {Number} The charCode.
  * @throws {Error} if offset < 0 or offset >= this.length
  */
AbstractCharBuffer.prototype.charCodeAt = undefined;

/**
  * @abstract
  *
  * Read the char at an offset.
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
  *
  * Gets the length of the {@link String} represented by this buffer.
  * @return {Number} The length of the {@link String}.
  */
AbstractCharBuffer.prototype.getLength = function() {
  return this.length;
};

/**
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
  * @abstract
  *
  * Returns the {@link String} represented by this buffer.
  * @return {String} The string.
  */
AbstractCharBuffer.prototype.toString = undefined;

/**
  * @property {Boolean}
  * @static
  * @template
  * Indicates whether this AbstractCharBuffer is supported by the current platform.
  */
AbstractCharBuffer.isSupported = false;

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

/* istanbul ignore if: IE-fix */
if (!StringArrayBuffer.name) {
  StringArrayBuffer.name = 'StringArrayBuffer';
}

/**
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

/** */
StringArrayBuffer.prototype.append = StringArrayBuffer.prototype.write;

/** */
StringArrayBuffer.prototype.read = function(offset) {
  return this._buffer[offset].charCodeAt(0);
};

/** */
StringArrayBuffer.prototype.charAt = function(offset) {
  return this._buffer[offset];
};

/** */
StringArrayBuffer.prototype.charCodeAt = StringArrayBuffer.prototype.read;

/**
  * Returns the {@link String} represented by this buffer.
  * @return {String} The string.
  */
StringArrayBuffer.prototype.toString = function() {
  return this._buffer.slice(0, this.length).join('');
};

/**
  * @inheritdoc CharBuffer.AbstractCharBuffer#isSupported
  * @static
  */
StringArrayBuffer.isSupported = true;

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

/* istanbul ignore if: IE-fix */
if (!TypedArrayBuffer.name) {
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

/** */
TypedArrayBuffer.prototype.append = TypedArrayBuffer.prototype.write;

/** */
TypedArrayBuffer.prototype.read = function(offset) {
  return this._buffer[offset];
};

/** */
TypedArrayBuffer.prototype.charCodeAt = TypedArrayBuffer.prototype.read;

/** */
TypedArrayBuffer.prototype.charAt = function(offset) {
  return String.fromCharCode(this.read(offset));
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

/**
  * @inheritdoc CharBuffer.AbstractCharBuffer#isSupported
  * @static
  */
TypedArrayBuffer.isSupported = (function() {
  try {
    return String.fromCharCode.apply(null, new Uint16Array()) === '';
  } catch (err) {
    /* istanbul ignore next */
    return false;
  }
}());

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

/* istanbul ignore if: IE-fix */
if (!NodeBuffer.name) {
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

/** */
NodeBuffer.prototype.append = NodeBuffer.prototype.write;

/** */
NodeBuffer.prototype.read = function(offset) {
  return this._buffer.readUInt16LE(offset * 2);
};

/** */
NodeBuffer.prototype.charCodeAt = NodeBuffer.prototype.read;

/** */
NodeBuffer.prototype.charAt = function(offset) {
  return String.fromCharCode(this.read(offset));
};

/**
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

/**
  * @inheritdoc CharBuffer.AbstractCharBuffer#isSupported
  * @static
  */
NodeBuffer.isSupported = (function() {
  try {
    var buffer = new Buffer('A', 'utf16le');
    return buffer.readUInt16LE(0) === 65;
  } catch (e) {
    /* istanbul ignore next */
    return false;
  }
}());

module.exports = NodeBuffer;

});

define('char-buffer/index',['require','exports','module','./abstract-char-buffer','./string-buffer','./string-array-buffer','./typed-array-buffer','./node-buffer'],function (require, exports, module) {
var AbstractCharBuffer = require('./abstract-char-buffer');
var StringBuffer = require('./string-buffer');
var StringArrayBuffer = require('./string-array-buffer');
var TypedArrayBuffer = require('./typed-array-buffer');
var NodeBuffer = require('./node-buffer');

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
function CharBuffer(initCapacity) {
  return CharBuffer._default.call(this, initCapacity);
}

/* istanbul ignore if: IE-fix */
if (!CharBuffer.name) {
  CharBuffer.name = 'CharBuffer';
}

/**
  * @property {CharBuffer[]} CharBuffers
  * @static
  *
  * Array of all {@link CharBuffer.AbstractCharBuffer} implementations.
  */
CharBuffer.CharBuffers = [
  AbstractCharBuffer,
  StringBuffer,
  StringArrayBuffer,
  TypedArrayBuffer,
  NodeBuffer
];

/**
  * @property {String[]} [supported=["StringBuffer", "StringArrayBuffer",
  *   "TypedArrayBuffer", "NodeBuffer"]]
  * @static
  *
  * Names of the supported {@link CharBuffer.AbstractCharBuffer} implementations of the
  * current platform.
  */
CharBuffer.supported = [];

/**
  * @property {CharBuffer.AbstractCharBuffer} [_default=
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
for (i = 0; i < CharBuffer.CharBuffers.length; i++) {
  buffer = CharBuffer.CharBuffers[i];

  /* istanbul ignore else */
  if (buffer.isSupported) {
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

module.exports = CharBuffer;

});

define('char-buffer',['require','exports','module','./char-buffer/index'],function (require, exports, module) {
/*
 * Facade for AMD etc.
 */
var Facade = require('./char-buffer/index');
module.exports = Facade;

});

