import _ from 'lodash'
import {Individual, makeIndividual} from './common'
import runEvolution, {AlgorithmConfig} from './runEvolution'
import {specs, TestFunctionSpec} from './testFunctions'
import * as childrenSelectionFuncs from './childrenSelection'
import {withTime, withTimeF} from './common'
import determineSeeds from './determineSeeds'
import getStats, {Stats} from './stats'
import * as visualization from './visualization'

type Res = {
  fitnessFun: keyof typeof specs
  childrenSelectionFun: keyof typeof childrenSelectionFuncs
  mutationProbability: number
  runs: Run[]
}

type Run = {iterations: number} & Stats

const run = (dimensions: number): Res[] => {
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

const runTestFunction = (
  startingIndividuals: Individual[][],
  testFunctionSpec: TestFunctionSpec,
): Res[] =>
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
            runs: startingIndividuals.map(
              makeEvolutionRunner({testFunctionSpec, childrenSelectionConfig, mutationProbability}),
            ),
          }
        }),
      ),
    ),
  )

const makeEvolutionRunner = (runConfig: Omit<AlgorithmConfig, 'runNum'>) => (
  individual: Individual[],
  idx: number,
): Run => {
  const runNum = idx + 1
  const config = {...runConfig, runNum}

  console.log('\n---------------')
  console.log('Test', runNum)
  const evolutionRes = runEvolution(individual, config)

  const seeds = determineSeeds(evolutionRes.finalPopulation)
  console.log('Seeds', seeds)

  const stats = getStats({seeds, testFunctionSpec: runConfig.testFunctionSpec})

  visualization.writeSvg({
    ...config,
    iteration: evolutionRes.iterations,
    population: evolutionRes.finalPopulation,
    peaks: visualization.processPeaks(stats),
  })

  return {iterations: evolutionRes.iterations, ...stats}
}

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
