import {specs} from '../../testFunctions'
import {generateFunDimSheets} from './funDim'

export const generateInitialSheets = (dimensions: number[], functions = specs): void => {
  generateFunDimSheets(dimensions, functions)
}
