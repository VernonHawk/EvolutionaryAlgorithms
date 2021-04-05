import {Population, PopulationEntry} from './common'
import {distance} from './distance'

const determinePeaks = (population: Population): PopulationEntry[] => {
  const sortedPopulation = population.slice().sort((a, b) => b.health - a.health)
  const seeds: PopulationEntry[] = []

  sortedPopulation.forEach(popEntry => {
    if (seeds.every(seed => distance(seed.individual, popEntry.individual) > EPSILON)) {
      seeds.push(popEntry)
    }
  })

  return seeds
}

const EPSILON = 0.03

export default determinePeaks
