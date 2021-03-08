import _ from 'lodash'
import {Individual, makeIndividual} from './common'

type Attrs = {
  size: number
  dimensions: number
}

const generateStartingIndividuals = ({size, dimensions}: Attrs): Individual[] =>
  _.times(size, () => makeIndividual(_.times(dimensions, () => _.random(0, 1, true))))

export default generateStartingIndividuals
