import _ from 'lodash'
import {Individual, makeIndividual} from './common'
import runEvolution from './runEvolution'
import {specs, TestFunctionSpec} from './testFunctions'
import * as childrenSelectionFuncs from './childrenSelection'
import {withTime, withTimeF} from './common'
import determineSeeds from './determineSeeds'
import getStats, {Stats} from './stats'
import * as visualization from './visualization'

const run = (
  dimensions: number,
): {
  fitnessFun: keyof typeof specs
  childrenSelectionFun: keyof typeof childrenSelectionFuncs
  mutationProbability: number
  runs: ({iterations: number} & Stats)[]
}[] => {
  const populationSize = getPopulationSize(dimensions)

  console.log('Population size', populationSize, 'dimensions', dimensions)

  const startingIndividuals = _.times(10, () =>
    generateStartingIndividuals({size: populationSize, dimensions}),
  )

  return withTime('Full run', () =>
    _.flatMap(
      specs,
      withTimeF('Test function', testFunctionSpec => {
        console.log('\n----------------------------')
        return runTestFunction(startingIndividuals, testFunctionSpec)
      }),
    ),
  )
}

const runTestFunction = (startingIndividuals: Individual[][], testFunctionSpec: TestFunctionSpec) =>
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
            fitnessFun: testFunctionSpec.name,
            childrenSelectionFun: childrenSelectionConfig.name as keyof typeof childrenSelectionFuncs,
            mutationProbability,
            runs: startingIndividuals.map((ind, idx) => {
              const runNum = idx + 1
              const config = {
                testFunctionSpec,
                childrenSelectionConfig,
                mutationProbability,
                runNum,
              }

              console.log('\n---------------')
              console.log('Test', runNum)
              const evolutionRes = runEvolution(ind, config)

              const seeds = determineSeeds(evolutionRes.finalPopulation)
              console.log('Seeds', seeds)

              const stats = getStats({seeds, testFunctionSpec})

              visualization.writeSvg({
                ...config,
                iteration: evolutionRes.iterations,
                population: evolutionRes.finalPopulation,
                peaks: visualization.processPeaks(stats),
              })

              return {iterations: evolutionRes.iterations, ...stats}
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
