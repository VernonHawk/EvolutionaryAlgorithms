import _ from 'lodash'
import {individualToPopulationEntry, makeHealth, makeIndividual} from '../../../common'
import {TestFunctionSpec, TestFunSpecPeak} from '../../common'
import {generatePeaks, product, sum} from '../../helpers'

export const F20_Rastrigin: TestFunctionSpec = {
  name: 'F20_Rastrigin',
  fun: individual =>
    sum(individual, x => 10 * Math.cos(2 * Math.PI * x) - Math.pow(x, 2)) - 10 * individual.length,
  argsRange: [{min: -5.12, max: 5.12}],
  peaks: [
    {x: 0, locality: 'global'},
    {x: 1, locality: 'local'},
    {x: -1, locality: 'local'},
    {x: 2, locality: 'local'},
    {x: -2, locality: 'local'},
    {x: 3, locality: 'local'},
    {x: -3, locality: 'local'},
    {x: 4, locality: 'local'},
    {x: -4, locality: 'local'},
    {x: 5, locality: 'local'},
    {x: -5, locality: 'local'},
  ],
  wide: false,
  dimensions: 'ALL',
}

const F20_m_Rastrigin_fun: TestFunctionSpec['fun'] = ([x1, x2]) =>
  -10 - 9 * Math.cos(2 * Math.PI * 3 * x1) - 10 - 9 * Math.cos(2 * Math.PI * 4 * x2)
export const F20_m_Rastrigin: TestFunctionSpec = {
  name: 'F20_m_Rastrigin',
  fun: F20_m_Rastrigin_fun,
  argsRange: [{min: 0, max: 1}],
  peaks: [],
  absolutePeaks: _.range(1, 6, 2)
    .flatMap(x1 => _.range(1, 8, 2).map(x2 => [x1 / 6, x2 / 8]))
    .map(peak => ({
      locality: 'global',
      ...individualToPopulationEntry(F20_m_Rastrigin_fun)(makeIndividual(peak)),
    })),
  wide: false,
  dimensions: 2,
}

export const F22_Griewangk: TestFunctionSpec = {
  name: 'F22_Griewangk',
  fun: individual =>
    individual.length -
    1 -
    sum(individual, x => Math.pow(x, 2)) / 4_000 +
    product(individual, (x, i) => Math.cos(x / Math.sqrt(i + 1))),
  argsRange: [{min: -600, max: 600}],
  peaks: [
    {x: 0, locality: 'global'},
    ...generatePeaks({
      getValue: it => (it + 1) * 6.2800452793799046869,
      stopCondition: val => val > 600,
      locality: 'local',
    }),
    ...generatePeaks({
      getValue: it => -(it + 1) * 6.2800452793799046869,
      stopCondition: val => val < -600,
      locality: 'local',
    }),
  ],
  wide: true,
  dimensions: 'ALL',
}

export const F23_Schwefel: TestFunctionSpec = {
  name: 'F23_Schwefel',
  fun: individual => sum(individual, x => x * Math.sin(Math.sqrt(Math.abs(x)))) / individual.length,
  argsRange: [{min: -500, max: 500}],
  peaks: [{x: 420.9687, locality: 'global'}],
  wide: true,
  dimensions: 'ALL',
}

const F24_Generalized_Shubert_Base: Omit<TestFunctionSpec, 'name' | 'peaks' | 'dimensions'> = {
  fun: individual =>
    -product(individual, x => sum(_.range(1, 6), j => j * Math.cos((j + 1) * x + j))),
  argsRange: [{min: -10, max: 10}],
  wide: false,
}

export const F24_Generalized_Shubert_dim_1: TestFunctionSpec = {
  ...F24_Generalized_Shubert_Base,
  name: 'F24_Generalized_Shubert_dim_1',
  peaks: [
    {x: 4.858, locality: 'global'},
    {x: -1.4251, locality: 'global'},
    {x: -7.7083, locality: 'global'},
  ],
  dimensions: 1,
}

export const F24_Generalized_Shubert_dim_2: TestFunctionSpec = {
  ...F24_Generalized_Shubert_Base,
  name: 'F24_Generalized_Shubert_dim_2',
  absolutePeaks: [
    [-7.0835, 4.858],
    [-7.0835, -7.7083],
    [-1.4251, -7.0835],
    [5.4828, 4.858],
    [-1.4251, -0.8003],
    [4.858, 5.4828],
    [-7.7083, -7.0835],
    [-7.0835, -1.4251],
    [-7.7083, -0.8003],
    [-7.7083, 5.4828],
    [-0.8003, -7.7083],
    [-0.8003, -1.4251],
    [-0.8003, 4.858],
    [-1.4251, 5.4828],
    [5.4828, -7.7083],
    [4.858, -7.0835],
    [5.4828, -1.4251],
    [4.858, -0.8003],
  ].map(p => ({
    locality: 'global',
    ...individualToPopulationEntry(F24_Generalized_Shubert_Base.fun)(makeIndividual(p)),
  })),
  peaks: [],
  dimensions: 2,
}

