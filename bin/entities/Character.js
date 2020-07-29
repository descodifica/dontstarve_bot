const DefaultEntity = require('./Default')

// Entidade de personagens
class Character extends DefaultEntity {
  constructor () {
    super({ table: 'characters', })
  }
}

module.exports = new Character()