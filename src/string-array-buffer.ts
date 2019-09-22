import AbstractCharBuffer from './abstract-char-buffer';

/**
 * {@link AbstractCharBuffer} implementation using an {@link Array} of {@link String}s.
 */
export default class StringArrayBuffer extends AbstractCharBuffer {
	private _buffer: string[];

	public constructor(initCapacity: number) {
		super(initCapacity);
		initCapacity = initCapacity || 16;
		this._buffer = new Array(initCapacity);
	}

	public static get isSupported(): boolean {
		return true;
	}

	public static fromString(string: string, transform?: (value: number, index: number, string: string) => number, thisArg?: any): StringArrayBuffer {
		return super._fromString(new this(string.length), string, transform, thisArg);
	}

	/**
	 * Write a charCode to the buffer using {@link String#fromCharCode} and {@link Array#push []}.
	 *
	 * @param charCode The charCode to append.
	 * @param offset The zero based offset to write at.
	 */
	public write(charCode: number, offset?: number): this {
		if (typeof offset === 'undefined') {
			offset = this._length;
		}

		this._buffer[offset] = String.fromCharCode(charCode);
		this._length = offset + 1 > this._length ? offset + 1 : this._length;
		return this;
	}

	public charCodeAt(offset: number): number {
		return this._buffer[offset].charCodeAt(0);
	}

	public charAt(offset: number): string {
		return this._buffer[offset];
	}

	public toString(): string {
		return this._buffer.slice(0, this._length).join('');
	}
}
