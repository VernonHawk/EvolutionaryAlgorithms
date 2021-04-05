import run from './src'

const dimensions = [1, 2, 3, 4, 5]

const results = run(dimensions[0])

console.log(JSON.stringify(results, null, 2))

// dimensions.map(run)
