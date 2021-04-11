import ExcelJS, {Column, Workbook, Worksheet} from 'exceljs'
import _ from 'lodash'
import path from 'path'
import sp from 'synchronized-promise'
import {MUTATION_PROBABILITIES} from '../childrenGeneration'
import {TestFunctionSpec} from '../testFunctions'
import * as childrenSelection from '../childrenSelection'

export const writeSheet = (workbook: Workbook, path: string, tick = 1): void =>
  sp(() => workbook.xlsx.writeFile(path), {tick})()

export const readSheet = (path: string, tick = 1): Workbook =>
  sp(() => new ExcelJS.Workbook().xlsx.readFile(path), {tick})()

export const getPath = (functionSpec: TestFunctionSpec, dimension: number): string =>
  path.resolve(
    __dirname,
    `../../results/${functionSpec.name}/Fun_${functionSpec.name}__Dim_${dimension}.xlsx`,
  )

export const emptyCols = (num: number): Partial<Column>[] =>
  _.times(num, () => ({header: ``, width: 10}))

export const mergeColumns = (
  worksheet: Worksheet,
  num: number,
  length: number,
  start: number,
): number =>
  _.last(
    _.times(num, it => {
      const left = it * length + start
      const right = left + length - 1

      worksheet.mergeCells({top: 1, bottom: 1, left, right})

      return right
    }),
  )!

const childrenSelectionNames = Object.keys(childrenSelection)

export const getConfigRowIdx = (
  func: childrenSelection.ChildrenPickerConfig['name'],
  mutationProb: number,
): number =>
  childrenSelectionNames.findIndex(name => name === func) * MUTATION_PROBABILITIES.length +
  MUTATION_PROBABILITIES.findIndex(prob => prob === mutationProb) +
  1
