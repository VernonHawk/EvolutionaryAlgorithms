import run from './src'
import {generateInitialSheets} from './src/sheets'

const dimensions = [1, 2, 3, 4, 5, 10, 15, 20]

generateInitialSheets(dimensions)

const results = run(dimensions[0])

console.log(JSON.stringify(results, null, 2))

// dimensions.map(run)
