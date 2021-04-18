import _ from 'lodash'
import {Individual, individualToPopulationEntry, isNormalPeak, makeGene, Peak} from './common'
import {distance} from './distance'
import {FuncPeak, TestFunctionSpec, TestFunSpecHealthPeak, TestFunSpecPeak} from './testFunctions'

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
  const peaks = getPeaks(testFunctionSpec, dimensions)

  const {globalPeaks, localPeaks, falsePeaks} = verifySeeds(seeds, peaks)
  const GP = globalPeaks.length
  const LP = localPeaks.length
  const NP = GP + LP

  const {globalPeaksAmount, localPeaksAmount = 0} = _.countBy(peaks, peak =>
    peak.global ? 'globalPeaksAmount' : 'localPeaksAmount',
  )

  return {
    additionalStats: {foundGlobalPeaks: globalPeaks, foundLocalPeaks: localPeaks, falsePeaks},
    mainStats: {
      NSeeds,
      NP,
      GP,
      LP,
      PR: NP / peaks.length,
      GPR: GP / globalPeaksAmount,
      LPR: localPeaksAmount ? LP / localPeaksAmount : 0,
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

const verifySeeds = (
  seeds: Peak[],
  peaks: (TestFunSpecPeak | TestFunSpecHealthPeak)[],
): {globalPeaks: Peak[]; localPeaks: Peak[]; falsePeaks: Peak[]} => {
  const globalPeaks: Peak[] = []
  const localPeaks: Peak[] = []
  const falsePeaks: Peak[] = []

  seeds.forEach(seed => {
    const matchingPeak = peaks.find(
      peak =>
        peak.health - seed.health <= HEALTH_TOLERANCE &&
        (!isNormalPeak(peak) || distance(seed.individual, peak.individual) <= DISTANCE_TOLERANCE),
    )

    if (!matchingPeak) {
      falsePeaks.push(seed)
      return
    }

    if (matchingPeak.global) {
      globalPeaks.push(seed)
    } else {
      localPeaks.push(seed)
    }
  })

  return {globalPeaks, localPeaks, falsePeaks}
}

// sigma
const HEALTH_TOLERANCE = 0.01
// delta
const DISTANCE_TOLERANCE = 0.01

const getPeaks = (
  testFunctionSpec: TestFunctionSpec,
  dimensions: number,
): (TestFunSpecPeak | TestFunSpecHealthPeak)[] =>
  !!testFunctionSpec.absolutePeaks?.length
    ? testFunctionSpec.absolutePeaks
    : !!testFunctionSpec.healthPeaks?.length
    ? testFunctionSpec.healthPeaks
    : generatePeaks(testFunctionSpec, dimensions)

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
