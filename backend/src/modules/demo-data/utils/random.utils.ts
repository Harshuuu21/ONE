export function randomInRange(min: number, max: number, decimals: number = 0): number {
  const rand = Math.random() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(rand * factor) / factor;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice<T>(items: readonly T[]): T {
  if (!items || items.length === 0) {
    throw new Error('Cannot pick from empty array');
  }
  return items[Math.floor(Math.random() * items.length)];
}

export function weightedChoice<T>(itemsWithWeights: { item: T; weight: number }[]): T {
  const totalWeight = itemsWithWeights.reduce((acc, curr) => acc + curr.weight, 0);
  let randomVal = Math.random() * totalWeight;

  for (const entry of itemsWithWeights) {
    if (randomVal < entry.weight) {
      return entry.item;
    }
    randomVal -= entry.weight;
  }

  return itemsWithWeights[itemsWithWeights.length - 1].item;
}

export function shuffle<T>(array: readonly T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
