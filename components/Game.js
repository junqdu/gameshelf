export default class {
  constructor (params) {
    var games = require('../assets/game.json')
    for (var k in games[params.id]) {
      this[k] = games[params.id][k]
    }
    this.id = params.id
    this.imageUrl = params.imageUrl
    this.numplays = params.numplays
    this.playingtime = params.playingtime
    this.name = params.name

    if (params.rank) {
      this.rank = params.rank
    }
    if (params.average) {
      this.average = params.average
    }
    if (params.rating) {
      this.rating = params.rating
    }
  }
}
