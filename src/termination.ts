const didConverge = (): boolean => {
  // TODO
  return false
}

type ReachedIterationLimitAttrs = {
  dimensions: number
  iterations: number
}

const reachedIterationLimit = ({dimensions, iterations}: ReachedIterationLimitAttrs): boolean =>
  iterations >= (dimensions > 3 ? 400_000 : 40_000)

const shouldStop = (attrs: ReachedIterationLimitAttrs): boolean =>
  didConverge() || reachedIterationLimit(attrs)

export default shouldStop
