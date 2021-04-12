import {TestFunctionSpec} from '../common'

export const F20_Rastrigin: TestFunctionSpec = {
  name: 'F20_Rastrigin',
  fun: individual =>
    individual.reduce((acc, x) => acc + 10 * Math.cos(2 * Math.PI * x) - Math.pow(x, 2), 0) -
    10 * individual.length,
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
}

// export const F20_m_Rastrigin: TestFunctionSpec = {
//   name: 'F20_m_Rastrigin',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F20_m2_Rastrigin: TestFunctionSpec = {
//   name: 'F20_m2_Rastrigin',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F22_Griewangk: TestFunctionSpec = {
//   name: 'F22_Griewangk',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: true
// }

// export const F23_Schwefel: TestFunctionSpec = {
//   name: 'F23_Schwefel',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: true
// }

// export const F24_Generalized_Shubert: TestFunctionSpec = {
//   name: 'F24_Generalized_Shubert',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F25_Ackley: TestFunctionSpec = {
//   name: 'F25_Ackley',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: true
// }

// export const F28_Vincent: TestFunctionSpec = {
//   name: 'F28_Vincent',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F31_Xin_She_Yang: TestFunctionSpec = {
//   name: 'F31_Xin_She_Yang',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F38_Goldstein_Price: TestFunctionSpec = {
//   name: 'F38_Goldstein_Price',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F42_5_hills_4_valleys: TestFunctionSpec = {
//   name: 'F42_5_hills_4_valleys',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F43_1_center_peak_4_neighbours: TestFunctionSpec = {
//   name: 'F43_1_center_peak_4_neighbours',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F44_Ursem_Waves: TestFunctionSpec = {
//   name: 'F44_Ursem_Waves',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F45_Himmelblau: TestFunctionSpec = {
//   name: 'F45_Himmelblau',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F46_six_hump_camel_back: TestFunctionSpec = {
//   name: 'F46_six_hump_camel_back',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F48_Branin: TestFunctionSpec = {
//   name: 'F48_Branin',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F50_Easom: TestFunctionSpec = {
//   name: 'F50_Easom',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: true
// }

// export const F50_g_Easom_generalized: TestFunctionSpec = {
//   name: 'F50_g_Easom_generalized',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const F54_Shekel_Foxholes: TestFunctionSpec = {
//   name: 'F54_Shekel_Foxholes',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: true
// }

// export const F100_Bird: TestFunctionSpec = {
//   name: 'F100_Bird',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const D6_Five_Uneven_Peak_Trap: TestFunctionSpec = {
//   name: 'D6_Five_Uneven_Peak_Trap',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }

// export const D7_2_dim_Trap: TestFunctionSpec = {
//   name: 'D7_2_dim_Trap',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
// }
