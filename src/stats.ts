import _ from 'lodash'
import {Individual, individualToPopulationEntry, makeGene, Peak, PopulationEntry} from './common'
import {distance} from './distance'
import {FuncPeak, TestFunctionSpec} from './testFunctions'

export type Stats = {
  foundGlobalPeaks: Peak[]
  foundLocalPeaks: Peak[]
  NSeeds: number
  NP: number
  GP: number
  LP: number
  PR: number
  GPR: number
  LPR: number
  FPR: number
}

const getStats = ({
  seeds,
  testFunctionSpec,
}: {
  seeds: Peak[]
  testFunctionSpec: TestFunctionSpec
}): Stats => {
  const dimensions = seeds[0].individual.length

  const NSeeds = seeds.length
  const peaks = generatePeaks(testFunctionSpec, dimensions)

  const {foundGlobalPeaks, foundLocalPeaks} = verifySeeds(peaks, seeds)
  const GP = foundGlobalPeaks.length
  const LP = foundLocalPeaks.length
  const NP = GP + LP

  const {globalPeaksAmount, localPeaksAmount = 0} = _.countBy(peaks, peak =>
    peak.global ? 'globalPeaksAmount' : 'localPeaksAmount',
  )

  return {
    foundGlobalPeaks,
    foundLocalPeaks,
    NSeeds,
    NP,
    GP,
    LP,
    PR: NP / peaks.length,
    GPR: GP / globalPeaksAmount,
    LPR: localPeaksAmount ? LP / localPeaksAmount : 0,
    FPR: (NSeeds - NP) / NSeeds,
  }
}

const verifySeeds = (
  peaks: ({global: boolean} & PopulationEntry)[],
  seeds: Peak[],
): {foundGlobalPeaks: Peak[]; foundLocalPeaks: Peak[]} => {
  const foundGlobalPeaks: Peak[] = []
  const foundLocalPeaks: Peak[] = []

  seeds.forEach(seed => {
    const matchingPeak = peaks.find(
      peak =>
        peak.health - seed.health <= HEALTH_TOLERANCE &&
        distance(seed.individual, peak.individual) <= DISTANCE_TOLERANCE,
    )

    if (matchingPeak) {
      if (matchingPeak.global) {
        foundGlobalPeaks.push(seed)
      } else {
        foundLocalPeaks.push(seed)
      }
    }
  })

  return {foundGlobalPeaks, foundLocalPeaks}
}

// sigma
const HEALTH_TOLERANCE = 0.01
// delta
const DISTANCE_TOLERANCE = 0.01

const generatePeaks = (testFunctionSpec: TestFunctionSpec, dimensions: number) => {
  const res: {peak: Individual; global: boolean}[] = []
  const tmp: Individual = []

  peakGenerationHelper(testFunctionSpec.peaks, res, tmp, dimensions, true)

  return res.map(({peak, ...rest}) => ({
    ...individualToPopulationEntry(testFunctionSpec.fun)(peak),
    ...rest,
  }))
}

const peakGenerationHelper = (
  funcPeaks: FuncPeak[],
  res: {peak: Individual; global: boolean}[],
  tmp: Individual,
  dimensions: number,
  global: boolean,
): void => {
  if (tmp.length == dimensions) {
    res.push({peak: [...tmp], global})
    return
  }

  for (const {x, locality} of funcPeaks) {
    tmp.push(makeGene(x))

    peakGenerationHelper(funcPeaks, res, tmp, dimensions, global && locality === 'global')

    tmp.pop()
  }
}

export default getStats
