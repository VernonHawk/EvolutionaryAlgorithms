import {Individual} from '../common'
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

export const sum = (individual: Individual, comp: (x: number, idx: number) => number): number =>
  individual.reduce((acc, x, i) => acc + comp(x, i), 0)

export const product = (individual: Individual, comp: (x: number, idx: number) => number): number =>
  individual.reduce((acc, x, i) => acc * comp(x, i), 1)
