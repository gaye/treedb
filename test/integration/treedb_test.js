var expect = chai.expect;

suite('treedb', function() {
  var root;

  setup(function() {
    return treedb.domPromise(indexedDB.deleteDatabase('test'));
  });

  setup(function() {
    return treedb.open('test').then(function(vertex) {
      root = vertex;
    });
  });

  teardown(function() {
    treedb.close();
  });

  test('initialization', function() {
    expect(root).to.be.instanceOf(treedb.Vertex);
  });

  suite('with child', function() {
    var child;

    setup(function() {
      return root.child('posts/0/comments/0').then(function(result) {
        child = result;
      });
    });

    test('#child', function() {
      expect(child).to.be.instanceOf(treedb.Vertex);
      expect(child.key()).to.equal('test/posts/0/comments/0');
    });

    test('#parent', function() {
      var parent = child.parent();
      expect(parent).to.be.instanceOf(treedb.Vertex);
      expect(parent.key()).to.equal('test/posts/0/comments');
    });

    test('#root', function() {
      expect(child.root().key()).to.equal(root.key());
    });
  });

  suite('#set', function() {
    test('primitive value', function(done) {
      root.on('child_added', function(child) {
        expect(child.key()).to.equal('test/5');
        done();
      });

      root.set(5);
    });

    test('array of primitives', function(done) {
      root.on('value', function(newValue) {
        expect(newValue).to.deep.equal({
          'test': {
            '0': 'a',
            '1': 'b',
            '2': 'c',
            '3': 1,
            '4': 2,
            '5': 3
          }
        });

        done();
      });

      root.set(['a', 'b', 'c', 1, 2, 3]);
    });
  });
});