export const F25_Ackley: TestFunctionSpec = {
  name: 'F25_Ackley',
  fun: individual =>
    20 * Math.exp(-0.2 * Math.sqrt(sum(individual, x => Math.pow(x, 2)) / individual.length)) +
    Math.exp(sum(individual, x => Math.cos(2 * Math.PI * x)) / individual.length) -
    (20 + Math.E),
  argsRange: [{min: -32.768, max: 32.768}],
  peaks: [{x: 0, locality: 'global'}],
  wide: true,
  dimensions: 'ALL',
}

export const F28_Vincent: TestFunctionSpec = {
  name: 'F28_Vincent',
  fun: individual => sum(individual, x => Math.sin(10 * Math.log(x))) / individual.length,
  argsRange: [{min: 0.25, max: 10}],
  peaks: [
    {x: 0.333018, locality: 'global'},
    {x: 0.624228, locality: 'global'},
    {x: 1.170088, locality: 'global'},
    {x: 2.19328, locality: 'global'},
    {x: 4.111207, locality: 'global'},
    {x: 7.706277, locality: 'global'},
  ],
  wide: false,
  dimensions: 'ALL',
}

const F31_Xin_She_Yang_2_Base: Omit<TestFunctionSpec, 'name' | 'peaks' | 'dimensions'> = {
  fun: individual => sum(individual, Math.abs) * Math.exp(-sum(individual, x => Math.pow(x, 2))),
  argsRange: [{min: -10, max: 10}],
  wide: false,
}

export const F31_Xin_She_Yang_2_dim_1: TestFunctionSpec = {
  ...F31_Xin_She_Yang_2_Base,
  name: 'F31_Xin_She_Yang_2_dim_1',
  peaks: [
    {x: Math.SQRT1_2, locality: 'global'},
    {x: -Math.SQRT1_2, locality: 'global'},
  ],
  dimensions: 1,
}

export const F31_Xin_She_Yang_2_dim_2: TestFunctionSpec = {
  ...F31_Xin_She_Yang_2_Base,
  name: 'F31_Xin_She_Yang_2_dim_2',
  peaks: [
    {x: 0.5, locality: 'global'},
    {x: -0.5, locality: 'global'},
  ],
  dimensions: 2,
}

const F42_5_hills_4_valleys_fun: TestFunctionSpec['fun'] = ([x1, x2]) =>
  Math.sin(2.2 * Math.PI * x1 + 0.5 * Math.PI) *
    ((2 - Math.abs(x2)) / 2) *
    ((3 - Math.abs(x1)) / 2) +
  Math.sin(0.5 * Math.PI * Math.pow(x2, 2) + 0.5 * Math.PI) *
    ((2 - Math.abs(x2)) / 2) *
    ((2 - Math.abs(x1)) / 2)

export const F42_5_hills_4_valleys: TestFunctionSpec = {
  name: 'F42_5_hills_4_valleys',
  fun: F42_5_hills_4_valleys_fun,
  argsRange: [
    {min: -2.5, max: 3},
    {min: -2, max: 2},
  ],
  peaks: [],
  absolutePeaks: ([
    {peak: [0, 0], locality: 'global'},
    {peak: [0.889286, 0], locality: 'local'},
    {peak: [1.7839142, 0], locality: 'local'},
    {peak: [-0.889286, 0], locality: 'local'},
    {peak: [-1.7839142, 0], locality: 'local'},
  ] as const).map(({peak, locality}) => ({
    locality,
    ...individualToPopulationEntry(F42_5_hills_4_valleys_fun)(makeIndividual(peak)),
  })),
  wide: false,
  dimensions: 2,
}

const F45_Himmelblau_fun: TestFunctionSpec['fun'] = ([x1, x2]) =>
  200 - Math.pow(Math.pow(x1, 2) + x2 - 11, 2) - Math.pow(x1 + Math.pow(x2, 2) - 7, 2)
export const F45_Himmelblau: TestFunctionSpec = {
  name: 'F45_Himmelblau',
  fun: F45_Himmelblau_fun,
  argsRange: [{min: -6, max: 6}],
  peaks: [],
  absolutePeaks: [
    [3, 2],
    [3.58442834, -1.84812653],
    [-3.77931025, -3.28318599],
    [-2.80511809, 3.13131252],
  ].map(p => ({
    locality: 'global',
    ...individualToPopulationEntry(F45_Himmelblau_fun)(makeIndividual(p)),
  })),
  wide: false,
  dimensions: 2,
}

const F46_six_hump_camel_back_fun: TestFunctionSpec['fun'] = ([x1, x2]) =>
  -(
    (4 - 2.1 * Math.pow(x1, 2) + Math.pow(x1, 4) / 3) * Math.pow(x1, 2) +
    x1 * x2 +
    4 * (Math.pow(x2, 2) - 1) * Math.pow(x2, 2)
  )
