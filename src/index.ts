import _ from 'lodash'
import generateChildren from './childrenGeneration'
import pickChildren from './childrenSelection'
import {Individual, Population} from './common'
import determinePeaks from './determinePeaks'
import pickParents from './parentsSelection'
import generateStartingPopulation from './startingPopulation'
import shouldStop from './termination'
import * as testFunctions from './testFunctions'

const run = (
  dimensions: number,
): {function: keyof typeof testFunctions; results: Individual[]}[][] => {
  const populationSize = getPopulationSize(dimensions)

  return _.times(10, () => {
    const startingPopulation = generateStartingPopulation({size: populationSize, dimensions})

    return _.map(testFunctions, (fun, name) => ({
      function: name as keyof typeof testFunctions,
      results: testAlgorithm(startingPopulation, fun),
    }))
  })
}

const testAlgorithm = (
  startingPopulation: Population,
  fun: testFunctions.TestFunction,
): Individual[] => {
  let currentPopulation = startingPopulation

  while (!shouldStop({iterations: 0, populationSize: startingPopulation.length})) {
    const parents = pickParents(currentPopulation)
    const children = generateChildren(parents)
    currentPopulation = pickChildren(children)
  }

  return determinePeaks(currentPopulation)
}

const getPopulationSize = (dimensions: number): number => (dimensions <= 3 ? 500 : 5000)

export default run
