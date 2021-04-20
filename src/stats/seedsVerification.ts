import _ from 'lodash'
import {individualToPopulationEntry, makeIndividual, Peak} from '../common'
import {distance} from '../distance'
import {TestFunctionSpec, TestFunSpecHealthPeak, TestFunSpecPeak} from '../testFunctions'

const verifySeeds = (
  seeds: Peak[],
  testFunctionSpec: TestFunctionSpec,
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

  return verifySeedsBase(seeds, seed => {
    const funcPeaks = seed.individual.map(
      gene => _.minBy(testFunctionSpec.peaks, ({x}) => Math.abs(gene - x))!,
    )
    const closestPeak: TestFunSpecPeak = {
      ...individualToPopulationEntry(testFunctionSpec.fun)(makeIndividual(_.map(funcPeaks, 'x'))),
      locality: _.some(funcPeaks, ['locality', 'local']) ? 'local' : 'global',
    }

    return matchesHealth(closestPeak, seed) && matchesDistance(closestPeak, seed)
      ? closestPeak
      : undefined
  })
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
