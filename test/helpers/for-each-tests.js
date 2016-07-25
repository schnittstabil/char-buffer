function callTest(test, BufferConstr) {
	test(BufferConstr.name + '.forEach: should call callback with every written charCode', function (t) {
		var count = 0;
		var buffer = new BufferConstr(3);

		buffer.append(102).append(111);
		buffer.forEach(function (charCode, index, charBuffer) {
			t.is(charBuffer, buffer);
			t.is(charCode, index ? 111 : 102);
			count++;
		});

		t.is(count, 2);
	});
}

function throwsOnNonCallbackTest(test, BufferConstr) {
	test(BufferConstr.name + '.forEach throws exception on non callback', function (t) {
		t.throws(function () {
			new BufferConstr().forEach(null);
		}, /not a function/);
	});
}

function thisArgTest(test, BufferConstr) {
	test(BufferConstr.name + '.forEach should respect thisArg', function (t) {
		var thisArg = {count: 0};
		var buffer = new BufferConstr(2);

		buffer.append(102).append(111);

		buffer.forEach(function (charCode, index, charBuffer) {
			t.is(charBuffer, buffer);
			t.is(charCode, index ? 111 : 102);
			t.is(this, thisArg);
			this.count++;
		}, thisArg);

		t.is(thisArg.count, 2);
	});
}

function mapTests(test, BufferConstr) {
	callTest(test, BufferConstr);
	throwsOnNonCallbackTest(test, BufferConstr);
	thisArgTest(test, BufferConstr);
}

module.exports = mapTests;

