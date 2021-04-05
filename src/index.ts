import _ from 'lodash'
import {Individual, makeIndividual} from './common'
import runEvolution from './runEvolution'
import * as testFunctionsSpecs from './testFunctions'
import * as childrenSelectionFuncs from './childrenSelection'
import {withTime, withTimeF} from './common'
import determineSeeds from './determineSeeds'
import getStats, {Stats} from './stats'

const run = (
  dimensions: number,
): {
  fitnessFun: keyof typeof testFunctionsSpecs
  childrenSelectionFun: keyof typeof childrenSelectionFuncs
  mutationProbability: number
  runs: ({iterations: number} & Stats)[]
}[] => {
  const populationSize = getPopulationSize(dimensions)

  console.log('Population size', populationSize, 'dimensions', dimensions)

  const startingIndividuals = _.times(10, () =>
    generateStartingIndividuals({size: populationSize, dimensions}),
  )

  return withTime('Test', () =>
    _.flatMap(
      testFunctionsSpecs,
      withTimeF('Test function', testFunctionSpec => {
        console.log('\n----------------------------')
        return runTestFunction(startingIndividuals, testFunctionSpec)
      }),
    ),
  )
}

const runTestFunction = (
  startingIndividuals: Individual[][],
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

          return {
            fitnessFun: testFunctionSpec.name as keyof typeof testFunctionsSpecs,
            childrenSelectionFun: childrenSelectionConfig.name as keyof typeof childrenSelectionFuncs,
            mutationProbability,
            runs: startingIndividuals.map((ind, idx) => {
              console.log('\n---------------')
              console.log('Test', idx + 1)
              const res = runEvolution(ind, {
                testFunctionSpec,
                childrenSelectionConfig,
                mutationProbability,
              })

              const seeds = determineSeeds(res.finalPopulation)
              console.log('Seeds', seeds)

              return {iterations: res.iterations, ...getStats({seeds, testFunctionSpec})}
            }),
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
