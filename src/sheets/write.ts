import _ from 'lodash'
import {RunResult} from '..'
import {MUTATION_PROBABILITIES} from '../childrenGeneration'
import * as childrenSelection from '../childrenSelection'
import {AlgorithmConfig} from '../runEvolution'
import {readSheet, writeSheet} from './common'
import {generateFunDimSheet, headerRowsAmount, runCriteria} from './generate/funDim'

export const writeRunResults = (
  dimension: number,
  config: AlgorithmConfig,
  results: RunResult,
): void => {
  const path = generateFunDimSheet(config.testFunctionSpec, dimension)

  const workbook = readSheet(path)
  const worksheet = workbook.worksheets[0]

  const startColIdx = 1 + 1 + (config.runNum - 1) * runCriteria.length
  const row = worksheet.getRow(
    headerRowsAmount +
      getConfigRowIdx(config.childrenSelectionConfig.name, config.mutationProbability),
  )

  _.range(startColIdx, startColIdx + runCriteria.length).forEach(colIdx => {
    const res = results[runCriteria[colIdx - startColIdx]]

    row.getCell(colIdx).value = typeof res === 'boolean' ? Number(res) : res
  })

  writeSheet(workbook, path)

  // const parser = new Parser()

  // parser.on('callCellValue', (cellCoord, done) => {
  //   if (worksheet.getCell(cellCoord.label).formula) {
  //     done(parser.parse(worksheet.getCell(cellCoord.label).formula).result)
  //   } else {
  //     done(worksheet.getCell(cellCoord.label).value)
  //   }
  // })

  // parser.parse(worksheet.getCell('CF3').formula)
}
const childrenSelectionNames = Object.keys(childrenSelection)

const getConfigRowIdx = (
  func: childrenSelection.ChildrenPickerConfig['name'],
  mutationProb: number,
) =>
  childrenSelectionNames.findIndex(e => e === func) * MUTATION_PROBABILITIES.length +
  MUTATION_PROBABILITIES.findIndex(e => e === mutationProb) +
  1
