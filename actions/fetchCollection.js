import axios from 'axios'
import pickBy from 'lodash/pickBy'

export default async function fetchCollection (userId, {
  wantToPlay,
  trade,
  own,
  wishlist
}) {
  return axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
    params: pickBy({
      stats: 1,
      username: userId.trim()
    }, (val, key) => {
      return typeof val !== 'undefined'
    })
  })
}
