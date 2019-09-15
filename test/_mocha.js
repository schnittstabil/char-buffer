import AbstractCharBuffer from '../abstract-char-buffer';
import StringArrayBuffer from '../string-array-buffer';
import StringBuffer from '../string-buffer';
import TypedArrayBuffer from '../typed-array-buffer';

[
	{
		name: 'StringArrayBuffer',
		CharBuffer: StringArrayBuffer
	},
	{
		name: 'StringBuffer',
		CharBuffer: StringBuffer
	},
	{
		name: 'TypedArrayBuffer',
		CharBuffer: TypedArrayBuffer
	}
].filter(t => t.CharBuffer.isSupported)
	.map(({name, CharBuffer}) => describe(name, () => {
		const charBuffer = CharBuffer;

		it('should exists', () => {
			xpect(CharBuffer).to.be.a('function');
		});

		it('should have a name', () => {
			xpect(CharBuffer.name).to.be.a('string');
		});

		it('constructor should return an instance of AbstractCharBuffer', () => {
			xpect(charBuffer(0) instanceof AbstractCharBuffer).to.be.ok();
		});

		it('constructor (using new) should return an instance of AbstractCharBuffer', () => {
			xpect(new CharBuffer(0) instanceof AbstractCharBuffer).to.be.ok();
		});

		it('constructor (using new) should return an instance of AbstractCharBuffer', () => {
			xpect(new CharBuffer(0) instanceof AbstractCharBuffer).to.be.ok();
		});

		it('should support append', () => {
			xpect(charBuffer(0)).to.be.ok();

			xpect(charBuffer(0).append).to.be.a('function');
			xpect(new CharBuffer(0).append).to.be.a('function');

			xpect(charBuffer(3).append(102).append(111).append(111).toString()).to.be('foo');
			xpect(new CharBuffer(3).append(102).append(111).append(111).toString()).to.be('foo');

			xpect(charBuffer(1).append(102).append(111).append(111).toString()).to.be('foo');
			xpect(new CharBuffer(1).append(102).append(111).append(111).toString()).to.be('foo');
		});
	}));

window.addEventListener('load', () => {
	document.querySelector('#mocha').innerHTML = '';

	const runner = mocha.run();
	runner.on('end', () => {
		exposeMochaResults(runner.stats);
	});

	// Test if already ended:
	if (runner.stats.end) {
		exposeMochaResults(runner.stats);
	}
});
