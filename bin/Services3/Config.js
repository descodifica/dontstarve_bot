const DefaultEntity = require('./Default')

// Entidade de configurações
class Config extends DefaultEntity {
  constructor () {
    super({
      table: 'configs',
      props: {
        lang: { type: 'Options', values: require('../config').langs, },
      },
    })
  }
}

module.exports = new Config()