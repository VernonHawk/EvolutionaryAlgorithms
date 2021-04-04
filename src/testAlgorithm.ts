import _ from 'lodash'
import generateChildren from './childrenGeneration'
import {ChildrenPickerConfig} from './childrenSelection'
import {Individual, individualsToPopulation} from './common'
import determinePeaks from './determinePeaks'
import {avgDistance} from './distance'
import pickParents from './parentsSelection'
import shouldStop from './termination'
import {TestFunctionSpec} from './testFunctions'

type AlgorithmConfig = {
  testFunctionSpec: TestFunctionSpec
  childrenSelectionConfig: ChildrenPickerConfig
  mutationProbability: number
}

const testAlgorithm = (
  startingIndividuals: readonly Individual[],
  {testFunctionSpec, childrenSelectionConfig, mutationProbability}: AlgorithmConfig,
): Individual[] => {
  let currentPopulation = individualsToPopulation(startingIndividuals, testFunctionSpec.fun)

  let standardDeviation = BASE_STANDARD_DEVIATION

  let minHealth = 0
  let maxHealth = 0
  for (let i = 0; !shouldStop({iterations: i, dimensions: startingIndividuals[0].length}); ++i) {
    const shouldPrint = i % 1000 === 0
    if (shouldPrint) {
      console.log('\nIteration', i)
      console.timeEnd(`${1000} iterations time`)
      console.time(`${1000} iterations time`)
    }

    if (childrenSelectionConfig.needsMinMaxHealth) {
      minHealth = Math.min(minHealth, _.minBy(currentPopulation, 'health')!.health)
      maxHealth = Math.max(maxHealth, _.maxBy(currentPopulation, 'health')!.health)

      if (shouldPrint) {
        console.log('Min history health', minHealth, '- Max history health', maxHealth)
      }
    }

    if (i % STANDARD_DEVIATION_GAP === 0) {
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
      minHealth,
      maxHealth,
    )

    if (shouldPrint) console.log('New population size', currentPopulation.length)
  }

  return determinePeaks(currentPopulation)
}

// sigma
const BASE_STANDARD_DEVIATION = 0.0625

const STANDARD_DEVIATION_GAP = 60

export default testAlgorithm
