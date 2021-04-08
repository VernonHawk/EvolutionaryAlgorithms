import _ from 'lodash'
import random from 'random'
import {lowerBound, mutableSwapRemove, Population, PopulationEntry} from './common'

export type ChildrenPickerConfig = {
  name: string
  fun: (
    population: Population,
    size: number,
    health: {minHealth: number; maxHealth: number},
  ) => Population
}

export const CROWD_TOUR: ChildrenPickerConfig = {
  name: 'CROWD_TOUR',
  fun: (population: Population, size: number) =>
    _.range(0, size).map(
      i =>
        _.maxBy(
          [
            population[i],
            population[size + i * 3],
            population[size + i * 3 + 1],
            population[size + i * 3 + 2],
          ],
          'health',
        )!,
    ),
}

export const ELITE: ChildrenPickerConfig = {
  name: 'ELITE',
  fun: (population: Population, size: number) =>
    _.take(
      population.slice().sort((a, b) => b.health - a.health),
      size,
    ),
}

export const ALL: ChildrenPickerConfig = {
  name: 'ALL',
  fun: (population: Population) => population,
}

export const RAND: ChildrenPickerConfig = {
  name: 'RAND',
  fun: (population: Population, size: number) => _.sampleSize(population, size),
}

export const FUDS: ChildrenPickerConfig = {
  name: 'FUDS',
  fun: (population, size, {minHealth, maxHealth}) => {
    const groups = groupPopulation(population, minHealth, maxHealth)

    for (let currSize = population.length; currSize > size; ) {
      const maxSize = _.last(groups)!.length

      const randomGenerator = random.uniformInt(0, maxSize - 1)

      for (
        let firstMaxSizeIdx = lowerBound(groups, maxSize, g => g.length);
        firstMaxSizeIdx < groups.length;
        ++firstMaxSizeIdx
      ) {
        mutableSwapRemove(groups[firstMaxSizeIdx], randomGenerator())

        if (--currSize <= size) {
          break
        }
      }
    }

    return groups.flat()
  },
}

export const MOD_FUDS: ChildrenPickerConfig = {
  name: 'MOD_FUDS',
  fun: (population, size, {minHealth, maxHealth}) => {
    const groups = groupPopulation(population, minHealth, maxHealth)
    groups.forEach(group => group.sort((a, b) => b.health - a.health))

    for (let currSize = population.length; currSize > size; ) {
      const maxSize = _.last(groups)!.length

      for (
        let firstMaxSizeIdx = lowerBound(groups, maxSize, g => g.length);
        firstMaxSizeIdx < groups.length;
        ++firstMaxSizeIdx
      ) {
        groups[firstMaxSizeIdx].pop()

        if (--currSize <= size) {
          break
        }
      }
    }

    return groups.flat()
  },
}

const groupPopulation = (
  population: Population,
  minHealth: number,
  maxHealth: number,
): PopulationEntry[][] => {
  const groupsAmount = Math.round(Math.sqrt(population.length))
  const epsilon = (maxHealth - minHealth) / groupsAmount

  const groups = _.groupBy(population, ({health}) =>
    _.clamp(Math.floor((health - minHealth) / epsilon), 0, groupsAmount - 1),
  )

  return Object.values(_.groupBy(groups, 'length')).flat()
}
