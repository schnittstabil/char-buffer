import dots from 'dots';
import testStrings from './_test-strings';
import {plusOne, minusOne} from './_math';

const idTest = (test, BufferConstr, testString) => {
	const title = BufferConstr.name + '.map: (minusOne ° plusOne) should act like identity for ' + dots(testString, 40);

	test(title, t => {
		const org = BufferConstr.fromString(testString);
		const p1 = org.map(plusOne);
		const id = p1.map(minusOne);
		t.is(id.toString(), testString);
	});
};

const idTests = (test, BufferConstr) => testStrings.forEach(s => idTest(test, BufferConstr, s));

const throwsOnNonCallbackTest = (test, BufferConstr) => test(BufferConstr.name + '.map throws exception on non callback', t => {
	t.throws(() => {
		new BufferConstr().map(null);
	}, /not a function/);
});

const thisArgTest = (test, BufferConstr) => test(BufferConstr.name + '.map should respect thisArg', t => {
	const thisArg = {count: 0};
	const buffer = new BufferConstr(3);

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

export default (test, BufferConstr) => {
	idTests(test, BufferConstr);
	throwsOnNonCallbackTest(test, BufferConstr);
	thisArgTest(test, BufferConstr);
};
