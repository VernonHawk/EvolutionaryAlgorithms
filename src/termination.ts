import _ from 'lodash'
import {Population} from './common'

type ReachedIterationLimitAttrs = {
  dimensions: number
  iteration: number
}

export const makeConvergencyTracker = ({
  initialPopulation,
  notChangingLimit = 10,
  tolerance = 0.0001,
}: {
  initialPopulation?: Population
  notChangingLimit?: number
  tolerance?: number
}): {processPopulation: (population: Population) => void; didConverge: () => boolean} => {
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
  }
}

export const reachedIterationLimit = ({
  dimensions,
  iteration,
}: ReachedIterationLimitAttrs): boolean => iteration >= (dimensions > 3 ? 400_000 : 40_000)
