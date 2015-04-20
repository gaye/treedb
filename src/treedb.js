import * as db from './db';
import Vertex from './vertex';

export async function open(name) {
  await db.open(name);
  return new Vertex(name);
}

export function close() {
  db.close();
}

export { domPromise } from './polyfill';
export { Vertex }
