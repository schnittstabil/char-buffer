const dots = require('dots');
const testStrings = require('./_test-strings');
const math = require('./_math');

const fromStringTest = (test, BufferConstr, testString) => {
	const title = BufferConstr.name + '.fromString: (minusOne ° plusOne) should act like identity for ' + dots(testString, 40);

	test(title, t => {
		t.is(BufferConstr.fromString(testString).toString(), testString);

		const p1 = BufferConstr.fromString(testString, math.plusOne).toString();
		const id = BufferConstr.fromString(p1, math.minusOne).toString();

		t.is(id, testString);
	});
};

export default (test, BufferConstr) => {
	testStrings.forEach(s => {
		fromStringTest(test, BufferConstr, s);
	});
};
