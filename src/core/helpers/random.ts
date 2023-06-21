const DEFAULT_PRECISION = 0;
const MIN_RANDOM_VALUE = 0;
const FIRST_ARRAY_ELEMENT = 0;
const DELETE_VALUE = 1;

export function generateRandomValue(min: number, max: number, precision = DEFAULT_PRECISION) {
  return +(Math.random() * (max - min) + min).toFixed(precision);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(MIN_RANDOM_VALUE, items.length - 1)];
}

export function getFixedNumberRandomItems<T>(fixedNumber: number, items: T[]): T[] {
  if (fixedNumber >= items.length) {
    return items;
  }

  const array = items.slice();
  const resultList: T[] = [];

  if (fixedNumber === 0) {
    return resultList;
  }

  const index = generateRandomValue(MIN_RANDOM_VALUE, array.length - 1);
  const item = array.splice(index, DELETE_VALUE)[FIRST_ARRAY_ELEMENT];
  resultList.push(item);

  return getFixedNumberRandomItems(fixedNumber--, array);
}
