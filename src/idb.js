export function domPromise(req) {
  return new Promise((resolve, reject) => {
    req.onerror = () => reject(req.errorCode);
    req.onsuccess = () => resolve(req.result);
  });
}

/**
 * Options:
 *
 *   (IDBKeyRange) range
 */
export function indexGetAll(index, options) {
  let result = [];
  let req = index.openCursor(options.range);

  return new Promise((accept, reject) => {
    req.onerror = reject;

    req.onsuccess = event => {
      let cursor = event.target.result;
      if (!cursor) return accept(result);
      result.push(cursor.value);
      cursor.continue();
    };
  });
}

export function transactionComplete(trans) {
  return new Promise((resolve, reject) => {
    trans.onerror = reject;
    trans.oncomplete = resolve;
  });
}
