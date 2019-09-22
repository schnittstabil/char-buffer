import AbstractCharBuffer from './abstract-char-buffer';

/**
 * {@link AbstractCharBuffer} implementation using a [Node.js Buffer][1].
 *
 * [1]: http://nodejs.org/api/buffer.html
 */
export default class NodeBuffer extends AbstractCharBuffer {
	protected buffer: Buffer;

	public constructor(initCapacity: number) {
		super(initCapacity);
		initCapacity = initCapacity || 16;
		this.buffer = Buffer.alloc(initCapacity * 2);
	}

	public static get isSupported(): boolean {
		try {
			return Buffer.from('A', 'utf16le').readUInt16LE(0) === 65;
		} catch (_) {
			/* istanbul ignore next */
			return false;
		}
	}

	public static fromString(string: string, transform?: (value: number, index: number, string: string) => number, thisArg?: any): NodeBuffer {
		return super._fromString(new this(string.length), string, transform, thisArg);
	}

	public charAt(offset: number): string {
		return String.fromCharCode(this.read(offset));
	}

	public charCodeAt(offset: number): number {
		return this.buffer.readUInt16LE(offset * 2);
	}

	/**
	 * Write a charCode to the buffer using {@link Buffer.writeUInt16LE}.
	 *
	 * @param charCode charCode The charCode to append.
	 * @param offset offset The zero based offset to write at.
	 */
	public write(charCode: number, offset?: number): this {
		if (typeof offset === 'undefined') {
			offset = this._length;
		}

		this._ensureCapacity(offset + 1);
		this.buffer.writeUInt16LE(charCode, offset * 2);
		this._length = offset + 1 > this._length ? offset + 1 : this._length;
		return this;
	}

	public toString(): string {
		return this.buffer.toString('utf16le', 0, this._length * 2);
	}

	/**
	 * Ensures a minimum capacity.
	 * @param {Number} minCapacity The minimum capacity (i.e. the expected {@link String#length length} of the {@link String} this buffer may represent).
	 */
	private _ensureCapacity(minCapacity: number): void {
		if (this.buffer.length < minCapacity * 2) {
			if (minCapacity < this.buffer.length) {
				minCapacity = this.buffer.length; // I.e. double the capacity (!)
			}

			const buffer = Buffer.alloc(minCapacity * 2);
			this.buffer.copy(buffer);
			this.buffer = buffer;
		}
	}
}
