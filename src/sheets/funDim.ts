import ExcelJS, {Worksheet} from 'exceljs'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import {MUTATION_PROBABILITIES} from '../childrenGeneration'
import * as childrenSelection from '../childrenSelection'
import {TEST_RUNS} from '../common'
import {specs, TestFunctionSpec} from '../testFunctions'
import {writeSheet} from './common'

export const generateFunDimTables = (dimensions: number[], functions = specs): void =>
  void _.forEach(functions, fun => dimensions.forEach(dim => generateFunDimTable(fun, dim)))

const generateFunDimTable = (functionSpec: TestFunctionSpec, dimension: number): void => {
  const sheetPath = path.resolve(
    __dirname,
    `../../results/${functionSpec.name}/Fun_${functionSpec.name}__Dim_${dimension}.xlsx`,
  )

  if (fs.existsSync(sheetPath)) {
    return
  }

  fs.mkdirSync(sheetPath.slice(0, sheetPath.lastIndexOf('/')), {recursive: true})

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Test')

  // Initial columns
  worksheet.columns = [
    {header: 'Config', width: 20},
    ..._.range(1, TEST_RUNS + 1).flatMap(it => [
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
  const runsEnd = mergeColumns(worksheet, TEST_RUNS, runCriteria.length, headerRows)
  mergeColumns(worksheet, aggregationCols.length, aggregatableCriteria.length, runsEnd + 1)

  // Criteria headers row
  worksheet.addRow([
    '',
    ..._.times(TEST_RUNS, () => runCriteria).flat(),
    ..._.times(aggregationCols.length, () => aggregatableCriteria).flat(),
  ])

  // Configurations rows
  const configRows = _.flatMap(childrenSelection, ({name}) =>
    // TODO: remove random
    MUTATION_PROBABILITIES.map(prob => [
      `${name} Pm=${prob}`,
      ..._.times(runsEnd - 1, Math.random),
    ]),
  )
  worksheet.addRows(configRows)

  // Avg and max by runs
  _.times(aggregationCols.length, topColIdx =>
    _.range(headerRows + 1, configRows.length + headerRows + 1).forEach(row =>
      _.range(1, aggregatableCriteria.length + 1).forEach(col => {
        const colIdx = runsEnd + topColIdx * aggregatableCriteria.length + col

        worksheet.getCell(row, colIdx).value = {
          formula: `${topColIdx === 0 ? 'AVERAGE' : 'MAX'}(${getRunCells(worksheet, row, col).join(
            ',',
          )})`,
          date1904: true,
        }
      }),
    ),
  )

  // Suc Runs percentage
  _.range(headerRows + 1, configRows.length + headerRows + 1).forEach(
    row =>
      (worksheet.getCell(row, _.last(worksheet.columns)!.number).value = {
        formula: `AVERAGE(${getRunCells(worksheet, row, runCriteria.length).join(',')})`,
        date1904: true,
      }),
  )

  writeSheet(workbook, sheetPath)
}

const aggregatableCriteria = [
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
  'Lowest Peak',
]
const runCriteria = [...aggregatableCriteria, 'Suc Run']

const headerRows = 2
const aggregationCols = ['All runs avg', 'All runs best']

const emptyCols = (num: number) => _.times(num, () => ({header: ``, width: 10}))

const mergeColumns = (worksheet: Worksheet, num: number, length: number, start: number): number =>
  _.last(
    _.times(num, it => {
      const left = it * length + start
      const right = left + length - 1

      worksheet.mergeCells({top: 1, bottom: 1, left, right})

      return right
    }),
  )!

const getRunCells = (worksheet: Worksheet, absoluteRow: number, relativeColumn: number): string[] =>
  _.times(
    TEST_RUNS,
    runIdx =>
      worksheet.getColumn(1 + runIdx * runCriteria.length + relativeColumn).letter + absoluteRow,
  )
