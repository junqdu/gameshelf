const games = require('../assets/game.json')
const mechs = require('../assets/mech.json')
const keys = require('../assets/mechKey.json')

export default class {
  constructor (params) {
    const localData = games[params.id]
    if (localData) {
      this.bggbestplayers = localData.b
      this.bggrecplayers = localData.r
      this.weight = localData.w
      this.type = localData.t
    }
    const mechData = mechs[params.id]
    if (mechData) {
      this.mech = this.getMechData(mechData)
    }

    this.users = {}
    this.users[params.userId] = {}
    this.users[params.userId].numplays = params.numplays || 0
    this.users[params.userId].rating = params.rating || 0
    this.users[params.userId].own = params.own
    this.numplays = params.numplays || 0
    this.rating = params.rating || 0

    this.average = params.average || ''
    this.date = params.date || ''
    this.forTrade = params.forTrade
    this.id = params.id
    this.imageUrl = params.imageUrl || ''
    this.maxplayer = params.maxplayer || ''
    this.minplayer = params.minplayer || ''
    this.name = params.name || ''
    this.playingtime = params.playingtime || ''
    this.rank = params.rank || ''
    this.own = params.own
    this.wantToPlay = params.wantToPlay
    this.wishlist = params.wishlist
    this.wishlistpriority = params.wishlistpriority
    this.comment = params.comment
  }

  getMechData (data) {
    const result = []
    data.forEach(function (datum) {
      result.push(keys[datum])
    })
    return result
  }
}
