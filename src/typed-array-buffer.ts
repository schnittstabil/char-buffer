import AbstractCharBuffer from './abstract-char-buffer';

/**
 * {@link AbstractCharBuffer} implementation using a [Typed Array][1] (more precisely an [Uint16Array][2]).
 *
 * [1]: https://www.khronos.org/registry/typedarray/specs/latest/
 * [2]: https://developer.mozilla.org/en-US/docs/Web/API/Uint16Array
 */
export default class TypedArrayBuffer extends AbstractCharBuffer {
	private _buffer: Uint16Array;

	public constructor(initCapacity: number) {
		super(initCapacity);
		initCapacity = initCapacity || 16;
		this._buffer = new Uint16Array(initCapacity);
	}

	public static get isSupported(): boolean {
		try {
			/* eslint-disable-next-line unicorn/prefer-spread */
			return String.fromCharCode.apply(null, Array.from(new Uint16Array())) === '';
		} catch (_) {
			/* istanbul ignore next */
			return false;
		}
	}

	public static fromString(string: string, transform?: (value: number, index: number, string: string) => number, thisArg?: any): TypedArrayBuffer {
		return super._fromString(new this(string.length), string, transform, thisArg);
	}

	public charAt(offset: number): string {
		return String.fromCharCode(this.read(offset));
	}

	public charCodeAt(offset: number): number {
		return this._buffer[offset];
	}

	public write(charCode: number, offset?: number): this {
		if (offset === undefined) {
			offset = this._length;
		}

		this._ensureCapacity(offset + 1);
		this._buffer[offset] = charCode;
		this._length = offset + 1 > this._length ? offset + 1 : this._length;
		return this;
	}

	// jshint -W101
	/**
	 * Returns the {@link String} represented by this buffer using {@link String#fromCharCode}.
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
	public toString(): string {
		// jshint +W101
		const ARGS_MAX = 65535;
		const len = this._length;
		let buf = '';
		let startPos = 0;
		let endPos = 0;

		if (len <= ARGS_MAX) {
			/* eslint-disable-next-line unicorn/prefer-spread */
			return String.fromCharCode.apply(null, Array.from(this._buffer.subarray(startPos, len)));
		}

		do {
			startPos = endPos;
			endPos += ARGS_MAX;
			if (endPos > len) {
				endPos = len;
			}

			/* eslint-disable-next-line unicorn/prefer-spread */
			buf += String.fromCharCode.apply(null, Array.from(this._buffer.subarray(startPos, endPos)));
		} while (endPos < len);

		return buf;
	}

	/**
	 * Ensures a minimum capacity.
	 * @param {Number} minCapacity The minimum capacity (i.e. the expected
	 *     {@link String#length length} of the {@link String} this buffer may
	 *     represent).
	 */
	protected _ensureCapacity(minCapacity: number): void {
		if (this._buffer.length < minCapacity) {
			if (minCapacity < this._buffer.length * 2) {
				minCapacity = this._buffer.length * 2; // I.e. double the capacity (!)
			}

			const buffer = new Uint16Array(minCapacity);
			buffer.set(this._buffer);
			this._buffer = buffer;
		}
	}
}
