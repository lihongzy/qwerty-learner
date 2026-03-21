export default function range(start: number, end?: number, step?: number): number[] {
  let rangeStart = Number(start)
  let rangeEnd = end === undefined ? rangeStart : Number(end)

  if (end === undefined) {
    rangeStart = 0
  }

  const rangeStep = step === undefined ? (rangeStart < rangeEnd ? 1 : -1) : Number(step)

  if (rangeStep === 0) {
    return []
  }

  const result: number[] = []
  const shouldContinue = rangeStep > 0 ? (value: number) => value < rangeEnd : (value: number) => value > rangeEnd

  for (let value = rangeStart; shouldContinue(value); value += rangeStep) {
    result.push(value)
  }

  return result
}
