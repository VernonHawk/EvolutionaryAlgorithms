import _ from 'lodash'
import {makeIndividual} from '../common'
import {TestFunctionSpec} from './common'
import specs from './specs'

const generateFunctionData = (
  {fun, argsRange, wide}: TestFunctionSpec,
  num = wide ? 1000 : 500,
): {individual: number; health: number}[] => {
  if (argsRange.length === 0 || argsRange.length > 1) {
    console.error("Can't call generateFunctionData with argRange of size", argsRange.length)
    return []
  }

  const xRange = argsRange[0]
  const step = (xRange.max - xRange.min) / (num - 1)

  return _.times(num).map(idx => {
    const x = idx * step + xRange.min
    return {individual: x, health: fun(makeIndividual([x]))}
  })
}

export default _.mapValues(specs, spec =>
  spec.argsRange.length === 1 ? generateFunctionData(spec) : [],
)
