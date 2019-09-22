export default (test, BufferConstr) => {
	if (BufferConstr.isSupported) {
		return;
	}

	test(BufferConstr.name + ' should support append', t => {
		t.truthy(new BufferConstr(0));
		t.is(typeof new BufferConstr(0).append, 'function');
		t.is(new BufferConstr(3).append(102).append(111).append(111).toString(), 'foo');
		t.is(new BufferConstr(1).append(102).append(111).append(111).toString(), 'foo');
	});
};
