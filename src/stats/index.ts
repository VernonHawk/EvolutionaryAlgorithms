import _ from 'lodash'
import {Peak} from '../common'
import {
  Locality,
  TestFunctionSpec,
} from '../testFunctions'
import verifySeeds from './seedsVerification'

export type Stats = {
  mainStats: {
    NSeeds: number
    NP: number
    GP: number
    LP: number
    PR: number
    GPR: number
    LPR: number
    FPR: number
    LowestPeak: number
  }
  additionalStats: {foundGlobalPeaks: Peak[]; foundLocalPeaks: Peak[]; falsePeaks: Peak[]}
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

  const {globalPeaks, localPeaks, falsePeaks} = verifySeeds(seeds, testFunctionSpec, dimensions)
  const GP = globalPeaks.length
  const LP = localPeaks.length
  const NP = GP + LP

  const peaksAmount = getPeaksAmount(testFunctionSpec, dimensions)
  return {
    additionalStats: {foundGlobalPeaks: globalPeaks, foundLocalPeaks: localPeaks, falsePeaks},
    mainStats: {
      NSeeds,
      NP,
      GP,
      LP,
      PR: NP / (peaksAmount.global + peaksAmount.local),
      GPR: GP / peaksAmount.global,
      LPR: peaksAmount.local ? LP / peaksAmount.local : 0,
      FPR: (NSeeds - NP) / NSeeds,
      LowestPeak: determineLowestFoundPeak({globalPeaks, localPeaks}),
    },
  }
}

const determineLowestFoundPeak = ({
  globalPeaks,
  localPeaks,
}: {
  globalPeaks: Peak[]
  localPeaks: Peak[]
}): number => {
  const localMin = _.minBy(localPeaks, 'health')?.health ?? Infinity
  const globalMin = globalPeaks[0]?.health ?? localMin

  return Math.min(localMin, globalMin)
}

const getPeaksAmount = (
  {peaks, absolutePeaks, healthPeaks}: TestFunctionSpec,
  dimensions: number,
): {global: number; local: number} => {
  if (!!absolutePeaks?.length) {
    return countPeaksByLocality(absolutePeaks)
  }

  if (!!healthPeaks?.length) {
    return countPeaksByLocality(healthPeaks)
  }

  const {global, local} = countPeaksByLocality(peaks)
  const globalAmount = Math.pow(global, dimensions)

  return {global: globalAmount, local: Math.pow(global + local, dimensions) - globalAmount}
}

const countPeaksByLocality = (peaks: {locality: Locality}[]): {global: number; local: number} =>
  _.countBy(peaks, 'locality') as {global: number; local: number}

export default getStats
