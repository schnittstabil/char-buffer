import AbstractCharBuffer from '../abstract-char-buffer';
import StringArrayBuffer from '../string-array-buffer.js';
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
].filter(function (t) {
	return t.CharBuffer.isSupported;
}).map(
	({name, CharBuffer}) => describe(name, function () {
		const charBuffer = CharBuffer;

		it('should exists', function () {
			xpect(CharBuffer).to.be.a('function');
		});

		it('should have a name', function () {
			xpect(CharBuffer.name).to.be.a('string');
		});

		it('constructor should return an instance of AbstractCharBuffer', function () {
			xpect(charBuffer(0) instanceof AbstractCharBuffer).to.be.ok();
		});

		it('constructor (using new) should return an instance of AbstractCharBuffer', function () {
			xpect(new CharBuffer(0) instanceof AbstractCharBuffer).to.be.ok();
		});

		it('constructor (using new) should return an instance of AbstractCharBuffer', function () {
			xpect(new CharBuffer(0) instanceof AbstractCharBuffer).to.be.ok();
		});

		it('should support append', function () {
			xpect(charBuffer(0)).to.be.ok();

			xpect(charBuffer(0).append).to.be.a('function');
			xpect(new CharBuffer(0).append).to.be.a('function');

			xpect(charBuffer(3).append(102).append(111).append(111).toString()).to.be('foo');
			xpect(new CharBuffer(3).append(102).append(111).append(111).toString()).to.be('foo');

			xpect(charBuffer(1).append(102).append(111).append(111).toString()).to.be('foo');
			xpect(new CharBuffer(1).append(102).append(111).append(111).toString()).to.be('foo');
		});
	})
);

var runner;
var errors = [];

window.onload = function () {
	function exposeMochaResults() {
		window.mochaResults = runner.stats;
	}

	document.getElementById('mocha').innerHTML = '';

	try {
		runner = mocha.run();
		runner.on('end', exposeMochaResults);

		// test if already ended:
		if (runner.stats.end) {
			exposeMochaResults();
		}
	} catch (err) {
		errors.unshift(err);
		document.write(errors);

		throw err;
	}
};
