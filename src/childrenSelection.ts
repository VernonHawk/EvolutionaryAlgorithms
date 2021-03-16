import _ from 'lodash'
import {Population} from './common'

type ChildrenPicker = (population: Population, size: number) => Population

const pickChildren: ChildrenPicker = (population, size) => {
  // TODO
  return _.take(population, size)
}

const CROWD_TOUR: ChildrenPicker = population => {
  // TODO
  return []
}

const ELITE: ChildrenPicker = population => {
  // TODO
  return []
}

const ALL: ChildrenPicker = population => {
  // TODO
  return []
}

const RAND: ChildrenPicker = population => {
  // TODO
  return []
}

const FUDS: ChildrenPicker = population => {
  // TODO
  return []
}

const MOD_FUDS: ChildrenPicker = population => {
  // TODO
  return []
}

export default pickChildren
