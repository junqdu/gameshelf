export default class LocalStorage {
  constructor (localStorage = null) {
    this.localStorage = localStorage || window.localStorage
  }
  get (query) {
    try {
      const data = this.localStorage.getItem(query)
      return JSON.parse(data)
    } catch (e) {
      return null
    }
  }
  set (query, data) {
    this.localStorage.setItem(query, JSON.stringify(data))
  }
}
