import _ from 'lodash'
import random from 'random'
import {Population, PopulationEntry, sort, SortedArray} from './common'

const FUSS = (
  population: Population,
  size: number,
  {minHealth, maxHealth}: {minHealth: number; maxHealth: number},
): Population => {
  const sorted = sort(population, (a, b) => a.health - b.health)

  const randomGenerator = random.uniform(minHealth, maxHealth)

  return _.times(size, randomGenerator).map(closest(sorted))
}

const closest = (arr: SortedArray<PopulationEntry>) => (target: number): PopulationEntry => {
  let low = 0
  let high = arr.length - 1

  while (high - low > 1) {
    const mid = Math.floor(low + (high - low) / 2)

    if (arr[mid].health < target) {
      low = mid
    } else {
      high = mid
    }
  }

  return target - arr[low].health <= arr[high].health - target ? arr[low] : arr[high]
}

const pickParents = FUSS

export default pickParents
