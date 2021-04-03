import _ from 'lodash'
import {Population, PopulationEntry, sort, SortedArray} from './common'

const FUSS = (population: Population, size: number): Population => {
  const sorted = sort(population, (a, b) => a.health - b.health)

  const uniformRandomHealth = _.times(size, () =>
    _.random(_.first(sorted)!.health, _.last(sorted)!.health),
  )

  return uniformRandomHealth.map(closest(sorted))
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
