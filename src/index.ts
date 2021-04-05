import _ from 'lodash'
import {Individual, makeIndividual, Population, PopulationEntry} from './common'
import runEvolution from './runEvolution'
import * as testFunctionsSpecs from './testFunctions'
import * as childrenSelectionFuncs from './childrenSelection'
import {withTime, withTimeF} from './common'
import determinePeaks from './determinePeaks'

const run = (
  dimensions: number,
): {
  fitnessFun: keyof typeof testFunctionsSpecs
  childrenSelectionFun: keyof typeof childrenSelectionFuncs
  mutationProbability: number
  population: Population
  peaks: PopulationEntry[]
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
    withTimeF('Children selection function', childrenSelectionConfig =>
      MUTATION_PROBABILITIES.map(
        withTimeF('Mutation probability', mutationProbability => {
          console.log(
            '\nFunc',
            testFunctionSpec.name,
            '- Children selection',
            childrenSelectionConfig.name,
            '- Mutation probability',
            mutationProbability,
          )

          const finalPopulation = runEvolution(startingIndividuals, {
            testFunctionSpec,
            childrenSelectionConfig,
            mutationProbability,
          })

          const peaks = determinePeaks(finalPopulation)
          console.log('Peaks', peaks)

          return {
            fitnessFun: testFunctionSpec.name as keyof typeof testFunctionsSpecs,
            childrenSelectionFun: childrenSelectionConfig.name as keyof typeof childrenSelectionFuncs,
            mutationProbability,
            population: finalPopulation,
            peaks,
          }
        }),
      ),
    ),
  )

const generateStartingIndividuals = ({
  size,
  dimensions,
}: {
  size: number
  dimensions: number
}): Individual[] =>
  _.times(size, () => makeIndividual(_.times(dimensions, () => _.random(0, 1, true))))

const getPopulationSize = (dimensions: number): number => (dimensions <= 3 ? 500 : 5000)

// Pm
const MUTATION_PROBABILITIES = [0.15, 0.75]

export default run
