import { getClient } from '@sohey/core'

export const isSamePath = (url1: string, url2: string) => {
  try {
    const parsedUrl1 = new URL(url1)
    const parsedUrl2 = new URL(url2)
    return (
      parsedUrl1.protocol === parsedUrl2.protocol &&
      parsedUrl1.hostname === parsedUrl2.hostname &&
      parsedUrl1.port === parsedUrl2.port &&
      parsedUrl1.pathname === parsedUrl2.pathname
    )
  } catch (err) {
    return false
  }
}

export const throttled = (fn: Function, delay = 10) => {
  let lastTs = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (now - lastTs >= delay) {
      fn(...args)
      lastTs = now
    }
  }
}

export const getRelativeUrl = (url?: string) => {
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

export const needIgnoreUrl = (url: string) => {
  const client = getClient()
  if (!client) return false
  return isSamePath(client.getDsn(), url)
}

export const isResourceLoadedError = (e: any) => {
  return (
    e instanceof Event &&
    (e.target instanceof HTMLScriptElement ||
      e.target instanceof HTMLLinkElement ||
      e.target instanceof HTMLImageElement)
  )
}
