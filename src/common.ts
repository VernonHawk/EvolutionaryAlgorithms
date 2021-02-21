import calculateHealth from './health'

export type Health = number & {__TAG__: 'Health'}
export type Individual = number & {__TAG__: 'Individual'}
export type Population = {individual: Individual; health: Health}[]

export const individualsToPopulation = (individuals: Individual[]): Population =>
  individuals.map(individual => ({individual, health: calculateHealth(individual)}))
