import {Locality, TestFuncName} from './common'
import specs from './specs'

export const isTestFuncName = (str: string): str is TestFuncName =>
  Object.keys(specs).includes(str as TestFuncName)

export const generatePeaks = ({
  getValue,
  stopCondition,
  locality,
}: {
  getValue: (it: number) => number
  stopCondition: (val: number, it: number) => boolean
  locality: Locality
}): {locality: Locality; x: number}[] => {
  const res = []

  for (let i = 0, curr = getValue(i); !stopCondition(curr, i); curr = getValue(i + 1), ++i) {
    res.push({locality, x: curr})
  }

  return res
}
