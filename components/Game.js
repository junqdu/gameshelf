export default class {
  constructor (params) {
    var games = require('../assets/game.json')
    for (var k in games[params.id]) {
      this[k] = games[params.id][k]
    }
    this.average = params.average || ''
    this.date = params.date
    this.id = params.id
    this.imageUrl = params.imageUrl
    this.maxplayer = params.maxplayer
    this.minplayer = params.minplayer
    this.name = params.name
    this.numplays = params.numplays
    this.playingtime = params.playingtime
    this.rank = params.rank || ''
    this.rating = params.rating || ''
  }
}
