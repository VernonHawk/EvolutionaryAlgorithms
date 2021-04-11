import {specs} from '../testFunctions'
import {generateFunDimTables} from './funDim'

export const generateInitialTables = (dimensions: number[], functions = specs): void => {
  generateFunDimTables(dimensions, functions)
}
