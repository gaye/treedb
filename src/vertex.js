import * as path from './path';
import * as primitive from './primitive';
import * as tree from './tree';
import Query from './query';

/**
 * Events:
 *
 *   'value'
 *   'child_added'
 *   'child_removed'
 *   'child_changed'
 */
export default class Vertex extends Query {
  constructor(key) {
    super();

    this._key = key;
    this._onNewListener = this._onNewListener.bind(this);
    this.on('newListener', this._onNewListener);
  }

  async child(relpath) {
    let childpath = `${this._key}/${relpath}`;
    let vertices = await tree.findOrCreateVertex(childpath);
    let child = vertices.find(vertex => path.isChild(vertex.key, this._key));
    if (child) {
      // A direct child was created
      this.emit('child_added', new Vertex(child.key));
    } else {
      // A descendant was created but not a direct child.
      let childKey = `${this._key}/${path.root(relpath)}`;
      let value = await tree.getValue(childKey);
      this.emit('child_changed', value);
    }

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
    return new Vertex(rootpath);
  }

  key() {
    return this._key;
  }

  async set(value) {
    if (primitive.isPrimitive(value)) {
      let childKey = `${this._key}/${primitive.stringify(value)}`;
      await tree.createVertex(childKey, value);
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
    let newValue = await tree.getValue(this._key);
    this.emit('value', newValue);
  }

  async update(value) {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  async remove() {
    this.set(null);
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
