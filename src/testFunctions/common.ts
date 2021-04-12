import {Individual} from '../common'
import specs from './specs'

export type TestFunction = (individual: Individual) => number
export type TestFunctionSpec = {
  name: TestFuncName
  fun: TestFunction
  argRange: {min: number; max: number}
  peaks: FuncPeak[]
  wide: boolean
}

export type TestFuncName = keyof typeof specs

export type Locality = 'global' | 'local'

export type FuncPeak = {x: number; locality: Locality}
