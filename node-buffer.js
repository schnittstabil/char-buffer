'use strict';
const AbstractCharBuffer = require('./abstract-char-buffer');

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
	this._buffer = Buffer.alloc(initCapacity * 2);
}

NodeBuffer.prototype = new AbstractCharBuffer(-1);

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
NodeBuffer.prototype._ensureCapacity = function (minCapacity) {
	if (this._buffer.length < minCapacity * 2) {
		if (minCapacity < this._buffer.length) {
			minCapacity = this._buffer.length; // I.e. double the capacity (!)
		}

		const buffer = Buffer.alloc(minCapacity * 2);
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
NodeBuffer.prototype.write = function (charCode, offset) {
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
NodeBuffer.prototype.read = function (offset) {
	return this._buffer.readUInt16LE(offset * 2);
};

/** @method */
NodeBuffer.prototype.charCodeAt = NodeBuffer.prototype.read;

/** @method */
NodeBuffer.prototype.charAt = function (offset) {
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
NodeBuffer.prototype.toString = function () {
	return this._buffer.toString('utf16le', 0, this.length * 2);
};

/** @static @property */
Object.defineProperty(NodeBuffer, 'isSupported', {
	get: () => {
		try {
			return Buffer.from('A', 'utf16le').readUInt16LE(0) === 65;
		} catch (error) {
			/* istanbul ignore next */
			return false;
		}
	}
});

/** @static @method */
NodeBuffer.fromString = AbstractCharBuffer.fromStringConstr(NodeBuffer);

module.exports = NodeBuffer;
