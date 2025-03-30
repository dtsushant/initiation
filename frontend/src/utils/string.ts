export function stringCapitalization(
  str: string,
  scope: [number, number] = [0, 0]
) {
  if (!str) return '';

  const list = [...str];

  return list.reduce((acc, cur, i) => {
    if (i >= scope[0] && i <= scope[1]) {
      return acc + cur.toUpperCase();
    }

    return acc + cur.toLowerCase();
  }, '');
}

export function stringPluralize(num: number, word: string) {
  if (num === 1) {
    return word;
  } else {
    return `${word}s`;
  }
}
