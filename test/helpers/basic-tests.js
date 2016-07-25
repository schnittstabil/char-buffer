var dots = require('dots');
var testStrings = require('./test-strings');

function basicTest(test, BufferConstr, testString) {
	var testStringLen = testString.length;
	var MAX_LEN = testStringLen <= 40 ? testStringLen : 40;
	var MID = Math.round(testStringLen / 2);
	var TEST_CHAR = 'a';
	var TEST_CHARCODE = TEST_CHAR.charCodeAt(0);

	test('work well on "' + dots(testString, MAX_LEN) + '"', function (t) {
		var buffer = new BufferConstr(MAX_LEN);
		var j;

		// append testString
		for (j = 0; j < testStringLen; j++) {
			buffer.append(testString.charCodeAt(j));
			if (j === MID) {
				// check length and content
				t.is(buffer.length, j + 1);
				t.is(buffer.toString(), testString.substr(0, j + 1));
			}
		}

		// check length and content
		t.is(buffer.length, testStringLen);
		t.is(buffer.toString(), testString);

		// overwrite char
		buffer.write(TEST_CHARCODE, MID);

		// check content
		for (j = 0; j < MAX_LEN; j++) {
			if (j === MID) {
				t.is(buffer.charAt(j), TEST_CHAR);
				t.is(buffer.charCodeAt(j), TEST_CHARCODE);
			} else {
				t.is(buffer.charAt(j), testString.charAt(j));
				t.is(buffer.charCodeAt(j), testString.charCodeAt(j));
			}
		}

		// try illegal truncation
		t.throws(function () {
			buffer.setLength(-1);
		});

		// truncate
		t.notThrows(function () {
			buffer.setLength(1);
		});
		t.is(buffer.toString(), testString.substr(0, 1));

		// append single char
		t.notThrows(function () {
			buffer.write(testString.charCodeAt(1), buffer.getLength());
		});
		t.is(buffer.toString(), testString.substr(0, 2));
	});
}

function basicTests(test, BufferConstr) {
	testStrings.forEach(function (s) {
		basicTest(test, BufferConstr, s);
	});
}

module.exports = basicTests;
