import { BreadcrumbData } from '@sohey/shared'

export class Breadcrumb {
  queue: BreadcrumbData[] = []
  maxSize: number = 10

  add(data: BreadcrumbData) {
    if (!Object.prototype.hasOwnProperty.call(data, 'type')) return
    this.queue.push(data)
    this.checkSize()
  }

  getAll() {
    return this.queue
  }

  checkSize() {
    while (this.queue.length > this.maxSize) {
      this.queue.shift()
    }
  }
}

export const breadcrumb = new Breadcrumb()
