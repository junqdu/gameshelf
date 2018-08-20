import X2JS from 'x2js'
import Game from '~/components/Game'
import _ from 'lodash'

function parse (result = {}, items) { // eslint-disable-line
  const x2js = new X2JS()
  const { data } = result

  const games = x2js.xml2js(data)

  let userId = _.get(result, 'config.params.username')

  let rank
  if (_.get(games, 'items.item') && !_.isArray(_.get(games, 'items.item'))) {
    games.items.item = [games.items.item]
  }
  _.get(games, 'items.item', []).forEach(item => {
    if (_.get(item, 'stats.rating.ranks.rank.length', false)) {
      rank = parseFloat(item.stats.rating.ranks.rank[0]._value)
    } else {
      rank = parseFloat(_.get(item, 'stats.rating.ranks.rank._value'))
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
      if (items[gameId].users[userId].rating) {
        let validRatings = _.filter(items[gameId].users, function (user) {
          return user.rating
        })
        let ratings = _.map(validRatings, rating => rating.rating)
        items[gameId].rating = _.sum(ratings) / ratings.length
      }
      if (!items[gameId].comment) {
        items[gameId].comment = item.comment
      }
      items[gameId].forTrade = _.get(item, 'status._fortrade') === '1' || items[gameId].forTrade
      items[gameId].own = _.get(item, 'status._own') === '1' || items[gameId].own
      items[gameId].wantToPlay = _.get(item, 'status._wanttoplay') === '1' || items[gameId].wantToPlay
      items[gameId].wishlist = _.get(item, 'status._wishlist') === '1' || items[gameId].wishlist
      items[gameId].wishlistpriority = _.min([_.get(item, 'status._wishlistpriority', '5'), item.status._wishlistpriority])

      items[gameId].users[userId].own = _.get(item, 'status._own') === '1'
    } else {
      items[gameId] = (new Game({
        average: parseFloat(_.get(item, 'stats.rating.average._value')),
        comment: item.comment,
        forTrade: _.get(item, 'status._fortrade') === '1',
        id: gameId,
        imageUrl: item.thumbnail,
        maxplayer: parseFloat(item.stats._maxplayers),
        minplayer: parseFloat(item.stats._minplayers),
        name: item.name.__text,
        numplays,
        own: _.get(item, 'status._own') === '1',
        playingtime: parseFloat(item.stats._playingtime),
        rank,
        rating,
        userId,
        wantToPlay: _.get(item, 'status._wanttoplay') === '1',
        wishlist: _.get(item, 'status._wishlist') === '1',
        wishlistpriority: _.get(item, 'status._wishlistpriority', '5')
      }))
    }
  })
  return items
}

export default function combineCollections (collections = []) {
  const items = {}
  return collections.reduce((accumulator, collection) => {
    return parse(collection, accumulator)
  }, items)
}
