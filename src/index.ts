import _ from 'lodash'
import {Individual, makeIndividual, TEST_RUNS} from './common'
import runEvolution, {AlgorithmConfig} from './runEvolution'
import {specs, S, TestFuncName, TestFunctionSpec} from './testFunctions'
import * as childrenSelectionFuncs from './childrenSelection'
import {withTime, withTimeF} from './common'
import determineSeeds from './determineSeeds'
import getStats, {Stats} from './stats'
import * as visualization from './visualization'
import {CHILDREN_TO_GENERATE, MUTATION_PROBABILITIES} from './childrenGeneration'
import {writeRunResults} from './sheets'

type FullResult = {
  fitnessFun: TestFuncName
  childrenSelectionFun: keyof typeof childrenSelectionFuncs
  mutationProbability: number
  runs: RunResult[]
}

export type RunResult = {Iterations: number; NFE: number; SucRun: boolean} & Stats['mainStats']

const run = (dimensions: number, funcs = Object.keys(S) as TestFuncName[]): FullResult[] =>
  withTime('Full run', () =>
    _.flatMap(
      funcs.map(f => specs[f]),
      withTimeF('Test function', testFunctionSpec => {
        console.log('\n----------------------------')

        const populationSize = getPopulationSize(dimensions, testFunctionSpec.wide)
        console.log('Population size', populationSize, 'dimensions', dimensions)

        const startingIndividuals = _.times(TEST_RUNS, () =>
          generateStartingIndividuals({
            size: populationSize,
            dimensions,
            argRange: testFunctionSpec.argRange,
          }),
        )

        return runTestFunction(startingIndividuals, testFunctionSpec)
      }),
    ),
  )

const runTestFunction = (
  startingIndividuals: Individual[][],
  testFunctionSpec: TestFunctionSpec,
): FullResult[] =>
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
              makeEvolutionRunner({
                testFunctionSpec,
                childrenSelectionConfig,
                mutationProbability,
              }),
            ),
          }
        }),
      ),
    ),
  )

type RunConfig = Omit<AlgorithmConfig, 'runNum'>

const makeEvolutionRunner = (runConfig: RunConfig) => (
  startingIndividuals: Individual[],
  idx: number,
): RunResult => {
  const runNum = idx + 1
  const config = {...runConfig, runNum}

  console.log('\n---------------')
  console.log('Test', runNum)
  const evolutionRes = runEvolution(startingIndividuals, config)

  const seeds = determineSeeds(evolutionRes.finalPopulation)
  console.log('Seeds', seeds)

  const stats = getStats({seeds, testFunctionSpec: runConfig.testFunctionSpec})

  const processedPeaks = visualization.processPeaks(stats.additionalStats)

  const dimensions = startingIndividuals[0].length
  if (dimensions === 1) {
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
  }

  const results = {
    Iterations: evolutionRes.iterations,
    NFE: evolutionRes.iterations * startingIndividuals.length * CHILDREN_TO_GENERATE,
    SucRun: evolutionRes.didConverge,
    ...stats.mainStats,
  }

  writeRunResults(dimensions, config, results)

  return results
}

const generateStartingIndividuals = ({
  size,
  dimensions,
  argRange: {min, max},
}: {
  size: number
  dimensions: number
  argRange: {min: number; max: number}
}): Individual[] =>
  _.times(size, () => makeIndividual(_.times(dimensions, () => _.random(min, max, true))))

const getPopulationSize = (dimensions: number, wide: boolean): number =>
  dimensions <= 3 ? (wide ? 1000 : 500) : wide ? 10_000 : 5_000

export default run
