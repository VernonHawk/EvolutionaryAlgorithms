import {Individual} from './common'

export type TestFunction = (individual: Individual) => number

export const deba1: TestFunction = individual =>
  individual.reduce((acc, curr) => acc + Math.pow(Math.sin(5 * Math.PI * curr), 6), 0) /
  individual.length

export const deba2: TestFunction = individual =>
  individual.reduce(
    (acc, curr) =>
      acc +
      Math.pow(Math.E, -2 * Math.log(2) * Math.pow((curr - 0.1) / 0.8, 2)) *
        Math.pow(Math.sin(5 * Math.PI * curr), 6),
    0,
  ) / individual.length

export const deba3: TestFunction = individual =>
  individual.reduce(
    (acc, curr) => acc + Math.pow(Math.sin(5 * Math.PI * (Math.pow(curr, 0.75) - 0.05)), 6),
    0,
  ) / individual.length

export const deba4: TestFunction = individual =>
  individual.reduce(
    (acc, curr) =>
      acc +
      Math.pow(Math.E, -2 * Math.log(2) * Math.pow((curr - 0.08) / 0.854, 2)) *
        Math.pow(Math.sin(5 * Math.PI * (Math.pow(curr, 0.75) - 0.05)), 6),
    0,
  ) / individual.length
