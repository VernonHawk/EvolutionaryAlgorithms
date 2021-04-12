import {TestFunctionSpec} from '../common'
import {sum} from '../helpers'

export const F15_deba1: TestFunctionSpec = {
  name: 'F15_deba1',
  fun: individual =>
    sum(individual, x => Math.pow(Math.sin(5 * Math.PI * x), 6)) / individual.length,
  argRange: {min: 0, max: 1},
  peaks: [
    {x: 0.1, locality: 'global'},
    {x: 0.3, locality: 'global'},
    {x: 0.5, locality: 'global'},
    {x: 0.7, locality: 'global'},
    {x: 0.9, locality: 'global'},
  ],
  wide: false,
  dimensions: 'ALL',
}

export const F16_deba2: TestFunctionSpec = {
  name: 'F16_deba2',
  fun: individual =>
    sum(
      individual,
      x =>
        Math.pow(Math.E, -2 * Math.log(2) * Math.pow((x - 0.1) / 0.8, 2)) *
        Math.pow(Math.sin(5 * Math.PI * x), 6),
    ) / individual.length,
  argRange: {min: 0, max: 1},
  peaks: [
    {x: 0.1, locality: 'global'},
    {x: 0.3, locality: 'local'},
    {x: 0.5, locality: 'local'},
    {x: 0.7, locality: 'local'},
    {x: 0.9, locality: 'local'},
  ],
  wide: false,
  dimensions: 'ALL',
}

export const F18_deba3: TestFunctionSpec = {
  name: 'F18_deba3',
  fun: individual =>
    sum(individual, x => Math.pow(Math.sin(5 * Math.PI * (Math.pow(x, 0.75) - 0.05)), 6)) /
    individual.length,
  argRange: {min: 0, max: 1},
  peaks: [
    {x: 0.08, locality: 'global'},
    {x: 0.247, locality: 'global'},
    {x: 0.451, locality: 'global'},
    {x: 0.681, locality: 'global'},
    {x: 0.934, locality: 'global'},
  ],
  wide: false,
  dimensions: 'ALL',
}

export const F19_deba4: TestFunctionSpec = {
  name: 'F19_deba4',
  fun: individual =>
    sum(
      individual,
      x =>
        Math.pow(Math.E, -2 * Math.log(2) * Math.pow((x - 0.08) / 0.854, 2)) *
        Math.pow(Math.sin(5 * Math.PI * (Math.pow(x, 0.75) - 0.05)), 6),
    ) / individual.length,
  argRange: {min: 0, max: 1},
  peaks: [
    {x: 0.08, locality: 'global'},
    {x: 0.247, locality: 'local'},
    {x: 0.451, locality: 'local'},
    {x: 0.681, locality: 'local'},
    {x: 0.934, locality: 'local'},
  ],
  wide: false,
  dimensions: 'ALL',
}
