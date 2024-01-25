export const throttled = (fn, delay = 10) => {
  let lastTs = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTs >= delay) {
      fn(...args)
      lastTs = now
    }
  }
}

export const getRelativeUrl = url => {
  let urlInstance: URL | Location = location
  if (url) {
    try {
      urlInstance = new URL(url)
    } catch (err) {
      console.error(err)
    }
  }
  return urlInstance.href.slice(urlInstance.origin.length)
}
