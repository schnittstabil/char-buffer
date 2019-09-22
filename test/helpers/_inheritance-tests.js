import AbstractCharBuffer from '../../abstract-char-buffer';

const _inheritanceTests = (test, BufferConstr) => {
	test(BufferConstr.name + ' should exists', t => {
		t.is(typeof BufferConstr, 'function');
	});

	test(BufferConstr.name + ' should have a name', t => {
		t.is(typeof BufferConstr.name, 'string');
	});

	test(BufferConstr.name + ' constructor (using new) should return an instance of AbstractCharBuffer', t => {
		t.truthy(new BufferConstr(0) instanceof AbstractCharBuffer);
	});
};

export default _inheritanceTests;
