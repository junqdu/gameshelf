import cookie from '~/components/cookie'
import filter from 'lodash/filter'
import get from 'lodash/get'
import intersection from 'lodash/intersection'

export default function filterItems (items, filters) {
  const bestAtLeast = cookie.get('bestatleast')
  const showExp = cookie.get('showexp')
  const expmin = cookie.get('expmin')
  return filter(items, (item) => {
    let bestnum = false
    if (typeof filters !== 'object') {
      filters = {}
    }
    if (bestAtLeast && bestAtLeast !== 'false') {
      const highestNum = get(item, 'bggbestplayers', '').split(',').pop()
      if (highestNum) {
        bestnum = +highestNum >= filters.bestnum
      }
    } else {
      bestnum = get(item, 'bggbestplayers', '').split(',').includes(filters.bestnum)
    }

    let mech = true

    if (filters.mechShow && filters.mechShow.length > 0) {
      mech = intersection(filters.mechShow, item.mech).length === filters.mechShow.length
    }

    if (filters.mechHide && filters.mechHide.length > 0 && mech) {
      mech = !intersection(filters.mechHide, item.mech).length > 0
    }

    const pass = (
      (!filters.bestnum || bestnum) &&
      (!filters.recnum || get(item, 'bggrecplayers', '').split(',').includes(filters.recnum)) &&
      (!filters.mintime || item.playingtime >= filters.mintime) &&
      (!filters.maxtime || item.playingtime <= filters.maxtime) &&
      (!filters.supplayer || (item.minplayer <= filters.supplayer && item.maxplayer >= filters.supplayer)) &&
      (!filters.maxweight || item.weight <= filters.maxweight) &&
      (!filters.minweight || item.weight >= filters.minweight) &&
      ((showExp === 'false' && item.type !== 'e') || showExp === 'true') &&
      ((showExp === 'true' && item.type === 'e' && item.average >= expmin) || item.type !== 'e') &&
      (!filters.playlessthan || item.numplays <= filters.playlessthan) &&
      (!filters.playgreaterthan || item.numplays >= filters.playgreaterthan) &&
      (typeof filters.ownedgames === 'boolean' && filters.ownedgames ? item.own : true) &&
      mech
    )
    return pass
  })
};
