import { domPromise } from './polyfill';

export let db;

export async function open(name, version=1) {
  let req = indexedDB.open(name, version);

  req.onupgradeneeded = event => {
    let oldVersion = event.oldVersion;
    db = req.result;

    if (oldVersion < 1) {
      // Create initial backing idb database.
      let store = db.createObjectStore('vertex', { keyPath: 'key' });
      store.createIndex('parentKey', 'parentKey', { unique: false });
      // Inject root node.
      store.add({ key: name, parentKey: null });
    }
  };

  db = await domPromise(req);
  return db;
}

export function close() {
  db.close();
}
