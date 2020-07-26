const DefaultEntity = require('./Default')

// Entidade de personagens
class Character extends DefaultEntity {
  constructor () {
    super()

    this.table = 'characters'
  }
}

module.exports = new Character()