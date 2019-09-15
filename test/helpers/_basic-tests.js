import dots from 'dots';
import testStrings from './_test-strings';

const basicTest = (test, BufferConstr, testString) => {
	const testStringLen = testString.length;
	const MAX_LEN = testStringLen <= 40 ? testStringLen : 40;
	const MID = Math.round(testStringLen / 2);
	const TEST_CHAR = 'a';
	const TEST_CHARCODE = TEST_CHAR.charCodeAt(0);

	test('work well on "' + dots(testString, MAX_LEN) + '"', t => {
		const buffer = new BufferConstr(MAX_LEN);

		// Append testString
		for (let j = 0; j < testStringLen; j++) {
			buffer.append(testString.charCodeAt(j));
			if (j === MID) {
				// Check length and content
				t.is(buffer.length, j + 1);
				t.is(buffer.toString(), testString.substr(0, j + 1));
			}
		}

		// Check length and content
		t.is(buffer.length, testStringLen);
		t.is(buffer.toString(), testString);

		// Overwrite char
		buffer.write(TEST_CHARCODE, MID);

		// Check content
		for (let j = 0; j < MAX_LEN; j++) {
			if (j === MID) {
				t.is(buffer.charAt(j), TEST_CHAR);
				t.is(buffer.charCodeAt(j), TEST_CHARCODE);
			} else {
				t.is(buffer.charAt(j), testString.charAt(j));
				t.is(buffer.charCodeAt(j), testString.charCodeAt(j));
			}
		}

		// Try illegal truncation
		t.throws(() => {
			buffer.setLength(-1);
		});

		// Truncate
		t.notThrows(() => {
			buffer.setLength(1);
		});
		t.is(buffer.toString(), testString.substr(0, 1));

		// Append single char
		t.notThrows(() => {
			buffer.write(testString.charCodeAt(1), buffer.getLength());
		});
		t.is(buffer.toString(), testString.substr(0, 2));
	});
};

export default (test, BufferConstr) => {
	testStrings.forEach(s => {
		basicTest(test, BufferConstr, s);
	});
};
