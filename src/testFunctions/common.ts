import {Individual, Peak} from '../common'
import specs from './specs'

export type TestFunction = (individual: Individual) => number
export type TestFunctionSpec = {
  name: TestFuncName
  fun: TestFunction
  argRange: {min: number; max: number}
  peaks: FuncPeak[]
  absolutePeaks?: (Peak & {global: boolean})[]
  wide: boolean
  dimensions: 'ALL' | number
}

export type TestFuncName = keyof typeof specs

export type Locality = 'global' | 'local'

export type FuncPeak = {x: number; locality: Locality}
