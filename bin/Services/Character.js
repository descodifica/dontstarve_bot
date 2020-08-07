const DefaultEntity = require('./Default')

// Entidade de personagens
class Character extends DefaultEntity {
  constructor () {
    super({
      table: 'characters',
      relations: {
        oneToMany: [ { entity: 'Experience', fk: 'user', }, ],
      },
    })
  }
}

module.exports = new Character()