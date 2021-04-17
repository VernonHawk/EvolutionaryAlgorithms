import _ from 'lodash'
import random from 'random'
import {Gene, individualToPopulationEntry, makeGene, makeIndividual, Population} from './common'
import {TestFunctionSpec} from './testFunctions'

type Attrs = {
  parents: Population
  mutationProbability: number
  standardDeviation: number
  testFunctionSpec: TestFunctionSpec
}

const generateChildren = ({
  parents,
  mutationProbability,
  standardDeviation,
  testFunctionSpec,
}: Attrs): Population => {
  const normalDistribution = random.normal(0, standardDeviation)

  return parents.flatMap(parent =>
    _.times(CHILDREN_TO_GENERATE, () =>
      individualToPopulationEntry(testFunctionSpec.fun)(
        makeIndividual(
          parent.individual.map((gene, idx) => {
            const argsRange =
              testFunctionSpec.argsRange.length === 1
                ? testFunctionSpec.argsRange[0]
                : testFunctionSpec.argsRange[idx]
            return geneMutation(
              {
                normalDistribution,
                clamp: gene => makeGene(_.clamp(gene, argsRange.min, argsRange.max)),
                mutationProbability,
              },
              gene,
            )
          }),
        ),
      ),
    ),
  )
}

type MutationAttrs = {
  normalDistribution: () => number
  mutationProbability: number
  clamp: (gene: Gene) => Gene
}

const geneMutation = (
  {normalDistribution, mutationProbability, clamp}: MutationAttrs,
  gene: Gene,
): Gene =>
  Math.random() < mutationProbability ? clamp(makeGene(gene + normalDistribution())) : gene

// L
export const CHILDREN_TO_GENERATE = 3
// Pm
export const MUTATION_PROBABILITIES = [0.15, 0.75]

export default generateChildren
