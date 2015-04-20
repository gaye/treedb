import { db } from './db';
import { domPromise, indexGetAll, transactionComplete } from './idb';
import * as path from './path';
import * as primitive from './primitive';
import Query from './query';

export default class Vertex extends Query {
  constructor(key) {
    super();

    this._key = key;
    this._onNewListener = this._onNewListener.bind(this);
    this.on('newListener', this._onNewListener);
  }

  async child(relpath) {
    let childpath = `${this._key}/${relpath}`;
    await findOrCreateVertex(childpath);
    return new Vertex(childpath);
  }

  parent() {
    // We already know that the parent vertex exists.
    let parentpath = path.parent(this._key);
    return new Vertex(parentpath);
  }

  root() {
    // We already know that the root exists.
    let rootpath = path.root(this._key);
    return new Vertex(rootpath, db);
  }

  key() {
    return this._key;
  }

  async set(value) {
    if (primitive.isPrimitive(value)) {
      let childKey = `${this._key}/${primitive.stringify(value)}`;
      await createVertex(childKey, value);
      this.emit('child_added', new Vertex(childKey));
    } else if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index++) {
        let child = await this.child(index.toString());
        await child.set(value[index]);
        this.emit('child_added', child);
      }
    } else {
      // Object
      for (let key in value) {
        let child = await this.child(key);
        await child.set(value[key]);
        this.emit('child_added', key);
      }
    }

    // Report new value.
    let newValue = await getValue(this._key);
    this.emit('value', newValue);
  }

  async update(value) {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  async remove() {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  async push() {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  /**
   * We need to tell the new listener our data.
   */
  async _onNewListener(event, listener) {
    // TODO(gaye)
  }
}

async function findOrCreateVertex(key) {
  let subpaths = path.subpaths(key);

  let vertex, parentKey;
  for (let i = 0; i < subpaths.length; i++) {
    let subpath = subpaths[i];
    vertex = await findVertex(subpath);
    if (!vertex || !vertex.key) {
      // vertex needs to be created
      vertex = await createVertex(subpath);
    }

    parentKey = vertex.key;
  }

  return vertex;
}

async function findVertex(key) {
  let trans = db.transaction('vertex', 'readonly');
  let store = trans.objectStore('vertex');
  let vertex = await domPromise(store.get(key));
  await transactionComplete(trans);
  return vertex;
}

async function createVertex(key, value) {
  let trans = db.transaction('vertex', 'readwrite');
  let store = trans.objectStore('vertex');
  let parentKey = path.parent(key);
  let record = { key: key, parentKey: parentKey };
  if (value)
    record.value = value;
  store.add(record);
  await transactionComplete(trans);
  return record;
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
async function getValue(key) {
  let result = {};
  let children = await getChildren(key);
  result[path.leaf(key)] = await getChildrenValue(children);
  return result;
}

async function getChildrenValue(children) {
  switch (children.length) {
    case 0:
      return null;
    case 1:
      let child = children[0];
      let grandchildren = await getChildren(child.key);

      if (!grandchildren.length) {
        let vertex = await findVertex(child.key);
        return vertex.value;
      }

      return getValue(child.key);
    default:
      let value = {};
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let grandchildren = await getChildren(child.key);
        value[path.leaf(child.key)] = await getChildrenValue(grandchildren);
      }

      return value;
  }
}

async function getChildren(key) {
  let trans = db.transaction('vertex', 'readonly');
  let store = trans.objectStore('vertex');
  let index = store.index('parentKey');
  let children = await indexGetAll(index, { range: IDBKeyRange.only(key) });
  await transactionComplete(trans);
  return children;
}