export const F46_six_hump_camel_back: TestFunctionSpec = {
  name: 'F46_six_hump_camel_back',
  fun: F46_six_hump_camel_back_fun,
  argsRange: [
    {min: -3, max: 3},
    {min: -2, max: 2},
  ],
  peaks: [],
  absolutePeaks: [
    ...[
      [-0.0898, 0.7126],
      [0.0898, -0.7126],
    ].map<TestFunSpecPeak>(p => ({
      locality: 'global',
      ...individualToPopulationEntry(F46_six_hump_camel_back_fun)(makeIndividual(p)),
    })),
    ...[
      [-1.7036, 0.7961],
      [1.7036, -0.7961],
      [-1.6071, -0.5687],
      [1.6071, 0.5687],
    ].map<TestFunSpecPeak>(p => ({
      locality: 'local',
      ...individualToPopulationEntry(F46_six_hump_camel_back_fun)(makeIndividual(p)),
    })),
  ],
  wide: false,
  dimensions: 2,
}

export const F50_Easom: TestFunctionSpec = {
  name: 'F50_Easom',
  fun: ([x1, x2]) =>
    Math.cos(x1) * Math.cos(x2) * Math.exp(-Math.pow(x1 - Math.PI, 2) - Math.pow(x2 - Math.PI, 2)),
  argsRange: [{min: -100, max: 100}],
  peaks: [{x: Math.PI, locality: 'global'}],
  wide: true,
  dimensions: 2,
}

export const D6_Five_Uneven_Peak_Trap: TestFunctionSpec = {
  name: 'D6_Five_Uneven_Peak_Trap',
  fun: ([x]) => {
    if (x < 0 || x > 30) {
      console.error(x, `is out of function ${D6_Five_Uneven_Peak_Trap.name} bounds`)
      return 0
    }

    if (x < 2.5) {
      return 80 * (2.5 - x)
    }

    if (x < 5) {
      return 64 * (x - 2.5)
    }

    if (x < 7.5) {
      return 64 * (7.5 - x)
    }

    if (x < 12.5) {
      return 28 * (x - 7.5)
    }

    if (x < 17.5) {
      return 28 * (17.5 - x)
    }

    if (x < 22.5) {
      return 32 * (x - 17.5)
    }

    if (x < 27.5) {
      return 32 * (27.5 - x)
    }

    // x <= 30
    return 80 * (x - 27.5)
  },
  argsRange: [{min: 0, max: 30}],
  peaks: [
    {x: 0, locality: 'global'},
    {x: 30, locality: 'global'},
    {x: 5, locality: 'local'},
    {x: 12.5, locality: 'local'},
    {x: 22.5, locality: 'local'},
  ],
  wide: false,
  dimensions: 1,
}

const makeD7_2_dim_Trap_fun = (delta: number): TestFunctionSpec['fun'] => ([x1, x2]) => {
  if (x1 >= D7_2_dim_Trap_a && x1 <= D7_2_dim_Trap_a + delta) {
    if (x2 >= D7_2_dim_Trap_b && x2 <= D7_2_dim_Trap_b + delta) {
      return 4
    }

    return 1
  }

  if (x2 >= D7_2_dim_Trap_b && x2 <= D7_2_dim_Trap_b + delta) {
    return 2
  }

  return 3
}
const D7_2_dim_Trap_Base: Omit<TestFunctionSpec, 'name' | 'fun' | 'absolutePeaks'> = {
  argsRange: [{min: 0, max: 1}],
  wide: false,
  dimensions: 2,
  peaks: [],
  healthPeaks: [
    {locality: 'global', health: makeHealth(4)},
    {locality: 'local', health: makeHealth(3)},
    {locality: 'local', health: makeHealth(2)},
    {locality: 'local', health: makeHealth(1)},
  ],
}
const D7_2_dim_Trap_a = 0.4
const D7_2_dim_Trap_b = 0.4

export const D7_2_dim_Trap_delta_001: TestFunctionSpec = {
  ...D7_2_dim_Trap_Base,
  name: 'D7_2_dim_Trap_delta_001',
  fun: makeD7_2_dim_Trap_fun(0.01),
}

export const D7_2_dim_Trap_delta_01: TestFunctionSpec = {
  ...D7_2_dim_Trap_Base,
  name: 'D7_2_dim_Trap_delta_01',
  fun: makeD7_2_dim_Trap_fun(0.1),
}

export const D7_2_dim_Trap_delta_003: TestFunctionSpec = {
  ...D7_2_dim_Trap_Base,
  name: 'D7_2_dim_Trap_delta_003',
  fun: makeD7_2_dim_Trap_fun(0.03),
}

export const D7_2_dim_Trap_delta_005: TestFunctionSpec = {
  ...D7_2_dim_Trap_Base,
  name: 'D7_2_dim_Trap_delta_005',
  fun: makeD7_2_dim_Trap_fun(0.05),
}

export const D7_2_dim_Trap_delta_007: TestFunctionSpec = {
  ...D7_2_dim_Trap_Base,
  name: 'D7_2_dim_Trap_delta_007',
  fun: makeD7_2_dim_Trap_fun(0.07),
}
