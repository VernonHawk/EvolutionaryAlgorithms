import _ from 'lodash'
import {Population} from './common'

export type ChildrenPicker = (population: Population, size: number) => Population

export const CROWD_TOUR: ChildrenPicker = (population, size) => {
  // TODO
  return _.take(population, size)
}

export const ELITE: ChildrenPicker = (population, size) => {
  // TODO
  return _.take(population, size)
}

export const ALL: ChildrenPicker = population => population

export const RAND: ChildrenPicker = (population, size) => {
  // TODO
  return _.take(population, size)
}

export const FUDS: ChildrenPicker = (population, size) => {
  // TODO
  return _.take(population, size)
}

export const MOD_FUDS: ChildrenPicker = (population, size) => {
  // TODO
  return _.take(population, size)
}
