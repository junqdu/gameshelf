var _ = require('lodash')

export default class {
  static set (key) {

  }

  static get (key) {
    const items = key.split(';')
    const cookies = []
    _.forEach(items, item => {
      cookies.push(item)
    })
    console.log(cookies)
  }
}
