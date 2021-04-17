import {TestFunctionSpec} from '../../common'
import {generatePeaks, product, sum} from '../../helpers'

export const F20_Rastrigin: TestFunctionSpec = {
  name: 'F20_Rastrigin',
  fun: individual =>
    sum(individual, x => 10 * Math.cos(2 * Math.PI * x) - Math.pow(x, 2)) - 10 * individual.length,
  argRange: {min: -5.12, max: 5.12},
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

export const F20_m_Rastrigin: TestFunctionSpec = {
  name: 'F20_m_Rastrigin',
  fun: individual =>
    -10 -
    9 * Math.cos(2 * Math.PI * 3 * individual[0]) -
    10 -
    9 * Math.cos(2 * Math.PI * 4 * individual[1]),
  argRange: {min: 0, max: 1},
  peaks: [],
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
  argRange: {min: -600, max: 600},
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

// TODO:
// export const F23_Schwefel: TestFunctionSpec = {
//   name: 'F23_Schwefel',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: true
// }

// TODO:
// export const F24_Generalized_Shubert: TestFunctionSpec = {
//   name: 'F24_Generalized_Shubert',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// TODO:
// export const F25_Ackley: TestFunctionSpec = {
//   name: 'F25_Ackley',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: true
// }

// TODO:
// export const F28_Vincent: TestFunctionSpec = {
//   name: 'F28_Vincent',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

const Xin_She_Yang_2_Base: Omit<TestFunctionSpec, 'name' | 'peaks' | 'dimensions'> = {
  fun: individual => sum(individual, Math.abs) * Math.exp(-sum(individual, x => Math.pow(x, 2))),
  argRange: {min: -10, max: 10},
  wide: false,
}

export const F31_Xin_She_Yang_2_dim_1: TestFunctionSpec = {
  ...Xin_She_Yang_2_Base,
  name: 'F31_Xin_She_Yang_2_dim_1',
  peaks: [
    {x: Math.SQRT1_2, locality: 'global'},
    {x: -Math.SQRT1_2, locality: 'global'},
  ],
  dimensions: 1,
}

export const F31_Xin_She_Yang_2_dim_2: TestFunctionSpec = {
  ...Xin_She_Yang_2_Base,
  name: 'F31_Xin_She_Yang_2_dim_2',
  peaks: [
    {x: 0.5, locality: 'global'},
    {x: -0.5, locality: 'global'},
  ],
  dimensions: 2,
}

// TODO:
// export const F42_5_hills_4_valleys: TestFunctionSpec = {
//   name: 'F42_5_hills_4_valleys',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// TODO:
// export const F45_Himmelblau: TestFunctionSpec = {
//   name: 'F45_Himmelblau',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// TODO:
// export const F46_six_hump_camel_back: TestFunctionSpec = {
//   name: 'F46_six_hump_camel_back',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// TODO:
// export const F50_Easom: TestFunctionSpec = {
//   name: 'F50_Easom',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: true
// }

export const D6_Five_Uneven_Peak_Trap: TestFunctionSpec = {
  name: 'D6_Five_Uneven_Peak_Trap',
  fun: individual => {
    const x = individual[0]
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
  argRange: {min: 0, max: 30},
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

// TODO:
// export const D7_2_dim_Trap: TestFunctionSpec = {
//   name: 'D7_2_dim_Trap',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }