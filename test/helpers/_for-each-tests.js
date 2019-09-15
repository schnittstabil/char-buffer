const callTest = (test, BufferConstr) => {
	test(BufferConstr.name + '.forEach: should call callback with every written charCode', t => {
		let count = 0;
		const buffer = new BufferConstr(3);

		buffer.append(102).append(111);
		buffer.forEach((charCode, index, charBuffer) => {
			t.is(charBuffer, buffer);
			t.is(charCode, index ? 111 : 102);
			count++;
		});

		t.is(count, 2);
	});
};

const throwsOnNonCallbackTest = (test, BufferConstr) => {
	test(BufferConstr.name + '.forEach throws exception on non callback', t => {
		t.throws(() => {
			new BufferConstr().forEach(null);
		}, /not a function/);
	});
};

const thisArgTest = (test, BufferConstr) => {
	test(BufferConstr.name + '.forEach should respect thisArg', t => {
		const thisArg = {count: 0};
		const buffer = new BufferConstr(2);

		buffer.append(102).append(111);

		buffer.forEach(function (charCode, index, charBuffer) {
			t.is(charBuffer, buffer);
			t.is(charCode, index ? 111 : 102);
			t.is(this, thisArg);
			this.count++;
		}, thisArg);

		t.is(thisArg.count, 2);
	});
};

const mapTests = (test, BufferConstr) => {
	callTest(test, BufferConstr);
	throwsOnNonCallbackTest(test, BufferConstr);
	thisArgTest(test, BufferConstr);
};

export default mapTests;

