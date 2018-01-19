const games = require('../assets/game.json')

export default class {
  constructor (params) {
    const localData = games[params.id]
    if (localData) {
      this.bggbestplayers = localData.b
      this.bggrecplayers = localData.r
      this.weight = localData.w
      this.type = localData.t
    }

    this.users = {}
    this.users[params.userId] = {}
    this.users[params.userId].numplays = params.numplays || 0
    this.users[params.userId].rating = params.rating || 0
    this.numplays = params.numplays || 0
    this.rating = params.rating || 0

    this.average = params.average || ''
    this.date = params.date || ''
    this.id = params.id
    this.imageUrl = params.imageUrl || ''
    this.maxplayer = params.maxplayer || ''
    this.minplayer = params.minplayer || ''
    this.name = params.name || ''
    this.playingtime = params.playingtime || ''
    this.rank = params.rank || ''
    this.own = params.own
    this.wishlistpriority = params.wishlistpriority
    this.comment = params.comment
  }
}
