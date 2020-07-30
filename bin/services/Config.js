const DefaultEntity = require('./Default')

// Entidade de configurações
class Config extends DefaultEntity {
  constructor () {
    super({
      table: 'configs',
      props: {
        lang: { type: 'Options', values: [ 'de', 'en', 'es', 'fr', 'it', 'ptbr', 'zhcn', ], },
      },
    })
  }
}

module.exports = new Config()