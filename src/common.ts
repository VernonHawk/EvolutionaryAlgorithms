import {Brand, make} from 'ts-brand'
import {TestFunction} from './testFunctions'

export type Health = Brand<number, 'Health'>
export const makeHealth = make<Health>()

export type Individual = Brand<number[], 'Individual'>
export const makeIndividual = make<Individual>()

export type Population = PopulationEntry[]
export type PopulationEntry = {individual: Individual; health: Health}

export const individualsToPopulation = (individuals: Individual[], fun: TestFunction): Population =>
  individuals.map(individual => ({individual, health: makeHealth(fun(individual))}))

export type SortedArray<T> = Brand<T[], 'SortedArray'>

export const sort = <T>(arr: T[], fn: (a: T, b: T) => number): SortedArray<T> =>
  make<SortedArray<T>>()(arr.slice().sort(fn))
