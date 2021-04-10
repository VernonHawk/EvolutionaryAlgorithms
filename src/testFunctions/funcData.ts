import _ from 'lodash'
import {makeIndividual} from '../common'
import {TestFunctionSpec} from './common'
import specs from './specs'

const generateFunctionData = (
  {fun, argRange}: TestFunctionSpec,
  num = 300,
): {individual: number; health: number}[] => {
  const step = (argRange.max - argRange.min) / num

  return _.times(num).map(idx => {
    const x = idx * step + argRange.min
    return {individual: x, health: fun(makeIndividual([x]))}
  })
}

export default _.mapValues(specs, spec => generateFunctionData(spec))
