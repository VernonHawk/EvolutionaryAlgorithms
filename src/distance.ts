import {Individual, Population} from './common'

export const avgDistance = (population: Population): number => {
  const N = population.length

  let distances = 0

  for (let i = 0; i < N - 1; ++i) {
    for (let j = i + 1; j < N; ++j) {
      distances += distance(population[i].individual, population[j].individual)
    }
  }

  const distancesAmount = (N * (N - 1)) / 2

  return distancesAmount === 0 ? 0 : distances / distancesAmount
}

export const distance = (a: Individual, b: Individual): number =>
  Math.sqrt(
    a.reduce((acc, _curr, idx) => {
      const diff = a[idx] - b[idx]

      return acc + diff * diff
    }, 0),
  )
