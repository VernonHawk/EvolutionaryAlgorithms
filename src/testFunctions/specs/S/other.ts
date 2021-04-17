import {TestFunctionSpec} from '../../common'
import {sum} from '../../helpers'

export const F20_m2_Rastrigin: TestFunctionSpec = {
  name: 'F20_m2_Rastrigin',
  fun: individual =>
    10 * individual.length - sum(individual, x => Math.pow(x, 2) + 10 * Math.cos(2 * Math.PI * x)),
  argsRange: [{min: -5.12, max: 5.12}],
  peaks: [
    {x: 0.49748, locality: 'global'},
    {x: -0.49748, locality: 'global'},
  ],
  wide: false,
  dimensions: 'ALL',
}

// export const F38_Goldstein_Price: TestFunctionSpec = {
//   name: 'F38_Goldstein_Price',
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

// export const F48_Branin: TestFunctionSpec = {
//   name: 'F48_Branin',
//   fun: individual => individual,
//   argRange: {min: 0, max: 1},
//   peaks: [],
// wide: false
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
