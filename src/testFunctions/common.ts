import {HealthPeak, Individual, Peak} from '../common'
import specs from './specs'

export type ArgsRange = {min: number; max: number}[]

export type TestFunSpecPeak = Peak & {locality: Locality}
export type TestFunSpecHealthPeak = HealthPeak & {locality: Locality}

export type TestFunction = (individual: Individual) => number
export type TestFunctionSpec = {
  name: TestFuncName
  fun: TestFunction
  argsRange: ArgsRange
  peaks: FuncPeak[]
  absolutePeaks?: TestFunSpecPeak[]
  healthPeaks?: TestFunSpecHealthPeak[]
  wide: boolean
  dimensions: 'ALL' | number
}

export type TestFuncName = keyof typeof specs

export type Locality = 'global' | 'local'

export type FuncPeak = {x: number; locality: Locality}
