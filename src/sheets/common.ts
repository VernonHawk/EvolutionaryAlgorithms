import {Workbook} from 'exceljs'
import sp from 'synchronized-promise'

export const writeSheet = (workbook: Workbook, path: string, tick = 1): void =>
  sp(() => workbook.xlsx.writeFile(path), {tick})()
