export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  export function randomFrom<T>(arr: readonly T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  