const DefaultEntity = require('./Default')

// Entidade de configurações
class Profile extends DefaultEntity {
  constructor () {
    super()

    this.table = 'profiles'
  }
}

module.exports = new Profile()