import {Spec, View, parse} from 'vega'
import fs from 'fs'
import path from 'path'
import sp from 'synchronized-promise'
import {functionData, TestFunctionSpec} from './testFunctions'
import {AlgorithmConfig} from './runEvolution'
import {Peak, Population} from './common'

type Config = AlgorithmConfig & {iteration: number; population: Population; peaks?: Peak[]}

export const writeSvg = sp(
  ({population, peaks = [], ...config}: Config): Promise<void> =>
    new View(parse(makeSpec(config.testFunctionSpec, population, peaks)), {renderer: 'none'})
      .toSVG()
      .then(svg => {
        const path = makePath(config)
        fs.mkdirSync(path.slice(0, path.lastIndexOf('/')), {recursive: true})
        fs.writeFileSync(path, svg)
      })
      .catch(console.error),
)

const makePath = (config: Omit<Config, 'population' | 'peaks'>): string =>
  path.resolve(
    __dirname,
    '../results',
    `f_${config.testFunctionSpec.name}`,
    `c_${config.childrenSelectionConfig.name}`,
    `m_${config.mutationProbability.toString()}`,
    `r_${config.runNum.toString()}`,
    `i_${config.iteration}.svg`,
  )

const makeSpec = (
  funcSpec: TestFunctionSpec,
  population: Population,
  peaks: Peak[] = [],
): Spec => ({
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  width: 1500,
  height: 700,
  data: [
    {name: 'table', values: functionData[funcSpec.name]},
    {name: 'population', values: population},
    {name: 'peaks', values: peaks},
  ],
  scales: [
    {
      name: 'x',
      type: 'linear',
      range: 'width',
      nice: true,
      domain: {data: 'table', field: 'individual'},
    },
    {
      name: 'y',
      type: 'linear',
      range: 'height',
      nice: true,
      zero: true,
      domain: {data: 'table', field: 'health'},
    },
  ],
  axes: [
    {orient: 'bottom', scale: 'x'},
    {orient: 'left', scale: 'y'},
  ],
  marks: [
    {
      type: 'line',
      from: {data: 'table'},
      encode: {
        enter: {
          x: {scale: 'x', field: 'individual'},
          y: {scale: 'y', field: 'health'},
          strokeWidth: {value: 1},
          interpolate: {value: 'natural'},
        },
      },
    },
    {
      type: 'symbol',
      from: {data: 'population'},
      encode: {
        enter: {
          x: {scale: 'x', field: 'individual'},
          y: {scale: 'y', field: 'health'},
          size: {value: 30},
          fill: {value: 'blue'},
        },
      },
    },
    {
      type: 'symbol',
      from: {data: 'peaks'},
      encode: {
        enter: {
          x: {scale: 'x', field: 'individual'},
          y: {scale: 'y', field: 'health'},
          stroke: {value: 'red'},
          strokeWidth: {value: 2},
          fill: {value: 'red'},
          fillOpacity: {field: 'real'},
        },
      },
    },
  ],
})

export const processPeaks = ({
  foundGlobalPeaks,
  foundLocalPeaks,
  falsePeaks,
}: {
  foundGlobalPeaks: Peak[]
  foundLocalPeaks: Peak[]
  falsePeaks: Peak[]
}): Peak[] => [
  ...foundGlobalPeaks.map(p => ({...p, real: 1})),
  ...foundLocalPeaks.map(p => ({...p, real: 1})),
  ...falsePeaks.map(p => ({...p, real: 0})),
]
