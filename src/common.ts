import {Brand, make} from 'ts-brand'
import calculateHealth from './health'

export type Health = Brand<number, 'Health'>
export const makeHealth = make<Health>()

export type Individual = Brand<number[], 'Individual'>
export const makeIndividual = make<Individual>()

export type Population = {individual: Individual; health: Health}[]

export const individualsToPopulation = (individuals: Individual[]): Population =>
  individuals.map(individual => ({individual, health: calculateHealth(individual)}))
