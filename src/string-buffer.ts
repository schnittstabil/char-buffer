import AbstractCharBuffer from './abstract-char-buffer';

/**
 * {@link AbstractCharBuffer} implementation using a single {@link String}.
 */

export default class StringBuffer extends AbstractCharBuffer {
	private _buffer: string;

	public constructor(initCapacity: number) {
		super(initCapacity);
		this._buffer = '';
	}

	public static get isSupported(): boolean {
		return true;
	}

	public static fromString(string: string, transform?: (value: number, index: number, string: string) => number, thisArg?: any): StringBuffer {
		return super._fromString(new this(string.length), string, transform, thisArg);
	}

	public append(charCode: number): this {
		this._buffer += String.fromCharCode(charCode);
		this._length = this._buffer.length;
		return this;
	}

	public charAt(offset: number): string {
		return this._buffer.charAt(offset);
	}

	public charCodeAt(offset: number): number {
		return this._buffer.charCodeAt(offset);
	}

	/**
	 * Write a charCode to the buffer using {@link String#fromCharCode} and {@link String#concat +}.
	 * @param charCode
	 * @param offset
	 */
	public write(charCode: number, offset?: number): this {
		if (typeof offset === 'undefined' || offset === this._length) {
			return this.append(charCode);
		}

		const pre = this._buffer.slice(0, offset);
		const post = this._buffer.slice(offset + 1);
		this._buffer = pre + String.fromCharCode(charCode) + post;
		this._length = this._buffer.length;
		return this;
	}

	public toString(): string {
		return this._buffer;
	}

	protected setLength(newLength: number): void {
		super.setLength(newLength);
		this._buffer = this._buffer.slice(0, this.length);
	}
}
