// import axios from 'axios'
// import X2JS from 'x2js'

export default class {
  constructor (params) {
    var games = require('../assets/game.json')
    for (var k in games[params.id]) {
      this[k] = games[params.id][k]
    }
    this.id = params.id
    this.imageUrl = params.imageUrl
    // axios.get('https://www.boardgamegeek.com/xmlapi2/thing?id=' + this.id + '&stats=1')
    //   .then((res) => {
    //     var x2js = new X2JS()
    //     var data = x2js.xml2js(res.data)

    //     console.log(data)
    //     // var items = []
    //     // data.items.item.forEach(function (item) {
    //     //   items.push(new Game(item._objectid))
    //     // }, this)
    //     // var json = parser.toJson(res.data)
    //     // console.log('to json -> %s', json)
    //     // console.log(res)
    //     // return { data, items }
    //   })
  }
}
