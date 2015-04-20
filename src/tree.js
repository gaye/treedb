/**
 * @fileoverview abstractions for basic tree operations.
 */
import { db } from './db';
import { domPromise, indexGetAll, transactionComplete } from './idb';
import * as path from './path';

/**
 * @param {String} key path to create vertex.
 * @return {Array.<Object>} vertices created in this method.
 */
export async function findOrCreateVertex(key) {
  let subpaths = path.subpaths(key);

  let vertices = [];
  let vertex, parentKey;
  for (let i = 0; i < subpaths.length; i++) {
    let subpath = subpaths[i];
    vertex = await findVertex(subpath);
    if (!vertex || !vertex.key) {
      // vertex needs to be created
      vertex = await createVertex(subpath);
      vertices.push(vertex);
    }

    parentKey = vertex.key;
  }

  return vertices;
}

export async function findVertex(key) {
  let trans = db.transaction('vertex', 'readonly');
  let store = trans.objectStore('vertex');
  let vertex = await domPromise(store.get(key));
  await transactionComplete(trans);
  return vertex;
}

export async function createVertex(key, value) {
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
export async function getValue(key) {
  let result = {};
  let children = await getChildren(key);
  result[path.leaf(key)] = await getChildrenValue(children);
  return result;
}

export async function getChildrenValue(children) {
  switch (children.length) {
    case 0:
      return null;
    case 1:
      let child = children[0];
      let grandchildren = await getChildren(child.key);

      if (!grandchildren.length) {
        let vertex = await findVertex(child.key);
        return vertex.value || path.leaf(child.key);
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

export async function getChildren(key) {
  let trans = db.transaction('vertex', 'readonly');
  let store = trans.objectStore('vertex');
  let index = store.index('parentKey');
  let children = await indexGetAll(index, { range: IDBKeyRange.only(key) });
  await transactionComplete(trans);
  return children;
}
