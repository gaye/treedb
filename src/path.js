export function leaf(path) {
  let parts = path.split('/');
  return parts[parts.length - 1];
}

export function parent(path) {
  let parts = path.split('/');
  if (parts.length <= 1) return null;
  parts.pop();
  return parts.join('/');
}

export function root(path) {
  return path.split('/')[0];
}

export function subpaths(path) {
  let parts = path.split('/');
  return parts.reduce((result, part) => {
    let next;
    if (result.length) {
      let prev = result[result.length - 1];
      next = `${prev}/${part}`;
    } else {
      next = part;
    }

    result.push(next);
    return result;
  }, []);
}
