import { options } from '../core'

/**
 * 判断是否同一个路径(不含 URL search)
 */
export const isSamePath = (url1, url2) => {
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

/**
 * 是否需要忽略
 * @param url
 */
export const needIgnoreUrl = url => {
  return isSamePath(options.dsn, url)
}
