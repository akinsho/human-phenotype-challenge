export function findInDoubleQuotes(string) {
  return string.match(/"([^"]+)"/)[1];
}

export function removeDuplicateObj(array, prop) {
  return array.filter((obj, pos, arr) =>
    arr.map(mapObj => mapObj[prop]).indexOf(obj[prop])
  );
}
