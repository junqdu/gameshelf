<template>
  <section class="container left help">
    <h4>User setting</h4>
    <b-input-group prepend="User ID">
      <b-form-input v-model="userId"></b-form-input>
      <b-input-group-append>
        <b-btn @click="save" variant="primary">Save</b-btn>
      </b-input-group-append>
    </b-input-group>
    <b-input-group prepend="Player Name">
      <b-form-input v-model="playername"></b-form-input>
      <b-input-group-append>
        <b-btn @click="save" variant="primary">Save</b-btn>
      </b-input-group-append>
    </b-input-group>
    <p>You can add multiple(up to 10) user IDs and seperate them by comma, e.g.
      "userId1,userId2", this will merge the collection of the users. This only
      work with "Collection" for now, other list won't be supported unless there
      is a popular demand.</p>
    <h5>Collection</h5>
    <h6>Show Expansions with miniumn rating of:</h6>
    <b-input-group>
      <b-input-group-prepend is-text>
        <input type="checkbox" id="show-expansions" v-model="showexp">
      </b-input-group-prepend>
      <b-form-input type="number" :disabled="!showexp" v-model="expmin"/>
    </b-input-group>
    <div>Note: Only game with rating of 6 or greater has data for weight and best/rec# of players.</div>
    <h6>Best number of players filter:</h6>
    <input type="checkbox" id="best-at-least" v-model="bestatleast"> Show "At least" rather than exact, e.g. when input 3, rather showing game played best with 3, it will show 3 and above.

    <h4>Clear cache</h4>
    <b-button @click="clear" variant="warning">Clear cache</b-button>

    <h4>URL params</h4>
    <b-table striped hover :items="params"></b-table>
    <a href="https://en.wikipedia.org/wiki/Query_string#Structure">How to use URL params?</a>

    <h4>FAQ</h4>
    <div v-for="item in faq">
      <div><b>Q: {{item.q}}</b></div>
      <div>A: {{item.a}}</div>
    </div>

    <h4>Suggestion / Report Bug</h4>
    <a href="https://github.com/gameshelf/gameshelf.github.io/issues/new">Open an issue</a>

    <h4>Contributors</h4>
    <ul>
      <li>junqdu</li>
      <li>mattmontgomery</li>
    </ul>

    <h4>Donate</h4>
    If you find this site useful and want buy me a drink.
    <b-button size="sm" variant="primary" href="https://paypal.me/jotarora" target="_blank">
      <i class="fa fa-paypal" aria-hidden="true"></i>
      PayPal
    </b-button>

  </section>
</template>

<script>
import cookie from '~/components/cookie.js'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      bestatleast: cookie.get('bestatleast') === 'true',
      expmin: +cookie.get('expmin'),
      faq: [
        {
          q: 'Why are my seeing "Waiting for BGG to process. Please try again later for access."?',
          a: 'This site relies on BGG, the bigger your collection is, the longer it takes for BGG to prepare your data, just be patiently and smash your refresh button.'
        },
        {
          q: 'Why only subset of my collection is shown?',
          a: 'Only game that is flagged with "Owned" on BGG is shown.'
        },
        {
          q: 'Why is the weight/best#/rec# data is not shown for some game?',
          a: 'I only make that kind of data available for the ranked game, or expansion with rating 6 or greater.'
        },
        {
          q: 'What is the goal/purpose of this site',
          a: 'For me to simply and elegantly filtering (based on things I care about, e.g. Best# of player and play time) down to a game I want to play.'
        },
        {
          q: 'What game do you have data for?',
          a: 'Up to BGG game id of 240000'
        },
        {
          q: 'When is your data update?',
          a: '7/31/2018'
        }
      ],
      params: [
        { paramName: 'userid', type: 'String', usage: "Determine who's collection to load" },
        { paramName: 'noimage', type: 'Boolean', usage: 'When true, image will not be load in the table to save data on mobile' },
        { paramName: 'showexp', type: 'Boolean', usage: 'When true, expansions will be shown' },
        { paramName: 'bestnum', type: 'Number', usage: 'Prepopulate the best # of players filter' },
        { paramName: 'recnum', type: 'Number', usage: 'Prepopulate the recommended # of player filter' },
        { paramName: 'supplayer', type: 'Number', usage: 'Prepopulate the supported # of player filter' },
        { paramName: 'maxweight', type: 'Number', usage: 'Prepopulate the max weight filter' },
        { paramName: 'minweight', type: 'Number', usage: 'Prepopulate the min weight filter' },
        { paramName: 'maxtime', type: 'Number', usage: 'Prepopulate the max play time filter' },
        { paramName: 'mintime', type: 'Number', usage: 'Prepopulate the min play time filter' },
        { paramName: 'playlessthan', type: 'Number', usage: 'Prepopulate the play less than filter' }
      ],
      playername: cookie.get('playername'),
      showexp: cookie.get('showexp') === 'true',
      userId: cookie.get('username')
    }
  },
  methods: {
    ...mapActions({
      clear: 'items/cache/clear'
    }),
    save: function () {
      cookie.set('username', this.userId)
      cookie.set('playername', this.playername)
      this.$toast.success('User ID and player name updated', {
        icon: 'fa-check'
      })
    }
  },
  watch: {
    bestatleast: function (val) {
      cookie.set('bestatleast', val)
    },
    expmin: function (val) {
      cookie.set('expmin', val)
    },
    showexp: function (val) {
      cookie.set('showexp', val)
      if (val) {
        this.$toast.success('Expansons will be shown', {
          icon: 'fa-check'
        })
      } else {
        this.$toast.success('Expansons will be hiden', {
          icon: 'fa-check'
        })
      }
    }
  }
}
</script>

<style>
.container.left{
  justify-content: left;
  align-items: left;
  text-align: left;
}

.input-group {
  min-width: 20rem;
  width: 50%;
}

.help h4 {
  margin-top: 1rem
}

h6 {
  margin-top: 0.5rem
}
</style>
