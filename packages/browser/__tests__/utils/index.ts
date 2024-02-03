import { TransportOptions } from '@sohey/types'

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export function xhr(
  method: string,
  url: string,
  body?: any,
  options?: TransportOptions
) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve({
          statusCode: xhr.status
        })
      }
    }
    if (options && options.headers) {
      Object.keys(options.headers).forEach(header => {
        // @ts-ignore
        xhr.setRequestHeader(header, options.headers[header])
      })
    }
    xhr.onerror = reject
    xhr.send(body)
  })
}
