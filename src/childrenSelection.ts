import _ from 'lodash'
import {Population} from './common'

export type ChildrenPickerConfig =
  | {
      name: string
      fun: (population: Population, size: number) => Population
      needsMinMaxHealth: false
    }
  | {
      name: string
      fun: (population: Population, size: number, minHealth: number, maxHealth: number) => Population
      needsMinMaxHealth: true
    }

export const CROWD_TOUR: ChildrenPickerConfig = {
  name: 'CROWD_TOUR',
  fun: (population, size) =>
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
  needsMinMaxHealth: false,
}

export const ELITE: ChildrenPickerConfig = {
  name: 'ELITE',
  fun: (population, size) =>
    _.take(
      population.slice().sort((a, b) => b.health - a.health),
      size,
    ),
  needsMinMaxHealth: false,
}

export const ALL: ChildrenPickerConfig = {
  name: 'ALL',
  fun: population => population,
  needsMinMaxHealth: false,
}

export const RAND: ChildrenPickerConfig = {
  name: 'RAND',
  fun: (population, size) => _.sampleSize(population, size),
  needsMinMaxHealth: false,
}

export const FUDS: ChildrenPickerConfig = {
  name: 'FUDS',
  fun: (population, size, minHealth, maxHealth) => {
    // TODO
    return _.take(population, size)
  },
  needsMinMaxHealth: true,
}

export const MOD_FUDS: ChildrenPickerConfig = {
  name: 'MOD_FUDS',
  fun: (population, size, minHealth, maxHealth) => {
    // TODO
    return _.take(population, size)
  },
  needsMinMaxHealth: true,
}
