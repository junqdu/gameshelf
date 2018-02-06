import cookie from '~/components/cookie.js'
import filter from 'lodash/filter'
import get from 'lodash/get'
import intersection from 'lodash/intersection'

export default function filterItems (items, owned = true) {
  return filter(items, (item) => {
    let bestnum = false
    if (cookie.get('bestatleast')) {
      const highestNum = get(item, 'bggbestplayers', '').split(',').pop()
      if (highestNum) {
        bestnum = +highestNum >= this.bestnum
      }
    } else {
      bestnum = get(item, 'bggbestplayers', '').split(',').includes(this.bestnum)
    }

    let mech = true

    if (this.mechShow && this.mechShow.length > 0) {
      mech = intersection(this.mechShow, item.mech).length === this.mechShow.length
    }

    if (this.mechHide && this.mechHide.length > 0 && mech) {
      mech = !intersection(this.mechHide, item.mech).length > 0
    }

    return (!this.bestnum || bestnum) &&
    (!this.recnum || get(item, 'bggrecplayers', '').split(',').includes(this.recnum)) &&
    (!this.mintime || item.playingtime >= this.mintime) &&
    (!this.maxtime || item.playingtime <= this.maxtime) &&
    (!this.supplayer || (item.minplayer <= this.supplayer && item.maxplayer >= this.supplayer)) &&
    (!this.maxweight || item.weight <= this.maxweight) &&
    (!this.minweight || item.weight >= this.minweight) &&
    ((cookie.get('showexp') === 'false' && item.type !== 'e') || cookie.get('showexp') === 'true') &&
    ((cookie.get('showexp') === 'true' && item.type === 'e' && item.average >= cookie.get('expmin')) || item.type !== 'e') &&
    (!this.playlessthan || item.numplays <= this.playlessthan) &&
    (owned ? item.own : true) && mech
  })
};
