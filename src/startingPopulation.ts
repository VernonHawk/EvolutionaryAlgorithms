import _ from 'lodash'
import {Individual, individualsToPopulation} from './common'

const generateStartingIndividuals = (size: number): Individual[] => {
  // TODO
  return []
}

const generateStartingPopulation = _.flow(generateStartingIndividuals, individualsToPopulation)

export default generateStartingPopulation
