import _ from 'lodash'
import {Individual, makeIndividual} from './common'
import runEvolution, {AlgorithmConfig} from './runEvolution'
import {specs, TestFunctionSpec} from './testFunctions'
import * as childrenSelectionFuncs from './childrenSelection'
import {withTime, withTimeF} from './common'
import determineSeeds from './determineSeeds'
import getStats, {Stats} from './stats'
import * as visualization from './visualization'
import {CHILDREN_TO_GENERATE} from './childrenGeneration'

type Res = {
  fitnessFun: keyof typeof specs
  childrenSelectionFun: keyof typeof childrenSelectionFuncs
  mutationProbability: number
  runs: Run[]
}

type Run = {iterations: number; NFE: number} & Stats

const TEST_RUNS = 3

const run = (dimensions: number): Res[] => {
  const populationSize = getPopulationSize(dimensions)

  console.log('Population size', populationSize, 'dimensions', dimensions)

  const startingIndividuals = _.times(TEST_RUNS, () =>
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
  startingIndividuals: Individual[],
  idx: number,
): Run => {
  const runNum = idx + 1
  const config = {...runConfig, runNum}

  console.log('\n---------------')
  console.log('Test', runNum)
  const evolutionRes = runEvolution(startingIndividuals, config)

  const seeds = determineSeeds(evolutionRes.finalPopulation)
  console.log('Seeds', seeds)

  const stats = getStats({seeds, testFunctionSpec: runConfig.testFunctionSpec})

  const processedPeaks = visualization.processPeaks(stats)
  visualization.writeSvg({
    ...config,
    iteration: evolutionRes.iterations,
    population: evolutionRes.finalPopulation,
    peaks: processedPeaks,
  })

  visualization.writeSvg({
    ...config,
    iteration: 'final',
    population: [],
    peaks: processedPeaks,
  })

  return {
    iterations: evolutionRes.iterations,
    NFE: evolutionRes.iterations * startingIndividuals.length * CHILDREN_TO_GENERATE,
    ...stats,
  }
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
