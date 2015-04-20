import { assert } from 'chai';

import * as path from '../../src/path';

suite('path', function() {
  test('#leaf', function() {
    assert.equal(path.leaf('stairway/to/heaven'), 'heaven');
  });

  test('#parent', function() {
    assert.equal(path.parent('stairway/to/heaven'), 'stairway/to');
  });

  test('#root', function() {
    assert.equal(path.root('stairway/to/heaven'), 'stairway');
  });

  test('#subpaths', function() {
    assert.deepEqual(
      path.subpaths('stairway/to/heaven'),
      [
        'stairway',
        'stairway/to',
        'stairway/to/heaven'
      ]
    );
  });
});
