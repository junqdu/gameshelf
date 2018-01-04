<template>
  <section class="container left help">
    <h4>User setting</h4>
    <b-input-group>
      <b-input-group-addon>
        User ID
      </b-input-group-addon>
      <b-form-input v-model="userId"></b-form-input>
      <b-input-group-button slot="right">
        <b-btn @click="save" variant="info">Save</b-btn>
      </b-input-group-button>
    </b-input-group>

    <h4>FAQ</h4>
    <div v-for="item in faq">
      <div><b>Q: {{item.q}}</b></div>
      <div>A: {{item.a}}</div>
    </div>

    <h4>Suggestion / Report Bug</h4>
    <a href="https://github.com/gameshelf/gameshelf.github.io/issues/new">Open an issue</a>
  </section>
</template>

<script>
import cookie from '~/components/cookie.js'

export default {
  data () {
    return {
      faq: [
        {
          q: 'Why are my seeing "Waiting for BGG to process. Please try again later for access."?',
          a: 'This site relies on BGG, the bigger your collection is, the longer it take for BGG to prepare your data, just be patiently and smash your refresh button.'
        },
        {
          q: 'Why only subset of my collection is shown?',
          a: 'Only game that is "Owned" and non-expansion is shown.'
        },
        {
          q: 'What is the goal/purpose of this site',
          a: 'For me to quickly filtering (based on things I care about, e.g. Best# of player and play time) down to a game I want to play.'
        }
      ],
      userId: cookie.get('username')
    }
  },
  methods: {
    save: function () {
      cookie.set('username', this.userId, 3650)
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
</style>
