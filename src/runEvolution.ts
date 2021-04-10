import _ from 'lodash'
import generateChildren from './childrenGeneration'
import {ChildrenPickerConfig} from './childrenSelection'
import {Individual, individualsToPopulation, Population} from './common'
import {avgDistance} from './distance'
import {writeSvg} from './visualization'
import pickParents from './parentsSelection'
import {makeConvergencyTracker, reachedIterationLimit} from './termination'
import {TestFunctionSpec} from './testFunctions'

export type AlgorithmConfig = {
  testFunctionSpec: TestFunctionSpec
  childrenSelectionConfig: ChildrenPickerConfig
  mutationProbability: number
  runNum: number
}

const runEvolution = (
  startingIndividuals: readonly Individual[],
  config: AlgorithmConfig,
): {finalPopulation: Population; iterations: number; didConverge: boolean} => {
  const {testFunctionSpec, childrenSelectionConfig, mutationProbability} = config

  let currentPopulation = individualsToPopulation(startingIndividuals, testFunctionSpec.fun)

  let standardDeviation = BASE_STANDARD_DEVIATION

  const convergency = makeConvergencyTracker({initialPopulation: currentPopulation})
  const healthLimits = makeHealthLimitsTracker(currentPopulation)

  const dimensions = startingIndividuals[0].length

  let iteration = 0
  for (
    ;
    !(reachedIterationLimit({iteration, dimensions}) || convergency.didConverge());
    ++iteration
  ) {
    if (iteration % 2 === 0) {
      writeSvg({...config, iteration: iteration, population: currentPopulation})
    }

    const shouldPrint = iteration % PRINT_GAP === 0
    if (shouldPrint) {
      console.log('\nIteration', iteration)
      console.timeEnd(`${PRINT_GAP} iterations time`)
      console.time(`${PRINT_GAP} iterations time`)
    }

    if (shouldPrint) {
      console.log(
        'Min history health',
        healthLimits.minHealth,
        '- Max history health',
        healthLimits.maxHealth,
      )
    }

    if (iteration % STANDARD_DEVIATION_GAP === 0) {
      standardDeviation = BASE_STANDARD_DEVIATION * avgDistance(currentPopulation)

      if (shouldPrint) console.log('Standard deviation', standardDeviation)
    }

    const parents = pickParents(currentPopulation, startingIndividuals.length, healthLimits)

    const children = generateChildren({
      parents,
      mutationProbability,
      standardDeviation,
      testFunctionSpec,
    })
    healthLimits.processPopulation(children)

    currentPopulation = childrenSelectionConfig.fun(
      [...parents, ...children],
      startingIndividuals.length,
      healthLimits,
    )

    convergency.processPopulation(currentPopulation)
  }

  console.log('\nStopped at iteration', iteration)

  return {
    finalPopulation: currentPopulation,
    iterations: iteration,
    didConverge: convergency.didConverge(),
  }
}

export const makeHealthLimitsTracker = (
  initialPopulation?: Population,
): {
  processPopulation: (population: Population) => void
  minHealth: number
  maxHealth: number
} => {
  let minHealth = 0
  let maxHealth = 0

  const processPopulation = (population: Population) => {
    minHealth = Math.min(minHealth, _.minBy(population, 'health')!.health)
    maxHealth = Math.max(maxHealth, _.maxBy(population, 'health')!.health)
  }

  if (initialPopulation) {
    processPopulation(initialPopulation)
  }

  return {
    processPopulation,
    get minHealth() {
      return minHealth
    },
    get maxHealth() {
      return maxHealth
    },
  }
}

// sigma
const BASE_STANDARD_DEVIATION = 0.0625

const STANDARD_DEVIATION_GAP = 60

const PRINT_GAP = 1000

export default runEvolution
