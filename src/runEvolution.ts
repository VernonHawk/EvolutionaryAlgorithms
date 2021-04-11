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
  const {testFunctionSpec, childrenSelectionConfig, mutationProbability, runNum} = config

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
    if (runNum === 1 && shouldTakeSnapshot(iteration)) {
      writeSvg({...config, iteration, population: currentPopulation})
    }

    const shouldPrint = iteration % PRINT_GAP === 0
    if (shouldPrint) {
      console.log('\nIteration', iteration)
      console.timeEnd(`${PRINT_GAP} iterations time`)
      console.time(`${PRINT_GAP} iterations time`)
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
      [...(childrenSelectionConfig.worksWithParents ? parents : currentPopulation), ...children],
      startingIndividuals.length,
      healthLimits,
    )

    convergency.processPopulation(currentPopulation)

    if (shouldPrint) {
      console.log('Convergency', convergency.getState())
    }
  }

  console.log('\nStopped at iteration', iteration)

  return {
    finalPopulation: currentPopulation,
    iterations: iteration,
    didConverge: convergency.didConverge(),
  }
}

const shouldTakeSnapshot = (iteration: number) => {
  if (iteration <= 300) {
    return true
  }

  if (iteration <= 600) {
    return iteration % 5 === 0
  }

  if (iteration <= 1000) {
    return iteration % 10 === 0
  }

  if (iteration <= 5000) {
    return iteration % 100 === 0
  }

  if (iteration <= 15000) {
    return iteration % 1000 === 0
  }

  if (iteration <= 30000) {
    return iteration % 5000 === 0
  }

  return false
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

const PRINT_GAP = 2500

export default runEvolution
