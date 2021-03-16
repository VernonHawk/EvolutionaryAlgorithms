import generateChildren from './childrenGeneration'
import pickChildren from './childrenSelection'
import {Individual, individualsToPopulation} from './common'
import determinePeaks from './determinePeaks'
import pickParents from './parentsSelection'
import shouldStop from './termination'
import {TestFunctionSpec} from './testFunctions'

type AlgorithmConfig = {
  testFunctionSpec: TestFunctionSpec
  mutationProbability: number
}

const testAlgorithm = (
  startingIndividuals: Individual[],
  {testFunctionSpec, mutationProbability}: AlgorithmConfig,
): Individual[] => {
  console.log()
  console.log(testFunctionSpec.name, 'Mutation probability', mutationProbability)

  let currentPopulation = individualsToPopulation(startingIndividuals, testFunctionSpec.fun)

  let standardDeviation = BASE_STANDARD_DEVIATION

  for (let i = 0; !shouldStop({iterations: i, dimensions: startingIndividuals[0].length}); ++i) {
    if (i % 1000 === 0) console.log('iteration', i)

    if (i % STANDARD_DEVIATION_GAP === 0) {
      standardDeviation = BASE_STANDARD_DEVIATION // TODO: Regenerate standardDeviation from avg individual distances
    }

    const parents = pickParents(currentPopulation)
    const children = generateChildren({
      parents,
      mutationProbability,
      standardDeviation,
      testFunctionSpec,
    })
    currentPopulation = pickChildren(children, startingIndividuals.length)
  }

  return determinePeaks(currentPopulation)
}

// sigma
const BASE_STANDARD_DEVIATION = 0.0625

const STANDARD_DEVIATION_GAP = 60

export default testAlgorithm
