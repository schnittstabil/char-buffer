const AbstractCharBuffer = require('../../abstract-char-buffer');

function inheritanceTests(test, BufferConstr) {
	var buffer = BufferConstr;

	test(BufferConstr.name + ' should exists', function (t) {
		t.is(typeof BufferConstr, 'function');
	});

	test(BufferConstr.name + ' should have a name', function (t) {
		t.is(typeof BufferConstr.name, 'string');
	});

	test(BufferConstr.name + ' constructor should return an instance of AbstractCharBuffer', function (t) {
		t.truthy(buffer(0) instanceof AbstractCharBuffer);
	});

	test(BufferConstr.name + ' constructor (using new) should return an instance of AbstractCharBuffer', function (t) {
		t.truthy(new BufferConstr(0) instanceof AbstractCharBuffer);
	});
}

module.exports = inheritanceTests;
