import X2JS from 'x2js'
import Game from '~/components/Game'
import get from 'lodash/get'

function parse (result = {}, items) { // eslint-disable-line
  const x2js = new X2JS()
  const { data } = result

  const games = x2js.xml2js(data)

  let userId = get(result, 'config.params.username')

  let rank
  get(games, 'items.item', []).forEach(item => {
    if (get(item, 'stats.rating.ranks.rank.length', false)) {
      rank = parseFloat(item.stats.rating.ranks.rank[0]._value)
    } else {
      rank = parseFloat(get(item, 'stats.rating.ranks.rank._value'))
    }

    let gameId = item._objectid
    let numplays = parseFloat(item.numplays)
    let rating = parseFloat(item.stats.rating._value)
    if (items[gameId]) {
      items[gameId].users[userId] = {
        numplays,
        rating: rating || 0
      }
      items[gameId].numplays += numplays || 0
      let numOfUser = Object.keys(items[gameId].users).length
      if (items[gameId].users[userId].rating) {
        items[gameId].rating = ((items[gameId].rating * (numOfUser - 1)) + items[gameId].users[userId].rating) / numOfUser
      }
      if (!items[gameId].own) {
        items[gameId].own = get(item, 'status._own') === '1'
      }
      if (get(item, 'status._own') === '1') {
        items[gameId].users[userId].own = true
      }
    } else {
      items[gameId] = (new Game({
        average: parseFloat(get(item, 'stats.rating.average._value')),
        id: gameId,
        imageUrl: item.thumbnail,
        maxplayer: parseFloat(item.stats._maxplayers),
        minplayer: parseFloat(item.stats._minplayers),
        name: item.name.__text,
        numplays,
        own: get(item, 'status._own') === '1',
        playingtime: parseFloat(item.stats._playingtime),
        rank,
        rating,
        userId,
        wishlistpriority: item.status._wishlistpriority
      }))
    }
  })
  return items
}

export default function combineCollections (collections = []) {
  const items = {}
  return collections.reduce((accumulator, collection) => {
    // const { data } = collection
    return parse(collection, accumulator)
  }, items)
}
