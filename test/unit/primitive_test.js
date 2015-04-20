import { assert } from 'chai';

import * as primitive from '../../src/primitive';

suite('primitive', function() {
  test('#isPrimitive', function() {
    assert.isTrue(primitive.isPrimitive(true));
    assert.isTrue(primitive.isPrimitive(3.14));
    assert.isTrue(primitive.isPrimitive('haxx0r'));
    assert.isTrue(primitive.isPrimitive(undefined));
    assert.isTrue(primitive.isPrimitive(null));
    assert.isTrue(primitive.isPrimitive(new Boolean(false)));
    assert.isTrue(primitive.isPrimitive(new Number(1)));
    assert.isTrue(primitive.isPrimitive(new String('beep beep')));
    assert.isFalse(primitive.isPrimitive({ name: 'Linus', species: 'dog' }));
    assert.isFalse(primitive.isPrimitive(['a', 'b', 'c', 1, 2, 3]));
  });

  test('#stringifiy', function() {
    assert.equal(primitive.stringify(true), 'true');
    assert.equal(primitive.stringify(3.14), '3.14');
    assert.equal(primitive.stringify('haxx0r'), 'haxx0r');
    assert.equal(primitive.stringify(undefined), 'null');
    assert.equal(primitive.stringify(null), 'null');
    assert.equal(primitive.stringify(new Boolean(false)), 'false');
    assert.equal(primitive.stringify(new Number(1)), '1');
    assert.equal(primitive.stringify(new String('beep beep')), 'beep beep');
  });
});
