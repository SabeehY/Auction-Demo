require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  database: {
    url: process.env.MONGO_URI || 'mongodb://localhost/auction'
  },
  app: {
    title: 'Demo Auction',
    description: 'Demo Auction for Aaron Hoffman',
    head: {
      titleTemplate: '%s | Demo Auction',
      meta: [
        {name: 'description', content: 'Demo Auction for Aaron Hoffman'},
        {charset: 'utf-8'}
      ]
    }
  },

}, environment);
