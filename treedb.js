(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.treedb = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.open = open;
exports.close = close;

var _domPromise = require('./idb');

var db = undefined;

exports.db = db;

function open(name) {
  var version = arguments[1] === undefined ? 1 : arguments[1];
  var req;
  return regeneratorRuntime.async(function open$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        req = indexedDB.open(name, version);

        req.onupgradeneeded = function (event) {
          var oldVersion = event.oldVersion;
          exports.db = db = req.result;

          if (oldVersion < 1) {
            // Create initial backing idb database.
            var store = db.createObjectStore('vertex', { keyPath: 'key' });
            store.createIndex('parentKey', 'parentKey', { unique: false });
            // Inject root node.
            store.add({ key: name, parentKey: null });
          }
        };

        context$1$0.next = 4;
        return _domPromise.domPromise(req);

      case 4:
        exports.db = db = context$1$0.sent;
        return context$1$0.abrupt('return', db);

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function close() {
  db.close();
}
},{"./idb":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.domPromise = domPromise;

/**
 * Options:
 *
 *   (IDBKeyRange) range
 */
exports.indexGetAll = indexGetAll;
exports.transactionComplete = transactionComplete;

function domPromise(req) {
  return new Promise(function (resolve, reject) {
    req.onerror = function () {
      return reject(req.errorCode);
    };
    req.onsuccess = function () {
      return resolve(req.result);
    };
  });
}

function indexGetAll(index, options) {
  var result = [];
  var req = index.openCursor(options.range);

  return new Promise(function (accept, reject) {
    req.onerror = reject;

    req.onsuccess = function (event) {
      var cursor = event.target.result;
      if (!cursor) return accept(result);
      result.push(cursor.value);
      cursor["continue"]();
    };
  });
}

function transactionComplete(trans) {
  return new Promise(function (resolve, reject) {
    trans.onerror = reject;
    trans.oncomplete = resolve;
  });
}
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.leaf = leaf;
exports.parent = parent;
exports.root = root;
exports.subpaths = subpaths;

function leaf(path) {
  var parts = path.split('/');
  return parts[parts.length - 1];
}

function parent(path) {
  var parts = path.split('/');
  if (parts.length <= 1) {
    return null;
  }parts.pop();
  return parts.join('/');
}

function root(path) {
  return path.split('/')[0];
}

function subpaths(path) {
  var parts = path.split('/');
  return parts.reduce(function (result, part) {
    var next = undefined;
    if (result.length) {
      var prev = result[result.length - 1];
      next = '' + prev + '/' + part;
    } else {
      next = part;
    }

    result.push(next);
    return result;
  }, []);
}
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isPrimitive = isPrimitive;
exports.stringify = stringify;

function isPrimitive(value) {
  switch (typeof value) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return true;
    case 'object':
      return value === null || value instanceof Boolean || value instanceof Number || value instanceof String;
  }
}

function stringify(value) {
  if (value == null) {
    return 'null';
  }

  return value.toString();
}
},{}],5:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _EventEmitter22 = require('eventemitter2');

var Query = (function (_EventEmitter2) {
  function Query() {
    _classCallCheck(this, Query);

    _get(Object.getPrototypeOf(Query.prototype), 'constructor', this).call(this, {
      maxListeners: 1000,
      newListener: true
    });
  }

  _inherits(Query, _EventEmitter2);

  _createClass(Query, [{
    key: 'orderByChild',
    value: function orderByChild(key) {
      // TODO(gaye)
      throw new Error('Not yet implemented');
    }
  }, {
    key: 'orderByKey',
    value: function orderByKey() {
      // TODO(gaye)
      throw new Error('Not yet implemented');
    }
  }, {
    key: 'orderByValue',
    value: function orderByValue() {
      // TODO(gaye)
      throw new Error('Not yet implemented');
    }
  }, {
    key: 'startAt',
    value: function startAt(value, key) {
      // TODO(gaye)
      throw new Error('Not yet implemented');
    }
  }, {
    key: 'endAt',
    value: function endAt(value, key) {
      // TODO(gaye)
      throw new Error('Not yet implemented');
    }
  }, {
    key: 'equalTo',
    value: function equalTo(value, key) {
      // TODO(gaye)
      throw new Error('Not yet implemented');
    }
  }, {
    key: 'limitToFirst',
    value: function limitToFirst(limit) {
      // TODO(gaye)
      throw new Error('Not yet implemented');
    }
  }, {
    key: 'limitToLast',
    value: function limitToLast(limit) {
      // TODO(gaye)
      throw new Error('Not yet implemented');
    }
  }, {
    key: 'limit',
    value: function limit(limit) {
      // TODO(gaye)
      throw new Error('Not yet implemented');
    }
  }, {
    key: 'ref',
    value: function ref() {
      // TODO(gaye)
      throw new Error('Not yet implemented');
    }
  }]);

  return Query;
})(_EventEmitter22.EventEmitter2);

