export function findInDoubleQuotes(string) {
  //Regexp to find only substr which is within quotes
  return string ? string.match(/"([^"]+)"/)[1] : string;
}

export function removeDuplicateObj(array, prop) {
  return array.filter((obj, pos, arr) =>
    arr.map(mapObj => mapObj[prop]).indexOf(obj[prop])
  );
}
