import {Individual} from '../common'
import specs from './specs'

export type TestFunction = (individual: Individual) => number
export type TestFunctionSpec = {
  name: TestFuncName
  fun: TestFunction
  argRange: {min: number; max: number}
  peaks: FuncPeak[]
}

export type TestFuncName = keyof typeof specs

export type FuncPeak = {x: number; locality: 'global' | 'local'}