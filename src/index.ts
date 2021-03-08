import _ from 'lodash'
import generateChildren from './childrenGeneration'
import pickChildren from './childrenSelection'
import {Individual, individualsToPopulation} from './common'
import determinePeaks from './determinePeaks'
import pickParents from './parentsSelection'
import generateStartingIndividuals from './startingPopulation'
import shouldStop from './termination'
import * as testFunctions from './testFunctions'

const run = (
  dimensions: number,
): {function: keyof typeof testFunctions; results: Individual[]}[][] => {
  const populationSize = getPopulationSize(dimensions)

  return _.times(10, () => {
    const startingIndividuals = generateStartingIndividuals({size: populationSize, dimensions})

    return _.map(testFunctions, (fun, name) => ({
      function: name as keyof typeof testFunctions,
      results: testAlgorithm(startingIndividuals, fun),
    }))
  })
}

const testAlgorithm = (
  startingIndividuals: Individual[],
  fun: testFunctions.TestFunction,
): Individual[] => {
  let currentPopulation = individualsToPopulation(startingIndividuals, fun)

  for (let i = 0; !shouldStop({iterations: i, dimensions: startingIndividuals[0].length}); ++i) {
    const parents = pickParents(currentPopulation)
    const children = generateChildren(parents)
    currentPopulation = pickChildren(children)
  }

  return determinePeaks(currentPopulation)
}

const getPopulationSize = (dimensions: number): number => (dimensions <= 3 ? 500 : 5000)

export default run
