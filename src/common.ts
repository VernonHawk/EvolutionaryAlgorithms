import _ from 'lodash'
import {Brand, make} from 'ts-brand'
import {TestFunction} from './testFunctions'

export const TEST_RUNS = 5

export type Health = Brand<number, 'Health'>
export const makeHealth = make<Health>()

export type Gene = Brand<number, 'Gene'>
export const makeGene = make<Gene>()

export type Individual = Gene[]
export const makeIndividual = make<Individual>()

export type Population = PopulationEntry[]
export type PopulationEntry = {individual: Individual; health: Health}

export type Peak = Brand<PopulationEntry, 'Peak'>
export const makePeak = make<Peak>()

export const individualsToPopulation = (
  individuals: readonly Individual[],
  fun: TestFunction,
): Population => individuals.map(individualToPopulationEntry(fun))

export const individualToPopulationEntry = (fun: TestFunction) => (
  individual: Individual,
): PopulationEntry => ({individual, health: makeHealth(fun(individual))})

export type SortedArray<T> = Brand<T[], 'SortedArray'>

export const sort = <T>(arr: readonly T[], fn: (a: T, b: T) => number): SortedArray<T> =>
  make<SortedArray<T>>()(arr.slice().sort(fn))

export const withTime = <ResT>(name: string, fn: () => ResT): ResT => withTimeF(name, fn)()

export const withTimeF = <ResT, ArgsT extends unknown[]>(
  name: string,
  fn: (...args: ArgsT) => ResT,
) => (...args: ArgsT): ResT => {
  console.time(name + ' time')

  const res = fn(...args)

  console.log()
  console.timeEnd(name + ' time')

  return res
}

export const binarySearch = <T>(array: readonly T[], pred: (el: T) => boolean): number => {
  let lo = -1
  let hi = array.length

  while (1 + lo < hi) {
    const mi = lo + ((hi - lo) >> 1)

    if (pred(array[mi])) {
      hi = mi
    } else {
      lo = mi
    }
  }

  return hi
}

export const lowerBound = <T>(
  array: readonly T[],
  item: number,
  picker: (e: T) => number = _.identity,
): number => binarySearch<T>(array, j => item <= picker(j))

export const mutableSwapRemove = <T>(array: T[], idx: number): void => {
  array[idx] = _.last(array)!
  array.pop()
}
