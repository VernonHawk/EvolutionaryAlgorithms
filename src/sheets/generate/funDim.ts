import ExcelJS, {Worksheet} from 'exceljs'
import _ from 'lodash'
import fs from 'fs'
import {MUTATION_PROBABILITIES} from '../../childrenGeneration'
import * as childrenSelection from '../../childrenSelection'
import {makeFilePath} from '../../common'
import {specs, TestFunctionSpec} from '../../testFunctions'
import {emptyCols, getPath, mergeColumns, writeSheet} from '../common'
import {RunResult} from '../..'

export const generateFunDimSheets = (dimensions: number[], functions = specs): void =>
  void _.forEach(functions, fun => dimensions.forEach(dim => generateFunDimSheet(fun, dim)))

const RUNS = 10

export const generateFunDimSheet = (functionSpec: TestFunctionSpec, dimensions: number): string => {
  const sheetPath = getPath(functionSpec, dimensions)

  if (fs.existsSync(sheetPath)) {
    return sheetPath
  }

  makeFilePath(sheetPath)

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Test')

  // Initial columns
  worksheet.columns = [
    {header: 'Config', width: 20},
    ..._.range(1, RUNS + 1).flatMap(it => [
      {header: `Run ${it}`, width: 10},
      ...emptyCols(runCriteria.length - 1),
    ]),
    ...aggregationCols.flatMap(col => [
      {header: col, width: 10},
      ...emptyCols(aggregatableCriteria.length - 1),
    ]),
    {header: 'Suc Runs', width: 10},
  ]

  // Merge runs cols in the first row
  const runsEnd = mergeColumns(worksheet, RUNS, runCriteria.length, headerRowsAmount)
  mergeColumns(worksheet, aggregationCols.length, aggregatableCriteria.length, runsEnd + 1)

  // Criteria headers row
  worksheet.addRow([
    '',
    ..._.times(RUNS, () => runCriteria).flat(),
    ..._.times(aggregationCols.length, () => aggregatableCriteria).flat(),
  ])

  // Configurations rows
  const configRows = _.flatMap(childrenSelection, ({name}) =>
    MUTATION_PROBABILITIES.map(prob => [
      `${name} Pm=${prob}`,
      ..._.times(runsEnd - 1, _.constant(0)),
    ]),
  )
  worksheet.addRows(configRows)

  // Avg and max by runs
  _.times(aggregationCols.length, topColIdx =>
    _.range(headerRowsAmount + 1, configRows.length + headerRowsAmount + 1).forEach(row =>
      _.range(1, aggregatableCriteria.length + 1).forEach(col => {
        const colIdx = runsEnd + topColIdx * aggregatableCriteria.length + col
        const criteriaCells = getCriteriaCells(worksheet, row, col).join(',')

        worksheet.getCell(row, colIdx).value = {
          formula: `${topColIdx === 0 ? 'AVERAGE' : 'MAX'}(${criteriaCells})`,
          date1904: true,
        }
      }),
    ),
  )

  // Suc Runs percentage
  _.range(headerRowsAmount + 1, configRows.length + headerRowsAmount + 1).forEach(
    row =>
      (worksheet.getCell(row, _.last(worksheet.columns)!.number).value = {
        formula: `AVERAGE(${getSucRunCells(worksheet, row).join(',')})`,
        date1904: true,
      }),
  )

  writeSheet(workbook, sheetPath)

  return sheetPath
}

export const aggregatableCriteria: readonly (keyof RunResult)[] = [
  'Iterations',
  'NFE',
  'NSeeds',
  'NP',
  'GP',
  'LP',
  'PR',
  'GPR',
  'LPR',
  'FPR',
  'LowestPeak',
]
export const runCriteria: readonly (keyof RunResult)[] = [...aggregatableCriteria, 'SucRun']

export const headerRowsAmount = 2
const aggregationCols = ['All runs avg', 'All runs best']

const getCriteriaCells = (
  worksheet: Worksheet,
  absoluteRow: number,
  relativeColumn: number,
): string[] =>
  _.times(
    RUNS,
    runIdx =>
      worksheet.getColumn(1 + runIdx * runCriteria.length + relativeColumn).letter + absoluteRow,
  )

const getSucRunCells = (worksheet: Worksheet, row: number): string[] =>
  getCriteriaCells(worksheet, row, runCriteria.length)