exports['default'] = Query;
module.exports = exports['default'];
},{"eventemitter2":9}],6:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.open = open;
exports.close = close;

var _import = require('./db');

var db = _interopRequireWildcard(_import);

var _Vertex = require('./vertex');

var _Vertex2 = _interopRequireWildcard(_Vertex);

function open(name) {
  return regeneratorRuntime.async(function open$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return db.open(name);

      case 2:
        return context$1$0.abrupt('return', new _Vertex2['default'](name));

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function close() {
  db.close();
}

var _domPromise = require('./idb');

Object.defineProperty(exports, 'domPromise', {
  enumerable: true,
  get: function get() {
    return _domPromise.domPromise;
  }
});
exports.Vertex = _Vertex2['default'];
},{"./db":1,"./idb":2,"./vertex":7}],7:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _db = require('./db');

var _domPromise$indexGetAll$transactionComplete = require('./idb');

var _import = require('./path');

var path = _interopRequireWildcard(_import);

var _import2 = require('./primitive');

var primitive = _interopRequireWildcard(_import2);

var _Query2 = require('./query');

var _Query3 = _interopRequireWildcard(_Query2);

var Vertex = (function (_Query) {
  function Vertex(key) {
    _classCallCheck(this, Vertex);

    _get(Object.getPrototypeOf(Vertex.prototype), 'constructor', this).call(this);

    this._key = key;
    this._onNewListener = this._onNewListener.bind(this);
    this.on('newListener', this._onNewListener);
  }

  _inherits(Vertex, _Query);

  _createClass(Vertex, [{
    key: 'child',
    value: function child(relpath) {
      var childpath;
      return regeneratorRuntime.async(function child$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            childpath = '' + this._key + '/' + relpath;
            context$2$0.next = 3;
            return findOrCreateVertex(childpath);

          case 3:
            return context$2$0.abrupt('return', new Vertex(childpath));

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'parent',
    value: function parent() {
      // We already know that the parent vertex exists.
      var parentpath = path.parent(this._key);
      return new Vertex(parentpath);
    }
  }, {
    key: 'root',
    value: function root() {
      // We already know that the root exists.
      var rootpath = path.root(this._key);
      return new Vertex(rootpath, _db.db);
    }
  }, {
    key: 'key',
    value: function key() {
      return this._key;
    }
  }, {
    key: 'set',
    value: function set(value) {
      var childKey, index, child, key, newValue;
      return regeneratorRuntime.async(function set$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!primitive.isPrimitive(value)) {
              context$2$0.next = 7;
              break;
            }

            childKey = '' + this._key + '/' + primitive.stringify(value);
            context$2$0.next = 4;
            return createVertex(childKey, value);

          case 4:
            this.emit('child_added', new Vertex(childKey));
            context$2$0.next = 32;
            break;

          case 7:
            if (!Array.isArray(value)) {
              context$2$0.next = 21;
              break;
            }

            index = 0;

          case 9:
            if (!(index < value.length)) {
              context$2$0.next = 19;
              break;
            }

            context$2$0.next = 12;
            return this.child(index.toString());

          case 12:
            child = context$2$0.sent;
            context$2$0.next = 15;
            return child.set(value[index]);

          case 15:
            this.emit('child_added', child);

          case 16:
            index++;
            context$2$0.next = 9;
            break;

          case 19:
            context$2$0.next = 32;
            break;

          case 21:
            context$2$0.t0 = regeneratorRuntime.keys(value);

          case 22:
            if ((context$2$0.t1 = context$2$0.t0()).done) {
              context$2$0.next = 32;
              break;
            }

            key = context$2$0.t1.value;
            context$2$0.next = 26;
            return this.child(key);

          case 26:
            child = context$2$0.sent;
            context$2$0.next = 29;
            return child.set(value[key]);

          case 29:
            this.emit('child_added', key);
            context$2$0.next = 22;
            break;

          case 32:
            context$2$0.next = 34;
            return getValue(this._key);

          case 34:
            newValue = context$2$0.sent;

            this.emit('value', newValue);

          case 36:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'update',
    value: function update(value) {
      return regeneratorRuntime.async(function update$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            throw new Error('Not yet implemented');

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'remove',
    value: function remove() {
      return regeneratorRuntime.async(function remove$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            throw new Error('Not yet implemented');

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'push',
    value: function push() {
      return regeneratorRuntime.async(function push$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            throw new Error('Not yet implemented');

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: '_onNewListener',

    /**
     * We need to tell the new listener our data.
     */
    value: function _onNewListener(event, listener) {
      return regeneratorRuntime.async(function _onNewListener$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return Vertex;
})(_Query3['default']);

exports['default'] = Vertex;

function findOrCreateVertex(key) {
  var subpaths, vertex, parentKey, i, subpath;
  return regeneratorRuntime.async(function findOrCreateVertex$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        subpaths = path.subpaths(key);
        vertex = undefined, parentKey = undefined;
        i = 0;

      case 3:
        if (!(i < subpaths.length)) {
          context$1$0.next = 16;
          break;
        }

        subpath = subpaths[i];
        context$1$0.next = 7;
        return findVertex(subpath);

      case 7:
        vertex = context$1$0.sent;

        if (!(!vertex || !vertex.key)) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 11;
        return createVertex(subpath);

      case 11:
        vertex = context$1$0.sent;

      case 12:

        parentKey = vertex.key;

      case 13:
        i++;
        context$1$0.next = 3;
        break;

      case 16:
        return context$1$0.abrupt('return', vertex);

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function findVertex(key) {
  var trans, store, vertex;
  return regeneratorRuntime.async(function findVertex$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        trans = _db.db.transaction('vertex', 'readonly');
        store = trans.objectStore('vertex');
        context$1$0.next = 4;
        return _domPromise$indexGetAll$transactionComplete.domPromise(store.get(key));

      case 4:
        vertex = context$1$0.sent;
        context$1$0.next = 7;
        return _domPromise$indexGetAll$transactionComplete.transactionComplete(trans);

      case 7:
        return context$1$0.abrupt('return', vertex);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function createVertex(key, value) {
  var trans, store, parentKey, record;
  return regeneratorRuntime.async(function createVertex$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        trans = _db.db.transaction('vertex', 'readwrite');
        store = trans.objectStore('vertex');
        parentKey = path.parent(key);
        record = { key: key, parentKey: parentKey };

        if (value) record.value = value;
        store.add(record);
        context$1$0.next = 8;
        return _domPromise$indexGetAll$transactionComplete.transactionComplete(trans);

      case 8:
        return context$1$0.abrupt('return', record);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

/**
 * Example tree:
 *
 * test
 *   \___ posts
 *          \____ 0
 *                \____ title
 *                        \_____ Effective indexedDB abstractions
 *                \____ author
 *                        \_____ gaye
 *                \____ comments
 *                         \____ 0
 *                               \____ How do you know when it's working?
 *
 */
function getValue(key) {
  var result, children;
  return regeneratorRuntime.async(function getValue$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        result = {};
        context$1$0.next = 3;
        return getChildren(key);

      case 3:
        children = context$1$0.sent;
        context$1$0.next = 6;
        return getChildrenValue(children);

      case 6:
        result[path.leaf(key)] = context$1$0.sent;
        return context$1$0.abrupt('return', result);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function getChildrenValue(children) {
  var child, grandchildren, vertex, value, i, _child, _grandchildren;

  return regeneratorRuntime.async(function getChildrenValue$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.t2 = children.length;
        context$1$0.next = context$1$0.t2 === 0 ? 3 : context$1$0.t2 === 1 ? 4 : 14;
        break;

      case 3:
        return context$1$0.abrupt('return', null);

      case 4:
        child = children[0];
        context$1$0.next = 7;
        return getChildren(child.key);

      case 7:
        grandchildren = context$1$0.sent;

        if (grandchildren.length) {
          context$1$0.next = 13;
          break;
        }

        context$1$0.next = 11;
        return findVertex(child.key);

      case 11:
        vertex = context$1$0.sent;
        return context$1$0.abrupt('return', vertex.value);

      case 13:
        return context$1$0.abrupt('return', getValue(child.key));

      case 14:
        value = {};
        i = 0;

      case 16:
        if (!(i < children.length)) {
          context$1$0.next = 27;
          break;
        }

        _child = children[i];
        context$1$0.next = 20;
        return getChildren(_child.key);

      case 20:
        _grandchildren = context$1$0.sent;
        context$1$0.next = 23;
        return getChildrenValue(_grandchildren);

      case 23:
        value[path.leaf(_child.key)] = context$1$0.sent;

      case 24:
        i++;
        context$1$0.next = 16;
        break;

      case 27:
        return context$1$0.abrupt('return', value);

      case 28:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function getChildren(key) {
  var trans, store, index, children;
  return regeneratorRuntime.async(function getChildren$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        trans = _db.db.transaction('vertex', 'readonly');
        store = trans.objectStore('vertex');
        index = store.index('parentKey');
        context$1$0.next = 5;
        return _domPromise$indexGetAll$transactionComplete.indexGetAll(index, { range: IDBKeyRange.only(key) });

      case 5:
        children = context$1$0.sent;
        context$1$0.next = 8;
        return _domPromise$indexGetAll$transactionComplete.transactionComplete(trans);

      case 8:
        return context$1$0.abrupt('return', children);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}
module.exports = exports['default'];

// Object

// Report new value.

// TODO(gaye)

// TODO(gaye)

// TODO(gaye)

// TODO(gaye)

// vertex needs to be created
},{"./db":1,"./idb":2,"./path":3,"./primitive":4,"./query":5}],8:[function(require,module,exports){
require('regenerator/runtime');
module.exports = require('./build/treedb');

},{"./build/treedb":6,"regenerator/runtime":10}],9:[function(require,module,exports){
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {

      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    configure.call(this, conf);
  }

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }

    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }

        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = defaultMaxListeners;

            if (typeof this._events.maxListeners !== 'undefined') {
              m = this._events.maxListeners;
            }

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              console.trace();
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  }

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._events || init.call(this);
    this._events.maxListeners = n;
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) { return false; }
    }

    // Loop through the *_all* functions and invoke them.
    if (this._all) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        this._all[i].apply(this, args);
      }
    }

    // If there is no 'error' event listener then throw.
    if (type === 'error') {

      if (!this._all &&
        !this._events.error &&
        !(this.wildcard && this.listenerTree.error)) {

        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    var handler;

    if(this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    }
    else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      if (arguments.length === 1) {
        handler.call(this);
      }
      else if (arguments.length > 1)
        switch (arguments.length) {
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            var l = arguments.length;
            var args = new Array(l - 1);
            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
            handler.apply(this, args);
        }
      return true;
    }
    else if (handler) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        this.event = type;
        listeners[i].apply(this, args);
      }
      return (listeners.length > 0) || !!this._all;
    }
    else {
      return !!this._all;
    }

  };

  EventEmitter.prototype.on = function(type, listener) {

    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
    else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (!this._events[type].warned) {

        var m = defaultMaxListeners;

        if (typeof this._events.maxListeners !== 'undefined') {
          m = this._events.maxListeners;
        }

        if (m > 0 && this._events[type].length > m) {

          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          console.trace();
        }
      }
    }
    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if(!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          return this;
        }
      }
    } else {
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else {
      if (!this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    exports.EventEmitter2 = EventEmitter;
  }
  else {
    // Browser global.
    window.EventEmitter2 = EventEmitter;
  }
}();

},{}],10:[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);

    generator._invoke = makeInvokeMethod(
      innerFn, self || null,
      new Context(tryLocsList || [])
    );

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    return new Promise(function(resolve, reject) {
      var generator = wrap(innerFn, outerFn, self, tryLocsList);
      var callNext = step.bind(generator, "next");
      var callThrow = step.bind(generator, "throw");

      function step(method, arg) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
          return;
        }

        var info = record.arg;
        if (info.done) {
          resolve(info.value);
        } else {
          Promise.resolve(info.value).then(callNext, callThrow);
        }
      }

      callNext();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            delete context.sent;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  function defineGeneratorMethod(method) {
    Gp[method] = function(arg) {
      return this._invoke(method, arg);
    };
  }
  defineGeneratorMethod("next");
  defineGeneratorMethod("throw");
  defineGeneratorMethod("return");

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset();
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function() {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      // Pre-initialize at least 20 temporary variables to enable hidden
      // class optimizations for simple generators.
      for (var tempIndex = 0, tempName;
           hasOwn.call(this, tempName = "t" + tempIndex) || tempIndex < 20;
           ++tempIndex) {
        this[tempName] = null;
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          return this.complete(entry.completion, entry.afterLoc);
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[8])(8)
});