import _ from 'lodash'
import {Gene, Individual, makeGene} from './common'

export type TestFunction = (individual: Individual) => number
export type TestFunctionSpec = {
  name: string
  fun: TestFunction
  argClamp: ArgClamp
  peaks: FuncPeak[]
}

export type FuncPeak = {x: number; locality: 'global' | 'local'}

type ArgClamp = (arg: Gene) => Gene
const zeroToOneClamp: ArgClamp = arg => makeGene(_.clamp(arg, 0, 1))

export const deba1: TestFunctionSpec = {
  name: 'deba1',
  fun: individual =>
    individual.reduce((acc, curr) => acc + Math.pow(Math.sin(5 * Math.PI * curr), 6), 0) /
    individual.length,
  argClamp: zeroToOneClamp,
  peaks: [
    {x: 0.1, locality: 'global'},
    {x: 0.3, locality: 'global'},
    {x: 0.5, locality: 'global'},
    {x: 0.7, locality: 'global'},
    {x: 0.9, locality: 'global'},
  ],
}

export const deba2: TestFunctionSpec = {
  name: 'deba2',
  fun: individual =>
    individual.reduce(
      (acc, curr) =>
        acc +
        Math.pow(Math.E, -2 * Math.log(2) * Math.pow((curr - 0.1) / 0.8, 2)) *
          Math.pow(Math.sin(5 * Math.PI * curr), 6),
      0,
    ) / individual.length,
  argClamp: zeroToOneClamp,
  peaks: [
    {x: 0.1, locality: 'global'},
    {x: 0.3, locality: 'local'},
    {x: 0.5, locality: 'local'},
    {x: 0.7, locality: 'local'},
    {x: 0.9, locality: 'local'},
  ],
}

export const deba3: TestFunctionSpec = {
  name: 'deba3',
  fun: individual =>
    individual.reduce(
      (acc, curr) => acc + Math.pow(Math.sin(5 * Math.PI * (Math.pow(curr, 0.75) - 0.05)), 6),
      0,
    ) / individual.length,
  argClamp: zeroToOneClamp,
  peaks: [
    {x: 0.08, locality: 'global'},
    {x: 0.247, locality: 'global'},
    {x: 0.451, locality: 'global'},
    {x: 0.681, locality: 'global'},
    {x: 0.934, locality: 'global'},
  ],
}

export const deba4: TestFunctionSpec = {
  name: 'deba4',
  fun: individual =>
    individual.reduce(
      (acc, curr) =>
        acc +
        Math.pow(Math.E, -2 * Math.log(2) * Math.pow((curr - 0.08) / 0.854, 2)) *
          Math.pow(Math.sin(5 * Math.PI * (Math.pow(curr, 0.75) - 0.05)), 6),
      0,
    ) / individual.length,
  argClamp: zeroToOneClamp,
  peaks: [
    {x: 0.08, locality: 'global'},
    {x: 0.247, locality: 'local'},
    {x: 0.451, locality: 'local'},
    {x: 0.681, locality: 'local'},
    {x: 0.934, locality: 'local'},
  ],
}
