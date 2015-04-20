import { EventEmitter2 } from 'eventemitter2';

export default class Query extends EventEmitter2 {
  constructor() {
    super({
      maxListeners: 1000,
      newListener: true
    });
  }

  orderByChild(key) {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  orderByKey() {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  orderByValue() {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  startAt(value, key) {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  endAt(value, key) {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  equalTo(value, key) {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  limitToFirst(limit) {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  limitToLast(limit) {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  limit(limit) {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }

  ref() {
    // TODO(gaye)
    throw new Error('Not yet implemented');
  }
}
