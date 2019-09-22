/**
 * Base class for all CharBuffers.
 */
export default abstract class AbstractCharBuffer {
	protected _length: number;

	/**
	 * Indicates whether this CharBuffer is supported by the current platform.
	 */
	public static get isSupported(): boolean {
		/* istanbul ignore next */
		return false;
	}

	/**
	 * @param initCapacity The initial capacity (i.e. the expected {@link String#length length} of the {@link String} represented by this buffer).
	 */
	protected constructor(initCapacity: number) {
		if (initCapacity < 0) {
			throw new RangeError(`initCapacity must be non-negative, ${initCapacity} given.`);
		}

		this._length = 0;
	}

	/**
	 * Creates a new CharBuffer from a {@link String}.
	 *
	 * @param output
	 * @param string The string.
	 * @param transform Function that produces a charCode for the new CharBuffer from a charCode of the string parameter.
	 * @param thisArg
	 *
	 * ```
	 * var charBuffer;
	 *
	 * charBuffer = CharBuffer.fromString('abc');
	 * console.log(charBuffer.toString()); // output: abc
	 *
	 * charBuffer = CharBuffer.fromString('abc', function (charCode, index){
	 *     return charCode + 3;
	 * });
	 *
	 * console.log(charBuffer.toString()); // output: def
	 * ```
	 */
	protected static _fromString<T extends AbstractCharBuffer>(output: T, string: string, transform?: (value: number, index: number, string: string) => number, thisArg?: any): T {
		const len = string.length;

		// Manual loop optimization :-)
		if (transform) {
			for (let i = 0; i < len; i++) {
				output.append(transform.call(thisArg, string.charCodeAt(i), i, string));
			}
		} else {
			for (let i = 0; i < len; i++) {
				output.append(string.charCodeAt(i));
			}
		}

		return output;
	}

	/**
	 * Length of the {@link String} represented by this buffer.
	 */
	public get length(): number {
		return this._length;
	}

	/**
	 * Sets the length of the {@link String} represented by this buffer.
	 *
	 * @param {Number} newLength The new length.
	 * @throws {RangeError} if `newLength < 0 || newLength > this.length`
	 */
	public set length(newLength: number) {
		this.setLength(newLength);
	}

	/**
	 * Appends a charCode to the buffer. The length of the buffer increases by 1.
	 *
	 * @param charCode The charCode to append.
	 */
	public append(charCode: number): this {
		return this.write(charCode);
	}

	/**
	 * Reads the charCode at an offset.
	 *
	 * @param offset The zero based offset.
	 * @return The charCode.
	 *
	 * @throws if offset < 0 or offset >= this.length
	 */
	public read(offset: number): number {
		return this.charCodeAt(offset);
	}

	/**
	 * Executes a function once per charCode.
	 * See also {@link Array#forEach}
	 *
	 * @param callback Function to execute for each charCode.
	 * @param thisArg Value to use as this when executing callback.
	 */
	public forEach(callback: (value: number, index: number, buffer: this) => void, thisArg?: any): void {
		if (typeof callback !== 'function') {
			throw new TypeError(`${callback} is not a function`);
		}

		for (let i = 0; i < this.length; i++) {
			callback.call(thisArg, this.read(i), i, this);
		}
	}

	/**
	 * Creates a new CharBuffer with the results of calling a provided function on every charCode.
	 * See also {@link Array#map}
	 *
	 * @param callback Function to execute for each charCode.
	 * @param thisArg Value to use as this when executing callback.
	 */
	public map(callback: (value: number, index: number, buffer: this) => number, thisArg?: any): this {
		if (typeof callback !== 'function') {
			throw new TypeError(`${callback} is not a function`);
		}

		const output = this.clone();

		for (let i = 0; i < this.length; i++) {
			output.append(callback.call(thisArg, this.read(i), i, this));
		}

		return output;
	}

	/**
	 * Override this to observe changes.
	 * @param newLength
	 */
	protected setLength(newLength: number): void {
		if (newLength < 0 || newLength > this.length) {
			throw new RangeError(`newLength must be between 0 and ${this.length}, ${newLength} given.`);
		}

		this._length = newLength;
	}

	protected clone(): this {
		return new (this.constructor as any)(this.length);
	}

	/**
	 * Writes a charCode to the buffer at an offset.
	 *
	 * @param charCode charCode The charCode to write.
	 * @param offset offset The zero based offset to write at.
	 *
	 * @throws if offset < 0 or offset > this.length
	 */
	public abstract write(charCode: number, offset?: number): this;

	/**
	 * Reads the charCode at an offset.
	 *
	 * @param offset The zero based offset.
	 * @return The charCode.
	 *
	 * @throws if offset < 0 or offset >= this.length
	 */
	public abstract charCodeAt(offset: number): number;

	/**
	 * Reads the char at an offset.
	 *
	 * @param offset The zero based offset.
	 * @return The char.
	 * @throws {Error} if offset < 0 or offset >= this.length
	 */
	public abstract charAt(offset: number): string;

	/**
	 * Returns the {@link String} represented by this buffer.
	 */
	public abstract toString(): string;
}
