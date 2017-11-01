export default class {
  constructor (params) {
    var games = require('../assets/game.json')
    for (var k in games[params.id]) {
      this[k] = games[params.id][k]
    }
    this.id = params.id
    this.imageUrl = params.imageUrl
  }
}
