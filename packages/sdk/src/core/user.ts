import { SetUser } from '../types'

export class User {
  info: any

  getUser = () => {
    return this.info
  }

  setUser: SetUser = userInfo => {
    this.info = userInfo
  }

  clearUser() {
    this.info = null
  }
}

export const user = new User()
export const setUser = userInfo => user.setUser(userInfo)
export const clearUser = () => user.clearUser()
