export class Breadcrumb {
  queue = []
  maxLSize: 10

  add(data) {
    if (!Object.prototype.hasOwnProperty.call(data, 'type')) return
    this.queue.push(data)
    this.checkSize()
  }

  getAll() {
    return this.queue
  }

  checkSize() {
    while (this.queue.length > this.maxLSize) {
      this.queue.shift()
    }
  }
}

export const breadcrumb = new Breadcrumb()
