import _ from 'lodash'
import {Population} from './common'

export type ChildrenPicker = (population: Population, size: number) => Population

export const CROWD_TOUR: ChildrenPicker = (population, size) =>
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
  )

export const ELITE: ChildrenPicker = (population, size) =>
  _.take(
    population.slice().sort((a, b) => b.health - a.health),
    size,
  )

export const ALL: ChildrenPicker = population => population

export const RAND: ChildrenPicker = (population, size) => _.sampleSize(population, size)

export const FUDS: ChildrenPicker = (population, size) => {
  // TODO
  return _.take(population, size)
}

export const MOD_FUDS: ChildrenPicker = (population, size) => {
  // TODO
  return _.take(population, size)
}
