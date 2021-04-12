import _ from 'lodash'
import {Population} from './common'

export const makeConvergencyTracker = ({
  initialPopulation,
  notChangingLimit = 10,
  tolerance = 0.0001,
}: {
  initialPopulation?: Population
  notChangingLimit?: number
  tolerance?: number
}): {
  processPopulation: (population: Population) => void
  didConverge: () => boolean
  getState: () => {avgHealth: number; avgHealthNotChangingIterations: number}
} => {
  let avgHealth = initialPopulation ? _.meanBy(initialPopulation, 'health') : 0
  let avgHealthNotChangingIterations = 0

  return {
    processPopulation: population => {
      const newAvgHealth = _.meanBy(population, 'health')

      if (Math.abs(avgHealth - newAvgHealth) <= tolerance) {
        ++avgHealthNotChangingIterations
      } else {
        avgHealthNotChangingIterations = 0
      }

      avgHealth = newAvgHealth
    },
    didConverge: () => avgHealthNotChangingIterations === notChangingLimit,
    getState: () => ({avgHealth, avgHealthNotChangingIterations}),
  }
}

type ReachedIterationLimitAttrs = {
  dimensions: number
  iteration: number
  runNum: number
}

export const reachedIterationLimit = ({
  dimensions,
  iteration,
  runNum,
}: ReachedIterationLimitAttrs): boolean =>
  iteration >=
  (dimensions > 3 ? (runNum === 1 ? 400_000 : 100_000) : runNum === 1 ? 40_000 : 10_000)
