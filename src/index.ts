import _ from 'lodash'
import {Individual} from './common'
import generateStartingIndividuals from './startingPopulation'
import testAlgorithm from './testAlgorithm'
import * as testFunctionsSpecs from './testFunctions'
import * as childrenSelectionFuncs from './childrenSelection'
import {withTime, withTimeF} from './common'

const run = (
  dimensions: number,
): {
  fitnessFun: keyof typeof testFunctionsSpecs
  childrenSelectionFun: keyof typeof childrenSelectionFuncs
  mutationProbability: number
  results: Individual[]
}[][] => {
  const populationSize = getPopulationSize(dimensions)

  console.log('Population size', populationSize, 'dimensions', dimensions)

  return _.times(10, i => {
    console.log('\n===================================')
    console.log('Test #', i + 1)

    return withTime('Test', () => {
      const startingIndividuals = generateStartingIndividuals({size: populationSize, dimensions})

      return _.flatMap(
        testFunctionsSpecs,
        withTimeF('Test function', testFunctionSpec => {
          console.log('\n----------------------------')
          return runTestFunction(startingIndividuals, testFunctionSpec)
        }),
      )
    })
  })
}

const runTestFunction = (
  startingIndividuals: Individual[],
  testFunctionSpec: testFunctionsSpecs.TestFunctionSpec,
) =>
  _.flatMap(
    childrenSelectionFuncs,
    withTimeF('Children selection function', childrenSelectionFun =>
      MUTATION_PROBABILITIES.map(
        withTimeF('Mutation probability', mutationProbability => {
          console.log(
            '\nFunc',
            testFunctionSpec.name,
            '- Children selection',
            childrenSelectionFun.name,
            '- Mutation probability',
            mutationProbability,
          )

          return {
            fitnessFun: testFunctionSpec.name as keyof typeof testFunctionsSpecs,
            childrenSelectionFun: childrenSelectionFun.name as keyof typeof childrenSelectionFuncs,
            mutationProbability,
            results: testAlgorithm(startingIndividuals, {
              testFunctionSpec,
              childrenSelectionFun,
              mutationProbability,
            }),
          }
        }),
      ),
    ),
  )

const getPopulationSize = (dimensions: number): number => (dimensions <= 3 ? 500 : 5000)

// Pm
const MUTATION_PROBABILITIES = [0.15, 0.75]

export default run
