const webpack = require('webpack')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Game Shelf',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/bootstrap-vue',
    '@nuxtjs/font-awesome',
    '@nuxtjs/toast',
    ['@nuxtjs/google-adsense', {
      id: 'ca-pub-4646777840516978'
    }]
  ],
  mode: 'spa',
  axios: {
    // proxyHeaders: false
  },
  toast: {
    iconPack: 'fontawesome',
    position: 'top-right'
  },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios', 'x2js'],
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        '_': 'lodash'
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })
    ]
  },
  plugins: ['~/plugins/vue-clipboards']
}
