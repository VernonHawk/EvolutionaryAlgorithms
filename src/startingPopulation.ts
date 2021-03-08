import _ from 'lodash'
import {Individual, individualsToPopulation, makeIndividual} from './common'

const generateStartingIndividuals = ({
  size,
  dimensions,
}: {
  size: number
  dimensions: number
}): Individual[] =>
  Array(size)
    .fill(0)
    .map(() =>
      makeIndividual(
        Array(dimensions)
          .fill(0)
          .map(() => _.random(0, 1, true)),
      ),
    )

const generateStartingPopulation = _.flow(generateStartingIndividuals, individualsToPopulation)

export default generateStartingPopulation
