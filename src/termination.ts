const didConverge = (): boolean => {
  // TODO
  return true
}

type ReachedIterationLimitAttrs = {
  populationSize: number
  iterations: number
}

const reachedIterationLimit = ({populationSize, iterations}: ReachedIterationLimitAttrs): boolean =>
  populationSize * 40_000 >= iterations

const shouldStop = (attrs: ReachedIterationLimitAttrs): boolean =>
  didConverge() || reachedIterationLimit(attrs)

export default shouldStop
