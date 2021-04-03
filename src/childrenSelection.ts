import {Population} from './common'

export type ChildrenPicker = (population: Population, size: number) => Population

export const CROWD_TOUR: ChildrenPicker = population => {
  // TODO
  return population
}

export const ELITE: ChildrenPicker = population => {
  // TODO
  return population
}

export const ALL: ChildrenPicker = population => population

export const RAND: ChildrenPicker = population => {
  // TODO
  return population
}

export const FUDS: ChildrenPicker = population => {
  // TODO
  return population
}

export const MOD_FUDS: ChildrenPicker = population => {
  // TODO
  return population
}
