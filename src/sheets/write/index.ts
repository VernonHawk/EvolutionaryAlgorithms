import {RunResult} from '../..'
import {AlgorithmConfig} from '../../runEvolution'
import {writeFunDim} from './funDim'

export const writeRunResults = (
  dimension: number,
  config: AlgorithmConfig,
  results: RunResult,
): void => {
  writeFunDim(dimension, config, results)

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
