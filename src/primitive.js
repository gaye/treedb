export function isPrimitive(value) {
  switch (typeof value) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return true;
    case 'object':
      return (value === null ||
              value instanceof Boolean ||
              value instanceof Number ||
              value instanceof String);
  }
}

export function stringify(value) {
  if (value == null) {
    return 'null';
  }

  return value.toString();
}
