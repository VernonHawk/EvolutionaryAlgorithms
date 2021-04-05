import {makePeak, Population, Peak} from './common'
import {distance} from './distance'

const determineSeeds = (population: Population): Peak[] => {
  const sortedPopulation = population.slice().sort((a, b) => b.health - a.health)
  const seeds: Peak[] = []

  sortedPopulation.forEach(popEntry => {
    if (seeds.every(seed => distance(seed.individual, popEntry.individual) > EPSILON)) {
      seeds.push(makePeak(popEntry))
    }
  })

  return seeds
}

const EPSILON = 0.03

export default determineSeeds
