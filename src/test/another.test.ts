import * as assert from 'assert';

// import * as myExtension from '../../extension';

suite('Non-Extension Test Suite', () => {

	test('Sample test2', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test("I am funny test2", () => {
		assert.strictEqual(true, false);
	});
});
