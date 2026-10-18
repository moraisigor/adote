const map = new Map<string, Promise<unknown>>()

export const serialize = <T>(key: string, task: () => Promise<T>): Promise<T> => {
  const prev = map.get(key) ?? Promise.resolve()

  const next = prev.then(task, task)

  map.set(key, next)

  next
    .finally(() => {
      if (map.get(key) === next) {
        map.delete(key)
      }
    })
    .catch((e) => console.log(e))

  return next
}
