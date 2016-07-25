var dots = require('dots');
var testStrings = require('./test-strings');
var math = require('./math');

function idTest(test, BufferConstr, testString) {
	var title = BufferConstr.name + '.map: (minusOne ° plusOne) should act like identity for ' + dots(testString, 40);

	test(title, function (t) {
		var org = BufferConstr.fromString(testString);
		var p1 = org.map(math.plusOne);
		var id = p1.map(math.minusOne);
		t.is(id.toString(), testString);
	});
}

function idTests(test, BufferConstr) {
	testStrings.forEach(function (s) {
		idTest(test, BufferConstr, s);
	});
}

function throwsOnNonCallbackTest(test, BufferConstr) {
	test(BufferConstr.name + '.map throws exception on non callback', function (t) {
		t.throws(function () {
			new BufferConstr().map(null);
		}, /not a function/);
	});
}

function thisArgTest(test, BufferConstr) {
	test(BufferConstr.name + '.map should respect thisArg', function (t) {
		var thisArg = {count: 0};
		var buffer = new BufferConstr(3);

		buffer.append(102).append(111);

		buffer.map(function (charCode, index, charBuffer) {
			t.is(charBuffer, buffer);
			t.is(charCode, index ? 111 : 102);
			t.is(this, thisArg);
			this.count++;

			return charCode;
		}, thisArg);

		t.is(thisArg.count, 2);
	});
}

function mapTests(test, BufferConstr) {
	idTests(test, BufferConstr);
	throwsOnNonCallbackTest(test, BufferConstr);
	thisArgTest(test, BufferConstr);
}

module.exports = mapTests;
