var dots = require('dots');
var testStrings = require('./test-strings');
var math = require('./math');

function fromStringTest(test, BufferConstr, testString) {
	var title = BufferConstr.name + '.fromString: (minusOne ° plusOne) should act like identity for ' + dots(testString, 40);

	test(title, function (t) {
		t.is(BufferConstr.fromString(testString).toString(), testString);

		var p1 = BufferConstr.fromString(testString, math.plusOne).toString();
		var id = BufferConstr.fromString(p1, math.minusOne).toString();

		t.is(id, testString);
	});
}

function fromStringTests(test, BufferConstr) {
	testStrings.forEach(function (s) {
		fromStringTest(test, BufferConstr, s);
	});
}

module.exports = fromStringTests;
