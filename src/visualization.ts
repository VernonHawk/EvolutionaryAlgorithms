import {Spec, View, parse} from 'vega'
import fs from 'fs'
import path from 'path'
import sp from 'synchronized-promise'
import {functionData} from './testFunctions'
import {AlgorithmConfig} from './runEvolution'
import {makeFilePath, Peak, Population, RESULTS_FOLDER} from './common'

type Config = AlgorithmConfig & {
  iteration: number | string
  population: Population
  peaks?: Peak[]
  parents?: Population
  children?: Population
  selectedChildren?: Population
}

export const writeSvg = sp(
  (config: Config): Promise<void> =>
    new View(parse(makeSpec(config)), {renderer: 'none'})
      .toSVG()
      .then(svg => {
        const path = makePath(config)

        makeFilePath(path)
        fs.writeFileSync(path, svg)
      })
      .catch(console.error),
  {tick: 2},
)

const makePath = (config: Omit<Config, 'population' | 'peaks'>): string =>
  path.resolve(
    __dirname,
    `../${RESULTS_FOLDER}`,
    config.testFunctionSpec.name,
    `c_${config.childrenSelectionConfig.name}`,
    `m_${config.mutationProbability.toString()}`,
    `r_${config.runNum.toString()}`,
    `i_${config.iteration}.svg`,
  )

const makeSpec = ({
  testFunctionSpec,
  childrenSelectionConfig,
  mutationProbability,
  runNum,
  population,
  parents,
  children,
  selectedChildren,
  peaks,
}: Config): Spec => ({
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  width: 1500,
  height: 700,
  padding: 5,
  title: {
    text: `${testFunctionSpec.name} - ${childrenSelectionConfig.name} - mut ${mutationProbability} - run ${runNum}`,
  },
  data: [
    {name: 'table', values: functionData[testFunctionSpec.name]},
    {name: 'population', values: population},
    {name: 'parents', values: parents},
    {name: 'children', values: children},
    {name: 'selectedChildren', values: selectedChildren},
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
          interpolate: {value: 'linear'},
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
      from: {data: 'parents'},
      encode: {
        enter: {
          x: {scale: 'x', field: 'individual'},
          y: {scale: 'y', field: 'health'},
          fill: {value: 'red'},
        },
      },
    },
    {
      type: 'symbol',
      from: {data: 'children'},
      encode: {
        enter: {
          x: {scale: 'x', field: 'individual'},
          y: {scale: 'y', field: 'health'},
          fill: {value: 'yellow'},
        },
      },
    },
    {
      type: 'symbol',
      from: {data: 'selectedChildren'},
      encode: {
        enter: {
          x: {scale: 'x', field: 'individual'},
          y: {scale: 'y', field: 'health'},
          fill: {value: 'green'},
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
