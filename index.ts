import run from './src'
import {generateInitialSheets} from './src/sheets'
import {isTestFuncName} from './src/testFunctions'

const dimensions = [1, 2, 3, 4, 5, 10, 15, 20]

generateInitialSheets(dimensions)

const func = process.argv[2]
const results = run(dimensions[0], isTestFuncName(func) ? [func] : undefined)

console.log(JSON.stringify(results, null, 2))

// dimensions.map(run)
