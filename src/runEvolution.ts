import _ from 'lodash'
import generateChildren from './childrenGeneration'
import {ChildrenPickerConfig} from './childrenSelection'
import {Individual, individualsToPopulation, Population} from './common'
import {avgDistance} from './distance'
import pickParents from './parentsSelection'
import {makeConvergencyTracker, reachedIterationLimit} from './termination'
import {TestFunctionSpec} from './testFunctions'

type AlgorithmConfig = {
  testFunctionSpec: TestFunctionSpec
  childrenSelectionConfig: ChildrenPickerConfig
  mutationProbability: number
}

const runEvolution = (
  startingIndividuals: readonly Individual[],
  {testFunctionSpec, childrenSelectionConfig, mutationProbability}: AlgorithmConfig,
): {finalPopulation: Population; iterations: number; didConverge: boolean} => {
  let currentPopulation = individualsToPopulation(startingIndividuals, testFunctionSpec.fun)

  let standardDeviation = BASE_STANDARD_DEVIATION

  const convergency = makeConvergencyTracker({initialPopulation: currentPopulation})
  const healthLimits = makeHealthLimitsTracker()
  const dimensions = startingIndividuals[0].length

  let iterations = 0
  for (
    ;
    !(reachedIterationLimit({iterations, dimensions}) || convergency.didConverge());
    ++iterations
  ) {
    const shouldPrint = iterations % PRINT_GAP === 0
    if (shouldPrint) {
      console.log('\nIteration', iterations)
      console.timeEnd(`${PRINT_GAP} iterations time`)
      console.time(`${PRINT_GAP} iterations time`)
    }

    if (childrenSelectionConfig.needsMinMaxHealth) {
      healthLimits.processPopulation(currentPopulation)

      if (shouldPrint) {
        console.log(
          'Min history health',
          healthLimits.minHealth,
          '- Max history health',
          healthLimits.maxHealth,
        )
      }
    }

    if (iterations % STANDARD_DEVIATION_GAP === 0) {
      standardDeviation = BASE_STANDARD_DEVIATION * avgDistance(currentPopulation)

      if (shouldPrint) console.log('Standard deviation', standardDeviation)
    }

    const parents = pickParents(currentPopulation, startingIndividuals.length)

    const children = generateChildren({
      parents,
      mutationProbability,
      standardDeviation,
      testFunctionSpec,
    })

    currentPopulation = childrenSelectionConfig.fun(
      [...parents, ...children],
      startingIndividuals.length,
      healthLimits.minHealth,
      healthLimits.maxHealth,
    )

    convergency.processPopulation(currentPopulation)
  }

  console.log('\nStopped at iteration', iterations)

  return {finalPopulation: currentPopulation, iterations, didConverge: convergency.didConverge()}
}

export const makeHealthLimitsTracker = (): {
  processPopulation: (population: Population) => void
  minHealth: number
  maxHealth: number
} => {
  let minHealth = 0
  let maxHealth = 0

  return {
    processPopulation: population => {
      minHealth = Math.min(minHealth, _.minBy(population, 'health')!.health)
      maxHealth = Math.max(maxHealth, _.maxBy(population, 'health')!.health)
    },
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

const PRINT_GAP = 3000

export default runEvolution
