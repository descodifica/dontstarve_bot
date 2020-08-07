const DefaultEntity = require('./Default')

// Entidade de personagens
class Character extends DefaultEntity {
  constructor () {
    super({
      table: 'characters',
      relations: {
        oneToOne: [ { entity: 'Experience', fk: 'user', }, ],
      },
    })
  }
}

module.exports = new Character()