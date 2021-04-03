export const withTime = <ResT>(name: string, fn: () => ResT): ResT => withTimeF(name, fn)()

export const withTimeF = <ResT, ArgsT extends unknown[]>(
  name: string,
  fn: (...args: ArgsT) => ResT,
) => (...args: ArgsT): ResT => {
  console.time(name + ' time')

  const res = fn(...args)

  console.log()
  console.timeEnd(name + ' time')

  return res
}
