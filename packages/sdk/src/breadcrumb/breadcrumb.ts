export class Breadcrumb {
  queue: []
  add() {}
  getAll() {
    return this.queue
  }
}

export const breadcrumb = new Breadcrumb()
