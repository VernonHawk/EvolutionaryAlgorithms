import _ from 'lodash'
import {RunResult} from '../..'
import {getConfigRowIdx} from '../common'
import {AlgorithmConfig} from '../../runEvolution'
import {readSheet, writeSheet} from '../common'
import {generateFunDimSheet, headerRowsAmount, runCriteria} from '../generate/funDim'

export const writeFunDim = (
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

    row.getCell(colIdx).value = typeof res === 'boolean' ? Number(res) : Number(res.toFixed(6))
  })

  writeSheet(workbook, path)
}
