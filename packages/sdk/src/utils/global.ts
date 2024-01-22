export const getGlobal = (): Window => {
  return window
}

const global = getGlobal()

export { global }
