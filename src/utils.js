
export function rotateArray(arr, startIndex) {
  if (!Array.isArray(arr) || arr.length === 0) return [];

  const index = ((startIndex % arr.length) + arr.length) % arr.length;
  return [...arr.slice(index), ...arr.slice(0, index)];
}

export function getCyclicElement(arr, index) {
  // Проверка на пустой массив
  if (!arr || arr.length === 0) {
    return undefined;
  }

  // Вычисление циклического индекса
  const cyclicIndex = index % arr.length;

  // Для отрицательных индексов
  const normalizedIndex = cyclicIndex >= 0 ? cyclicIndex : arr.length + cyclicIndex;

  return arr[normalizedIndex];
}
