const digitsInNumber = (n: number): number[] => (
  n
    .toString()
    .split('')
    .map(n => parseInt(n))
    .sort((a, b) => a - b)
);

const digitsMatch = (a: number[], b: number[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((n, i) => n === b[i]);
};

const checkNumber = (n: number): boolean => {
  const nDigits = digitsInNumber(n);

  return Array(6)
    .fill(null)
    .every((_, i) => digitsMatch(nDigits, digitsInNumber(n * (i + 1))));
};

const loopFrom = (n: number): number => {
  let i = n;

  for (; !checkNumber(i); i++);

  return i;
};

const getNums = (n: number): [number, number, number, number, number, number] => (
  [n, n * 2, n * 3, n * 4, n * 5, n * 6]
);

console.log(getNums(loopFrom(1)));
console.log(getNums(loopFrom(142858)));
console.log(getNums(loopFrom(1428571)));
