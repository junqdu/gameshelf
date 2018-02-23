import axios from 'axios'

export default async function fetchCollection (userId) {
  const result = await axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
    params: {
      stats: 1,
      username: userId.trim()
    }
  })
  return result
}
