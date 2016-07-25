function appendTests(test, BufferConstr) {
	if (BufferConstr.isSupported) {
		return;
	}

	test(BufferConstr.name + ' should support append', function (t) {
		var buffer = BufferConstr;

		t.truthy(buffer(0));

		t.is(typeof buffer(0).append, 'function');
		t.is(typeof new BufferConstr(0).append, 'function');

		t.is(buffer(3).append(102).append(111).append(111).toString(), 'foo');
		t.is(new BufferConstr(3).append(102).append(111).append(111).toString(), 'foo');

		t.is(buffer(1).append(102).append(111).append(111).toString(), 'foo');
		t.is(new BufferConstr(1).append(102).append(111).append(111).toString(), 'foo');
	});
}

module.exports = appendTests;
