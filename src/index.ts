import _ from 'lodash'
import {Individual} from './common'
import generateStartingIndividuals from './startingPopulation'
import testAlgorithm from './testAlgorithm'
import * as testFunctionsSpecs from './testFunctions'

const run = (
  dimensions: number,
): {
  function: keyof typeof testFunctionsSpecs
  mutationProbability: number
  results: Individual[]
}[][] => {
  const populationSize = getPopulationSize(dimensions)

  return _.times(10, i => {
    console.log()
    console.log(`test #${i}`)
    const startingIndividuals = generateStartingIndividuals({size: populationSize, dimensions})

    return _.flatMap(testFunctionsSpecs, (testFunctionSpec, name) =>
      MUTATION_PROBABILITIES.map(mutationProbability => ({
        function: name as keyof typeof testFunctionsSpecs,
        mutationProbability,
        results: testAlgorithm(startingIndividuals, {testFunctionSpec, mutationProbability}),
      })),
    )
  })
}

const getPopulationSize = (dimensions: number): number => (dimensions <= 3 ? 500 : 5000)

// Pm
const MUTATION_PROBABILITIES = [0.15, 0.75]

export default run
