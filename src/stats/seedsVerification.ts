import {Individual, individualToPopulationEntry, makeGene, Peak} from '../common'
import {distance} from '../distance'
import {
  FuncPeak,
  Locality,
  TestFunctionSpec,
  TestFunSpecHealthPeak,
  TestFunSpecPeak,
} from '../testFunctions'

const verifySeeds = (
  seeds: Peak[],
  testFunctionSpec: TestFunctionSpec,
  dimensions: number,
): {globalPeaks: Peak[]; localPeaks: Peak[]; falsePeaks: Peak[]} => {
  if (!!testFunctionSpec.absolutePeaks?.length) {
    return verifySeedsBase(seeds, seed =>
      testFunctionSpec.absolutePeaks!.find(
        peak => matchesHealth(peak, seed) && matchesDistance(peak, seed),
      ),
    )
  }

  if (!!testFunctionSpec.healthPeaks?.length) {
    return verifySeedsBase(seeds, seed =>
      testFunctionSpec.healthPeaks!.find(peak => matchesHealth(peak, seed)),
    )
  }

  const peaks = generatePeaks(testFunctionSpec, dimensions)
  return verifySeedsBase(seeds, seed =>
    peaks.find(peak => matchesHealth(peak, seed) && matchesDistance(peak, seed)),
  )
}
export default verifySeeds

const matchesHealth = (peak: Pick<Peak, 'health'>, seed: Pick<Peak, 'health'>): boolean =>
  Math.abs(peak.health - seed.health) <= HEALTH_TOLERANCE
// sigma
const HEALTH_TOLERANCE = 0.01

const matchesDistance = (peak: Pick<Peak, 'individual'>, seed: Pick<Peak, 'individual'>): boolean =>
  distance(seed.individual, peak.individual) <= DISTANCE_TOLERANCE
// delta
const DISTANCE_TOLERANCE = 0.01

const verifySeedsBase = (
  seeds: Peak[],
  getMatchingPeak: (seed: Peak) => TestFunSpecPeak | TestFunSpecHealthPeak | undefined,
) => {
  const globalPeaks: Peak[] = []
  const localPeaks: Peak[] = []
  const falsePeaks: Peak[] = []

  seeds.forEach(seed => {
    const matchingPeak = getMatchingPeak(seed)

    if (!matchingPeak) {
      falsePeaks.push(seed)
      return
    }

    if (matchingPeak.locality === 'global') {
      globalPeaks.push(seed)
    } else {
      localPeaks.push(seed)
    }
  })

  return {globalPeaks, localPeaks, falsePeaks}
}

const generatePeaks = (testFunctionSpec: TestFunctionSpec, dimensions: number) => {
  const res: {peak: Individual; locality: Locality}[] = []
  const tmp: Individual = []

  peakGenerationHelper(testFunctionSpec.peaks, res, tmp, dimensions, 'global')

  return res.map(({peak, ...rest}) => ({
    ...individualToPopulationEntry(testFunctionSpec.fun)(peak),
    ...rest,
  }))
}

const peakGenerationHelper = (
  funcPeaks: FuncPeak[],
  res: {peak: Individual; locality: Locality}[],
  tmp: Individual,
  dimensions: number,
  locality: Locality,
): void => {
  if (tmp.length == dimensions) {
    res.push({peak: [...tmp], locality})
    return
  }

  for (const {x, locality: peakLocality} of funcPeaks) {
    tmp.push(makeGene(x))

    peakGenerationHelper(
      funcPeaks,
      res,
      tmp,
      dimensions,
      peakLocality === 'global' && locality === 'global' ? 'global' : 'local',
    )

    tmp.pop()
  }
}
