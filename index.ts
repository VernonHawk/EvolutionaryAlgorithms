import run from './src'
import {withTime} from './src/common'
import {isTestFuncName} from './src/testFunctions/helpers'

const dimensionsList = [1, 2, 3, 4, 5, 10, 15, 20]

const func = process.argv[2]
const results = withTime('FULL RUN', () =>
  [1, 2, 3].map(dimensions => run(dimensions, isTestFuncName(func) ? [func] : undefined)),
)

console.log(JSON.stringify(results, null, 2))
